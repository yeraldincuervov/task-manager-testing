import { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types';
import { createTask, fetchTasks } from '../services/taskService';
import { TaskListSchema } from '../schemas/taskSchema';

const STORAGE_KEY = 'tasks';

interface UseCreateTaskOptions {
  syncWithApi?: boolean;
}

export function useCreateTask({ syncWithApi = false }: UseCreateTaskOptions = {}) {
  const [status, setStatus] = useState<'loading' | 'idle' | 'success' | 'error'>(
    syncWithApi ? 'loading' : 'idle'
  );
  const [tasks, setTasks] = useState<Task[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const loaded = useRef(false);

  useEffect(() => {
    let active = true;

    const loadTasks = syncWithApi
      ? Promise.all([AsyncStorage.getItem(STORAGE_KEY), fetchTasks()])
      : Promise.all([AsyncStorage.getItem(STORAGE_KEY), Promise.resolve<Task[]>([])]);

    loadTasks
      .then(([raw, remoteTasks]) => {
        if (!active) return;

        const cachedResult = raw ? TaskListSchema.safeParse(JSON.parse(raw)) : null;
        const cachedTasks = cachedResult?.success ? cachedResult.data : null;
        setTasks(syncWithApi ? (cachedTasks ?? remoteTasks) : (cachedTasks ?? []));
        setStatus('idle');
      })
      .catch(() => {
        if (!active) return;
        setErrorMessage('No fue posible cargar las tareas');
        setStatus('error');
      })
      .finally(() => {
        loaded.current = true;
      });

    return () => {
      active = false;
    };
  }, [syncWithApi]);

  useEffect(() => {
    // ponytail: no guardar antes de terminar de cargar, si no el [] inicial pisa lo guardado
    if (!loaded.current) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)).catch(() => {});
  }, [tasks]);

  const submit = async (title: string) => {
    setStatus('loading');
    setErrorMessage(null);

    try {
      const task = syncWithApi
        ? await createTask(title)
        : {
            id: Date.now().toString(),
            title,
            status: 'pending' as const,
            createdAt: new Date().toISOString(),
          };
      setTasks((prev) => [...prev, task]);
      setStatus('success');
    } catch {
      setErrorMessage('No fue posible crear la tarea');
      setStatus('error');
    }
  };

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t
      )
    );
  };

  return { status, tasks, errorMessage, submit, removeTask, toggleTask };
}
