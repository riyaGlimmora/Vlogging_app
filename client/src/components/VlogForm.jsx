import { useState } from 'react';

const VlogForm = ({ initialValues = {}, onSubmit, submitting, isEdit = false }) => {
  const [title, setTitle] = useState(initialValues.title || '');
  const [description, setDescription] = useState(initialValues.description || '');
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (video) formData.append('video', video);
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
        <label htmlFor="video" className="block text-sm font-medium text-gray-700">
          Video {isEdit && '(leave empty to keep current)'}
        </label>
        <input
          id="video"
          type="file"
          accept="video/*"
          required={!isEdit}
          onChange={(e) => setVideo(e.target.files?.[0] || null)}
          className="mt-1 w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-brand-700"
        />
      </div>

      <div>
        <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">
          Thumbnail {isEdit && '(leave empty to keep current)'}
        </label>
        {initialValues.thumbnailUrl && (
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
          required={!isEdit}
          onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
          className="mt-1 w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-brand-700"
        />
      </div>

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
