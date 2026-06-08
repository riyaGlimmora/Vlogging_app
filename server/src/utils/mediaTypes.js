const VIDEO_EXTENSIONS = new Set(['.mp4', '.mov', '.avi', '.mkv', '.webm', '.m4v', '.mpeg', '.mpg']);
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp']);

export const getExtension = (filename = '') => {
  const dot = filename.lastIndexOf('.');
  return dot === -1 ? '' : filename.slice(dot).toLowerCase();
};

export const isVideoFile = (file) => {
  if (!file) return false;
  if (file.mimetype.startsWith('video/')) return true;
  if (file.mimetype === 'application/octet-stream') {
    return VIDEO_EXTENSIONS.has(getExtension(file.originalname));
  }
  return false;
};

export const isImageFile = (file) => {
  if (!file) return false;
  if (file.mimetype.startsWith('image/')) return true;
  if (file.mimetype === 'application/octet-stream') {
    return IMAGE_EXTENSIONS.has(getExtension(file.originalname));
  }
  return false;
};

export const detectMediaType = (file) => {
  if (isVideoFile(file)) return 'video';
  if (isImageFile(file)) return 'image';
  return null;
};
