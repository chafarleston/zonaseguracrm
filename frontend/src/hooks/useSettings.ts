import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi, type CompanySettingsFormData } from '@/services/api';
import { toast } from 'sonner';

const SETTINGS_KEY = ['settings'];

export function useSettings() {
  const queryClient = useQueryClient();

  const {
    data: settings,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: SETTINGS_KEY,
    queryFn: () => settingsApi.get(),
    staleTime: 1000 * 60 * 5,
  });

  const updateSettings = useMutation({
    mutationFn: (data: CompanySettingsFormData) => settingsApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEY });
      toast.success('Configuración actualizada');
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const uploadLogo = useMutation({
    mutationFn: (file: File) => settingsApi.uploadLogo(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEY });
      toast.success('Logo actualizado');
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  return {
    settings,
    isLoading,
    error: error instanceof Error ? error.message : null,
    refetch,
    updateSettings: updateSettings.mutateAsync,
    uploadLogo: uploadLogo.mutateAsync,
  };
}
