import type { Photo } from '../types/photo'

interface PhotoCardProps {
  photo: Photo
  loading?: 'lazy' | 'eager'
  className?: string
}

export const PhotoCard: React.FC<PhotoCardProps> = ({
  photo,
  loading = 'lazy',
  className = '',
}) => (
  <div className={`photo-card ${className}`}>
    <img
      className="photo-img skeleton"
      src={photo.download_url}
      alt={`Photo by ${photo.author}`}
      loading={loading}
      width={photo.width}
      height={photo.height}
      // decoding="async"
      // fetchPriority="high"
    />
    <div className="photo-author">
      {photo.id} {photo.author}
    </div>
  </div>
)

PhotoCard.displayName = 'PhotoCard'
