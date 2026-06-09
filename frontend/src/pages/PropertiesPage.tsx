import { useState } from 'react';
import { useProperties } from '@/hooks/useProperties';
import { ShareDialog } from '@/components/social/ShareDialog';
import { PropertyForm } from '@/components/property/PropertyForm';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  Loader2,
  MapPin,
  BedDouble,
  Share2,
  Bath,
  Maximize,
} from 'lucide-react';
import type { Property, PropertyFormData } from '@/types/property';
import { toast } from 'sonner';

const STATUS_COLORS: Record<string, string> = {
  venta: 'bg-green-100 text-green-800',
  alquiler: 'bg-blue-100 text-blue-800',
  reservado: 'bg-yellow-100 text-yellow-800',
  vendido: 'bg-gray-100 text-gray-800',
};

const STATUS_LABELS: Record<string, string> = {
  venta: 'En Venta',
  alquiler: 'Alquiler',
  reservado: 'Reservado',
  vendido: 'Vendido',
};

const TYPE_LABELS: Record<string, string> = {
  casa: 'Casa',
  departamento: 'Departamento',
  loft: 'Loft',
  ph: 'PH',
  terreno: 'Terreno',
  comercial: 'Comercial',
};

export function PropertiesPage() {
  const { properties, loading, error, refetch, createProperty, updateProperty, deleteProperty } = useProperties();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [shareProperty, setShareProperty] = useState<Property | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  const filteredProperties = (properties as Property[]).filter((prop: Property) => {
    const matchesSearch =
      prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.propertyCode?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || prop.status === statusFilter;
    const matchesType = typeFilter === 'all' || prop.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleCreate = () => {
    setEditingProperty(null);
    setIsFormOpen(true);
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setIsFormOpen(true);
  };

  const handleSubmit = async (data: PropertyFormData) => {
    try {
      if (editingProperty) {
        await updateProperty(editingProperty.id, data);
        toast.success('Propiedad actualizada');
      } else {
        await createProperty(data);
        toast.success('Propiedad creada');
      }
      setIsFormOpen(false);
      setEditingProperty(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al guardar');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta propiedad?')) {
      await deleteProperty(id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Error: {error}</p>
        <Button onClick={() => refetch()} className="bg-green-600 hover:bg-green-700">
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Propiedades</h2>
          <p className="text-muted-foreground">
            {filteredProperties.length} propiedades encontradas
          </p>
        </div>
        <Button onClick={handleCreate} className="bg-green-600 hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Propiedad
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título, dirección o código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="venta">En Venta</SelectItem>
                <SelectItem value="alquiler">Alquiler</SelectItem>
                <SelectItem value="reservado">Reservado</SelectItem>
                <SelectItem value="vendido">Vendido</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="casa">Casa</SelectItem>
                <SelectItem value="departamento">Departamento</SelectItem>
                <SelectItem value="loft">Loft</SelectItem>
                <SelectItem value="ph">PH</SelectItem>
                <SelectItem value="terreno">Terreno</SelectItem>
                <SelectItem value="comercial">Comercial</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de propiedades */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Propiedad</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Detalles</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProperties.map((property: Property) => (
                <TableRow key={property.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {property.images && property.images.length > 0 ? (
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{property.title}</p>
                        {property.propertyCode && (
                          <p className="text-xs text-muted-foreground">
                            {property.propertyCode}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="truncate max-w-[200px]">{property.address}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <BedDouble className="h-3 w-3" />
                        {property.bedrooms}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath className="h-3 w-3" />
                        {property.bathrooms}
                      </span>
                      <span className="flex items-center gap-1">
                        <Maximize className="h-3 w-3" />
                        {property.area}m²
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold">
                      {property.currency} {property.price.toLocaleString()}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge className={STATUS_COLORS[property.status] || 'bg-gray-100 text-gray-800'}>
                      {STATUS_LABELS[property.status] || property.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm capitalize">
                      {TYPE_LABELS[property.type] || property.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShareProperty(property);
                          setIsShareOpen(true);
                        }}
                      >
                        <Share2 className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(property)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(property.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredProperties.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No se encontraron propiedades
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Property Form Dialog */}
      <PropertyForm
        property={editingProperty}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProperty(null);
        }}
        onSubmit={handleSubmit}
      />

      {/* Share Dialog */}
      <ShareDialog
        property={shareProperty}
        isOpen={isShareOpen}
        onClose={() => {
          setIsShareOpen(false);
          setShareProperty(null);
        }}
      />
    </div>
  );
}
