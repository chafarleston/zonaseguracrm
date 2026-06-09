import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, List, MapIcon } from 'lucide-react';

interface PropertyFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  viewMode: 'grid' | 'map';
  onViewModeChange: (mode: 'grid' | 'map') => void;
  totalCount: number;
  filteredCount: number;
}

export function PropertyFilters({
  searchTerm,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  statusFilter,
  onStatusFilterChange,
  viewMode,
  onViewModeChange,
  totalCount,
  filteredCount,
}: PropertyFiltersProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-6 shadow-sm border border-green-200">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-600" />
          <Input
            placeholder="Buscar propiedades..."
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            className="pl-10 border-green-200 focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div className="flex gap-4 flex-wrap">
          <Select value={typeFilter} onValueChange={onTypeFilterChange}>
            <SelectTrigger className="w-[140px] border-green-200" aria-label="Filtrar por tipo">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              <SelectItem value="casa">Casa</SelectItem>
              <SelectItem value="departamento">Departamento</SelectItem>
              <SelectItem value="loft">Loft</SelectItem>
              <SelectItem value="ph">PH</SelectItem>
              <SelectItem value="terreno">Terreno</SelectItem>
              <SelectItem value="comercial">Comercial</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-[140px] border-green-200" aria-label="Filtrar por estado">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="venta">En Venta</SelectItem>
              <SelectItem value="alquiler">En Alquiler</SelectItem>
              <SelectItem value="reservado">Reservado</SelectItem>
              <SelectItem value="vendido">Vendido</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex border border-green-200 rounded-lg overflow-hidden bg-white">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => onViewModeChange('grid')}
              aria-label="Vista en cuadrícula"
              aria-pressed={viewMode === 'grid'}
              className={`rounded-none ${viewMode === 'grid' ? 'bg-green-600 hover:bg-green-700' : 'hover:bg-green-50'}`}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'map' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => onViewModeChange('map')}
              aria-label="Vista en mapa"
              aria-pressed={viewMode === 'map'}
              className={`rounded-none ${viewMode === 'map' ? 'bg-green-600 hover:bg-green-700' : 'hover:bg-green-50'}`}
            >
              <MapIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-4 text-sm text-green-700">
        Mostrando <span className="font-semibold">{filteredCount}</span> de <span className="font-semibold">{totalCount}</span> propiedades
      </div>
    </div>
  );
}
