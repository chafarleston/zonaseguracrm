import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceApi, type ServiceFormData } from '@/services/api';
import { toast } from 'sonner';

const SERVICES_KEY = ['services'];

export function useServices() {
  const {
    data: services = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: SERVICES_KEY,
    queryFn: () => serviceApi.getActive(),
    staleTime: 1000 * 60 * 5,
  });

  return {
    services,
    isLoading,
    error: error instanceof Error ? error.message : null,
    refetch,
  };
}

export function useAdminServices() {
  const queryClient = useQueryClient();

  const {
    data: services = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['admin-services'],
    queryFn: () => serviceApi.getAll(),
  });

  const createService = useMutation({
    mutationFn: (data: ServiceFormData) => serviceApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICES_KEY });
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      toast.success('Servicio creado');
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const updateService = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ServiceFormData }) =>
      serviceApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICES_KEY });
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      toast.success('Servicio actualizado');
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const deleteService = useMutation({
    mutationFn: (id: string) => serviceApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICES_KEY });
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      toast.success('Servicio eliminado');
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const uploadImage = useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      serviceApi.uploadImage(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICES_KEY });
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      toast.success('Imagen actualizada');
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  return {
    services,
    isLoading,
    error: error instanceof Error ? error.message : null,
    refetch,
    createService: createService.mutateAsync,
    updateService: (id: string, data: ServiceFormData) => updateService.mutateAsync({ id, data }),
    deleteService: deleteService.mutateAsync,
    uploadImage: (id: string, file: File) => uploadImage.mutateAsync({ id, file }),
  };
}
