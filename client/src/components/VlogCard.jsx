import { Link } from 'react-router-dom';
import { EyeIcon, HeartIcon } from './Icons';

const VlogCard = ({ vlog }) => {
  const authorName = vlog.author?.name || 'Unknown';
  const likeCount = vlog.likes?.length ?? 0;
  const isImage = vlog.mediaType === 'image';
  const cardImageSrc = isImage ? vlog.imageUrl || vlog.thumbnailUrl : vlog.thumbnailUrl;

  return (
    <Link
      to={`/vlogs/${vlog._id}`}
      className="group overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        <img
          src={cardImageSrc}
          alt={vlog.title}
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
        {!isImage && vlog.videoUrl && (
          <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-0.5 text-xs text-white">
            Video
          </span>
        )}
        {isImage && (
          <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-0.5 text-xs text-white">
            Image
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 font-semibold text-gray-900 group-hover:text-brand-600">
          {vlog.title}
        </h3>
        <p className="mt-1 text-sm text-gray-500">{authorName}</p>
        <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <EyeIcon className="h-4 w-4" />
            {vlog.viewCount ?? 0}
          </span>
          <span className="flex items-center gap-1">
            <HeartIcon filled={false} className="h-4 w-4" />
            {likeCount}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default VlogCard;
