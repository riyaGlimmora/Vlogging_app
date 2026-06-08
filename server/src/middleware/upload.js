import multer from 'multer';
import ApiError from '../utils/ApiError.js';

const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  if (file.fieldname === 'video') {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new ApiError(400, 'Video file must be a valid video format'), false);
    }
    return;
  }

  if (file.fieldname === 'thumbnail') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new ApiError(400, 'Thumbnail must be a valid image format'), false);
    }
    return;
  }

  cb(new ApiError(400, 'Unexpected file field'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});

export const uploadVlogMedia = (req, res, next) => {
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
  ])(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new ApiError(400, 'File too large. Maximum size is 100MB.'));
      }
      return next(err instanceof ApiError ? err : new ApiError(400, err.message));
    }
    next();
  });
};
