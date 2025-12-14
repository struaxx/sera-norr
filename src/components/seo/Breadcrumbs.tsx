import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

export function Breadcrumbs({ items, className, showHome = true }: BreadcrumbsProps) {
  const { t } = useTranslation();
  const location = useLocation();

  // Auto-generate breadcrumbs from path if items not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    
    const pathToLabel: Record<string, string> = {
      collections: t('nav.collections'),
      bespoke: t('nav.bespoke'),
      about: t('nav.about'),
      contact: t('nav.contact'),
      product: 'Product',
      terra: 'TERRA',
      vanta: 'VANTA',
      nord: 'NORD',
    };

    return pathParts.map((part, index) => ({
      label: pathToLabel[part] || part.charAt(0).toUpperCase() + part.slice(1),
      href: '/' + pathParts.slice(0, index + 1).join('/'),
    }));
  };

  const breadcrumbItems = items || generateBreadcrumbs();

  if (breadcrumbItems.length === 0) return null;

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={cn('flex items-center gap-2 text-sm text-muted-foreground', className)}
    >
      {showHome && (
        <>
          <Link 
            to="/" 
            className="flex items-center hover:text-foreground transition-colors duration-300"
            aria-label="Home"
          >
            <Home className="h-4 w-4" />
          </Link>
          <ChevronRight className="h-3 w-3" aria-hidden="true" />
        </>
      )}
      
      {breadcrumbItems.map((item, index) => (
        <span key={item.href} className="flex items-center gap-2">
          {index < breadcrumbItems.length - 1 ? (
            <>
              <Link 
                to={item.href}
                className="hover:text-foreground transition-colors duration-300 link-underline"
              >
                {item.label}
              </Link>
              <ChevronRight className="h-3 w-3" aria-hidden="true" />
            </>
          ) : (
            <span className="text-foreground font-medium" aria-current="page">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
