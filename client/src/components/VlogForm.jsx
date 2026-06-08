import { useState, useEffect } from 'react';

const VlogForm = ({ initialValues = {}, onSubmit, submitting, isEdit = false }) => {
  const [title, setTitle] = useState(initialValues.title || '');
  const [description, setDescription] = useState(initialValues.description || '');
  const [media, setMedia] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaIsVideo, setMediaIsVideo] = useState(
    isEdit ? (initialValues.mediaType || 'video') === 'video' : null
  );

  useEffect(() => {
    return () => {
      if (mediaPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(mediaPreview);
      }
    };
  }, [mediaPreview]);

  const handleMediaChange = (file) => {
    setMedia(file);
    if (mediaPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(mediaPreview);
    }
    if (file) {
      const isVideo = file.type.startsWith('video/');
      setMediaIsVideo(isVideo);
      setMediaPreview(URL.createObjectURL(file));
    } else {
      setMediaIsVideo(isEdit ? (initialValues.mediaType || 'video') === 'video' : null);
      setMediaPreview(null);
    }
  };

  const showThumbnailField = mediaIsVideo === true;

  const currentMediaPreview =
    mediaPreview ||
    (isEdit
      ? initialValues.mediaType === 'image'
        ? initialValues.imageUrl
        : initialValues.videoUrl
      : null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (media) formData.append('media', media);
    if (thumbnail) formData.append('thumbnail', thumbnail);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-xl bg-white p-6 shadow-sm">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          id="title"
          type="text"
          required
          maxLength={200}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          required
          rows={5}
          maxLength={5000}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
      </div>

      <div>
        <label htmlFor="media" className="block text-sm font-medium text-gray-700">
          Upload Image or Video {isEdit && '(leave empty to keep current)'}
        </label>
        {currentMediaPreview && (
          <div className="mb-3 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
            {mediaIsVideo !== false && (media?.type?.startsWith('video/') || (!media && initialValues.mediaType !== 'image')) ? (
              <video src={currentMediaPreview} controls className="aspect-video w-full" />
            ) : (
              <img src={currentMediaPreview} alt="Media preview" className="max-h-64 w-full object-contain" />
            )}
          </div>
        )}
        <input
          id="media"
          type="file"
          accept="image/*,video/*"
          required={!isEdit}
          onChange={(e) => handleMediaChange(e.target.files?.[0] || null)}
          className="mt-1 w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-brand-700"
        />
      </div>

      {showThumbnailField && (
        <div>
          <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">
            Thumbnail {isEdit ? '(required for new video, leave empty to keep current)' : '(required for videos)'}
          </label>
          {initialValues.thumbnailUrl && !thumbnail && (
            <img
              src={initialValues.thumbnailUrl}
              alt="Current thumbnail"
              className="mb-2 h-24 rounded-lg object-cover"
            />
          )}
          <input
            id="thumbnail"
            type="file"
            accept="image/*"
            required={!isEdit && mediaIsVideo === true}
            onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
            className="mt-1 w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-brand-700"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-brand-600 py-2.5 font-medium text-white hover:bg-brand-700 disabled:opacity-50"
      >
        {submitting ? 'Saving...' : isEdit ? 'Update Vlog' : 'Publish Vlog'}
      </button>
    </form>
  );
};

export default VlogForm;
