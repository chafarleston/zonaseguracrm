import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export interface Client {
  id: string;
  userId: string;
  name: string;
  email: string | null;
  phone: string | null;
  secondaryPhone: string | null;
  source: string;
  status: string;
  notes: string | null;
  budgetMin: number | null;
  budgetMax: number | null;
  preferredLocation: string | null;
  preferredBedrooms: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ClientFormData {
  name: string;
  email?: string;
  phone?: string;
  secondary_phone?: string;
  source?: string;
  status?: string;
  notes?: string;
  budget_min?: number;
  budget_max?: number;
  preferred_location?: string;
  preferred_bedrooms?: number;
}

interface ClientFormProps {
  client?: Client | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ClientFormData) => Promise<void>;
}

const SOURCES = [
  { value: 'web', label: 'Sitio Web' },
  { value: 'referido', label: 'Referido' },
  { value: 'llamada', label: 'Llamada' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'otro', label: 'Otro' },
];

const STATUSES = [
  { value: 'lead', label: 'Lead' },
  { value: 'prospect', label: 'Prospecto' },
  { value: 'active', label: 'Activo' },
  { value: 'inactive', label: 'Inactivo' },
  { value: 'converted', label: 'Convertido' },
];

export function ClientForm({ client, isOpen, onClose, onSubmit }: ClientFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    email: '',
    phone: '',
    secondary_phone: '',
    source: 'web',
    status: 'lead',
    notes: '',
    budget_min: undefined,
    budget_max: undefined,
    preferred_location: '',
    preferred_bedrooms: undefined,
  });

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || '',
        email: client.email || '',
        phone: client.phone || '',
        secondary_phone: client.secondaryPhone || '',
        source: client.source || 'web',
        status: client.status || 'lead',
        notes: client.notes || '',
        budget_min: client.budgetMin || undefined,
        budget_max: client.budgetMax || undefined,
        preferred_location: client.preferredLocation || '',
        preferred_bedrooms: client.preferredBedrooms || undefined,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        secondary_phone: '',
        source: 'web',
        status: 'lead',
        notes: '',
        budget_min: undefined,
        budget_max: undefined,
        preferred_location: '',
        preferred_bedrooms: undefined,
      });
    }
  }, [client, isOpen]);

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error('El nombre es requerido');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      toast.success(client ? 'Cliente actualizado' : 'Cliente creado');
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
          <DialogTitle>
            {client ? 'Editar Cliente' : 'Nuevo Cliente'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información básica */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase text-muted-foreground">
              Información de Contacto
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">Nombre completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Juan Pérez García"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono principal</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+51 912345678"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondary_phone">Teléfono secundario</Label>
                <Input
                  id="secondary_phone"
                  value={formData.secondary_phone}
                  onChange={(e) => setFormData({ ...formData, secondary_phone: e.target.value })}
                  placeholder="+51 987654321"
                />
              </div>
            </div>
          </div>

          {/* Clasificación */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase text-muted-foreground">
              Clasificación
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="source">Fuente de contacto</Label>
                <Select
                  value={formData.source}
                  onValueChange={(value) => setFormData({ ...formData, source: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SOURCES.map((source) => (
                      <SelectItem key={source.value} value={source.value}>
                        {source.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Preferencias */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase text-muted-foreground">
              Preferencias de Búsqueda
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget_min">Presupuesto mínimo (USD)</Label>
                <Input
                  id="budget_min"
                  type="number"
                  min={0}
                  value={formData.budget_min || ''}
                  onChange={(e) => setFormData({ ...formData, budget_min: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget_max">Presupuesto máximo (USD)</Label>
                <Input
                  id="budget_max"
                  type="number"
                  min={0}
                  value={formData.budget_max || ''}
                  onChange={(e) => setFormData({ ...formData, budget_max: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferred_bedrooms">Habitaciones preferidas</Label>
                <Input
                  id="preferred_bedrooms"
                  type="number"
                  min={0}
                  value={formData.preferred_bedrooms || ''}
                  onChange={(e) => setFormData({ ...formData, preferred_bedrooms: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferred_location">Ubicación preferida</Label>
              <Input
                id="preferred_location"
                value={formData.preferred_location}
                onChange={(e) => setFormData({ ...formData, preferred_location: e.target.value })}
                placeholder="Ej: Sullana, Piura"
              />
            </div>
          </div>

          {/* Notas */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase text-muted-foreground">
              Notas
            </h3>

            <div className="space-y-2">
              <Label htmlFor="notes">Observaciones</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Notas sobre el cliente..."
                rows={3}
              />
            </div>
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
            ) : client ? (
              'Actualizar'
            ) : (
              'Crear Cliente'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
