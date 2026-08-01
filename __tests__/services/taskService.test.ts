import { http, HttpResponse } from 'msw';
import { server } from '../../src/mocks/server';
import { fetchTasks } from '../../src/services/taskService';

const API_URL = 'https://api.taskmanager.com';

describe('taskService - fetchTasks', () => {
  it('retorna las tareas cuando el servicio responde correctamente', async () => {
    const tasks = await fetchTasks();

    expect(tasks).toEqual([
      { id: '1', title: 'Tarea existente', status: 'pending' },
      { id: '2', title: 'Otra tarea', status: 'completed' },
    ]);
  });

  it('lanza un error cuando el servicio responde con un estado no exitoso', async () => {
    // Se simula un error de la API para probar este camino sin hacer una petición externa real.
    server.use(
      http.get(`${API_URL}/tasks`, () => new HttpResponse(null, { status: 500 }))
    );

    await expect(fetchTasks()).rejects.toThrow('Error al obtener las tareas');
  });
});
