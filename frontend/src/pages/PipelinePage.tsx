import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dealApi, type Deal } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import {
  Loader2,
  DollarSign,
  User,
  Building2,
} from 'lucide-react';
import { toast } from 'sonner';

const STAGES = [
  { id: 'prospecting', label: 'Prospecto', color: 'bg-gray-100 border-gray-300' },
  { id: 'contacted', label: 'Contactado', color: 'bg-blue-50 border-blue-300' },
  { id: 'visit', label: 'Visita', color: 'bg-purple-50 border-purple-300' },
  { id: 'negotiation', label: 'Negociación', color: 'bg-yellow-50 border-yellow-300' },
  { id: 'offer', label: 'Oferta', color: 'bg-orange-50 border-orange-300' },
];

const STAGE_COLORS: Record<string, string> = {
  prospecting: 'bg-gray-500',
  contacted: 'bg-blue-500',
  visit: 'bg-purple-500',
  negotiation: 'bg-yellow-500',
  offer: 'bg-orange-500',
};

export function PipelinePage() {
  const queryClient = useQueryClient();
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['deals'],
    queryFn: () => dealApi.getAll(),
  });

  const deals = data?.data ?? [];

  const updateStageMutation = useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: string }) =>
      dealApi.updateStage(id, stage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      queryClient.invalidateQueries({ queryKey: ['pipeline'] });
      toast.success('Estado actualizado');
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const dealsByStage = STAGES.reduce((acc, stage) => {
    acc[stage.id] = deals.filter((deal: Deal) => deal.stage === stage.id);
    return acc;
  }, {} as Record<string, Deal[]>);

  const handleDragStart = (deal: Deal) => {
    setDraggedDeal(deal);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (stageId: string) => {
    if (draggedDeal && draggedDeal.stage !== stageId) {
      updateStageMutation.mutate({ id: draggedDeal.id, stage: stageId });
    }
    setDraggedDeal(null);
  };

  const handleMoveDeal = async (dealId: string, newStage: string) => {
    updateStageMutation.mutate({ id: dealId, stage: newStage });
  };

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
        <p className="text-red-600 mb-4">Error al cargar el pipeline</p>
        <Button onClick={() => refetch()} className="bg-green-600 hover:bg-green-700">
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Pipeline de Ventas</h2>
          <p className="text-muted-foreground">
            {deals.length} deals en el pipeline
          </p>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {STAGES.map((stage) => {
          const stageDeals = dealsByStage[stage.id] || [];
          const totalAmount = stageDeals.reduce((sum, deal) => sum + (deal.offerAmount || 0), 0);

          return (
            <div
              key={stage.id}
              className={`${stage.color} border-2 rounded-lg p-3 min-h-[400px] transition-colors ${
                draggedDeal && draggedDeal.stage !== stage.id ? 'border-green-500 bg-green-50' : ''
              }`}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(stage.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${STAGE_COLORS[stage.id]}`} />
                  <h3 className="font-semibold text-sm">{stage.label}</h3>
                </div>
                <Badge variant="secondary">{stageDeals.length}</Badge>
              </div>

              {totalAmount > 0 && (
                <p className="text-xs text-muted-foreground mb-3">
                  USD {totalAmount.toLocaleString()}
                </p>
              )}

              <div className="space-y-2">
                {stageDeals.map((deal) => (
                  <Card
                    key={deal.id}
                    className={`cursor-grab hover:shadow-md transition-shadow ${
                      draggedDeal?.id === deal.id ? 'opacity-50' : ''
                    }`}
                    draggable
                    onDragStart={() => handleDragStart(deal)}
                    onDragEnd={() => setDraggedDeal(null)}
                  >
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <p className="font-medium text-sm truncate flex-1">
                            {deal.client?.name || 'Sin cliente'}
                          </p>
                          <Select
                            value={deal.stage}
                            onValueChange={(value) => handleMoveDeal(deal.id, value)}
                          >
                            <SelectTrigger className="w-6 h-6 p-0 border-none">
                              <span className="sr-only">Cambiar estado</span>
                            </SelectTrigger>
                            <SelectContent>
                              {STAGES.map((s) => (
                                <SelectItem key={s.id} value={s.id}>
                                  {s.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {deal.property && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Building2 className="h-3 w-3" />
                            <span className="truncate">{deal.property.title}</span>
                          </div>
                        )}

                        {deal.offerAmount && (
                          <div className="flex items-center gap-1 text-xs font-medium text-green-700">
                            <DollarSign className="h-3 w-3" />
                            <span>USD {deal.offerAmount.toLocaleString()}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span>{deal.user?.name || 'Sin agente'}</span>
                        </div>

                        {deal.expectedCloseDate && (
                          <p className="text-xs text-muted-foreground">
                            Cierre: {new Date(deal.expectedCloseDate).toLocaleDateString('es-PE')}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {stageDeals.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    {draggedDeal && draggedDeal.stage !== stage.id
                      ? 'Soltar aquí'
                      : 'Sin deals'
                    }
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
