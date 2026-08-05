import { useState } from 'react';
import { useClients } from '@/hooks/useClients';
import { ClientForm } from '@/components/clients/ClientForm';
import type { Client, ClientFormData } from '@/components/clients/ClientForm';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
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
  Loader2,
  Mail,
  Phone,
  MapPin,
  UserCheck,
} from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  lead: 'bg-gray-100 text-gray-800',
  prospect: 'bg-blue-100 text-blue-800',
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-red-100 text-red-800',
  converted: 'bg-purple-100 text-purple-800',
};

const STATUS_LABELS: Record<string, string> = {
  lead: 'Lead',
  prospect: 'Prospecto',
  active: 'Activo',
  inactive: 'Inactivo',
  converted: 'Convertido',
};

const SOURCE_LABELS: Record<string, string> = {
  web: 'Sitio Web',
  referido: 'Referido',
  llamada: 'Llamada',
  whatsapp: 'WhatsApp',
  facebook: 'Facebook',
  instagram: 'Instagram',
  otro: 'Otro',
};

const SOURCE_COLORS: Record<string, string> = {
  web: 'bg-blue-100 text-blue-800',
  referido: 'bg-green-100 text-green-800',
  llamada: 'bg-yellow-100 text-yellow-800',
  whatsapp: 'bg-emerald-100 text-emerald-800',
  facebook: 'bg-indigo-100 text-indigo-800',
  instagram: 'bg-pink-100 text-pink-800',
  otro: 'bg-gray-100 text-gray-800',
};

export function ClientsPage() {
  const { clients, isLoading, error, refetch, createClient, updateClient, deleteClient, convertClient } = useClients();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deleteClientId, setDeleteClientId] = useState<string | null>(null);
  const [convertClientId, setConvertClientId] = useState<string | null>(null);

  const filteredClients = (clients as Client[]).filter((client: Client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone?.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || client.source === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  const handleCreate = () => {
    setEditingClient(null);
    setIsFormOpen(true);
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setIsFormOpen(true);
  };

  const handleSubmit = async (data: ClientFormData) => {
    if (editingClient) {
      await updateClient(editingClient.id, data);
    } else {
      await createClient(data);
    }
    setIsFormOpen(false);
    setEditingClient(null);
  };

  const handleDelete = (id: string) => {
    setDeleteClientId(id);
  };

  const confirmDelete = async () => {
    if (deleteClientId) {
      await deleteClient(deleteClientId);
      setDeleteClientId(null);
    }
  };

  const handleConvert = (id: string) => {
    setConvertClientId(id);
  };

  const confirmConvert = async () => {
    if (convertClientId) {
      await convertClient(convertClientId);
      setConvertClientId(null);
    }
  };

  if (isLoading) {
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
          <h2 className="text-2xl font-bold">Clientes</h2>
          <p className="text-muted-foreground">
            {filteredClients.length} clientes encontrados
          </p>
        </div>
        <Button onClick={handleCreate} className="bg-green-600 hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, email o teléfono..."
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
                <SelectItem value="lead">Lead</SelectItem>
                <SelectItem value="prospect">Prospecto</SelectItem>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="inactive">Inactivo</SelectItem>
                <SelectItem value="converted">Convertido</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Fuente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="web">Sitio Web</SelectItem>
                <SelectItem value="referido">Referido</SelectItem>
                <SelectItem value="llamada">Llamada</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de clientes */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Fuente</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Presupuesto</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client: Client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{client.name}</p>
                      {client.preferredBedrooms && (
                        <p className="text-xs text-muted-foreground">
                          {client.preferredBedrooms} hab preferidas
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {client.email && (
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="truncate max-w-[150px]">{client.email}</span>
                        </div>
                      )}
                      {client.phone && (
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span>{client.phone}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={SOURCE_COLORS[client.source] || 'bg-gray-100 text-gray-800'}>
                      {SOURCE_LABELS[client.source] || client.source}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={STATUS_COLORS[client.status] || 'bg-gray-100 text-gray-800'}>
                      {STATUS_LABELS[client.status] || client.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {(client.budgetMin || client.budgetMax) ? (
                      <p className="text-sm">
                        {client.budgetMin ? `USD ${client.budgetMin.toLocaleString()}` : ''}
                        {client.budgetMin && client.budgetMax ? ' - ' : ''}
                        {client.budgetMax ? `USD ${client.budgetMax.toLocaleString()}` : ''}
                      </p>
                    ) : (
                      <span className="text-muted-foreground text-sm">No definido</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {client.preferredLocation ? (
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="truncate max-w-[120px]">{client.preferredLocation}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {client.status !== 'converted' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleConvert(client.id)}
                          title="Convertir cliente"
                        >
                          <UserCheck className="h-4 w-4 text-green-500" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(client)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(client.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredClients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No se encontraron clientes
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Client Form Dialog */}
      <ClientForm
        client={editingClient}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingClient(null);
        }}
        onSubmit={handleSubmit}
      />

      {/* Confirmación de eliminación */}
      <ConfirmDialog
        open={!!deleteClientId}
        onOpenChange={(open) => !open && setDeleteClientId(null)}
        title="Eliminar cliente"
        description="¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={confirmDelete}
        variant="destructive"
      />

      {/* Confirmación de conversión */}
      <ConfirmDialog
        open={!!convertClientId}
        onOpenChange={(open) => !open && setConvertClientId(null)}
        title="Convertir cliente"
        description="¿Deseas marcar a este cliente como convertido?"
        confirmLabel="Convertir"
        cancelLabel="Cancelar"
        onConfirm={confirmConvert}
      />
    </div>
  );
}
