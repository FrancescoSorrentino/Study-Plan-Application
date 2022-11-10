const pianodao = require('../modules/piano_dao')
const userdao = require('../modules/user_dao')


exports.listsCourses = async (req,res) => {
    try{
        let corsi = await pianodao.listCourses()
        if(corsi){
            for (let i = 0; i < corsi.length; i++) {
                const inc = { 'inc': await pianodao.getIncompatibilities(corsi[i].codice) }
                corsi[i] = {
                ...corsi[i],
                inc
                }
            }
        }
        return res.status(200).json(corsi);
    }
    catch(err){
        return  res.status(500).send('Internal Server Error')
    }
}

exports.getPlan = async (req,res) => {
    let userId = req.user.id;
    try{
        let piano = await pianodao.listPlan(userId)
        if(piano.courses){
            for (let i = 0; i < piano.courses.length; i++) {
                const inc = await pianodao.getIncompatibilities(piano.courses[i].codice)
                piano.courses[i] = {
                ...piano.courses[i],
                inc:  inc
                }
            }
        }
        return res.status(200).json(piano);
    }
    catch(err){
        return res.status(500).send('Internal Server Error')
    }
}

exports.addPlan = async (req,res) => {
    let userId = req.user.id
    let courses = req.body.courses
    let type = req.body.type
    /***********BACKEND VALIDATION DEI VINCOLI************/
    let totcrediti = 0;
    for(let i=0; i<courses.length; i++){
        let obj
        try{
        obj = await pianodao.getCourseInfo(courses[i])
        }
        catch(e){
            return res.status(503).send('Service Unavailable')
        }
        totcrediti+= obj.c.crediti
        
        
        //check propedeuticità 
        if(!(courses.find(e =>e==obj.c.propedeutica)) && !(obj.c.propedeutica==null) ){
            
            return res.status(422).send('Vincolo di propedeuticità non rispettato.')
        }
        else if(obj.c.maxstudenti && obj.x && obj.x.nstudenti>=obj.c.maxstudenti){
            
            return res.status(422).send('Vincolo di massimo numero di studenti non rispettato.');
        }
        else{
            //check incompatibilità
            obj.v.forEach((code) => {
                if(courses.find(co =>co==code)){
                    
                    return res.status(422).send('Vincolo di incompatibilità non rispettato.');
                }
            })
        }
    }
    if((type === 'parttime' && (totcrediti < 20 || totcrediti > 40)) || ( type === 'fulltime' && (totcrediti < 60 && totcrediti > 80)) )
        return res.status(422).send('Vincolo di crediti rispetto al tipo di piano non rispettato.');
    /*******************************************************/
    
    const params = []
      courses.forEach(p => {
      params.push([p, userId])
      });
    try{
        
        let r = await pianodao.addMultipleCourses(params)
        
    }
    catch(err){
        return res.status(503).send('Service Unavailable')
    }
    //Aggiunge il tipo di piano in user
    try{
        let x = await userdao.setPlanType(userId,type)
        return res.status(201).send()
    }
    catch(err){
        return res.status(503).send('Service Unavailable')
    }
}

exports.updatePlan = async (req,res) => {
    let userId = req.user.id
    let newCourses = req.body.courses
    let type = req.body.type
    let studyplan='';
    try{
    studyplan = await pianodao.getPlanCoursesById(userId)
    }
    catch(e){
        return res.status(503).send('Service Unavailable')
    }
    let courses = newCourses.filter(ad => 
                  studyplan.every(fd => fd.codice !== ad));
    /***********BACKEND VALIDATION DEI VINCOLI************/
    let totcrediti = 0;
    for(let i=0; i<courses.length; i++){
        let obj
        try{
        obj = await pianodao.getCourseInfo(courses[i])
        }
        catch(e){
            return res.status(503).send('Service Unavailable')
        }
        
        
        
        //check propedeuticità 
        if(!(newCourses.find(e =>e==obj.c.propedeutica)) && !(obj.c.propedeutica==null) ){
            
            return res.status(422).send('Vincolo di propedeuticità non rispettato.')
        }
        else if(obj.c.maxstudenti && obj.x && obj.x.nstudenti>=obj.c.maxstudenti){
            
            return res.status(422).send('Vincolo di massimo numero di studenti non rispettato.');
        }
        else{
            //check incompatibilità
            obj.v.forEach((code) => {
                if(newCourses.find(co =>co==code)){
                    
                    return res.status(422).send('Vincolo di incompatibilità non rispettato.');
                }
            })
        }
    }
    for(let i=0; i<newCourses.length; i++){
        let obj
        try{
        obj = await pianodao.getCourseInfo(newCourses[i])
        }
        catch(e){
            return res.status(503).send('Service Unavailable')
        }
        totcrediti+= obj.c.crediti
    }

    if((type === 'parttime' && (totcrediti < 20 || totcrediti > 40)) || ( type === 'fulltime' && (totcrediti < 60 && totcrediti > 80)) )
        return res.status(422).send('Vincolo di crediti rispetto al tipo di piano non rispettato.');

    /*******************************************************/
    const params = []
      newCourses.forEach(p => {
      params.push([p, userId])
      });
    try{
        
        let r = await pianodao.deleteAll(userId)
        
    }
    catch(err){
        return res.status(503).send('Service Unavailable')
    }
    try{
        let x = await pianodao.addMultipleCourses(params)
        return res.status(200).send()
    }
    catch(err){
        return res.status(503).send('Service Unavailable')
    }
}

exports.deletePlan = async (req,res) => {
    let userId = req.user.id
    try{
        let r = await pianodao.deleteAll(userId)
    }
    catch(err){
        return res.status(503).send('Service Unavailable')
    }
    try{
        let x = await userdao.setPlanType(userId,'')
        return res.status(204).send()
    }
    catch(err){
        return res.status(503).send('Service Unavailable')
    }
}
