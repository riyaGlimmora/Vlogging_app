import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import VlogForm from '../components/VlogForm';

const CreateVlog = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setError(null);
    try {
      const { data } = await api.post('/vlogs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate(`/vlogs/${data.data._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Create New Vlog</h1>
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-red-700" role="alert">
          {error}
        </div>
      )}
      <VlogForm onSubmit={handleSubmit} submitting={submitting} />
    </div>
  );
};

export default CreateVlog;
