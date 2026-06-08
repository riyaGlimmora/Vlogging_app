import Vlog from '../models/Vlog.js';
import ApiError from '../utils/ApiError.js';
import { uploadVideo, uploadThumbnail, deleteFromCloudinary } from './cloudinaryService.js';

const populateAuthor = { path: 'author', select: 'name email' };

export const getAllVlogs = async (page = 1) => {
  const limit = 10;
  const skip = (page - 1) * limit;

  const [vlogs, total] = await Promise.all([
    Vlog.find()
      .populate(populateAuthor)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Vlog.countDocuments(),
  ]);

  return {
    vlogs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

export const getVlogById = async (id) => {
  const vlog = await Vlog.findByIdAndUpdate(
    id,
    { $inc: { viewCount: 1 } },
    { new: true }
  ).populate(populateAuthor);

  if (!vlog) {
    throw new ApiError(404, 'Vlog not found');
  }

  return vlog;
};

const getUploadedFile = (files, field) => files?.[field]?.[0] ?? null;

export const createVlog = async (userId, body, files) => {
  const videoFile = getUploadedFile(files, 'video');
  const thumbnailFile = getUploadedFile(files, 'thumbnail');

  const [videoUrl, thumbnailUrl] = await Promise.all([
    uploadVideo(videoFile),
    uploadThumbnail(thumbnailFile),
  ]);

  const vlog = await Vlog.create({
    title: body.title,
    description: body.description,
    videoUrl,
    thumbnailUrl,
    author: userId,
  });

  return vlog.populate(populateAuthor);
};

export const updateVlog = async (id, userId, body, files) => {
  const vlog = await Vlog.findById(id);
  if (!vlog) {
    throw new ApiError(404, 'Vlog not found');
  }

  if (vlog.author.toString() !== userId.toString()) {
    throw new ApiError(403, 'You are not authorized to edit this vlog');
  }

  if (body.title) vlog.title = body.title;
  if (body.description) vlog.description = body.description;

  const videoFile = getUploadedFile(files, 'video');
  const thumbnailFile = getUploadedFile(files, 'thumbnail');

  if (videoFile) {
    await deleteFromCloudinary(vlog.videoUrl, 'video');
    vlog.videoUrl = await uploadVideo(videoFile);
  }

  if (thumbnailFile) {
    await deleteFromCloudinary(vlog.thumbnailUrl, 'image');
    vlog.thumbnailUrl = await uploadThumbnail(thumbnailFile);
  }

  await vlog.save();
  return vlog.populate(populateAuthor);
};

export const deleteVlog = async (id, userId) => {
  const vlog = await Vlog.findById(id);
  if (!vlog) {
    throw new ApiError(404, 'Vlog not found');
  }

  if (vlog.author.toString() !== userId.toString()) {
    throw new ApiError(403, 'You are not authorized to delete this vlog');
  }

  await Promise.all([
    deleteFromCloudinary(vlog.videoUrl, 'video'),
    deleteFromCloudinary(vlog.thumbnailUrl, 'image'),
  ]);

  await vlog.deleteOne();
};

export const toggleLike = async (id, userId) => {
  const vlog = await Vlog.findById(id);
  if (!vlog) {
    throw new ApiError(404, 'Vlog not found');
  }

  const userIdStr = userId.toString();
  const likeIndex = vlog.likes.findIndex((likeId) => likeId.toString() === userIdStr);

  if (likeIndex > -1) {
    vlog.likes.splice(likeIndex, 1);
  } else {
    vlog.likes.push(userId);
  }

  await vlog.save();
  return vlog.populate(populateAuthor);
};
