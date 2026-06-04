import { cloudinary, configureCloudinary } from '../config/cloudinary.js';
import ApiError from '../utils/ApiError.js';

const uploadFromBuffer = (buffer, options) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        reject(new ApiError(500, 'Failed to upload file to Cloudinary'));
        return;
      }
      resolve(result);
    });
    stream.end(buffer);
  });

export const uploadVideo = async (file) => {
  configureCloudinary();
  if (!file) {
    throw new ApiError(400, 'Video file is required');
  }
  const result = await uploadFromBuffer(file.buffer, {
    resource_type: 'video',
    folder: 'vlogging-app/videos',
  });
  return result.secure_url;
};

export const uploadThumbnail = async (file) => {
  configureCloudinary();
  if (!file) {
    throw new ApiError(400, 'Thumbnail file is required');
  }
  const result = await uploadFromBuffer(file.buffer, {
    resource_type: 'image',
    folder: 'vlogging-app/thumbnails',
  });
  return result.secure_url;
};

export const deleteFromCloudinary = async (url, resourceType = 'image') => {
  if (!url) return;
  configureCloudinary();
  const publicId = extractPublicId(url);
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
};

const extractPublicId = (url) => {
  try {
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;
    const path = parts[1].replace(/^v\d+\//, '');
    const withoutExt = path.replace(/\.[^/.]+$/, '');
    return withoutExt;
  } catch {
    return null;
  }
};
