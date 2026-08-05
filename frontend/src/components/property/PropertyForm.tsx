import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Property, PropertyFormData } from '@/types/property';
import { propertyApi } from '@/services/api';
import { PROPERTY_TYPES, PROPERTY_STATUS, CURRENCIES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { LocationPicker } from '@/components/maps/LocationPicker';
import {
  Plus,
  X,
  Ruler,
  Map,
  Sprout,
  Layers,
  Clock,
  Building,
  BedDouble,
  Bath,
  Droplets,
  Car,
  Waves,
  Flame,
  Zap,
  Upload,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

const propertySchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  price: z.coerce.number().min(0, 'El precio debe ser positivo'),
  currency: z.string().min(1),
  type: z.string().min(1),
  status: z.string().min(1),
  bedrooms: z.coerce.number().min(0, 'Debe ser un número positivo'),
  bathrooms: z.coerce.number().min(0, 'Debe ser un número positivo'),
  halfBathrooms: z.coerce.number().min(0).optional(),
  parkingSpaces: z.coerce.number().min(0).optional(),
  area: z.coerce.number().min(0, 'Debe ser un número positivo'),
  terrainTotalArea: z.coerce.number().min(0).optional(),
  terrainBuiltArea: z.coerce.number().min(0).optional(),
  terrainFreeArea: z.coerce.number().min(0).optional(),
  terrainMeasurements: z.string().optional(),
  propertyAge: z.coerce.number().min(0).optional(),
  propertyFloors: z.coerce.number().min(0).optional(),
  address: z.string().min(1, 'La dirección es requerida'),
});

type FormValues = z.infer<typeof propertySchema>;

interface PropertyFormProps {
  property?: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PropertyFormData) => Promise<void>;
}

