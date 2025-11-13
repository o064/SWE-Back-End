const Discussion = require('../models/Discussion');
const Course = require('../models/Course');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.createDiscussion = catchAsync(async (req, res, next) => {
    const { courseId, title, content } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return next(new AppError('Course not found', 404));

    const discussion = await Discussion.create({ course: courseId, author: req.user._id, title, content });
    res.status(201).json({ status: 'success', discussion });
});

exports.getDiscussionsByCourse = catchAsync(async (req, res, next) => {
    const discussions = await Discussion.find({ course: req.params.courseId })
        .populate('author', 'name email')
        .populate('replies.author', 'name email')
        .sort({ createdAt: -1 });
    res.json({ status: 'success', discussions });
});

exports.replyToDiscussion = catchAsync(async (req, res, next) => {
    const { content } = req.body;
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) return next(new AppError('Discussion not found', 404));

    discussion.replies.push({ author: req.user._id, content, createdAt: new Date() });
    await discussion.save();

    res.json({ status: 'success', discussion });
});
