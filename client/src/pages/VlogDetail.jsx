import { useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useVlog from '../hooks/useVlog';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { VlogDetailSkeleton } from '../components/LoadingSkeleton';
import { EyeIcon, HeartIcon } from '../components/Icons';

const VlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { vlog, loading, error, setVlog } = useVlog(id);

  const isOwner =
    isAuthenticated && vlog?.author && (vlog.author._id === user?.id || vlog.author.id === user?.id);

  const hasLiked =
    isAuthenticated &&
    vlog?.likes?.some((likeId) => {
      const idStr = typeof likeId === 'object' ? likeId._id : likeId;
      return idStr === user?.id;
    });

  const handleLike = useCallback(async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      const { data } = await api.post(`/vlogs/${id}/like`);
      setVlog(data.data);
    } catch {
      /* error surfaced via UI if needed */
    }
  }, [id, isAuthenticated, navigate, setVlog]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this vlog?')) return;
    try {
      await api.delete(`/vlogs/${id}`);
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <VlogDetailSkeleton />;

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 px-4 py-8 text-center text-red-700" role="alert">
        {error}
        <div className="mt-4">
          <Link to="/" className="text-brand-600 hover:underline">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  if (!vlog) return null;

  const authorName = vlog.author?.name || 'Unknown';
  const likeCount = vlog.likes?.length ?? 0;

  return (
    <article className="mx-auto max-w-4xl">
      <div className="overflow-hidden rounded-xl bg-black shadow-lg">
        <video
          src={vlog.videoUrl}
          controls
          poster={vlog.thumbnailUrl}
          className="aspect-video w-full"
        >
          <track kind="captions" />
        </video>
      </div>

      <div className="mt-6">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{vlog.title}</h1>
        <p className="mt-2 text-gray-600">by {authorName}</p>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5 text-gray-600">
            <EyeIcon />
            {vlog.viewCount ?? 0} views
          </span>
          <button
            type="button"
            onClick={handleLike}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition ${
              hasLiked ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-label={hasLiked ? 'Unlike' : 'Like'}
          >
            <HeartIcon filled={hasLiked} />
            {likeCount} {likeCount === 1 ? 'like' : 'likes'}
          </button>
        </div>

        <p className="mt-6 whitespace-pre-wrap text-gray-700 leading-relaxed">{vlog.description}</p>

        {isOwner && (
          <div className="mt-8 flex gap-3">
            <Link
              to={`/edit/${vlog._id}`}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              Edit
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </article>
  );
};

export default VlogDetail;
