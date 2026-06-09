import { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import type L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { defaultIcon, TILE_CONFIG, DEFAULT_CENTER } from '@/lib/leaflet-config';

function LocationMarker({
  position,
  onPositionChange,
}: {
  position: [number, number] | null;
  onPositionChange: (pos: [number, number]) => void;
}) {
  useMapEvents({
    click(e: L.LeafletMouseEvent) {
      onPositionChange([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? (
    <Marker position={position} icon={defaultIcon} />
  ) : null;
}

interface LocationPickerProps {
  value?: { lat: number; lng: number } | null;
  onChange: (coords: { lat: number; lng: number }) => void;
  height?: string;
}

export function LocationPicker({
  value,
  onChange,
  height = '300px',
}: LocationPickerProps) {
  const initPosition: [number, number] | null = value && (value.lat !== 0 || value.lng !== 0)
    ? [value.lat, value.lng]
    : null;
  const [position, setPosition] = useState<[number, number] | null>(initPosition);

  const handlePositionChange = useCallback((newPosition: [number, number]) => {
    setPosition(newPosition);
    onChange({ lat: newPosition[0], lng: newPosition[1] });
  }, [onChange]);

  const center: [number, number] = position || DEFAULT_CENTER;

  return (
    <div className="space-y-2">
      <div className="text-sm text-muted-foreground">
        Haz clic en el mapa para seleccionar la ubicación exacta de la propiedad
      </div>
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height, width: '100%', borderRadius: '0.5rem' }}
      >
        <TileLayer {...TILE_CONFIG} />
        <LocationMarker
          position={position}
          onPositionChange={handlePositionChange}
        />
      </MapContainer>

      {position && (
        <div className="flex items-center gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Latitud: </span>
            <span className="font-mono">{position[0].toFixed(6)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Longitud: </span>
            <span className="font-mono">{position[1].toFixed(6)}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setPosition(null);
              onChange({ lat: 0, lng: 0 });
            }}
            className="text-sm text-red-600 hover:text-red-800 ml-auto"
            aria-label="Quitar marcador de ubicación"
          >
            Quitar ubicación
          </button>
        </div>
      )}
    </div>
  );
}
