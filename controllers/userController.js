const User = require('../models/User');
const APIFeatures = require('../utils/APIFeatures');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(User.find(), req.query).filter().limitFields().paginate().sort();
  const users = await features.query;
  res.status(200).json({
    status: 'success',
    length: users.length,
    data: {
      users
    }
  })
});


exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError("User with this id is not found", 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });

});
exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new AppError("User with this id is not found", 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });

});

exports.createUser = catchAsync(async (req, res) => {
  const newUser = await User.create(req.body);
  res.status(200).json({
    status: 'success',
    data: {
      newUser
    }
  })

});
exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id, req.body);
  if (!user) {
    return next(new AppError("User with this id is not found", 404));
  }
  res.status(201).json({
    status: 'success',
    data: {
      user
    }
  });


});
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new AppError("User with this id is not found", 404));
  }
  res.status(204).json({
    status: 'success',
    data: null
  });
});
