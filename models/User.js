const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "email field is required"],
        trim: true,
        unique: true,
        validate: [validator.isEmail, 'Invalid Email address'],
        lowercase: true
    },
    role: {
        type: String,
        enum: ["student", "instructor", "admin"]
    },
    password: {
        type: String,
        required: [true, "password field is required"],
        trim: true,
        minlength: [8, "password should be more than or equal 8 characters"],
        select: false //not selecting in query
    },
    passwordConfirm: {
        type: String,
        required: [true, "passwordConfirm field is required"],
        trim: true,
        validate: {
            validator: function (val) {
                return this.password === val; // onsave only
            },
            message: "Passwords do not match."
        }
    },
    name: {
        type: String,
        required: [true, "name field is required"],
        trim: true,
        minlength: [3, "name should be more than or equal 3 characters"],
        maxlength: [50, "name should be less than or equal 50 characters"],
    },
    studentId: {
        type: String,
        trim: true,
        minlength: [3, "studentId should be more than or equal to 3 characters"],
        maxlength: [50, "studentId should be less than or equal to 50 characters"],
        match: [/^[A-Za-z0-9_-]+$/, "studentId may only contain letters, numbers, underscores, or hyphens"],
        required: [
            function () {
                return this.role === "user";
            },
            "studentId is required for students"
        ]
    },
    GPA: {
        type: Number,
        max: 4.0,
        min: 0.0,
        required: [
            function () {
                return this.role === "user";
            },
            "GPA is required for students"
        ]
    },
    major: {
        type: String,
        trim: true,
        minlength: [3, "major should be more than or equal 3 characters"],
        maxlength: [50, "major should be less than or equal 50 characters"],
        required: [
            function () {
                return this.role === "user";
            },
            "major is required for students"
        ]
    },
    level: {
        type: Number,
        trim: true,
        min: 0,
        max: 7,
        required: [
            function () {
                return this.role === "user";
            },
            "level is required for students"
        ]
    },
    photo: {
        type: String,
        trim: true,
    },
    DateJoined: {
        type: Date,
        default: Date.now(),
    }
});

// pre save hooks
userSchema.pre("save", async function (next) {
    // if password not modified go the next middleware
    if (!this.isModified("password")) return next();
    // hash the password with salt 12 
    this.password = await bcrypt.hash(this.password, 12);
    // delete passwordConfirm field 
    this.passwordConfirm = undefined;
    next();
})
userSchema.pre("save", function (next) {
    // if password not modified go the next middleware
    if (!this.isModified("password") || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000; // because saving to db slower than issuing the token so it may not worked 
    next()
})

// instance methoes
userSchema.methods.correctPassword = async (candidatePassword, password) => {
    // this.password not available because select set to true 
    return await bcrypt.compare(candidatePassword, password);
}
userSchema.methods.hasChangePassword = async function (jwtToken) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        return jwtToken < changedTimestamp;
    }
    // false mean not change and pass
    return false
};

const User = mongoose.model("User", userSchema);

module.exports = User;