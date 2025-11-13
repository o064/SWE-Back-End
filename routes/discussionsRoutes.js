const express = require('express');
const discussionsController = require('../controllers/discussionsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/', authController.protect, discussionsController.createDiscussion);
router.get('/course/:courseId', authController.protect, discussionsController.getDiscussionsByCourse);
router.post('/:id/reply', authController.protect, discussionsController.replyToDiscussion);

module.exports = router;
