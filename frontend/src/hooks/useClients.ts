import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientApi, type ClientFormData } from '@/services/api';
import { toast } from 'sonner';

const CLIENTS_KEY = ['clients'];

export function useClients(params?: Record<string, string>) {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [CLIENTS_KEY, params],
    queryFn: () => clientApi.getAll(params),
  });

  const clients = data?.data ?? [];

  const createClient = useMutation({
    mutationFn: (data: ClientFormData) => clientApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_KEY });
      toast.success('Cliente creado exitosamente');
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const updateClient = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ClientFormData }) =>
      clientApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_KEY });
      toast.success('Cliente actualizado');
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const deleteClient = useMutation({
    mutationFn: (id: string) => clientApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_KEY });
      toast.success('Cliente eliminado');
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const convertClient = useMutation({
    mutationFn: (id: string) => clientApi.convert(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_KEY });
      toast.success('Cliente convertido');
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  return {
    clients,
    isLoading,
    error: error instanceof Error ? error.message : error ? 'Error al cargar clientes' : null,
    refetch,
    createClient: createClient.mutateAsync,
    updateClient: (id: string, data: ClientFormData) => updateClient.mutateAsync({ id, data }),
    deleteClient: deleteClient.mutateAsync,
    convertClient: convertClient.mutateAsync,
  };
}

export function useClient(id: string) {
  const {
    data: client,
    isLoading,
    error,
  } = useQuery({
    queryKey: [CLIENTS_KEY, id],
    queryFn: () => clientApi.getById(id),
    enabled: !!id,
  });

  return {
    client,
    isLoading,
    error: error instanceof Error ? error.message : null,
  };
}
