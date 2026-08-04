export interface Property {
  id: string;
  userId: string | null;
  title: string;
  propertyCode: string | null;
  description: string;
  price: number;
  currency: string;
  commissionRate: number;
  type: 'casa' | 'departamento' | 'loft' | 'ph' | 'terreno' | 'comercial';
  status: 'venta' | 'alquiler' | 'reservado' | 'vendido';
  bedrooms: number;
  bathrooms: number;
  halfBathrooms: number;
  parkingSpaces: number;
  area: number;
  terrainTotalArea: number | null;
  terrainBuiltArea: number | null;
  terrainFreeArea: number | null;
  terrainMeasurements: string | null;
  propertyAge: number | null;
  propertyFloors: number | null;
  hasDrainage: boolean;
  hasGas: boolean;
  hasElectricity: boolean;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  images: string[];
  features: string[];
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFormData {
  title: string;
  description: string;
  price: number;
  currency: string;
  type: 'casa' | 'departamento' | 'loft' | 'ph' | 'terreno' | 'comercial';
  status: 'venta' | 'alquiler' | 'reservado' | 'vendido';
  bedrooms: number;
  bathrooms: number;
  halfBathrooms?: number;
  parkingSpaces?: number;
  area: number;
  terrainTotalArea?: number;
  terrainBuiltArea?: number;
  terrainFreeArea?: number;
  terrainMeasurements?: string;
  propertyAge?: number;
  propertyFloors?: number;
  hasDrainage?: boolean;
  hasGas?: boolean;
  hasElectricity?: boolean;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  images: string[];
  features: string[];
  propertyCode?: string;
  commissionRate?: number;
  notes?: string;
}