export function PropertyForm({ property, isOpen, onClose, onSubmit }: PropertyFormProps) {
  const [newFeature, setNewFeature] = useState('');
  const [newImage, setNewImage] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resolver = zodResolver(propertySchema);

  const {
    register,
    handleSubmit: handleFormSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: resolver as any,
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      currency: 'USD',
      type: 'casa',
      status: 'venta',
      bedrooms: 1,
      bathrooms: 1,
      halfBathrooms: 0,
      parkingSpaces: 0,
      area: 0,
      terrainTotalArea: 0,
      terrainBuiltArea: 0,
      terrainFreeArea: 0,
      terrainMeasurements: '',
      propertyAge: 0,
      propertyFloors: 1,
      address: '',
    },
  });

  const watchType = watch('type');
  const watchStatus = watch('status');
  const watchCurrency = watch('currency');
  const [hasDrainage, setHasDrainage] = useState(false);
  const [hasGas, setHasGas] = useState(false);
  const [hasElectricity, setHasElectricity] = useState(false);

  useEffect(() => {
    if (property) {
      reset({
        title: property.title,
        description: property.description,
        price: property.price,
        currency: property.currency,
        type: property.type,
        status: property.status,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        halfBathrooms: property.halfBathrooms,
        parkingSpaces: property.parkingSpaces,
        area: property.area,
        terrainTotalArea: property.terrainTotalArea ?? 0,
        terrainBuiltArea: property.terrainBuiltArea ?? 0,
        terrainFreeArea: property.terrainFreeArea ?? 0,
        terrainMeasurements: property.terrainMeasurements || '',
        propertyAge: property.propertyAge ?? 0,
        propertyFloors: property.propertyFloors ?? 1,
        address: property.address,
      });
      setHasDrainage(property.hasDrainage);
      setHasGas(property.hasGas);
      setHasElectricity(property.hasElectricity);
      setFeatures(property.features);
      setImages(property.images);
      setCoordinates(property.coordinates);
    } else {
      reset();
      setHasDrainage(false);
      setHasGas(false);
      setHasElectricity(false);
      setFeatures([]);
      setImages([]);
      setCoordinates({ lat: 0, lng: 0 });
    }
  }, [property, isOpen, reset]);

  const onSubmitForm = async () => {
    setIsSubmitting(true);
    try {
      const formData = {
        title: watch('title'),
        description: watch('description'),
        price: Number(watch('price')),
        currency: watch('currency'),
        type: watch('type') as PropertyFormData['type'],
        status: watch('status') as PropertyFormData['status'],
        bedrooms: Number(watch('bedrooms')),
        bathrooms: Number(watch('bathrooms')),
        halfBathrooms: Number(watch('halfBathrooms') || 0),
        parkingSpaces: Number(watch('parkingSpaces') || 0),
        area: Number(watch('terrainTotalArea') || watch('area') || 0),
        terrainTotalArea: watch('terrainTotalArea') ? Number(watch('terrainTotalArea')) : undefined,
        terrainBuiltArea: watch('terrainBuiltArea') ? Number(watch('terrainBuiltArea')) : undefined,
        terrainFreeArea: watch('terrainFreeArea') ? Number(watch('terrainFreeArea')) : undefined,
        terrainMeasurements: watch('terrainMeasurements') || undefined,
        propertyAge: watch('propertyAge') ? Number(watch('propertyAge')) : undefined,
        propertyFloors: watch('propertyFloors') ? Number(watch('propertyFloors')) : undefined,
        hasDrainage,
        hasGas,
        hasElectricity,
        address: watch('address'),
        coordinates,
        images,
        features,
      };
      await onSubmit(formData);
      toast.success(property ? 'Propiedad actualizada' : 'Propiedad creada');
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al guardar');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures(prev => [...prev, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(prev => prev.filter((_, i) => i !== index));
  };

  const addImage = () => {
    if (newImage.trim()) {
      setImages(prev => [...prev, newImage.trim()]);
      setNewImage('');
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadImages = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        const result = await propertyApi.uploadImage(file);
        setImages(prev => [...prev, result.url]);
      }
      toast.success('Imágenes subidas correctamente');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al subir imágenes');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {property ? 'Editar Propiedad' : 'Nueva Propiedad'}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleFormSubmit(onSubmitForm, () => {
            toast.error('Revisa los campos obligatorios del formulario');
          })}
          className="space-y-6"
        >
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase text-muted-foreground">
              Información Básica
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="Ej: Moderna Casa Familiar"
                />
                {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Descripción *</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Describe la propiedad..."
                  rows={3}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Propiedad *</Label>
                <Select
                  value={watchType}
                  onValueChange={value => setValue('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROPERTY_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Estado *</Label>
                <Select
                  value={watchStatus}
                  onValueChange={value => setValue('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROPERTY_STATUS.map(status => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase text-muted-foreground">
              Precio
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Precio *</Label>
                <Input
                  id="price"
                  type="number"
                  step="any"
                  {...register('price', { setValueAs: (v) => v === '' ? 0 : Number(v) })}
                  placeholder="0"
                />
                {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Moneda *</Label>
                <Select
                  value={watchCurrency}
                  onValueChange={value => setValue('currency', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map(currency => (
                      <SelectItem key={currency.value} value={currency.value}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Características del Terreno */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase text-muted-foreground">
              Características del Terreno
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="terrainTotalArea" className="flex items-center gap-2">
                  <Map className="h-4 w-4 text-green-600" />
                  Área Total de Terreno (m&sup2;)
                </Label>
                <Input
                  id="terrainTotalArea"
                  type="number"
                  step="any"
                  min={0}
                  {...register('terrainTotalArea', { setValueAs: (v) => v === '' ? 0 : Number(v) })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="terrainBuiltArea" className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-green-600" />
                  Área Construida (m&sup2;)
                </Label>
                <Input
                  id="terrainBuiltArea"
                  type="number"
                  step="any"
                  min={0}
                  {...register('terrainBuiltArea', { setValueAs: (v) => v === '' ? 0 : Number(v) })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="terrainFreeArea" className="flex items-center gap-2">
                  <Sprout className="h-4 w-4 text-green-600" />
                  Área Libre (m&sup2;)
                </Label>
                <Input
                  id="terrainFreeArea"
                  type="number"
                  step="any"
                  min={0}
                  {...register('terrainFreeArea', { setValueAs: (v) => v === '' ? 0 : Number(v) })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="terrainMeasurements" className="flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-green-600" />
                  Medidas del Terreno
                </Label>
                <Input
                  id="terrainMeasurements"
                  {...register('terrainMeasurements')}
                  placeholder="Ej: 10m x 30m"
                />
              </div>
            </div>
          </div>

          {/* Características de la Propiedad */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase text-muted-foreground">
              Características de la Propiedad
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="propertyAge" className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-green-600" />
                  Antigüedad (años)
                </Label>
                <Input
                  id="propertyAge"
                  type="number"
                  min={0}
                  {...register('propertyAge', { setValueAs: (v) => v === '' ? 0 : Number(v) })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="propertyFloors" className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-green-600" />
                  N&deg; de Pisos
                </Label>
                <Input
                  id="propertyFloors"
                  type="number"
                  min={0}
                  {...register('propertyFloors', { setValueAs: (v) => v === '' ? 0 : Number(v) })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bedrooms" className="flex items-center gap-2">
                  <BedDouble className="h-4 w-4 text-green-600" />
                  Habitaciones *
                </Label>
                <Input
                  id="bedrooms"
                  type="number"
                  min={0}
                  {...register('bedrooms')}
                />
                {errors.bedrooms && <p className="text-sm text-red-500">{errors.bedrooms.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bathrooms" className="flex items-center gap-2">
                  <Bath className="h-4 w-4 text-green-600" />
                  Baños *
                </Label>
                <Input
                  id="bathrooms"
                  type="number"
                  min={0}
                  {...register('bathrooms')}
                />
                {errors.bathrooms && <p className="text-sm text-red-500">{errors.bathrooms.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="halfBathrooms" className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-green-600" />
                  1/2 Baños
                </Label>
                <Input
                  id="halfBathrooms"
                  type="number"
                  min={0}
                  {...register('halfBathrooms', { setValueAs: (v) => v === '' ? 0 : Number(v) })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="parkingSpaces" className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-green-600" />
                  Cochera
                </Label>
                <Input
                  id="parkingSpaces"
                  type="number"
                  min={0}
                  {...register('parkingSpaces', { setValueAs: (v) => v === '' ? 0 : Number(v) })}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Servicios */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <Label htmlFor="hasDrainage" className="flex items-center gap-2 cursor-pointer">
                  <Waves className="h-4 w-4 text-green-600" />
                  Servicio de Drenaje
                </Label>
                <Switch id="hasDrainage" checked={hasDrainage} onCheckedChange={setHasDrainage} />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <Label htmlFor="hasGas" className="flex items-center gap-2 cursor-pointer">
                  <Flame className="h-4 w-4 text-green-600" />
                  Servicio de Gas
                </Label>
                <Switch id="hasGas" checked={hasGas} onCheckedChange={setHasGas} />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <Label htmlFor="hasElectricity" className="flex items-center gap-2 cursor-pointer">
                  <Zap className="h-4 w-4 text-green-600" />
                  Servicio de Luz
                </Label>
                <Switch id="hasElectricity" checked={hasElectricity} onCheckedChange={setHasElectricity} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase text-muted-foreground">
              Ubicación
            </h3>

            <div className="space-y-2">
              <Label htmlFor="address">Dirección *</Label>
              <Input
                id="address"
                {...register('address')}
                placeholder="Ej: Av. Panamericana Norte 1500, Sullana"
              />
              {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Ubicación en el Mapa</Label>
              <LocationPicker
                value={coordinates.lat !== 0 ? coordinates : null}
                onChange={setCoordinates}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase text-muted-foreground">
              Imágenes
            </h3>

            {/* Subir archivos */}
            <div>
              <Label>Subir fotos desde tu computadora</Label>
              <div className="mt-2 flex items-center gap-3">
                <label
                  className={`flex-1 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors ${
                    isUploading ? 'opacity-60 pointer-events-none' : ''
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleUploadImages(e.target.files)}
                    disabled={isUploading}
                  />
                  {isUploading ? (
                    <>
                      <Loader2 className="h-6 w-6 mx-auto text-green-600 animate-spin mb-1" />
                      <p className="text-sm text-muted-foreground">Subiendo imágenes...</p>
                    </>
                  ) : (
                    <>
                      <Upload className="h-6 w-6 mx-auto text-gray-400 mb-1" />
                      <p className="text-sm text-muted-foreground">
                        Haz clic para seleccionar o arrastra fotos aquí
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        JPG, PNG, WebP · máx. 5MB cada una
                      </p>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* O agregar por URL */}
            <div className="flex gap-2 items-end">
              <div className="flex-1 space-y-1">
                <Label>O agrega por URL</Label>
                <Input
                  value={newImage}
                  onChange={e => setNewImage(e.target.value)}
                  placeholder="URL de la imagen"
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addImage())}
                />
              </div>
              <Button type="button" onClick={addImage} variant="outline" aria-label="Agregar imagen por URL">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {images.map((image, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={image}
                      alt={`Imagen ${idx + 1}`}
                      className="w-full h-20 object-cover rounded"
                      loading="lazy"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label={`Eliminar imagen ${idx + 1}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase text-muted-foreground">
              Amenities y Características
            </h3>

            <div className="flex gap-2">
              <Input
                value={newFeature}
                onChange={e => setNewFeature(e.target.value)}
                placeholder="Ej: Piscina, Jardín, Garage..."
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              />
              <Button type="button" onClick={addFeature} variant="outline" aria-label="Agregar característica">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {features.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1 bg-secondary px-3 py-1 rounded-full text-sm"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeFeature(idx)}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label={`Eliminar ${feature}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : property ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
