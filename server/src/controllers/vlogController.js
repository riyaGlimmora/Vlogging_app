import catchAsync from '../utils/catchAsync.js';
import * as vlogService from '../services/vlogService.js';

export const getVlogs = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const result = await vlogService.getAllVlogs(page);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const getVlog = catchAsync(async (req, res) => {
  const vlog = await vlogService.getVlogById(req.params.id);
  res.status(200).json({
    success: true,
    data: vlog,
  });
});

export const createVlog = catchAsync(async (req, res) => {
  const vlog = await vlogService.createVlog(req.user._id, req.body, req.files);
  res.status(201).json({
    success: true,
    message: 'Vlog created successfully',
    data: vlog,
  });
});

export const updateVlog = catchAsync(async (req, res) => {
  const vlog = await vlogService.updateVlog(req.params.id, req.user._id, req.body, req.files);
  res.status(200).json({
    success: true,
    message: 'Vlog updated successfully',
    data: vlog,
  });
});

export const deleteVlog = catchAsync(async (req, res) => {
  await vlogService.deleteVlog(req.params.id, req.user._id);
  res.status(200).json({
    success: true,
    message: 'Vlog deleted successfully',
  });
});

export const toggleLike = catchAsync(async (req, res) => {
  const vlog = await vlogService.toggleLike(req.params.id, req.user._id);
  res.status(200).json({
    success: true,
    message: 'Like toggled successfully',
    data: vlog,
  });
});