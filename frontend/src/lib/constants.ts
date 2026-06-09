export const PROPERTY_TYPES = [
  { value: 'casa', label: 'Casa' },
  { value: 'departamento', label: 'Departamento' },
  { value: 'loft', label: 'Loft' },
  { value: 'ph', label: 'PH' },
  { value: 'terreno', label: 'Terreno' },
  { value: 'comercial', label: 'Comercial' },
] as const;

export const PROPERTY_STATUS = [
  { value: 'venta', label: 'En Venta' },
  { value: 'alquiler', label: 'En Alquiler' },
  { value: 'reservado', label: 'Reservado' },
  { value: 'vendido', label: 'Vendido' },
] as const;

export const CURRENCIES = [
  { value: 'USD', label: 'USD - Dólares' },
  { value: 'ARS', label: 'ARS - Pesos Argentinos' },
  { value: 'EUR', label: 'EUR - Euros' },
] as const;

export const STATUS_BADGE_COLORS: Record<string, string> = {
  venta: 'bg-green-100 text-green-800 border-green-200',
  alquiler: 'bg-blue-100 text-blue-800 border-blue-200',
  reservado: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  vendido: 'bg-gray-100 text-gray-800 border-gray-200',
};

export const STATUS_LABELS: Record<string, string> = {
  venta: 'En Venta',
  alquiler: 'En Alquiler',
  reservado: 'Reservado',
  vendido: 'Vendido',
};

export const TYPE_LABELS: Record<string, string> = {
  casa: 'Casa',
  departamento: 'Departamento',
  loft: 'Loft',
  ph: 'PH',
  terreno: 'Terreno',
  comercial: 'Comercial',
};

export type PropertyType = (typeof PROPERTY_TYPES)[number]['value'];
export type PropertyStatus = (typeof PROPERTY_STATUS)[number]['value'];
export type Currency = (typeof CURRENCIES)[number]['value'];


