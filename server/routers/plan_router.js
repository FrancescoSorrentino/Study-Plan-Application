'use strict';
const express = require('express');
const router = express.Router();
const planserv = require('../services/plan_service');
const { body, oneOf } = require('express-validator');
const { validationHandler, isLoggedIn } = require('../middlewares/validation');


router.get('/corsi' , planserv.listsCourses);
router.get('/piano', isLoggedIn, planserv.getPlan)

router.post('/piano', 
            isLoggedIn,
            body('type').isIn(['parttime','fulltime']),
            body('courses').isLength({min: 7, max: 7}),
            validationHandler,
            planserv.addPlan )

router.put('/piano',
           isLoggedIn,
           body('type').isIn(['parttime','fulltime']),
           body('courses').isLength({min: 7, max: 7}),
            validationHandler,
           planserv.updatePlan)
           
router.delete('/piano',
              isLoggedIn,
              //validation
              planserv.deletePlan)

module.exports = router;