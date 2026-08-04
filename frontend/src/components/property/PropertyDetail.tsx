import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ImageGallery } from '@/components/property/ImageGallery';
import { PropertyMap } from '@/components/maps/PropertyMap';
import {
  Mail,
  Map,
  Building,
  Sprout,
  Ruler,
  Clock,
  Layers,
  BedDouble,
  Bath,
  Droplets,
  Car,
  Waves,
  Flame,
  Zap,
  Check,
  X as XIcon,
} from 'lucide-react';
import type { Property } from '@/types/property';
import { STATUS_BADGE_COLORS, STATUS_LABELS, TYPE_LABELS } from '@/lib/constants';

interface PropertyDetailProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PropertyDetail({ property, isOpen, onClose }: PropertyDetailProps) {
  if (!property) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-green-800">{property.title}</DialogTitle>
          <DialogDescription className="text-green-600">
            {property.address}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-green-800 mb-2">Galería de fotos</h3>
            <ImageGallery
              images={property.images}
              title={property.title}
            />
          </div>

          <div className="flex justify-between items-center bg-green-50 p-4 rounded-lg">
            <div>
              <p className="text-3xl font-bold text-green-700">
                {property.currency} {property.price.toLocaleString()}
              </p>
              <p className="text-green-600">{TYPE_LABELS[property.type] || property.type}</p>
            </div>
            <div className="text-right">
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${STATUS_BADGE_COLORS[property.status] || ''}`}>
                {STATUS_LABELS[property.status] || property.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 py-4 border-y border-green-200">
            <div className="text-center">
              <p className="text-2xl font-semibold text-green-700">{property.bedrooms}</p>
              <p className="text-sm text-green-600">Habitaciones</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-green-700">{property.bathrooms}</p>
              <p className="text-sm text-green-600">Baños</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-green-700">{property.area}m&sup2;</p>
              <p className="text-sm text-green-600">Área</p>
            </div>
          </div>

          {/* Características del Terreno */}
          {(property.terrainTotalArea !== null || property.terrainBuiltArea !== null || property.terrainFreeArea !== null || property.terrainMeasurements) && (
            <div>
              <h3 className="font-semibold text-green-800 mb-3">Características del Terreno</h3>
              <div className="grid grid-cols-2 gap-3">
                {property.terrainTotalArea !== null && (
                  <div className="flex items-center gap-2 bg-green-50 p-3 rounded-lg">
                    <Map className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-xs text-green-600">Área Total de Terreno</p>
                      <p className="font-semibold text-green-800">{property.terrainTotalArea} m²</p>
                    </div>
                  </div>
                )}
                {property.terrainBuiltArea !== null && (
                  <div className="flex items-center gap-2 bg-green-50 p-3 rounded-lg">
                    <Building className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-xs text-green-600">Área Construida</p>
                      <p className="font-semibold text-green-800">{property.terrainBuiltArea} m²</p>
                    </div>
                  </div>
                )}
                {property.terrainFreeArea !== null && (
                  <div className="flex items-center gap-2 bg-green-50 p-3 rounded-lg">
                    <Sprout className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-xs text-green-600">Área Libre</p>
                      <p className="font-semibold text-green-800">{property.terrainFreeArea} m²</p>
                    </div>
                  </div>
                )}
                {property.terrainMeasurements && (
                  <div className="flex items-center gap-2 bg-green-50 p-3 rounded-lg">
                    <Ruler className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-xs text-green-600">Medidas del Terreno</p>
                      <p className="font-semibold text-green-800">{property.terrainMeasurements}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Características de la Propiedad */}
          <div>
            <h3 className="font-semibold text-green-800 mb-3">Características de la Propiedad</h3>
            <div className="grid grid-cols-2 gap-3">
              {property.propertyAge !== null && (
                <div className="flex items-center gap-2 bg-green-50 p-3 rounded-lg">
                  <Clock className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-xs text-green-600">Antigüedad</p>
                    <p className="font-semibold text-green-800">{property.propertyAge} años</p>
                  </div>
                </div>
              )}
              {property.propertyFloors !== null && (
                <div className="flex items-center gap-2 bg-green-50 p-3 rounded-lg">
                  <Layers className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-xs text-green-600">N° de Pisos</p>
                    <p className="font-semibold text-green-800">{property.propertyFloors}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2 bg-green-50 p-3 rounded-lg">
                <BedDouble className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-xs text-green-600">Habitaciones</p>
                  <p className="font-semibold text-green-800">{property.bedrooms}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-green-50 p-3 rounded-lg">
                <Bath className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-xs text-green-600">Baños</p>
                  <p className="font-semibold text-green-800">{property.bathrooms}</p>
                </div>
              </div>
              {property.halfBathrooms > 0 && (
                <div className="flex items-center gap-2 bg-green-50 p-3 rounded-lg">
                  <Droplets className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-xs text-green-600">1/2 Baños</p>
                    <p className="font-semibold text-green-800">{property.halfBathrooms}</p>
                  </div>
                </div>
              )}
              {property.parkingSpaces > 0 && (
                <div className="flex items-center gap-2 bg-green-50 p-3 rounded-lg">
                  <Car className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-xs text-green-600">Cochera</p>
                    <p className="font-semibold text-green-800">{property.parkingSpaces} espacios</p>
                  </div>
                </div>
              )}
            </div>

            {/* Servicios */}
            <div className="mt-3 grid grid-cols-3 gap-3">
              <div className={`flex items-center gap-2 p-3 rounded-lg ${property.hasDrainage ? 'bg-green-50' : 'bg-gray-50'}`}>
                <Waves className={`h-5 w-5 ${property.hasDrainage ? 'text-green-600' : 'text-gray-400'}`} />
                <div>
                  <p className="text-xs text-green-600">Drenaje</p>
                  {property.hasDrainage ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <XIcon className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </div>
              <div className={`flex items-center gap-2 p-3 rounded-lg ${property.hasGas ? 'bg-green-50' : 'bg-gray-50'}`}>
                <Flame className={`h-5 w-5 ${property.hasGas ? 'text-green-600' : 'text-gray-400'}`} />
                <div>
                  <p className="text-xs text-green-600">Gas</p>
                  {property.hasGas ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <XIcon className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </div>
              <div className={`flex items-center gap-2 p-3 rounded-lg ${property.hasElectricity ? 'bg-green-50' : 'bg-gray-50'}`}>
                <Zap className={`h-5 w-5 ${property.hasElectricity ? 'text-green-600' : 'text-gray-400'}`} />
                <div>
                  <p className="text-xs text-green-600">Luz</p>
                  {property.hasElectricity ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <XIcon className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-green-800 mb-2">Descripción</h3>
            <p className="text-green-700">{property.description}</p>
          </div>

          {property.features.length > 0 && (
            <div>
              <h3 className="font-semibold text-green-800 mb-2">Características</h3>
              <div className="flex flex-wrap gap-2">
                {property.features.map((feature, idx) => (
                  <span
                    key={idx}
                    className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="font-semibold text-green-800 mb-2">Ubicación</h3>
            <PropertyMap
              properties={[property]}
              center={[property.coordinates.lat, property.coordinates.lng]}
              zoom={15}
              height="300px"
            />
          </div>

          <div className="pt-4 border-t border-green-200">
            <Button
              onClick={() => window.open('mailto:rcharles84@gmail.com?subject=Consulta%20sobre%20propiedad%20en%20Zona%20Segura', '_blank')}
              className="w-full bg-green-600 hover:bg-green-700 gap-2"
            >
              <Mail className="h-4 w-4" />
              Contactar sobre esta propiedad
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
