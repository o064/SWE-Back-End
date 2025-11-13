const express = require('express');
const assignmentsController = require('../controllers/assignmentsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/', authController.protect, authController.restrictTo('teacher', 'admin'), assignmentsController.createAssignment);
router.get('/course/:courseId', authController.protect, assignmentsController.getAssignmentsByCourse);
router.post('/submit', authController.protect, assignmentsController.submitAssignment);
router.put('/grade/:id', authController.protect, authController.restrictTo('teacher', 'admin'), assignmentsController.gradeSubmission);

module.exports = router;
