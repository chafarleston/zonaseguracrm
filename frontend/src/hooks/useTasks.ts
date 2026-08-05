import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi, type TaskFormData } from '@/services/api';
import { toast } from 'sonner';

const TASKS_KEY = ['tasks'];

export function useTasks(params?: Record<string, string>) {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: params ? [TASKS_KEY, params] : TASKS_KEY,
    queryFn: () => taskApi.getAll(params),
  });

  const tasks = data?.data ?? [];

  const createTask = useMutation({
    mutationFn: (data: TaskFormData) => taskApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
      toast.success('Tarea creada');
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const updateTask = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TaskFormData }) =>
      taskApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
      toast.success('Tarea actualizada');
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const deleteTask = useMutation({
    mutationFn: (id: string) => taskApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
      toast.success('Tarea eliminada');
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const completeTask = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      taskApi.complete(id, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
      toast.success('Tarea completada');
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const startTask = useMutation({
    mutationFn: (id: string) => taskApi.start(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
      toast.success('Tarea iniciada');
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  return {
    tasks,
    isLoading,
    error: error instanceof Error ? error.message : error ? 'Error al cargar tareas' : null,
    refetch,
    createTask: createTask.mutateAsync,
    updateTask: (id: string, data: TaskFormData) => updateTask.mutateAsync({ id, data }),
    deleteTask: deleteTask.mutateAsync,
    completeTask: (id: string, notes?: string) => completeTask.mutateAsync({ id, notes }),
    startTask: startTask.mutateAsync,
  };
}
