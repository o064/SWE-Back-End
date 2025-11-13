const express = require('express');
const lecturesController = require('../controllers/lecturesController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/', authController.protect, authController.restrictTo('teacher', 'admin'), lecturesController.createLecture);
router.get('/course/:courseId', authController.protect, lecturesController.getLecturesByCourse);
router.put('/:id', authController.protect, authController.restrictTo('teacher', 'admin'), lecturesController.updateLecture);
router.delete('/:id', authController.protect, authController.restrictTo('teacher', 'admin'), lecturesController.deleteLecture);

module.exports = router;
