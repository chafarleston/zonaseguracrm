import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function PipelinePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Pipeline de Ventas</h2>
        <p className="text-muted-foreground">Arrastra y suelta para cambiar el estado de las negociaciones</p>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {['Prospecto', 'Contactado', 'Visita', 'Negociación', 'Oferta'].map((stage) => (
          <Card key={stage}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{stage}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">Sin deals</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
