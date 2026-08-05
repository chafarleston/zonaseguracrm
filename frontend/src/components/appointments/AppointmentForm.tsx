import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Client, Property } from '@/types/crm';

export interface AppointmentFormDataInput {
  clientId: string;
  propertyId?: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  type?: string;
  status?: string;
  notes?: string;
}

interface AppointmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDate?: Date | null;
  clients: Client[];
  properties: Property[];
  onSubmit: (data: AppointmentFormDataInput) => Promise<void>;
}

const TYPES = [
  { value: 'visit', label: 'Visita' },
  { value: 'meeting', label: 'Reunión' },
  { value: 'call', label: 'Llamada' },
  { value: 'follow_up', label: 'Seguimiento' },
  { value: 'other', label: 'Otro' },
];

export function AppointmentForm({
  isOpen,
  onClose,
  defaultDate,
  clients,
  properties,
  onSubmit,
}: AppointmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '',
    propertyId: '',
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    location: '',
    type: 'visit',
    status: 'scheduled',
    notes: '',
  });

  useEffect(() => {
    if (isOpen) {
      const defaultTime = defaultDate || new Date();
      const iso = (d: Date) => {
        const offset = d.getTimezoneOffset();
        const local = new Date(d.getTime() - offset * 60000);
        return local.toISOString().slice(0, 16);
      };
      const start = new Date(defaultTime.getTime());
      const end = new Date(defaultTime.getTime() + 60 * 60000);
      setFormData({
        clientId: '',
        propertyId: '',
        title: '',
        description: '',
        startTime: iso(start),
        endTime: iso(end),
        location: '',
        type: 'visit',
        status: 'scheduled',
        notes: '',
      });
    }
  }, [isOpen, defaultDate]);

  const handleSubmit = async () => {
    if (!formData.clientId) {
      toast.error('Selecciona un cliente');
      return;
    }
    if (!formData.title.trim()) {
      toast.error('El título es requerido');
      return;
    }
    if (!formData.startTime || !formData.endTime) {
      toast.error('Selecciona la fecha y hora de inicio y fin');
      return;
    }
    if (new Date(formData.endTime) <= new Date(formData.startTime)) {
      toast.error('La hora de fin debe ser posterior a la de inicio');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        clientId: formData.clientId,
        propertyId: formData.propertyId || undefined,
        title: formData.title,
        description: formData.description || undefined,
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.location || undefined,
        type: formData.type,
        status: formData.status,
        notes: formData.notes || undefined,
      });
      toast.success('Cita creada');
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al guardar');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva Cita</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Cliente *</Label>
            <Select value={formData.clientId} onValueChange={(value) => setFormData({ ...formData, clientId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Título *</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ej: Visita a la propiedad"
            />
          </div>

          <div className="space-y-2">
            <Label>Propiedad (opcional)</Label>
            <Select value={formData.propertyId} onValueChange={(value) => setFormData({ ...formData, propertyId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una propiedad (opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Sin propiedad</SelectItem>
                {properties.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fecha y hora de inicio *</Label>
              <Input
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Fecha y hora de fin *</Label>
              <Input
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Ubicación</Label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Dirección de la visita"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Descripción</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descripción de la cita"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              'Crear Cita'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
