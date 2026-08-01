import { act, renderHook } from '@testing-library/react-native';
import { useCreateTask } from '../../src/hooks/useCreateTask';
import { createTask } from '../../src/services/taskService';
import { Task } from '../../src/types';

// Se aísla el servicio para probar únicamente las transiciones de estado del hook,
// sin depender de una API ni de la implementación que genera la tarea.
jest.mock('../../src/services/taskService', () => ({
  createTask: jest.fn(),
}));

const mockCreateTask = createTask as jest.MockedFunction<typeof createTask>;

describe('useCreateTask', () => {
  beforeEach(() => {
    mockCreateTask.mockReset();
  });

  it('inicia en idle sin invocar el servicio', async () => {
    const { result } = await renderHook(() => useCreateTask());

    expect(result.current.status).toBe('idle');
    expect(mockCreateTask).not.toHaveBeenCalled();
  });

  it('cambia de idle a loading mientras la creación está pendiente', async () => {
    let resolveRequest!: (task: Task) => void;
    const pendingRequest = new Promise<Task>((resolve) => {
      resolveRequest = resolve;
    });
    mockCreateTask.mockReturnValue(pendingRequest);
    const { result } = await renderHook(() => useCreateTask());
    let submitRequest!: Promise<Task | null>;

    await act(() => {
      submitRequest = result.current.submit('Tarea pendiente');
    });

    expect(result.current.status).toBe('loading');
    expect(mockCreateTask).toHaveBeenCalledWith('Tarea pendiente');

    await act(async () => {
      resolveRequest({ id: '1', title: 'Tarea pendiente', status: 'pending' });
      await submitRequest;
    });

    expect(result.current.status).toBe('success');
  });

  it('cambia de loading a success y retorna la tarea creada', async () => {
    const createdTask: Task = { id: '2', title: 'Tarea creada', status: 'pending' };
    mockCreateTask.mockResolvedValue(createdTask);
    const { result } = await renderHook(() => useCreateTask());
    let returnedTask: Task | null = null;

    await act(async () => {
      returnedTask = await result.current.submit('Tarea creada');
    });

    expect(mockCreateTask).toHaveBeenCalledTimes(1);
    expect(result.current.status).toBe('success');
    expect(returnedTask).toEqual(createdTask);
  });

  it('cambia de loading a error y retorna null cuando el servicio falla', async () => {
    let rejectRequest!: (error: Error) => void;
    const pendingRequest = new Promise<Task>((_resolve, reject) => {
      rejectRequest = reject;
    });
    mockCreateTask.mockReturnValue(pendingRequest);
    const { result } = await renderHook(() => useCreateTask());
    let submitRequest!: Promise<Task | null>;
    let returnedTask: Task | null | undefined;

    await act(() => {
      submitRequest = result.current.submit('Tarea fallida');
    });

    expect(result.current.status).toBe('loading');

    await act(async () => {
      rejectRequest(new Error('Servicio no disponible'));
      returnedTask = await submitRequest;
    });

    expect(mockCreateTask).toHaveBeenCalledWith('Tarea fallida');
    expect(result.current.status).toBe('error');
    expect(returnedTask).toBeNull();
  });
});
