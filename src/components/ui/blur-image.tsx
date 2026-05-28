import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface BlurImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'eager' | 'lazy';
  decoding?: 'sync' | 'async';
  fetchPriority?: 'high' | 'auto' | 'low';
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

/**
 * Image component with blur-up placeholder effect.
 * Shows a blurred low-res version while the full image loads,
 * then fades in the sharp version.
 */
export function BlurImage({
  src,
  alt,
  className,
  loading = 'lazy',
  decoding = 'async',
  fetchPriority = 'auto',
  onError,
}: BlurImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Check if image is already cached/loaded
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current?.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, []);

  return (
    <>
      {/* Neutral grey placeholder, stays visible until image loads, or permanently on error */}
      <div
        className={cn(
          "absolute inset-0 bg-muted transition-opacity duration-500",
          isLoaded && !hasError ? "opacity-0" : "opacity-100"
        )}
        aria-hidden="true"
      />

      {/* Actual image */}
      {!hasError && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={cn(
            "transition-opacity duration-500",
            isLoaded ? "opacity-100" : "opacity-0",
            className
          )}
          loading={loading}
          decoding={decoding}
          fetchPriority={fetchPriority}
          onLoad={() => setIsLoaded(true)}
          onError={(e) => {
            if (onError) {
              onError(e);
            } else {
              setHasError(true);
            }
          }}
        />
      )}
    </>
  );
}
