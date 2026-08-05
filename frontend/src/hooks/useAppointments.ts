import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentApi, type AppointmentFormData } from '@/services/api';
import { toast } from 'sonner';

const APPOINTMENTS_KEY = ['appointments'];
const CALENDAR_KEY = ['calendar'];

export function useAppointments(params?: Record<string, string>) {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: params ? [APPOINTMENTS_KEY, params] : APPOINTMENTS_KEY,
    queryFn: () => appointmentApi.getAll(params),
  });

  const appointments = data?.data ?? [];

  const createAppointment = useMutation({
    mutationFn: (data: AppointmentFormData) => appointmentApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_KEY });
      queryClient.invalidateQueries({ queryKey: CALENDAR_KEY });
      toast.success('Cita creada');
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const updateAppointment = useMutation({
    mutationFn: ({ id, data }: { id: string; data: AppointmentFormData }) =>
      appointmentApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_KEY });
      queryClient.invalidateQueries({ queryKey: CALENDAR_KEY });
      toast.success('Cita actualizada');
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const deleteAppointment = useMutation({
    mutationFn: (id: string) => appointmentApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_KEY });
      queryClient.invalidateQueries({ queryKey: CALENDAR_KEY });
      toast.success('Cita eliminada');
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const cancelAppointment = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      appointmentApi.cancel(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_KEY });
      queryClient.invalidateQueries({ queryKey: CALENDAR_KEY });
      toast.success('Cita cancelada');
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const completeAppointment = useMutation({
    mutationFn: (id: string) => appointmentApi.complete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_KEY });
      queryClient.invalidateQueries({ queryKey: CALENDAR_KEY });
      toast.success('Cita completada');
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  return {
    appointments,
    isLoading,
    error: error instanceof Error ? error.message : error ? 'Error al cargar citas' : null,
    refetch,
    createAppointment: createAppointment.mutateAsync,
    updateAppointment: (id: string, data: AppointmentFormData) =>
      updateAppointment.mutateAsync({ id, data }),
    deleteAppointment: deleteAppointment.mutateAsync,
    cancelAppointment: (id: string, reason?: string) =>
      cancelAppointment.mutateAsync({ id, reason }),
    completeAppointment: completeAppointment.mutateAsync,
  };
}

export function useCalendar(params?: Record<string, string>) {
  const {
    data: appointments,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: params ? [CALENDAR_KEY, params] : CALENDAR_KEY,
    queryFn: () => appointmentApi.getCalendar(params),
  });

  return {
    appointments: appointments ?? [],
    isLoading,
    error: error instanceof Error ? error.message : null,
    refetch,
  };
}
