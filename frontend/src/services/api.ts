import type { Property, PropertyFormData } from '@/types/property';
import type { AuthResponse, LoginCredentials, User } from '@/types/auth';

const API_URL = '/api';

function getToken(): string | null {
  return localStorage.getItem('zonasegura_token');
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: { ...headers, ...(options?.headers as Record<string, string>) },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Error de conexión' }));
    throw new Error(error.error || `Error ${response.status}`);
  }

  if (response.status === 204) return undefined as T;
  return response.json();
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  me: async (): Promise<User> => {
    return request<User>('/auth/me');
  },

  logout: async (): Promise<void> => {
    return request<void>('/auth/logout', { method: 'POST' });
  },
};

export const propertyApi = {
  getAll: async (params?: Record<string, string>): Promise<Property[]> => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '?all=1';
    const finalQuery = params ? query : '?all=1';
    return request<Property[]>(`/properties${finalQuery}`);
  },

  getById: async (id: string): Promise<Property> => {
    return request<Property>(`/properties/${id}`);
  },

  create: async (data: PropertyFormData): Promise<Property> => {
    return request<Property>('/properties', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: PropertyFormData): Promise<Property> => {
    return request<Property>(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return request<void>(`/properties/${id}`, { method: 'DELETE' });
  },

  uploadImage: async (file: File): Promise<{ url: string; path: string }> => {
    const token = localStorage.getItem('zonasegura_token');
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_URL}/properties/upload-image`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Error de conexión' }));
      throw new Error(error.error || `Error ${response.status}`);
    }

    return response.json();
  },
};

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

export interface ClientFormData {
  name: string;
  email?: string;
  phone?: string;
  secondaryPhone?: string;
  source?: string;
  status?: string;
  notes?: string;
  preferences?: Record<string, unknown>;
  budgetMin?: number;
  budgetMax?: number;
  preferredLocation?: string;
  preferredBedrooms?: number;
}

export const clientApi = {
  getAll: async (params?: Record<string, string>): Promise<{ data: Client[] }> => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<{ data: Client[] }>(`/clients${query}`);
  },

  getById: async (id: string): Promise<Client> => {
    return request<Client>(`/clients/${id}`);
  },

  create: async (data: ClientFormData): Promise<Client> => {
    return request<Client>('/clients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: ClientFormData): Promise<Client> => {
    return request<Client>(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return request<void>(`/clients/${id}`, { method: 'DELETE' });
  },

  convert: async (id: string): Promise<Client> => {
    return request<Client>(`/clients/${id}/convert`, { method: 'POST' });
  },
};

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

export interface DealFormData {
  clientId: string;
  propertyId: string;
  stage?: string;
  offerAmount?: number;
  finalAmount?: number;
  currency?: string;
  commissionRate?: number;
  notes?: string;
  expectedCloseDate?: string;
  priority?: number;
}

export const dealApi = {
  getAll: async (params?: Record<string, string>): Promise<{ data: Deal[] }> => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<{ data: Deal[] }>(`/deals${query}`);
  },

  getById: async (id: string): Promise<Deal> => {
    return request<Deal>(`/deals/${id}`);
  },

  create: async (data: DealFormData): Promise<Deal> => {
    return request<Deal>('/deals', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: DealFormData): Promise<Deal> => {
    return request<Deal>(`/deals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return request<void>(`/deals/${id}`, { method: 'DELETE' });
  },

  updateStage: async (id: string, stage: string): Promise<Deal> => {
    return request<Deal>(`/deals/${id}/stage`, {
      method: 'PUT',
      body: JSON.stringify({ stage }),
    });
  },

  getPipeline: async (): Promise<Record<string, Deal[]>> => {
    return request<Record<string, Deal[]>>('/pipeline');
  },
};

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

export interface AppointmentFormData {
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

export const appointmentApi = {
  getAll: async (params?: Record<string, string>): Promise<{ data: Appointment[] }> => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<{ data: Appointment[] }>(`/appointments${query}`);
  },

  getById: async (id: string): Promise<Appointment> => {
    return request<Appointment>(`/appointments/${id}`);
  },

