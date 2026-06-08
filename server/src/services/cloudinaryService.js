import { cloudinary, configureCloudinary } from '../config/cloudinary.js';
import ApiError from '../utils/ApiError.js';
import { detectMediaType } from '../utils/mediaTypes.js';

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

export const uploadMediaFile = async (file) => {
  configureCloudinary();
  if (!file) {
    throw new ApiError(400, 'Image or video file is required');
  }

  const mediaType = detectMediaType(file);
  if (!mediaType) {
    throw new ApiError(400, 'File must be a supported image or video format');
  }

  const result = await uploadFromBuffer(file.buffer, {
    resource_type: mediaType === 'video' ? 'video' : 'image',
    folder: mediaType === 'video' ? 'vlogging-app/videos' : 'vlogging-app/images',
  });

  return {
    url: result.secure_url,
    mediaType,
  };
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
