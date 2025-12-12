import { useState } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fallback?: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'wide' | 'auto';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
}

const defaultFallback = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23e5e7eb"/%3E%3Ctext x="50" y="50" font-family="sans-serif" font-size="14" fill="%239ca3af" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';

const aspectRatios = {
  square: 'aspect-square',
  video: 'aspect-video',
  wide: 'aspect-[21/9]',
  auto: '',
};

export default function ImageWithFallback({
  src,
  alt,
  fallback = defaultFallback,
  className = '',
  aspectRatio = 'auto',
  objectFit = 'cover',
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setImgSrc(fallback);
      setHasError(true);
    }
  };

  return (
    <div className={`overflow-hidden ${aspectRatios[aspectRatio]} ${className}`}>
      <img
        src={imgSrc}
        alt={alt}
        onError={handleError}
        className={`w-full h-full object-${objectFit}`}
        loading="lazy"
      />
    </div>
  );
}

// Placeholder component for when no image exists
interface PlaceholderProps {
  icon?: string;
  text?: string;
  className?: string;
  bgColor?: string;
}

export function ImagePlaceholder({
  icon = '🖼️',
  text = 'No Image',
  className = '',
  bgColor = 'bg-gray-100',
}: PlaceholderProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${bgColor} ${className}`}>
      <span className="text-3xl mb-2">{icon}</span>
      <span className="text-sm text-gray-500">{text}</span>
    </div>
  );
}

// Avatar component with initials fallback
interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const avatarSizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
};

export function Avatar({ src, name, size = 'md', className = '' }: AvatarProps) {
  const [hasError, setHasError] = useState(false);
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (!src || hasError) {
    return (
      <div
        className={`${avatarSizes[size]} bg-primary-100 rounded-full flex items-center justify-center font-bold text-primary-600 ${className}`}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      onError={() => setHasError(true)}
      className={`${avatarSizes[size]} rounded-full object-cover ${className}`}
    />
  );
}
