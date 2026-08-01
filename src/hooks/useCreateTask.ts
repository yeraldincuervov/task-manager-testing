import { useState } from 'react';
import { createTask } from '../services/taskService';

export function useCreateTask() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const submit = async (title: string) => {
    setStatus('loading');
    try {
      const task = await createTask(title);
      setStatus('success');
      return task;
    } catch {
      setStatus('error');
      return null;
    }
  };

  return { status, submit };
}
