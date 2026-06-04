import catchAsync from '../utils/catchAsync.js';
import * as authService from '../services/authService.js';

export const register = catchAsync(async (req, res) => {
  const result = await authService.registerUser(req.body);
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

export const login = catchAsync(async (req, res) => {
  const result = await authService.loginUser(req.body);
  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: result,
  });
});
