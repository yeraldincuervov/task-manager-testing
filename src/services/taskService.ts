import { Task } from '../types';
import { TaskListSchema, TaskSchema } from '../schemas/taskSchema';

const API_URL = 'https://api.taskmanager.com';

export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch(`${API_URL}/tasks`);
  if (!res.ok) throw new Error('Error al obtener las tareas');

  const result = TaskListSchema.safeParse(await res.json());
  if (!result.success) {
    throw new Error('La respuesta de GET /tasks no cumple el contrato esperado');
  }

  return result.data;
}

export async function createTask(title: string): Promise<Task> {
  const res = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error('Error al crear la tarea');

  const result = TaskSchema.safeParse(await res.json());
  if (!result.success) {
    throw new Error('La respuesta de POST /tasks no cumple el contrato esperado');
  }

  return result.data;
}
