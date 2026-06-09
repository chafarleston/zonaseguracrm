import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Property, PropertyFormData } from '@/types/property';
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
    queryKey: [PROPERTIES_KEY, params],
    queryFn: () => propertyApi.getAll(params),
  });

  const createProperty = useMutation({
    mutationFn: (data: PropertyFormData) => propertyApi.create(data),
    onSuccess: (newProperty) => {
      queryClient.setQueryData<Property[]>(PROPERTIES_KEY, (old) => [...(old || []), newProperty]);
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const updateProperty = useMutation({
    mutationFn: ({ id, data }: { id: string; data: PropertyFormData }) => propertyApi.update(id, data),
    onSuccess: (updated) => {
      queryClient.setQueryData<Property[]>(PROPERTIES_KEY, (old) =>
        old?.map(p => p.id === updated.id ? updated : p) || []
      );
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const deleteProperty = useMutation({
    mutationFn: (id: string) => propertyApi.delete(id),
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<Property[]>(PROPERTIES_KEY, (old) =>
        old?.filter(p => p.id !== deletedId) || []
      );
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
