import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { Button } from './button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EditorialCaptionProps {
  label?: string;
  title: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  className?: string;
  align?: 'left' | 'center';
}

export function EditorialCaption({
  label,
  title,
  description,
  ctaText,
  ctaLink,
  className,
  align = 'left',
}: EditorialCaptionProps) {
  return (
    <div className={cn(
      'space-y-3',
      align === 'center' && 'text-center',
      className
    )}>
      {label && (
        <p className="editorial-caption-label">
          {label}
        </p>
      )}
      <h3 className="font-serif text-xl lg:text-2xl text-foreground">
        {title}
      </h3>
      {description && (
        <p className="editorial-caption-text max-w-sm">
          {description}
        </p>
      )}
      {ctaText && ctaLink && (
        <div className="pt-3">
          <Button asChild variant="sera-secondary" size="sm">
            <Link to={ctaLink}>
              {ctaText}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}

interface ImageWithCaptionProps {
  src: string;
  alt: string;
  label?: string;
  title: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  aspectRatio?: 'portrait' | 'landscape' | 'square';
  className?: string;
}

export function ImageWithCaption({
  src,
  alt,
  label,
  title,
  description,
  ctaText,
  ctaLink,
  aspectRatio = 'portrait',
  className,
}: ImageWithCaptionProps) {
  const aspectStyles = {
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
    square: 'aspect-square',
  };

  const Wrapper = ctaLink ? Link : 'div';
  const wrapperProps = ctaLink ? { to: ctaLink } : {};

  return (
    <Wrapper {...(wrapperProps as any)} className={cn('group block', className)}>
      <div className="image-reveal mb-5">
        <div className={cn('bg-muted overflow-hidden', aspectStyles[aspectRatio])}>
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
      <EditorialCaption
        label={label}
        title={title}
        description={description}
        ctaText={ctaText}
        ctaLink={ctaLink}
      />
    </Wrapper>
  );
}
