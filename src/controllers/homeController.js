const router = require('express').Router();

const courseService = require('../services/courseService');
router.get('/',async(req, res)=> {
    let courses = await courseService.getAllPublic();
  
    res.render('home', { courses });
    
});
module.exports = router;    