import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';

export const protect = catchAsync(async (req, _res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Not authorized. Please log in.');
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new ApiError(500, 'Server configuration error');
  }

  const decoded = jwt.verify(token, secret);
  const user = await User.findById(decoded.id).select('-password');

  if (!user) {
    throw new ApiError(401, 'User no longer exists. Please log in again.');
  }

  req.user = user;
  next();
});
