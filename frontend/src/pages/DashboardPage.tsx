import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Building2,
  Users,
  GitBranch,
  Calendar,
  DollarSign,
  TrendingUp,
  Loader2,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

const STAGE_LABELS: Record<string, string> = {
  prospecting: 'Prospecto',
  contacted: 'Contactado',
  visit: 'Visita',
  negotiation: 'Negociación',
  offer: 'Oferta',
};

const STAGE_COLORS: Record<string, string> = {
  prospecting: 'bg-gray-100 text-gray-800',
  contacted: 'bg-blue-100 text-blue-800',
  visit: 'bg-purple-100 text-purple-800',
  negotiation: 'bg-yellow-100 text-yellow-800',
  offer: 'bg-orange-100 text-orange-800',
};

export function DashboardPage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardApi.getData(),
    refetchInterval: 30000,
  });

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
        <p className="text-red-600 mb-4">Error al cargar el dashboard</p>
        <Button onClick={() => refetch()} className="bg-green-600 hover:bg-green-700">
          Reintentar
        </Button>
      </div>
    );
  }

  const metrics = data?.metrics;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground">Resumen de tu actividad inmobiliaria</p>
      </div>

      {/* Métricas principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Propiedades Activas</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.activeProperties ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              {metrics?.totalProperties ?? 0} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalClients ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              {metrics?.conversionRate ?? 0}% conversión
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deals Activos</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.activeDeals ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              {metrics?.closedDeals ?? 0} cerrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citas Hoy</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.todayAppointments ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              programadas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Métricas de ingresos */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              USD {(metrics?.totalRevenue ?? 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              de deals cerrados
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
              USD {(metrics?.totalCommission ?? 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              ganadas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline y Citas */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Pipeline de Ventas */}
        <Card>
          <CardHeader>
            <CardTitle>Pipeline de Ventas</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.pipelineSummary && data.pipelineSummary.length > 0 ? (
              <div className="space-y-3">
                {data.pipelineSummary.map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <Badge className={STAGE_COLORS[item.stage] || 'bg-gray-100 text-gray-800'}>
                      {STAGE_LABELS[item.stage] || item.stage}
                    </Badge>
                    <div className="text-right">
                      <p className="font-semibold">{item.count} deals</p>
                      {item.total_amount && (
                        <p className="text-xs text-muted-foreground">
                          USD {parseFloat(item.total_amount).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No hay deals en el pipeline
              </p>
            )}
          </CardContent>
        </Card>

        {/* Próximas Citas */}
        <Card>
          <CardHeader>
            <CardTitle>Próximas Citas</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.upcomingAppointments && data.upcomingAppointments.length > 0 ? (
              <div className="space-y-3">
                {data.upcomingAppointments.map((appointment: any) => (
                  <div key={appointment.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
                    <Clock className="h-4 w-4 text-muted-foreground mt-1" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{appointment.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {appointment.client?.name || 'Sin cliente'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(appointment.start_time).toLocaleDateString('es-PE', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {appointment.type}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No hay citas programadas
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tareas Pendientes */}
      <Card>
        <CardHeader>
          <CardTitle>Tareas Pendientes</CardTitle>
        </CardHeader>
        <CardContent>
          {data?.pendingTasks && data.pendingTasks.length > 0 ? (
            <div className="space-y-3">
              {data.pendingTasks.map((task: any) => (
                <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  {task.priority === 'urgent' ? (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  ) : task.priority === 'high' ? (
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{task.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {task.client?.name || 'Sin cliente'}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={task.priority === 'urgent' ? 'destructive' : 'outline'}
                      className="text-xs"
                    >
                      {task.priority}
                    </Badge>
                    {task.due_date && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(task.due_date).toLocaleDateString('es-PE')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No hay tareas pendientes
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
