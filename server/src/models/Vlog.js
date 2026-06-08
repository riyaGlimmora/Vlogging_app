import mongoose from 'mongoose';

const vlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    mediaType: {
      type: String,
      enum: ['video', 'image'],
      default: 'video',
    },
    videoUrl: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    thumbnailUrl: {
      type: String,
      required: [true, 'Thumbnail URL is required'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    viewCount: {
      type: Number,
      default: 0,
    },

    viewedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

vlogSchema.pre('validate', function validateMediaUrls(next) {
  if (this.mediaType === 'video' && !this.videoUrl) {
    this.invalidate('videoUrl', 'Video URL is required for video vlogs');
  }
  if (this.mediaType === 'image' && !this.imageUrl) {
    this.invalidate('imageUrl', 'Image URL is required for image vlogs');
  }
  next();
});

const Vlog = mongoose.model('Vlog', vlogSchema);

export default Vlog;
