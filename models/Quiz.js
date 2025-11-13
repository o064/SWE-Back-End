const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Question text is required"],
        trim: true,
        minlength: [5, "Question should be at least 5 characters long"]
    },
    type: {
        type: String,
        enum: ['multiple-choice', 'true-false', 'short-answer'],
        default: 'multiple-choice',
        required: true
    },
    options: [{
        text: {
            type: String,
            required: true,
            trim: true
        },
        isCorrect: {
            type: Boolean,
            default: false
        }
    }],
    correctAnswer: {
        type: String,
        trim: true
    },
    points: {
        type: Number,
        required: [true, "Points are required"],
        min: [1, "Points must be at least 1"]
    },
    explanation: {
        type: String,
        trim: true
    }
});

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Quiz title is required"],
        trim: true,
        minlength: [3, "Title should be at least 3 characters long"],
        maxlength: [100, "Title should be less than or equal to 100 characters"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true,
        minlength: [10, "Description should be at least 10 characters long"]
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: [true, "Course reference is required"]
    },
    questions: [questionSchema],
    dueDate: {
        type: Date,
        required: [true, "Due date is required"]
    },
    totalPoints: {
        type: Number,
        required: [true, "Total points are required"],
        min: [1, "Total points must be at least 1"]
    },
    timeLimit: {
        type: Number,
        default: 60
    },
    passingScore: {
        type: Number,
        default: 60,
        min: [0, "Passing score must be at least 0"],
        max: [100, "Passing score cannot exceed 100"]
    },
    attempts: {
        type: Number,
        default: 1,
        min: [1, "Attempts must be at least 1"]
    },
    submissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'QuizSubmission'
    }],
    isPublished: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;
