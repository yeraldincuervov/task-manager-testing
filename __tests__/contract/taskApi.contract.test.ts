import { http, HttpResponse } from 'msw';
import { server } from '../../src/mocks/server';
import { createTask, fetchTasks } from '../../src/services/taskService';

const API_URL = 'https://api.taskmanager.com';

describe('API Contract - Tasks', () => {
  it('acepta una respuesta válida de GET /tasks', async () => {
    server.use(
      http.get(`${API_URL}/tasks`, () =>
        HttpResponse.json([
          { id: '1', title: 'Tarea 1', status: 'pending' },
          {
            id: '2',
            title: 'Tarea 2',
            status: 'completed',
            createdAt: '2026-08-20T12:00:00.000Z',
          },
        ])
      )
    );

    await expect(fetchTasks()).resolves.toEqual([
      { id: '1', title: 'Tarea 1', status: 'pending' },
      {
        id: '2',
        title: 'Tarea 2',
        status: 'completed',
        createdAt: '2026-08-20T12:00:00.000Z',
      },
    ]);
  });

  it('rechaza una respuesta inválida de GET /tasks', async () => {
    server.use(
      http.get(`${API_URL}/tasks`, () =>
        HttpResponse.json([{ id: 123, title: 'Tarea inválida', status: 'pending' }])
      )
    );

    await expect(fetchTasks()).rejects.toThrow(
      'La respuesta de GET /tasks no cumple el contrato esperado'
    );
  });

  it('acepta una respuesta válida de POST /tasks', async () => {
    await expect(createTask('Contrato válido')).resolves.toMatchObject({
      id: expect.any(String),
      title: 'Contrato válido',
      status: 'pending',
    });
  });

  it('rechaza una respuesta inválida de POST /tasks', async () => {
    server.use(
      http.post(`${API_URL}/tasks`, () =>
        HttpResponse.json({ id: '1', title: 'Sin estado' }, { status: 201 })
      )
    );

    await expect(createTask('Sin estado')).rejects.toThrow(
      'La respuesta de POST /tasks no cumple el contrato esperado'
    );
  });
});