  create: async (data: AppointmentFormData): Promise<Appointment> => {
    return request<Appointment>('/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: AppointmentFormData): Promise<Appointment> => {
    return request<Appointment>(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return request<void>(`/appointments/${id}`, { method: 'DELETE' });
  },

  cancel: async (id: string, reason?: string): Promise<Appointment> => {
    return request<Appointment>(`/appointments/${id}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ cancellation_reason: reason }),
    });
  },

  complete: async (id: string): Promise<Appointment> => {
    return request<Appointment>(`/appointments/${id}/complete`, { method: 'PUT' });
  },

  getCalendar: async (params?: Record<string, string>): Promise<Appointment[]> => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<Appointment[]>(`/calendar${query}`);
  },
};

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

export interface TaskFormData {
  title: string;
  description?: string;
  clientId?: string;
  dealId?: string;
  propertyId?: string;
  type?: string;
  priority?: string;
  status?: string;
  dueDate?: string;
  dueTime?: string;
  completionNotes?: string;
}

export const taskApi = {
  getAll: async (params?: Record<string, string>): Promise<{ data: Task[] }> => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<{ data: Task[] }>(`/tasks${query}`);
  },

  getById: async (id: string): Promise<Task> => {
    return request<Task>(`/tasks/${id}`);
  },

  create: async (data: TaskFormData): Promise<Task> => {
    return request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: TaskFormData): Promise<Task> => {
    return request<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return request<void>(`/tasks/${id}`, { method: 'DELETE' });
  },

  complete: async (id: string, notes?: string): Promise<Task> => {
    return request<Task>(`/tasks/${id}/complete`, {
      method: 'PUT',
      body: JSON.stringify({ completion_notes: notes }),
    });
  },

  start: async (id: string): Promise<Task> => {
    return request<Task>(`/tasks/${id}/start`, { method: 'PUT' });
  },
};

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

export interface DashboardData {
  metrics: DashboardMetrics;
  recentActivities: unknown[];
  upcomingAppointments: Appointment[];
  pendingTasks: Task[];
  pipelineSummary: unknown[];
  monthlyDeals: unknown[];
}

export const dashboardApi = {
  getData: async (userId?: string): Promise<DashboardData> => {
    const query = userId ? `?user_id=${userId}` : '';
    return request<DashboardData>(`/dashboard${query}`);
  },

  getAgents: async (): Promise<User[]> => {
    return request<User[]>('/dashboard/agents');
  },
};

export interface SalesReport {
  data: Array<{
    year: number;
    month: number;
    deals_count: number;
    total_amount: number;
    total_commission: number;
  }>;
  totals: {
    total_deals: number;
    total_amount: number;
    total_commission: number;
    avg_deal_amount: number;
  };
}

export const reportApi = {
  getSales: async (params?: Record<string, string>): Promise<SalesReport> => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<SalesReport>(`/reports/sales${query}`);
  },

  getAgents: async (params?: Record<string, string>): Promise<User[]> => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<User[]>(`/reports/agents${query}`);
  },

  getProperties: async (): Promise<unknown> => {
    return request<unknown>('/reports/properties');
  },

  getClients: async (): Promise<unknown> => {
    return request<unknown>('/reports/clients');
  },
};

export interface CompanySettings {
  id: string;
  companyName: string;
  companySubtitle: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  country: string;
  contactPerson: string;
  logoUrl: string;
  logoFullUrl: string | null;
  description: string;
  footerText: string;
}

export interface CompanySettingsFormData {
  company_name: string;
  company_subtitle?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  country?: string;
  contact_person?: string;
  logo_url?: string;
  description?: string;
  footer_text?: string;
}

export const settingsApi = {
  get: async (): Promise<CompanySettings> => {
    return request<CompanySettings>('/settings');
  },

  update: async (data: CompanySettingsFormData): Promise<CompanySettings> => {
    return request<CompanySettings>('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  uploadLogo: async (file: File): Promise<CompanySettings> => {
    const token = localStorage.getItem('zonasegura_token');
    const formData = new FormData();
    formData.append('logo', file);

    const response = await fetch(`${API_URL}/settings/logo`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Error de conexión' }));
      throw new Error(error.error || `Error ${response.status}`);
    }

    return response.json();
  },
};

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  longDescription: string | null;
  imageUrl: string | null;
  imageFullUrl: string | null;
  icon: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface ServiceFormData {
  name: string;
  description?: string;
  long_description?: string;
  icon?: string;
  sort_order?: number;
  is_active?: boolean;
}

export const serviceApi = {
  getActive: async (): Promise<Service[]> => {
    return request<Service[]>('/services');
  },

  getAll: async (): Promise<Service[]> => {
    return request<Service[]>('/services/manage');
  },

  create: async (data: ServiceFormData): Promise<Service> => {
    return request<Service>('/services/manage', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: ServiceFormData): Promise<Service> => {
    return request<Service>(`/services/manage/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return request<void>(`/services/manage/${id}`, { method: 'DELETE' });
  },

  uploadImage: async (id: string, file: File): Promise<Service> => {
    const token = localStorage.getItem('zonasegura_token');
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_URL}/services/${id}/image`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Error de conexión' }));
      throw new Error(error.error || `Error ${response.status}`);
    }

    return response.json();
  },
};
