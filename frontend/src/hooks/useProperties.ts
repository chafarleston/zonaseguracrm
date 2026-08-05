import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { PropertyFormData } from '@/types/property';
import { propertyApi } from '@/services/api';
import { toast } from 'sonner';

const PROPERTIES_KEY = ['properties'] as const;

export const useProperties = (params?: Record<string, string>) => {
  const queryClient = useQueryClient();

  const {
    data: properties = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: params ? [PROPERTIES_KEY, params] : PROPERTIES_KEY,
    queryFn: () => propertyApi.getAll(params),
  });

  const createProperty = useMutation({
    mutationFn: (data: PropertyFormData) => propertyApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROPERTIES_KEY });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const updateProperty = useMutation({
    mutationFn: ({ id, data }: { id: string; data: PropertyFormData }) => propertyApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROPERTIES_KEY });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const deleteProperty = useMutation({
    mutationFn: (id: string) => propertyApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROPERTIES_KEY });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  return {
    properties,
    loading,
    error: error instanceof Error ? error.message : error ? 'Error al cargar propiedades' : null,
    refetch,
    createProperty: createProperty.mutateAsync,
    updateProperty: async (id: string, data: PropertyFormData) => updateProperty.mutateAsync({ id, data }),
    deleteProperty: deleteProperty.mutateAsync,
  };
};
