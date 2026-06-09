import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function TasksPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Tareas</h2>
          <p className="text-muted-foreground">Gestiona tus tareas y recordatorios</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Tarea
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Tareas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Tabla de tareas...</p>
        </CardContent>
      </Card>
    </div>
  );
}
