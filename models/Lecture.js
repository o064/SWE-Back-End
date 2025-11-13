const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Lecture title is required"],
        trim: true,
        minlength: [3, "Title should be at least 3 characters long"]
    },
    content: {
        type: String,
        required: [true, "Lecture content is required"],
        trim: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: [true, "Course reference is required"]
    },
    videoUrl: {
        type: String,
        trim: true,
        validate: {
            validator: function (value) {
                return !value || value.startsWith("http");
            },
            message: "Video URL must be a valid link"
        }
    },
    attachments: [{
        type: String,
        trim: true
    }],
    order: {
        type: Number,
        required: [true, "Lecture order is required"],
        min: [1, "Order must be at least 1"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const Lecture = mongoose.model('Lecture', lectureSchema);
module.exports = Lecture;
