const router = require('express').Router();

const { request } = require('express');
const { isAuth } = require('../middlewares/authMiddleware');

const courseService = require('../services/courseService');



router.get('/', async (req, res) => {
    let courses = await courseService.getAll();
    res.render('home', { courses });
});

router.get('/create', isAuth, (req, res) => {
    res.render('course/create');
});

router.post('/create', isAuth, async (req, res) => {
    try {
        req.body.createdAt = new Date();
        if (req.body.isPublic) {
            req.body.isPublic = true;
        }
        await courseService.create({ ...req.body, owner: req.user._id });

        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.render('course/create', { error: getErrorMessage(error) })
    }

});


router.get('/:courseId/details', async (req, res) => {

    let course = await courseService.getOne(req.params.courseId);
    let courseData = await course.toObject();
    let isOwner = courseData.owner == req.user?._id
    let users = course.getUsers();
    let isEnrolled = course.users.some(x => x._id == req.user?._id);

    res.render('course/details', { ...courseData, isOwner, isEnrolled, users })
});


router.get('/:courseId/enroll', isOwner, async (req, res) => {

    await courseService.addUser(req.params.courseId, req.user?._id);
    res.redirect(`/course/${req.params.courseId}/details`);
});


router.get('/:courseId/delete', isntOwner, async (req, res) => {
    await courseService.delete(req.params.courseId)

    res.redirect('/course');
});


router.get('/:courseId/edit',isntOwner, async (req, res) => {
    let course = await courseService.getOne(req.params.courseId);
   
    res.render('course/edit', { ...course.toObject()});
});


router.post('/:courseId/edit',isntOwner, async (req, res) => {
    if (req.body.isPublic) {
        req.body.isPublic = true;
    } else {
        req.body.isPublic = false;

    }
    await courseService.updateOne(req.params.courseId, req.body)
    
    res.redirect(`/course/${req.params.courseId}/details`);
});

async function isOwner(req, res, next) {
    let course = await courseService.getOne(req.params.courseId);

    if (course.owner == req.user._id) {
        res.redirect(`/course/${req.params.courseId}/details`);
    } else {
        next();
    }
}
async function isntOwner(req, res, next) {
    let course = await courseService.getOne(req.params.courseId);
    if (course.owner !== req.user._id) {
        next()
    } else {
        res.redirect(`/course/${req.params.courseId}/details`);
    }
}
function getErrorMessage(error) {
    let errorNames = Object.keys(error.errors);

    if (errorNames.length > 0) {
        return error.errors[errorNames[0]];
    } else {
        return error.massage;
    }
}
router.get('/myProfile',isAuth, async (req, res) => {
    
    let courses = courseService.findMy(req.user._id);
    console.log(req.user._id);
    
    
    res.render('auth/myProfile',courses);
    
  })
module.exports = router;
