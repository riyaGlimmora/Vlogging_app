import { useState, useEffect } from 'react';
import api from '../api/axios';

const useVlog = (id) => {
  const [vlog, setVlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return undefined;
    }

    let cancelled = false;

    const fetchVlog = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get(`/vlogs/${id}`);
        if (!cancelled) {
          setVlog(data.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setVlog(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchVlog();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const refresh = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/vlogs/${id}`);
      setVlog(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { vlog, loading, error, setVlog, refresh };
};

export default useVlog;
