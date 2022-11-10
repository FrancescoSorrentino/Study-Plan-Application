const {validationResult} = require('express-validator')

function validationHandler(req,res,next)  {
    const errors = validationResult(req)
    if (!(errors.isEmpty())) {
        const map = errors.errors;
        let message = "Validation failed: \n"
        map.forEach(e => {
            message = message + e.param + " : " + e.msg + "\n"
        });

        res.status(422).send(message) 
        return;
    }
    next()
}

const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated())
      return next();
    
    return res.status(401).json({ error: 'not authenticated'});
} 

module.exports = { validationHandler, isLoggedIn };