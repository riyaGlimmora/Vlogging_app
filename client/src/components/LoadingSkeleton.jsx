const LoadingSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="animate-pulse overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="aspect-video bg-gray-200" />
        <div className="space-y-3 p-4">
          <div className="h-4 w-3/4 rounded bg-gray-200" />
          <div className="h-3 w-1/2 rounded bg-gray-200" />
          <div className="flex gap-4">
            <div className="h-3 w-16 rounded bg-gray-200" />
            <div className="h-3 w-16 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const VlogDetailSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="aspect-video w-full rounded-xl bg-gray-200" />
    <div className="h-8 w-2/3 rounded bg-gray-200" />
    <div className="h-4 w-full rounded bg-gray-200" />
    <div className="h-4 w-4/5 rounded bg-gray-200" />
  </div>
);

export default LoadingSkeleton;
