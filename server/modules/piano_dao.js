'use strict';
/* Dao module for the courses and studyplan */

const sqlite = require('sqlite3');

// open the database
const db = new sqlite.Database('plan.db', (err) => {
  if(err) throw err;
});

// get all courses
exports.listCourses = () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT c.codice as codice, c.nome as nome, c.crediti as crediti, c.maxstudenti as maxstudenti, c.propedeutica as propedeutica, COUNT(s.codice) as nstudenti FROM course c LEFT JOIN studyplan s ON c.codice=s.codice GROUP BY c.codice ORDER BY c.nome';
      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
     
        const courses = rows.map((e) => ({ codice: e.codice, nome: e.nome, crediti: e.crediti, maxstudenti: e.maxstudenti, nstudenti: e.nstudenti, propedeutica: e.propedeutica }));
        resolve(courses);
      });
    });
  };

exports.listPlan = (id) => {
  return new Promise((resolve, reject) => {
    const sql1 = 'SELECT c.codice as codice, c.nome as nome, c.crediti as crediti, c.maxstudenti as maxstudenti, c.propedeutica as propedeutica, COUNT(s.codice) as nstudenti, u.tipopiano as tipo FROM course c, user u LEFT JOIN studyplan s ON c.codice=s.codice WHERE u.id = s.id AND s.id = (?) GROUP BY c.codice ORDER BY c.nome'
    db.all(sql1, [id], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const courses = rows.map((e) => ({ codice: e.codice, nome: e.nome, crediti: e.crediti, maxstudenti: e.maxstudenti, nstudenti: e.nstudenti, propedeutica: e.propedeutica }));
      const piano = {tipo: rows[0].tipo, courses}
      resolve(piano);
    });
  });
};


exports.getIncompatibilities = (codice) => {
    return new Promise((resolve, reject) =>{
        const sql = 'SELECT * FROM incompatibility WHERE codice1 = (?) OR codice2 = (?)';
        db.all(sql, [codice,codice], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const inc = rows.map((e) => {
                if(e.codice1 == codice){
                    return e.codice2
                }
                else return e.codice1
            })
            resolve(inc);
        });
    });
};

exports.addMultipleCourses = (paramsList = [[]]) => {
  return new Promise(async (resolve, reject) => {
    const sql= 'INSERT INTO studyplan (codice, id) VALUES (?, ?)';
    let statement = db.prepare(sql);
    for (const params of paramsList) {
      try {
        await new Promise((resolve, reject) => {
          statement.run(params, (err) => {
            if (err) {
              reject(err)
            } else {
              resolve(true)
            }
          })
        })
      } catch (error) {
        reject(error)
      }
    }
    resolve(true);
  })
}

exports.deleteAll = (id) =>{
  return new Promise((resolve, reject) =>{
    const sql = 'DELETE FROM studyplan WHERE id = (?)';
    db.run(sql, [id], (err) => {
        if (err) {
            reject(err);
            return;
        }
        resolve(true);
    });
});
}

exports.getNStudents = (codice) =>{
    return new Promise((resolve, reject) => {
      const sql1 = 'SELECT COUNT(s.codice) as nstudenti FROM course c LEFT JOIN studyplan s ON c.codice=s.codice WHERE s.codice = (?) GROUP BY s.codice'
      db.get(sql1, [codice], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      });
    });
}

exports.getCorso = (codice) =>{
  return new Promise((resolve, reject) => {
    const sql1 = 'SELECT codice, propedeutica, maxstudenti, crediti FROM course  WHERE codice = (?)'
    db.get(sql1, [codice], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(row);
    });
  });
}

exports.getPlanCoursesById = (id) => {
  return new Promise((resolve, reject) => {
    const sql1 = 'SELECT s.codice as codice FROM studyplan s WHERE s.id = (?)'
    db.all(sql1, [id], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
};

exports.getCourseInfo = async (codice) => {
    let v = await this.getIncompatibilities(codice);
    let c = await this.getCorso(codice);
    let x = await this.getNStudents(codice);

    return { v, c, x} 
}


