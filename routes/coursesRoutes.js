const express = require('express');
const coursesController = require('../controllers/coursesController');
const authController = require('../controllers/authController');

const router = express.Router();
router.route("/")
    .get(authController.protect, coursesController.getAllCourses)
    .post(authController.protect, authController.restrictTo('teacher', 'admin'), coursesController.createCourse)
router.route("/:id")
    .get(authController.protect, coursesController.getCourseById)
    .put(authController.protect, authController.restrictTo('teacher', 'admin'), coursesController.updateCourse)
    .delete(authController.protect, authController.restrictTo('teacher', 'admin'), coursesController.deleteCourse)

router.get('/my-courses', authController.protect, coursesController.getMyCourses);
router.post('/:id/enroll', authController.protect, coursesController.enrollCourse);

module.exports = router;
