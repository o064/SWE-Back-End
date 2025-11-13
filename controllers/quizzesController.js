const Quiz = require('../models/Quiz');
const QuizSubmission = require('../models/QuizSubmission');
const Course = require('../models/Course');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.createQuiz = catchAsync(async (req, res, next) => {
    const { title, description, courseId, questions, dueDate, totalPoints, timeLimit, passingScore, attempts } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return next(new AppError('Course not found', 404));
    if (course.instructor.toString() !== req.user._id.toString()) return next(new AppError('Not authorized', 403));

    const quiz = await Quiz.create({
        title,
        description,
        course: courseId,
        questions,
        dueDate,
        totalPoints,
        timeLimit,
        passingScore,
        attempts,
        isPublished: false
    });
    if (course.quizzes) {
        course.quizzes.push(quiz._id);
        await course.save();
    }

    res.status(201).json({
        status: 'success', data: {
            quiz
        }
    });
});

exports.getQuizzesByCourse = catchAsync(async (req, res, next) => {
    const quizzes = await Quiz.find({ course: req.params.courseId, isPublished: true })
        .select('-questions')
        .sort({ createdAt: -1 });
    res.json({
        status: 'success', results: quizzes.length, data: {
            quizzes
        }
    });
});

exports.getQuizById = catchAsync(async (req, res, next) => {
    const quiz = await Quiz.findById(req.params.id).populate('course', 'title');
    if (!quiz) return next(new AppError('Quiz not found', 404));

    if (!quiz.isPublished && quiz.course.instructor.toString() !== req.user._id.toString()) {
        return next(new AppError('This quiz is not yet published', 403));
    }

    res.json({
        status: 'success', data: {
            quiz
        }
    });
});

exports.updateQuiz = catchAsync(async (req, res, next) => {
    const quiz = await Quiz.findById(req.params.id).populate('course');
    if (!quiz) return next(new AppError('Quiz not found', 404));

    if (quiz.course.instructor.toString() !== req.user._id.toString()) {
        return next(new AppError('Not authorized', 403));
    }

    Object.assign(quiz, req.body);
    quiz.updatedAt = Date.now();
    await quiz.save();

    res.json({
        status: 'success', data: {
            quiz
        }
    });
});

exports.deleteQuiz = catchAsync(async (req, res, next) => {
    const quiz = await Quiz.findById(req.params.id).populate('course');
    if (!quiz) return next(new AppError('Quiz not found', 404));

    if (quiz.course.instructor.toString() !== req.user._id.toString()) {
        return next(new AppError('Not authorized', 403));
    }

    await quiz.deleteOne();
    res.json({ status: 'success', message: 'Quiz deleted' });
});

exports.publishQuiz = catchAsync(async (req, res, next) => {
    const quiz = await Quiz.findById(req.params.id).populate('course');
    if (!quiz) return next(new AppError('Quiz not found', 404));

    if (quiz.course.instructor.toString() !== req.user._id.toString()) {
        return next(new AppError('Not authorized', 403));
    }

    if (quiz.questions.length === 0) {
        return next(new AppError('Quiz must have at least one question', 400));
    }

    quiz.isPublished = true;
    await quiz.save();

    res.json({
        status: 'success', message: 'Quiz published', data: {
            quiz
        }
    });
});

exports.submitQuiz = catchAsync(async (req, res, next) => {
    const { answers } = req.body;
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) return next(new AppError('Quiz not found', 404));
    if (!quiz.isPublished) return next(new AppError('Quiz is not published', 400));

    const studentAttempts = await QuizSubmission.countDocuments({
        quiz: quiz._id,
        student: req.user._id
    });

    if (studentAttempts >= quiz.attempts) {
        return next(new AppError('You have exhausted your quiz attempts', 400));
    }

    let totalScore = 0;
    const processedAnswers = [];

    answers.forEach(answer => {
        const question = quiz.questions.find(q => q._id.toString() === answer.questionId);
        if (!question) return;

        let pointsEarned = 0;
        let isCorrect = false;

        if (question.type === 'multiple-choice') {
            const correctOption = question.options.find(opt => opt.isCorrect);
            isCorrect = answer.studentAnswer === correctOption.text;
            pointsEarned = isCorrect ? question.points : 0;
        } else if (question.type === 'true-false') {
            isCorrect = answer.studentAnswer === question.correctAnswer;
            pointsEarned = isCorrect ? question.points : 0;
        } else if (question.type === 'short-answer') {
            // For short answers, instructor review is needed - default to 0
            isCorrect = false;
            pointsEarned = 0;
        }

        totalScore += pointsEarned;
        processedAnswers.push({
            questionId: answer.questionId,
            studentAnswer: answer.studentAnswer,
            isCorrect,
            pointsEarned
        });
    });

    const percentage = (totalScore / quiz.totalPoints) * 100;
    const passed = percentage >= quiz.passingScore;

    const submission = await QuizSubmission.create({
        quiz: quiz._id,
        student: req.user._id,
        answers: processedAnswers,
        totalScore,
        percentage,
        passed,
        submittedAt: Date.now(),
        attemptNumber: studentAttempts + 1
    });

    quiz.submissions.push(submission._id);
    await quiz.save();

    res.status(201).json({
        status: 'success',
        submission,
        message: passed ? 'Quiz passed!' : 'Quiz failed'
    });
});

exports.getQuizSubmissions = catchAsync(async (req, res, next) => {
    const quiz = await Quiz.findById(req.params.id).populate('course');
    if (!quiz) return next(new AppError('Quiz not found', 404));

    if (quiz.course.instructor.toString() !== req.user._id.toString()) {
        return next(new AppError('Not authorized', 403));
    }

    const submissions = await QuizSubmission.find({ quiz: quiz._id })
        .populate('student', 'name email')
        .sort({ submittedAt: -1 });

    res.json({
        status: 'success', data: {
            submissions
        }
    });
});

exports.getStudentQuizResults = catchAsync(async (req, res, next) => {
    const submissions = await QuizSubmission.find({
        quiz: req.params.id,
        student: req.user._id
    }).sort({ submittedAt: -1 });

    res.json({
        status: 'success', data: {
            submissions
        }
    });
});
