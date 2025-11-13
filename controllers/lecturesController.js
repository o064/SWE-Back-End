const Lecture = require('../models/Lecture');
const Course = require('../models/Course');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.createLecture = catchAsync(async (req, res, next) => {
    const { title, content, courseId, videoUrl, attachments, order } = req.body;
    const course = await Course.findById(courseId);

    if (!course) return next(new AppError('Course not found', 404));
    if (course.instructor.toString() !== req.user._id.toString()) return next(new AppError('Not authorized', 403));

    const lecture = await Lecture.create({ title, content, course: courseId, videoUrl, attachments, order });
    course.lectures.push(lecture._id);
    await course.save();

    res.status(201).json({ status: 'success', lecture });
});

exports.getLecturesByCourse = catchAsync(async (req, res, next) => {
    // get course lectures based on order
    const lectures = await Lecture.find({ course: req.params.courseId }).sort({ order: 1 });
    res.json({ status: 'success', lectures });
});

exports.updateLecture = catchAsync(async (req, res, next) => {
    const lecture = await Lecture.findById(req.params.id).populate('course');
    if (!lecture) return next(new AppError('Lecture not found', 404));
    if (lecture.course.instructor.toString() !== req.user._id.toString()) return next(new AppError('Not authorized', 403));

    Object.assign(lecture, req.body);
    await lecture.save();
    res.json({ status: 'success', lecture });
});

exports.deleteLecture = catchAsync(async (req, res, next) => {
    const lecture = await Lecture.findById(req.params.id).populate('course');
    if (!lecture) return next(new AppError('Lecture not found', 404));
    if (lecture.course.instructor.toString() !== req.user._id.toString()) return next(new AppError('Not authorized', 403));

    await lecture.deleteOne();
    res.json({ status: 'success', message: 'Lecture deleted' });
});
