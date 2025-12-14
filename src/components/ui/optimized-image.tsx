import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
}

// Generate Shopify CDN URL with size and format optimization
const getOptimizedUrl = (url: string, width?: number, quality: number = 80): string => {
  // Check if it's a Shopify CDN URL
  if (url.includes('cdn.shopify.com')) {
    // Shopify CDN supports width, height, and format transformations
    const urlObj = new URL(url);
    
    // Add width parameter if specified
    if (width) {
      urlObj.searchParams.set('width', String(Math.min(width * 2, 2048))); // 2x for retina, max 2048
    }
    
    // Request WebP format for modern browsers
    urlObj.searchParams.set('format', 'webp');
    
    return urlObj.toString();
  }
  
  return url;
};

// Generate low-quality placeholder URL
const getPlaceholderUrl = (url: string): string => {
  if (url.includes('cdn.shopify.com')) {
    const urlObj = new URL(url);
    urlObj.searchParams.set('width', '20');
    urlObj.searchParams.set('format', 'webp');
    return urlObj.toString();
  }
  return url;
};

export function OptimizedImage({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  quality = 80,
  placeholder = 'empty',
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px', // Start loading 200px before entering viewport
        threshold: 0,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const optimizedSrc = getOptimizedUrl(src, width, quality);
  const placeholderSrc = placeholder === 'blur' ? getPlaceholderUrl(src) : undefined;

  return (
    <div 
      ref={imgRef}
      className={cn('relative overflow-hidden bg-muted/20', className)}
      style={{ aspectRatio: width && height ? `${width}/${height}` : undefined }}
    >
      {/* Blur placeholder */}
      {placeholder === 'blur' && placeholderSrc && !isLoaded && (
        <img
          src={placeholderSrc}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-lg"
        />
      )}

      {/* Main image */}
      {isInView && (
        <img
          src={optimizedSrc}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          onLoad={() => setIsLoaded(true)}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-500',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
        />
      )}
    </div>
  );
}