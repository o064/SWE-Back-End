const Course = require('../models/Course');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.createCourse = catchAsync(async (req, res, next) => {
    const { title, description, startDate, endDate } = req.body;
    const course = await Course.create({
        title,
        description,
        instructor: req.user._id,
        startDate,
        endDate
    });
    res.status(201).json({
        status: 'success', data: {
            course
        }
    });
});

exports.getAllCourses = catchAsync(async (req, res, next) => {
    const courses = await Course.find().populate('instructor', 'name email');
    res.json({
        status: 'success', results: courses.length, data: {
            courses
        }
    });
});

exports.getCourseById = catchAsync(async (req, res, next) => {
    const course = await Course.findById(req.params.id)
        .populate('instructor', 'name email')
        .populate('lectures')
        .populate('assignments');
    if (!course) return next(new AppError('Course not found', 404));
    res.json({
        status: 'success', data: {
            course
        }
    });
});
exports.getMyCourses = catchAsync(async (req, res, next) => {
    const userId = req.user._id;

    let courses;

    if (req.user.role === 'instructor') {
        // Courses created by the instructor
        courses = await Course.find({ instructor: userId })
            .populate('students', 'name email')
            .populate('lectures')
            .populate('assignments');
    } else if (req.user.role === 'student') {
        // Courses the student is enrolled in
        courses = await Course.find({ students: userId })
            .populate('instructor', 'name email')
            .populate('lectures')
            .populate('assignments');
    } else {
        return next(new AppError('Role not allowed to view courses', 403));
    }

    res.status(200).json({
        status: 'success',
        results: courses.length,
        data: { courses }
    });
});
exports.enrollCourse = catchAsync(async (req, res, next) => {
    const course = await Course.findById(req.params.id);
    if (!course) return next(new AppError('Course not found', 404));

    if (course.students.includes(req.user._id)) return next(new AppError('Already enrolled', 400));

    course.students.push(req.user._id);

    await course.save();

    // try to push to user's enrolledCourses if present
    try {
        await User.findByIdAndUpdate(req.user._id, { $push: { enrolledCourses: course._id } });
    } catch (err) {
        console.log(err);
    }

    res.json({
        status: 'success', message: 'Enrolled successfully', data: {
            course
        }
    });
});

exports.updateCourse = catchAsync(async (req, res, next) => {
    const course = await Course.findById(req.params.id);
    if (!course) return next(new AppError('Course not found', 404));

    if (course.instructor.toString() !== req.user._id.toString()) return next(new AppError('Not authorized', 403));
    // update fileds 
    Object.assign(course, req.body);
    await course.save();
    res.json({
        status: 'success', data: {
            course
        }
    });
});

exports.deleteCourse = catchAsync(async (req, res, next) => {
    const course = await Course.findById(req.params.id);
    if (!course) return next(new AppError('Course not found', 404));
    if (course.instructor.toString() !== req.user._id.toString()) return next(new AppError('Not authorized', 403));

    await course.deleteOne();
    res.json({ status: 'success', message: 'Course deleted', data: null });
});
