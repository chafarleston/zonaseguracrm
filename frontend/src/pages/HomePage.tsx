import { useState, useMemo, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useProperties } from '@/hooks/useProperties';
import { PropertyCard } from '@/components/property/PropertyCard';
import { PropertyForm } from '@/components/property/PropertyForm';
import { PropertyMap } from '@/components/maps/PropertyMap';
import { PropertyDetail } from '@/components/property/PropertyDetail';
import { PropertyFilters } from '@/components/property/PropertyFilters';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppFooter } from '@/components/layout/AppFooter';
import { ContactDialog } from '@/components/contact/ContactDialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { LoginForm } from '@/components/auth/LoginForm';
import type { Property, PropertyFormData } from '@/types/property';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const bgStyle = {
  backgroundImage: 'url(/images/logo.jpg)',
  backgroundSize: 'contain' as const,
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundAttachment: 'fixed' as const,
};

export function HomePage() {
  const { isAdmin, isAuthenticated } = useAuth();
  const { properties, loading, error, refetch, createProperty, updateProperty, deleteProperty } = useProperties();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  const filteredProperties = useMemo(() => {
    return (properties as Property[]).filter((property: Property) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        property.title.toLowerCase().includes(term) ||
        property.address.toLowerCase().includes(term) ||
        property.description.toLowerCase().includes(term);

      const matchesType = typeFilter === 'all' || property.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || property.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [properties, searchTerm, typeFilter, statusFilter]);

  const checkAuth = useCallback(() => {
    if (!isAuthenticated) {
      setIsLoginOpen(true);
      return false;
    }
    return true;
  }, [isAuthenticated]);

  const handleEdit = useCallback((property: Property) => {
    if (!checkAuth()) return;
    setEditingProperty(property);
    setIsFormOpen(true);
  }, [checkAuth]);

  const handleCreate = useCallback(() => {
    if (!checkAuth()) return;
    setEditingProperty(null);
    setIsFormOpen(true);
  }, [checkAuth]);

  const handleSubmit = useCallback(async (data: PropertyFormData) => {
    if (!isAdmin) {
      toast.error('Solo los administradores pueden modificar propiedades');
      return;
    }
    if (editingProperty) {
      await updateProperty(editingProperty.id, data);
    } else {
      await createProperty(data);
    }
  }, [isAdmin, editingProperty, updateProperty, createProperty]);

  const handleDeleteClick = useCallback((id: string) => {
    if (!isAdmin) {
      toast.error('Solo los administradores pueden eliminar propiedades');
      return;
    }
    setPendingDeleteId(id);
    setIsConfirmDeleteOpen(true);
  }, [isAdmin]);

  const handleDeleteConfirm = useCallback(async () => {
    if (pendingDeleteId) {
      await deleteProperty(pendingDeleteId);
      toast.success('Propiedad eliminada');
    }
    setIsConfirmDeleteOpen(false);
    setPendingDeleteId(null);
  }, [pendingDeleteId, deleteProperty]);

  const handlePropertyClick = useCallback((property: Property) => {
    setSelectedProperty(property);
    setIsDetailOpen(true);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Button onClick={() => refetch()} className="bg-green-600 hover:bg-green-700">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 z-0 opacity-5" style={bgStyle} />
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-green-50/90 via-emerald-50/90 to-teal-50/90" />

      <div className="relative z-10">
        <AppHeader
          onNewProperty={handleCreate}
          onContact={() => setIsContactOpen(true)}
          onLogin={() => setIsLoginOpen(true)}
        />

        <main className="container mx-auto px-4 py-6">
          <div className="mb-6 p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-green-200 shadow-sm">
            <p className="text-green-800">
              <span className="font-semibold">&iexcl;Bienvenido a Zona Segura Inmobiliaria!</span>
              <span className="text-green-600 ml-2">
                Tu asesoría inmobiliaria de confianza. Saneamiento físico legal, compra, venta y alquiler de propiedades.
              </span>
            </p>
          </div>

          <PropertyFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            totalCount={(properties as Property[]).length}
            filteredCount={filteredProperties.length}
          />

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property: Property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onEdit={isAdmin ? handleEdit : undefined}
                  onDelete={isAdmin ? handleDeleteClick : undefined}
                  onClick={handlePropertyClick}
                  showActions={isAdmin}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {filteredProperties.map((property: Property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onEdit={isAdmin ? handleEdit : undefined}
                    onDelete={isAdmin ? handleDeleteClick : undefined}
                    onClick={handlePropertyClick}
                    showActions={false}
                  />
                ))}
              </div>
              <div className="lg:col-span-2">
                <PropertyMap
                  properties={filteredProperties}
                  selectedProperty={selectedProperty}
                  onPropertySelect={setSelectedProperty}
                  height="600px"
                />
              </div>
            </div>
          )}

          {filteredProperties.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <img src="/images/logo.jpg" alt="" className="h-12 w-auto" />
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">No se encontraron propiedades</h3>
              <p className="text-green-600">
                Intenta ajustar los filtros de búsqueda
              </p>
            </div>
          )}
        </main>

        <AppFooter />

        <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
          <DialogContent className="sm:max-w-md p-0 gap-0">
            <LoginForm onLoginSuccess={() => setIsLoginOpen(false)} />
          </DialogContent>
        </Dialog>

        <ContactDialog isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />

        {isAdmin && (
          <PropertyForm
            property={editingProperty}
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            onSubmit={handleSubmit}
          />
        )}

        <PropertyDetail
          property={selectedProperty}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
        />

        <ConfirmDialog
          open={isConfirmDeleteOpen}
          onOpenChange={setIsConfirmDeleteOpen}
          title="Eliminar Propiedad"
          description="&iquest;Est&aacute;s seguro de que deseas eliminar esta propiedad? Esta acci&oacute;n no se puede deshacer."
          confirmLabel="Eliminar"
          cancelLabel="Cancelar"
          onConfirm={handleDeleteConfirm}
          variant="destructive"
        />
      </div>
    </div>
  );
}
