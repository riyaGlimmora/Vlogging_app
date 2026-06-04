import { useState, useEffect, useMemo } from 'react';
import api from '../api/axios';
import VlogCard from '../components/VlogCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';

const Home = () => {
  const [vlogs, setVlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1 });
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchVlogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get(`/vlogs?page=${page}`);
        setVlogs(data.data.vlogs);
        setPagination(data.data.pagination);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVlogs();
  }, [page]);

  const sortedVlogs = useMemo(() => {
    const list = [...vlogs];
    if (sortBy === 'views') {
      return list.sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0));
    }
    if (sortBy === 'likes') {
      return list.sort((a, b) => (b.likes?.length ?? 0) - (a.likes?.length ?? 0));
    }
    return list;
  }, [vlogs, sortBy]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Discover Vlogs</h1>
          <p className="mt-1 text-gray-500">Watch stories from creators around the world</p>
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value="newest">Newest</option>
          <option value="views">Most viewed</option>
          <option value="likes">Most liked</option>
        </select>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-red-700" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingSkeleton />
      ) : sortedVlogs.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedVlogs.map((vlog) => (
              <VlogCard key={vlog._id} vlog={vlog} />
            ))}
          </div>
          {pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <span className="flex items-center px-4 text-sm text-gray-600">
                Page {page} of {pagination.totalPages}
              </span>
              <button
                type="button"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
