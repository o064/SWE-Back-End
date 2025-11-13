const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Reply author is required"]
    },
    content: {
        type: String,
        required: [true, "Reply content is required"],
        trim: true,
        minlength: [2, "Reply should be at least 2 characters long"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const discussionSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: [true, "Course reference is required"]
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Author is required"]
    },
    title: {
        type: String,
        required: [true, "Discussion title is required"],
        trim: true,
        minlength: [3, "Title should be at least 3 characters long"],
        maxlength: [150, "Title should be less than or equal to 150 characters"]
    },
    content: {
        type: String,
        required: [true, "Content is required"],
        trim: true,
        minlength: [10, "Content should be at least 10 characters long"]
    },
    replies: [replySchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const Discussion = mongoose.model('Discussion', discussionSchema);
module.exports = Discussion;
