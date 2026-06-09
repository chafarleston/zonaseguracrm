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
  area: number;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  images: string[];
  features: string[];
  notes: string | null;
  user?: User;
  dealsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export type PropertyFormData = Omit<Property, 'id' | 'userId' | 'user' | 'dealsCount' | 'createdAt' | 'updatedAt'>;

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  role: 'admin' | 'agent' | 'user';
  propertiesCount?: number;
  clientsCount?: number;
  dealsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  userId: string;
  name: string;
  email: string | null;
  phone: string | null;
  secondaryPhone: string | null;
  source: string;
  status: 'lead' | 'prospect' | 'active' | 'inactive' | 'converted';
  notes: string | null;
  preferences: Record<string, unknown> | null;
  budgetMin: number | null;
  budgetMax: number | null;
  preferredLocation: string | null;
  preferredBedrooms: number | null;
  user?: User;
  dealsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Deal {
  id: string;
  clientId: string;
  propertyId: string;
  userId: string;
  stage: 'prospecting' | 'contacted' | 'visit' | 'negotiation' | 'offer' | 'closed_won' | 'closed_lost';
  offerAmount: number | null;
  finalAmount: number | null;
  currency: string;
  commissionRate: number;
  commissionAmount: number | null;
  notes: string | null;
  expectedCloseDate: string | null;
  actualCloseDate: string | null;
  priority: number;
  client?: Client;
  property?: Property;
  user?: User;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  propertyId: string | null;
  userId: string;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
  location: string | null;
  type: 'visit' | 'meeting' | 'call' | 'follow_up' | 'other';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  notes: string | null;
  cancellationReason: string | null;
  client?: Client;
  property?: Property;
  user?: User;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  userId: string;
  clientId: string | null;
  dealId: string | null;
  propertyId: string | null;
  title: string;
  description: string | null;
  type: 'call' | 'email' | 'follow_up' | 'meeting' | 'document' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  dueDate: string | null;
  dueTime: string | null;
  completedAt: string | null;
  completionNotes: string | null;
  isOverdue: boolean;
  isDueToday: boolean;
  client?: Client;
  deal?: Deal;
  property?: Property;
  user?: User;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  userId: string;
  documentableType: string;
  documentableId: string;
  name: string;
  filePath: string;
  fileType: string | null;
  fileSize: number | null;
  fileSizeFormatted: string;
  category: string;
  description: string | null;
  url: string | null;
  user?: User;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  userId: string;
  activitableType: string;
  activitableId: string;
  type: string;
  description: string;
  oldValues: Record<string, unknown> | null;
  newValues: Record<string, unknown> | null;
  ipAddress: string | null;
  user?: User;
  createdAt: string;
}

export interface DashboardMetrics {
  totalProperties: number;
  activeProperties: number;
  totalClients: number;
  activeDeals: number;
  closedDeals: number;
  totalRevenue: number;
  totalCommission: number;
  todayAppointments: number;
  conversionRate: number;
}
