import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportApi } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Loader2,
  TrendingUp,
  DollarSign,
  Users,
  Building2,
  BarChart3,
} from 'lucide-react';

export function ReportsPage() {
  const [period, setPeriod] = useState('12');

  const { data: salesData, isLoading: salesLoading } = useQuery({
    queryKey: ['reports', 'sales', period],
    queryFn: () => reportApi.getSales({ months: period }),
  });

  const { data: propertiesData, isLoading: propertiesLoading } = useQuery({
    queryKey: ['reports', 'properties'],
    queryFn: () => reportApi.getProperties(),
  });

  const { data: clientsData, isLoading: clientsLoading } = useQuery({
    queryKey: ['reports', 'clients'],
    queryFn: () => reportApi.getClients(),
  });

  const isLoading = salesLoading || propertiesLoading || clientsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  const sales = salesData as any;
  const properties = propertiesData as any;
  const clients = clientsData as any;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Reportes</h2>
          <p className="text-muted-foreground">Analiza el rendimiento de tu negocio</p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">Últimos 3 meses</SelectItem>
            <SelectItem value="6">Últimos 6 meses</SelectItem>
            <SelectItem value="12">Últimos 12 meses</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Métricas de ventas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              USD {(sales?.totals?.total_amount || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {sales?.totals?.total_deals || 0} deals cerrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comisiones</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              USD {(sales?.totals?.total_commission || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Ganadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Propiedades</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {properties?.type_distribution?.reduce((sum: number, t: any) => sum + t.count, 0) || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Registradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {clients?.conversion_funnel?.total_leads || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Leads totales
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Ventas por período */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Ventas por Período
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sales?.data && sales.data.length > 0 ? (
              <div className="space-y-3">
                {sales.data.map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">
                      {new Date(item.year, item.month - 1).toLocaleDateString('es-PE', { month: 'long', year: 'numeric' })}
                    </span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {item.deals_count} deals
                      </span>
                      <span className="font-medium">
                        USD {parseFloat(item.total_amount).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No hay datos de ventas
              </p>
            )}
          </CardContent>
        </Card>

        {/* Distribución por tipo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Propiedades por Tipo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {properties?.type_distribution && properties.type_distribution.length > 0 ? (
              <div className="space-y-3">
                {properties.type_distribution.map((item: any) => (
                  <div key={item.type} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{item.type}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: `${(item.count / Math.max(...properties.type_distribution.map((t: any) => t.count))) * 100}%`
                          }}
                        />
                      </div>
                      <span className="font-medium w-8 text-right">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No hay datos
              </p>
            )}
          </CardContent>
        </Card>

        {/* Funnel de conversión */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Funnel de Conversión
            </CardTitle>
          </CardHeader>
          <CardContent>
            {clients?.conversion_funnel ? (
              <div className="space-y-3">
                {[
                  { key: 'total_leads', label: 'Leads', color: 'bg-gray-500' },
                  { key: 'prospects', label: 'Prospectos', color: 'bg-blue-500' },
                  { key: 'active', label: 'Activos', color: 'bg-yellow-500' },
                  { key: 'converted', label: 'Convertidos', color: 'bg-green-500' },
                ].map(({ key, label, color }) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${color}`} />
                      <span className="text-sm">{label}</span>
                    </div>
                    <span className="font-medium">
                      {clients.conversion_funnel[key] || 0}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No hay datos
              </p>
            )}
          </CardContent>
        </Card>

        {/* Distribución por fuente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Clientes por Fuente
            </CardTitle>
          </CardHeader>
          <CardContent>
            {clients?.source_distribution && clients.source_distribution.length > 0 ? (
              <div className="space-y-3">
                {clients.source_distribution.map((item: any) => (
                  <div key={item.source} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{item.source}</span>
                    <Badge variant="secondary">{item.count}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No hay datos
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
