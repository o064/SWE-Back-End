const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Course title is required"],
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
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Instructor is required"]
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    lectures: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lecture'
    }],
    assignments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment'
    }],
    startDate: {
        type: Date,
        required: [true, "Start date is required"]
    },
    endDate: {
        type: Date,
        required: [true, "End date is required"],
        validate: {
            validator: function (value) {
                return value > this.startDate;
            },
            message: "End date must be after the start date"
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const Course = mongoose.model('Course', courseSchema)
module.exports = Course;
