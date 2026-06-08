import Vlog from '../models/Vlog.js';
import ApiError from '../utils/ApiError.js';
import { uploadMediaFile, uploadThumbnail, deleteFromCloudinary } from './cloudinaryService.js';

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

export const getVlogById = async (id, userId) => {
  const vlog = await Vlog.findById(id).populate(populateAuthor);

  if (!vlog) {
    throw new ApiError(404, 'Vlog not found');
  }

  if (userId) {
    const alreadyViewed = vlog.viewedBy.some(
      (viewerId) => viewerId.toString() === userId.toString()
    );

    if (!alreadyViewed) {
      vlog.viewCount += 1;
      vlog.viewedBy.push(userId);
      await vlog.save();
    }
  }

  return vlog;
};

const getUploadedFile = (files, field) => files?.[field]?.[0] ?? null;

const removeVlogMedia = async (vlog) => {
  const tasks = [];
  if (vlog.videoUrl) {
    tasks.push(deleteFromCloudinary(vlog.videoUrl, 'video'));
  }
  if (vlog.imageUrl) {
    tasks.push(deleteFromCloudinary(vlog.imageUrl, 'image'));
  }
  if (vlog.thumbnailUrl && vlog.thumbnailUrl !== vlog.imageUrl) {
    tasks.push(deleteFromCloudinary(vlog.thumbnailUrl, 'image'));
  }
  await Promise.all(tasks);
};

export const createVlog = async (userId, body, files) => {
  const mediaFile = getUploadedFile(files, 'media');
  const thumbnailFile = getUploadedFile(files, 'thumbnail');

  const { url: mediaUrl, mediaType } = await uploadMediaFile(mediaFile);

  let videoUrl;
  let imageUrl;
  let thumbnailUrl;

  if (mediaType === 'video') {
    if (!thumbnailFile) {
      throw new ApiError(400, 'Thumbnail is required when uploading a video');
    }
    videoUrl = mediaUrl;
    thumbnailUrl = await uploadThumbnail(thumbnailFile);
  } else {
    imageUrl = mediaUrl;
    thumbnailUrl = mediaUrl;
  }

  const vlog = await Vlog.create({
    title: body.title,
    description: body.description,
    mediaType,
    videoUrl,
    imageUrl,
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

  const mediaFile = getUploadedFile(files, 'media');
  const thumbnailFile = getUploadedFile(files, 'thumbnail');

  if (mediaFile) {
    if (vlog.videoUrl) await deleteFromCloudinary(vlog.videoUrl, 'video');
    if (vlog.imageUrl) await deleteFromCloudinary(vlog.imageUrl, 'image');
    if (vlog.thumbnailUrl && vlog.thumbnailUrl !== vlog.imageUrl) {
      await deleteFromCloudinary(vlog.thumbnailUrl, 'image');
    }

    const { url: mediaUrl, mediaType } = await uploadMediaFile(mediaFile);
    vlog.mediaType = mediaType;

    if (mediaType === 'video') {
      vlog.videoUrl = mediaUrl;
      vlog.imageUrl = undefined;
      if (thumbnailFile) {
        vlog.thumbnailUrl = await uploadThumbnail(thumbnailFile);
      } else if (!vlog.thumbnailUrl) {
        throw new ApiError(400, 'Thumbnail is required when uploading a video');
      }
    } else {
      vlog.imageUrl = mediaUrl;
      vlog.videoUrl = undefined;
      vlog.thumbnailUrl = mediaUrl;
    }
  } else if (thumbnailFile) {
    if (vlog.mediaType !== 'video') {
      throw new ApiError(400, 'Thumbnail can only be updated for video vlogs');
    }
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

  await removeVlogMedia(vlog);
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
