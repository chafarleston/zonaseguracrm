import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProperties } from '@/hooks/useProperties';
import { useSettings } from '@/hooks/useSettings';
import { useServices } from '@/hooks/useServices';
import { PropertyMap } from '@/components/maps/PropertyMap';
import { PropertyDetail } from '@/components/property/PropertyDetail';
import { ContactDialog } from '@/components/contact/ContactDialog';
import { ShareDialog } from '@/components/social/ShareDialog';
import type { Property } from '@/types/property';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Building2,
  Search,
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  Mail,
  Phone,
  ChevronRight,
  Loader2,
  Map,
  Grid3X3,
  Heart,
  Share2,
  User,
  Droplets,
  Car,
  Waves,
  Flame,
  Zap,
} from 'lucide-react';

const PROPERTY_TYPES = [
  { value: 'all', label: 'Todos los tipos' },
  { value: 'casa', label: 'Casa' },
  { value: 'departamento', label: 'Departamento' },
  { value: 'loft', label: 'Loft' },
  { value: 'ph', label: 'PH' },
  { value: 'terreno', label: 'Terreno' },
  { value: 'comercial', label: 'Comercial' },
];

export function PropertiesPublicPage() {
  const { properties, loading, error, refetch } = useProperties();
  const { settings } = useSettings();
  const { services } = useServices();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [priceRange, setPriceRange] = useState('all');
  const [shareProperty, setShareProperty] = useState<Property | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('zonasegura_favorites') || '[]');
    } catch {
      return [];
    }
  });

  const logoUrl = settings?.logoUrl ? `/storage/${settings.logoUrl}` : settings?.logoFullUrl || null;

  const toggleFavorite = (propertyId: string) => {
    setFavorites(prev => {
      const isFavorite = prev.includes(propertyId);
      const next = isFavorite
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId];
      localStorage.setItem('zonasegura_favorites', JSON.stringify(next));
      toast.success(isFavorite ? 'Eliminado de favoritos' : 'Agregado a favoritos');
      return next;
    });
  };

  const handleShare = (property: Property) => {
    setShareProperty(property);
    setIsShareOpen(true);
  };

  const filteredProperties = useMemo(() => {
    return (properties as Property[]).filter((property: Property) => {
      const matchesStatus = property.status === 'venta' || property.status === 'alquiler';
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        property.title.toLowerCase().includes(term) ||
        property.address.toLowerCase().includes(term) ||
        property.description.toLowerCase().includes(term);
      const matchesType = typeFilter === 'all' || property.type === typeFilter;

      let matchesPrice = true;
      if (priceRange !== 'all') {
        const [min, max] = priceRange.split('-').map(Number);
        matchesPrice = property.price >= min && (max ? property.price <= max : true);
      }

      return matchesStatus && matchesSearch && matchesType && matchesPrice;
    });
  }, [properties, searchTerm, typeFilter, priceRange]);

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    setIsDetailOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-green-700">Cargando propiedades...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-green-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {logoUrl ? (
                <img
                  src={`${logoUrl}?v=${Date.now()}`}
                  alt={settings?.companyName || 'Logo'}
                  className="h-20 w-auto object-contain"
                />
              ) : (
                <div className="bg-green-600 p-2 rounded-lg">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-green-900">
                  {settings?.companyName || 'Zona Segura'}
                </h1>
                <p className="text-sm text-green-600">
                  {settings?.companySubtitle || 'Inmobiliaria'}
                </p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <a href="#propiedades" className="text-green-700 hover:text-green-900 font-medium">
                Propiedades
              </a>
              <a href="#nosotros" className="text-green-700 hover:text-green-900 font-medium">
                Nosotros
              </a>
              <a href="#contacto" className="text-green-700 hover:text-green-900 font-medium">
                Contacto
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setIsContactOpen(true)}
                className="gap-2 border-green-600 text-green-700 hover:bg-green-50"
              >
                <Mail className="h-4 w-4" />
                Contactar
              </Button>
              <Link to="/login">
                <Button className="gap-2 bg-green-600 hover:bg-green-700">
                  <Building2 className="h-4 w-4" />
                  Acceso Agentes
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/90 to-emerald-600/90" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }} />
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Encuentra tu hogar ideal
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Saneamiento físico legal, compra, venta y alquiler de propiedades.
            Tu asesoría inmobiliaria de confianza.
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-2xl p-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Buscar por ubicación, título o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-48 h-12">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-full md:w-48 h-12">
                  <SelectValue placeholder="Precio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los precios</SelectItem>
                  <SelectItem value="0-200000">Hasta $200,000</SelectItem>
                  <SelectItem value="200000-400000">$200,000 - $400,000</SelectItem>
                  <SelectItem value="400000-600000">$400,000 - $600,000</SelectItem>
                  <SelectItem value="600000-1000000">$600,000 - $1,000,000</SelectItem>
                  <SelectItem value="1000000">Más de $1,000,000</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 px-4 py-2">
              <Building2 className="h-4 w-4 mr-2" />
              {filteredProperties.length} propiedades disponibles
            </Badge>
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section id="propiedades" className="py-16">
        <div className="container mx-auto px-4">
          {/* View Mode Toggle */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-green-900">Propiedades Disponibles</h3>
              <p className="text-green-600">
                {filteredProperties.length} propiedades encontradas
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-green-600' : ''}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('map')}
                className={viewMode === 'map' ? 'bg-green-600' : ''}
              >
                <Map className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property: Property) => (
                <div
                  key={property.id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer"
                  onClick={() => handlePropertyClick(property)}
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    {property.images && property.images.length > 0 ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center">
                        <Building2 className="h-16 w-16 text-green-400" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-green-600 text-white">
                        {property.status === 'venta' ? 'En Venta' : 'Alquiler'}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Button
                        size="icon"
                        variant="secondary"
                        className={`h-8 w-8 ${favorites.includes(property.id) ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-white/80 hover:bg-white'}`}
                        aria-label={favorites.includes(property.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(property.id);
                        }}
                      >
                        <Heart className={`h-4 w-4 ${favorites.includes(property.id) ? 'fill-current' : ''}`} />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 bg-white/80 hover:bg-white"
                        aria-label="Compartir propiedad"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(property);
                        }}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <p className="text-2xl font-bold text-white">
                        {property.currency} {property.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-green-600 mb-2">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{property.address}</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-green-700 transition-colors">
                      {property.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {property.description}
                    </p>

                    {/* Features */}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <BedDouble className="h-4 w-4" />
                        <span>{property.bedrooms} hab</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="h-4 w-4" />
                        <span>{property.bathrooms} baños</span>
                      </div>
                      {property.halfBathrooms > 0 && (
                        <div className="flex items-center gap-1">
                          <Droplets className="h-4 w-4" />
                          <span>{property.halfBathrooms} 1/2</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Maximize className="h-4 w-4" />
                        <span>{property.area} m²</span>
                      </div>
                      {property.parkingSpaces > 0 && (
                        <div className="flex items-center gap-1">
                          <Car className="h-4 w-4" />
                          <span>{property.parkingSpaces}</span>
                        </div>
                      )}
                    </div>

                    {/* Services */}
                    {(property.hasDrainage || property.hasGas || property.hasElectricity) && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {property.hasDrainage && (
                          <Badge variant="outline" className="text-xs">
                            <Waves className="h-3 w-3 mr-1" /> Drenaje
                          </Badge>
                        )}
                        {property.hasGas && (
                          <Badge variant="outline" className="text-xs">
                            <Flame className="h-3 w-3 mr-1" /> Gas
                          </Badge>
                        )}
                        {property.hasElectricity && (
                          <Badge variant="outline" className="text-xs">
                            <Zap className="h-3 w-3 mr-1" /> Luz
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Features Tags */}
                    {property.features && property.features.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {property.features.slice(0, 3).map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {property.features.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{property.features.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t flex items-center justify-between">
                      <span className="text-sm text-green-600 font-medium capitalize">
                        {property.type}
                      </span>
                      <span className="text-sm text-green-700 flex items-center gap-1">
                        Ver detalles
                        <ChevronRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden" style={{ height: '600px' }}>
              <PropertyMap
                properties={filteredProperties}
                selectedProperty={selectedProperty}
                onPropertySelect={(prop) => {
                  setSelectedProperty(prop);
                  setIsDetailOpen(true);
                }}
                height="600px"
              />
            </div>
          )}

          {filteredProperties.length === 0 && (
            <div className="text-center py-20">
              <Building2 className="h-20 w-20 text-green-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-green-800 mb-3">
                No se encontraron propiedades
              </h3>
              <p className="text-green-600 mb-6">
                Intenta ajustar los filtros de búsqueda
              </p>
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setTypeFilter('all');
                  setPriceRange('all');
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                Limpiar filtros
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="nosotros" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-green-900 mb-6">
              Sobre Zona Segura Inmobiliaria
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Somos una asesoría inmobiliaria de confianza especializada en saneamiento físico legal,
              compra, venta y alquiler de propiedades. Con años de experiencia en el mercado,
              te ayudamos a encontrar el hogar de tus sueños.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-green-50 rounded-xl">
                <div className="bg-green-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-green-900 mb-2">Amplio Portafolio</h4>
                <p className="text-sm text-green-700">
                  Casas, departamentos, lofts y propiedades comerciales
                </p>
              </div>
              <div className="p-6 bg-green-50 rounded-xl">
                <div className="bg-green-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-green-900 mb-2">Ubicaciones Premium</h4>
                <p className="text-sm text-green-700">
                  Las mejores zonas de {settings?.city || 'Piura'} y alrededores
                </p>
              </div>
              <div className="p-6 bg-green-50 rounded-xl">
                <div className="bg-green-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-green-900 mb-2">Asesoría Personalizada</h4>
                <p className="text-sm text-green-700">
                  Te acompañamos en todo el proceso de compra o venta
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Sections */}
      {services.map((service) => (
        <section
          key={service.id}
          id={service.slug}
          className="py-16 bg-white"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                parseInt(service.id) % 2 === 0 ? 'lg:flex-row-reverse' : ''
              }`}>
                <div className={parseInt(service.id) % 2 === 0 ? 'lg:order-2' : ''}>
                  {service.imageFullUrl ? (
                    <img
                      src={service.imageFullUrl}
                      alt={service.name}
                      className="w-full h-80 object-cover rounded-2xl shadow-lg"
                    />
                  ) : (
                    <div className="w-full h-80 bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl shadow-lg flex items-center justify-center">
                      <Building2 className="h-20 w-20 text-green-400" />
                    </div>
                  )}
                </div>
                <div className={parseInt(service.id) % 2 === 0 ? 'lg:order-1' : ''}>
                  <h3 className="text-3xl font-bold text-green-900 mb-4">
                    {service.name}
                  </h3>
                  <p className="text-lg text-gray-600 mb-6">
                    {service.longDescription || service.description}
                  </p>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => setIsContactOpen(true)}
                  >
                    Consultar
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Contact Section */}
      <section id="contacto" className="py-16 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            ¿Listo para encontrar tu próximo hogar?
          </h3>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Contáctanos y te ayudaremos a encontrar la propiedad perfecta para ti
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-green-700 hover:bg-green-50"
              onClick={() => setIsContactOpen(true)}
            >
              <Mail className="h-5 w-5 mr-2" />
              Enviar Mensaje
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              <Phone className="h-5 w-5 mr-2" />
              Llamar Ahora
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-green-100 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                {logoUrl ? (
                  <img
                    src={`${logoUrl}?v=${Date.now()}`}
                    alt={settings?.companyName || 'Logo'}
                    className="h-16 w-auto object-contain"
                  />
                ) : (
                  <Building2 className="h-8 w-8 text-green-400" />
                )}
                <div>
                  <h4 className="text-lg font-bold text-white">
                    {settings?.companyName || 'Zona Segura'}
                  </h4>
                  <p className="text-sm text-green-400">
                    {settings?.companySubtitle || 'Inmobiliaria'}
                  </p>
                </div>
              </div>
              <p className="text-sm text-green-300">
                {settings?.description || 'Tu asesoría inmobiliaria de confianza.'}
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-white mb-4">Propiedades</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Casas en Venta</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Departamentos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terrenos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Comerciales</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-white mb-4">Servicios</h5>
              <ul className="space-y-2 text-sm">
                {services.map((service) => (
                  <li key={service.id}>
                    <a
                      href={`#${service.slug}`}
                      className="hover:text-white transition-colors"
                    >
                      {service.name}
                    </a>
                  </li>
                ))}
                {services.length === 0 && (
                  <>
                    <li><a href="#tasaciones" className="hover:text-white transition-colors">Tasaciones</a></li>
                    <li><a href="#asesoria-legal" className="hover:text-white transition-colors">Asesoría Legal</a></li>
                    <li><a href="#financiamiento" className="hover:text-white transition-colors">Financiamiento</a></li>
                    <li><a href="#administracion" className="hover:text-white transition-colors">Administración</a></li>
                  </>
                )}
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-white mb-4">Contacto</h5>
              <ul className="space-y-2 text-sm">
                {settings?.contactPerson && (
                  <li className="flex items-center gap-2">
                    <User className="h-4 w-4 text-green-400" />
                    {settings.contactPerson}
                  </li>
                )}
                {settings?.phone && (
                  <li className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-green-400" />
                    {settings.phone}
                  </li>
                )}
                {settings?.email && (
                  <li className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-green-400" />
                    {settings.email}
                  </li>
                )}
                {(settings?.address || settings?.city || settings?.country) && (
                  <li className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-400" />
                    {[settings?.address, settings?.city, settings?.country].filter(Boolean).join(', ')}
                  </li>
                )}
              </ul>
            </div>
          </div>
          <div className="border-t border-green-800 mt-8 pt-8 text-center text-sm text-green-400">
            <p>&copy; {new Date().getFullYear()} {settings?.footerText || 'Zona Segura Inmobiliaria. Todos los derechos reservados.'}</p>
          </div>
        </div>
      </footer>

      {/* Dialogs */}
      <PropertyDetail
        property={selectedProperty}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />

      <ContactDialog
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

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
