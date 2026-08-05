import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dealApi, type DealFormData } from '@/services/api';
import { toast } from 'sonner';

const DEALS_KEY = ['deals'];
const PIPELINE_KEY = ['pipeline'];

export function useDeals(params?: Record<string, string>) {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: params ? [DEALS_KEY, params] : DEALS_KEY,
    queryFn: () => dealApi.getAll(params),
  });

  const deals = data?.data ?? [];

  const createDeal = useMutation({
    mutationFn: (data: DealFormData) => dealApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEALS_KEY });
      queryClient.invalidateQueries({ queryKey: PIPELINE_KEY });
      toast.success('Negociación creada');
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const updateDeal = useMutation({
    mutationFn: ({ id, data }: { id: string; data: DealFormData }) =>
      dealApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEALS_KEY });
      queryClient.invalidateQueries({ queryKey: PIPELINE_KEY });
      toast.success('Negociación actualizada');
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const deleteDeal = useMutation({
    mutationFn: (id: string) => dealApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEALS_KEY });
      queryClient.invalidateQueries({ queryKey: PIPELINE_KEY });
      toast.success('Negociación eliminada');
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const updateStage = useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: string }) =>
      dealApi.updateStage(id, stage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEALS_KEY });
      queryClient.invalidateQueries({ queryKey: PIPELINE_KEY });
      toast.success('Estado actualizado');
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  return {
    deals,
    isLoading,
    error: error instanceof Error ? error.message : error ? 'Error al cargar negociaciones' : null,
    refetch,
    createDeal: createDeal.mutateAsync,
    updateDeal: (id: string, data: DealFormData) => updateDeal.mutateAsync({ id, data }),
    deleteDeal: deleteDeal.mutateAsync,
    updateStage: (id: string, stage: string) => updateStage.mutateAsync({ id, stage }),
  };
}

export function usePipeline() {
  const {
    data: pipeline,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: PIPELINE_KEY,
    queryFn: () => dealApi.getPipeline(),
  });

  return {
    pipeline,
    isLoading,
    error: error instanceof Error ? error.message : null,
    refetch,
  };
}
