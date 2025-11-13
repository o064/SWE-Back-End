const mongoose = require('mongoose');

const quizSubmissionSchema = new mongoose.Schema({
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: [true, "Quiz reference is required"]
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Student reference is required"]
    },
    answers: [{
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        studentAnswer: {
            type: String,
            required: true
        },
        isCorrect: {
            type: Boolean,
            default: false
        },
        pointsEarned: {
            type: Number,
            default: 0
        }
    }],
    totalScore: {
        type: Number,
        default: 0
    },
    percentage: {
        type: Number,
        default: 0
    },
    passed: {
        type: Boolean,
        default: false
    },
    startedAt: {
        type: Date,
        default: Date.now
    },
    submittedAt: {
        type: Date
    },
    feedback: {
        type: String,
        trim: true
    },
    attemptNumber: {
        type: Number,
        default: 1
    }
});
const QuizSubmission = mongoose.model('QuizSubmission', quizSubmissionSchema);
module.exports = QuizSubmission;
