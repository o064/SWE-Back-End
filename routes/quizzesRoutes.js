const express = require('express');
const quizzesController = require('../controllers/quizzesController');
const authController = require('../controllers/authController');

const router = express.Router();

// Instructor routes
router.post('/', authController.protect, authController.restrictTo('teacher', 'admin'), quizzesController.createQuiz);
router.put('/:id', authController.protect, authController.restrictTo('teacher', 'admin'), quizzesController.updateQuiz);
router.delete('/:id', authController.protect, authController.restrictTo('teacher', 'admin'), quizzesController.deleteQuiz);
router.patch('/:id/publish', authController.protect, authController.restrictTo('teacher', 'admin'), quizzesController.publishQuiz);
router.get('/:id/submissions', authController.protect, authController.restrictTo('teacher', 'admin'), quizzesController.getQuizSubmissions);

// Student routes
router.get('/course/:courseId', authController.protect, quizzesController.getQuizzesByCourse);
router.get('/:id', authController.protect, quizzesController.getQuizById);
router.post('/:id/submit', authController.protect, quizzesController.submitQuiz);
router.get('/:id/results', authController.protect, quizzesController.getStudentQuizResults);

module.exports = router;
