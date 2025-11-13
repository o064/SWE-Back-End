const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Assignment title is required"],
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
    dueDate: {
        type: Date,
        required: [true, "Due date is required"]
    },
    totalPoints: {
        type: Number,
        required: [true, "Total points are required"],
        min: [1, "Total points must be at least 1"]
    },
    submissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Submission'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
