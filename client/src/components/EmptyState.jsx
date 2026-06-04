import { Link } from 'react-router-dom';

const EmptyState = ({ title = 'No vlogs yet', message, showCreate = true }) => (
  <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white px-6 py-16 text-center">
    <svg
      className="mb-4 h-16 w-16 text-gray-300"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
    <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    <p className="mt-2 max-w-md text-gray-500">
      {message || 'Be the first to share your story with the community.'}
    </p>
    {showCreate && (
      <Link
        to="/create"
        className="mt-6 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
      >
        Create your first vlog
      </Link>
    )}
  </div>
);

export default EmptyState;
