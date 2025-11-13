const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const signInToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPERIES_IN
    })
}
const createSendToken = (user, statusCode, res) => {
    const token = signInToken(user._id);
    // set cookies
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPERIES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true // can not be edited or accessed by browser
    }
    if (process.env.NODE_ENV === "production") cookieOptions.secure = true; // sent on https only
    res.cookie("jwt", token, cookieOptions)
    //delete password from user in res 
    user.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
}


exports.signup = catchAsync(async (req, res, next) => {
    const userData = {
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        name: req.body.name,
    };
    const newUser = await User.create(userData);
    createSendToken(newUser, 201, res);
});


exports.login = catchAsync(async (req, res, next) => {
    //  TODO Later : create max attempt login
    const { email, password } = req.body;

    //  check if email and password exist 
    if (!email || !password)//bad request
        return next(new AppError("Please provide email and password!", 400));
    // check if user is exist 
    const user = await User.findOne({ email }).select(['email', 'password']);
    if (!user || !(await user.correctPassword(password, user.password))) // unauthorized
        return next(new AppError("password or email is not correct", 401));
    // generate token
    createSendToken(user, 200, res);

});
exports.protect = catchAsync(async (req, res, next) => {
    // check if token exist 
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token)
        return next(new AppError("You are not logge in! Please log in to get access.", 401));
    // token verification
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    // check if users still exist 
    const currentUser = await User.findById(decoded.id);
    if (!currentUser)  // user delete account 
        return next(new AppError("The user belonging to this token is no longer exist", 401));
    // check if user change password
    if (!currentUser.hasChangePassword(decoded.iat))
        return next(new AppError("The user has changed passwords", 401));
    // pass
    req.user = currentUser;
    next()
})
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles ['admin', 'lead-guide']. role='user'
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError('You do not have permission to perform this action', 403)
            );
        }
        next();
    };
};