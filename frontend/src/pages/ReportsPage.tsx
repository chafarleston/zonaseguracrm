import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Reportes</h2>
        <p className="text-muted-foreground">Analiza el rendimiento de tu negocio</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ventas por Período</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Gráfico de ventas...</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Rendimiento por Agente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Tabla de rendimiento...</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Propiedades más Buscadas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Top propiedades...</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Conversión de Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Funnel de conversión...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
