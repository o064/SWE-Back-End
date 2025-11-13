const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Course = require('../models/Course');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.createAssignment = catchAsync(async (req, res, next) => {
    const { title, description, courseId, dueDate, totalPoints } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return next(new AppError('Course not found', 404));
    if (course.instructor.toString() !== req.user._id.toString()) return next(new AppError('Not authorized', 403));

    const assignment = await Assignment.create({ title, description, course: courseId, dueDate, totalPoints });
    course.assignments.push(assignment._id);
    await course.save();
    res.status(201).json({ status: 'success', assignment });
});

exports.getAssignmentsByCourse = catchAsync(async (req, res, next) => {
    const assignments = await Assignment.find({ course: req.params.courseId });
    res.json({ status: 'success', assignments });
});

exports.submitAssignment = catchAsync(async (req, res, next) => {
    const { assignmentId, content, attachments } = req.body;
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return next(new AppError('Assignment not found', 404));

    const existingSubmission = await Submission.findOne({ assignment: assignmentId, student: req.user._id });
    if (existingSubmission) return next(new AppError('Already submitted', 400));

    const submission = await Submission.create({ assignment: assignmentId, student: req.user._id, content, attachments });
    assignment.submissions.push(submission._id);
    await assignment.save();

    res.status(201).json({ status: 'success', submission });
});

exports.gradeSubmission = catchAsync(async (req, res, next) => {
    const { grade, feedback } = req.body;
    const submission = await Submission.findById(req.params.id).populate({ path: 'assignment', populate: { path: 'course' } });
    if (!submission) return next(new AppError('Submission not found', 404));
    if (submission.assignment.course.instructor.toString() !== req.user._id.toString()) return next(new AppError('Not authorized', 403));

    submission.grade = grade;
    submission.feedback = feedback;
    submission.gradedAt = new Date();
    await submission.save();

    res.json({ status: 'success', submission });
});
