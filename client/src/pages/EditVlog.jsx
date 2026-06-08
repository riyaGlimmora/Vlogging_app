import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useVlog from '../hooks/useVlog';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import VlogForm from '../components/VlogForm';
import { VlogDetailSkeleton } from '../components/LoadingSkeleton';

const EditVlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { vlog, loading, error } = useVlog(id);
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const isOwner =
    vlog?.author && (vlog.author._id === user?.id || vlog.author.id === user?.id);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const { data } = await api.put(`/vlogs/${id}`, formData, {
        timeout: 300000,
      });
      navigate(`/vlogs/${data.data._id}`);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <VlogDetailSkeleton />;

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 px-4 py-8 text-center text-red-700">{error}</div>
    );
  }

  if (!vlog) return null;

  if (!isOwner) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">You are not authorized to edit this vlog.</p>
        <Link to={`/vlogs/${id}`} className="mt-4 inline-block text-brand-600 hover:underline">
          Back to vlog
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Edit Vlog</h1>
      {submitError && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-red-700" role="alert">
          {submitError}
        </div>
      )}
      <VlogForm
        initialValues={{
          title: vlog.title,
          description: vlog.description,
          thumbnailUrl: vlog.thumbnailUrl,
        }}
        onSubmit={handleSubmit}
        submitting={submitting}
        isEdit
      />
    </div>
  );
};

export default EditVlog;
