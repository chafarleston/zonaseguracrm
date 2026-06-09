import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import type { Property } from '@/types/property';
import 'leaflet/dist/leaflet.css';
import { defaultIcon, selectedIcon, TILE_CONFIG, DEFAULT_CENTER } from '@/lib/leaflet-config';

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

interface PropertyMapProps {
  properties: Property[];
  selectedProperty?: Property | null;
  onPropertySelect?: (property: Property) => void;
  center?: [number, number];
  zoom?: number;
  height?: string;
}

export function PropertyMap({
  properties,
  selectedProperty,
  onPropertySelect,
  center = DEFAULT_CENTER,
  zoom = 12,
  height = '400px',
}: PropertyMapProps) {
  const mapCenter: [number, number] = selectedProperty
    ? [selectedProperty.coordinates.lat, selectedProperty.coordinates.lng]
    : center;

  return (
    <MapContainer
      center={mapCenter}
      zoom={zoom}
      scrollWheelZoom={true}
      style={{ height, width: '100%', borderRadius: '0.5rem' }}
    >
      <TileLayer {...TILE_CONFIG} />

      <MapUpdater center={mapCenter} />

      {properties.map((property) => (
        <Marker
          key={property.id}
          position={[property.coordinates.lat, property.coordinates.lng]}
          icon={selectedProperty?.id === property.id ? selectedIcon : defaultIcon}
          eventHandlers={{
            click: () => onPropertySelect?.(property),
          }}
        >
          <Popup>
            <div className="min-w-[200px]">
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-24 object-cover rounded mb-2"
                loading="lazy"
              />
              <h3 className="font-semibold text-sm">{property.title}</h3>
              <p className="text-primary font-bold">
                {property.currency} {property.price.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {property.bedrooms} hab &middot; {property.bathrooms} baños &middot; {property.area}m&sup2;
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {property.address}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
