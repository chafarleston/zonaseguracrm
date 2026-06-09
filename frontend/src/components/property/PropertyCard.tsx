import { memo } from 'react';
import type { Property } from '@/types/property';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bed, Bath, Maximize, MapPin, Edit, Trash2, Images } from 'lucide-react';
import { STATUS_BADGE_COLORS, STATUS_LABELS, TYPE_LABELS } from '@/lib/constants';

interface PropertyCardProps {
  property: Property;
  onEdit?: (property: Property) => void;
  onDelete?: (id: string) => void;
  onClick?: (property: Property) => void;
  showActions?: boolean;
  'aria-label'?: string;
}

export const PropertyCard = memo(function PropertyCard({
  property,
  onEdit,
  onDelete,
  onClick,
  showActions = false,
  ['aria-label']: ariaLabel,
}: PropertyCardProps) {
  const mainImage = property.images[0] || '/images/logo.jpg';
  const hasMultipleImages = property.images.length > 1;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(property);
    }
  };

  return (
    <Card
      className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group bg-white/90 backdrop-blur-sm border-green-100"
      onClick={() => onClick?.(property)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel || `Ver detalles de ${property.title}`}
    >
      <div className="relative">
        <img
          src={mainImage}
          alt={property.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {hasMultipleImages && (
          <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded-full flex items-center gap-1 text-sm">
            <Images className="h-4 w-4" />
            <span>{property.images.length}</span>
          </div>
        )}

        <div className="absolute top-2 left-2 flex gap-2 flex-wrap">
          <Badge className={STATUS_BADGE_COLORS[property.status] || ''}>
            {STATUS_LABELS[property.status] || property.status}
          </Badge>
          <Badge variant="secondary" className="bg-white/90 text-green-700">
            {TYPE_LABELS[property.type] || property.type}
          </Badge>
        </div>

        {showActions && onEdit && onDelete && (
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity max-md:opacity-100">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 bg-white/90 hover:bg-green-100"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(property);
              }}
              aria-label={`Editar ${property.title}`}
            >
              <Edit className="h-4 w-4 text-green-600" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(property.id);
              }}
              aria-label={`Eliminar ${property.title}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg line-clamp-1 text-green-800">{property.title}</h3>
        </div>
        <p className="text-green-600 font-bold text-xl">
          {property.currency} {property.price.toLocaleString()}
        </p>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-green-700/70 text-sm line-clamp-2 mb-3">
          {property.description}
        </p>

        <div className="flex items-center text-sm text-green-700/70 mb-3">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="truncate">{property.address}</span>
        </div>

        <div className="flex justify-between text-sm border-t border-green-100 pt-3 text-green-700">
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4 text-green-600" />
            <span>{property.bedrooms} hab</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4 text-green-600" />
            <span>{property.bathrooms} baños</span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize className="h-4 w-4 text-green-600" />
            <span>{property.area}m&sup2;</span>
          </div>
        </div>

        {property.features.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {property.features.slice(0, 3).map((feature, idx) => (
              <Badge key={idx} variant="outline" className="text-xs border-green-200 text-green-700">
                {feature}
              </Badge>
            ))}
            {property.features.length > 3 && (
              <Badge variant="outline" className="text-xs border-green-200 text-green-700">
                +{property.features.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
});
