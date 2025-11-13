const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    assignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment',
        required: [true, "Assignment reference is required"]
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Student reference is required"]
    },
    content: {
        type: String,
        required: [true, "Submission content is required"],
        trim: true,
        minlength: [5, "Submission content should be at least 5 characters long"]
    },
    attachments: [{
        type: String,
        trim: true
    }],
    grade: {
        type: Number,
        min: [0, "Grade cannot be negative"]
    },
    feedback: {
        type: String,
        trim: true,
        maxlength: [500, "Feedback should not exceed 500 characters"]
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    gradedAt: {
        type: Date
    }
});
const Submission = mongoose.model('Submission', submissionSchema);
module.exports = Submission
