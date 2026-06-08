import multer from 'multer';
import ApiError from '../utils/ApiError.js';
import { isVideoFile, isImageFile } from '../utils/mediaTypes.js';

const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  if (file.fieldname === 'media') {
    if (isVideoFile(file) || isImageFile(file)) {
      cb(null, true);
    } else {
      cb(
        new ApiError(
          400,
          `Media must be an image (jpg, png, gif, webp) or video (mp4, mov, avi, mkv, webm). Got ${file.mimetype}`
        ),
        false
      );
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
    new ApiError(400, `Unexpected file field "${file.fieldname}". Use field names "media" and "thumbnail".`),
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
  { name: 'media', maxCount: 1 },
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
  const media = req.files?.media?.[0];
  const thumbnail = req.files?.thumbnail?.[0];

  if (!media) {
    const hint =
      received.length > 0
        ? `Received file field(s): [${received.join(', ')}]. Expected field name "media" (type: File).`
        : 'No files parsed. Use Body → Form with field "media" (image or video File).';
    return next(new ApiError(400, `Image or video file is required. ${hint}`));
  }

  if (isVideoFile(media) && !thumbnail) {
    return next(
      new ApiError(400, 'Thumbnail is required when uploading a video. Add a "thumbnail" field (image File).')
    );
  }

  next();
};
