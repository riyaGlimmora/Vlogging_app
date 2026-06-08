import multer from 'multer';
import ApiError from '../utils/ApiError.js';

const storage = multer.memoryStorage();

const VIDEO_EXTENSIONS = new Set(['.mp4', '.mov', '.avi', '.mkv', '.webm', '.m4v', '.mpeg', '.mpg']);
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp']);

const getExtension = (filename = '') => {
  const dot = filename.lastIndexOf('.');
  return dot === -1 ? '' : filename.slice(dot).toLowerCase();
};

const isVideoFile = (file) => {
  if (file.mimetype.startsWith('video/')) return true;
  if (file.mimetype === 'application/octet-stream') {
    return VIDEO_EXTENSIONS.has(getExtension(file.originalname));
  }
  return false;
};

const isImageFile = (file) => {
  if (file.mimetype.startsWith('image/')) return true;
  if (file.mimetype === 'application/octet-stream') {
    return IMAGE_EXTENSIONS.has(getExtension(file.originalname));
  }
  return false;
};

const fileFilter = (_req, file, cb) => {
  if (file.fieldname === 'video') {
    if (isVideoFile(file)) {
      cb(null, true);
    } else {
      cb(new ApiError(400, `Video file must be a valid video format (got ${file.mimetype})`), false);
    }
    return;
  }

  if (file.fieldname === 'thumbnail') {
    if (isImageFile(file)) {
      cb(null, true);
    } else {
      cb(new ApiError(400, `Thumbnail must be a valid image format (got ${file.mimetype})`), false);
    }
    return;
  }

  cb(
    new ApiError(400, `Unexpected file field "${file.fieldname}". Use field names "video" and "thumbnail".`),
    false
  );
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});

const runUpload = upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
]);

export const uploadVlogMedia = (req, res, next) => {
  runUpload(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new ApiError(400, 'File too large. Maximum size is 100MB.'));
      }
      return next(err instanceof ApiError ? err : new ApiError(400, err.message));
    }
    next();
  });
};

export const requireCreateVlogFiles = (req, _res, next) => {
  const received = req.files ? Object.keys(req.files) : [];
  const video = req.files?.video?.[0];
  const thumbnail = req.files?.thumbnail?.[0];

  if (!video) {
    const hint =
      received.length > 0
        ? `Received file field(s): [${received.join(', ')}]. Expected field name "video" (type: File).`
        : 'No files parsed. Use Body → Form with fields "video" and "thumbnail" as File types.';
    return next(new ApiError(400, `Video file is required. ${hint}`));
  }

  if (!thumbnail) {
    const hint =
      received.length > 0
        ? `Received file field(s): [${received.join(', ')}]. Expected field name "thumbnail" (type: File).`
        : 'No files parsed. Use Body → Form with fields "video" and "thumbnail" as File types.';
    return next(new ApiError(400, `Thumbnail file is required. ${hint}`));
  }

  next();
};
