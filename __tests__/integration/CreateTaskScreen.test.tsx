import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HttpResponse, http } from 'msw';
import { server } from '../../src/mocks/server';
import { CreateTaskScreen } from '../../src/screens/CreateTaskScreen';

const API_URL = 'https://api.taskmanager.com';

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

const renderScreen = () =>
  render(
    <SafeAreaProvider initialMetrics={metrics}>
      <CreateTaskScreen syncWithApi />
    </SafeAreaProvider>
  );

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('CreateTaskScreen - integración con MSW', () => {
  it('envía el formulario, recibe la respuesta y muestra la tarea creada', async () => {
    await renderScreen();
    await screen.findByText('No hay tareas aún');

    await fireEvent.changeText(
      screen.getByLabelText('Título de la tarea'),
      'Estudiar integración'
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Guardar tarea' }));

    expect(await screen.findByText('Tarea creada exitosamente')).toBeTruthy();
    expect(screen.getByText('Estudiar integración')).toBeTruthy();
  });

  it('muestra un mensaje y no agrega la tarea cuando la API falla', async () => {
    server.use(
      http.post(`${API_URL}/tasks`, () => new HttpResponse(null, { status: 500 }))
    );
    await renderScreen();
    await screen.findByText('No hay tareas aún');

    await fireEvent.changeText(screen.getByLabelText('Título de la tarea'), 'Tarea rechazada');
    await fireEvent.press(screen.getByRole('button', { name: 'Guardar tarea' }));

    expect(await screen.findByText('No fue posible crear la tarea')).toBeTruthy();
    expect(screen.queryByText('Tarea rechazada')).toBeNull();
  });

  it('representa correctamente una respuesta exitosa con datos vacíos', async () => {
    server.use(http.get(`${API_URL}/tasks`, () => HttpResponse.json([])));
    await renderScreen();

    expect(await screen.findByText('No hay tareas aún')).toBeTruthy();
    await waitFor(() => expect(screen.queryByText('Cargando tareas...')).toBeNull());
  });

  it('muestra un mensaje cuando falla la carga inicial de tareas', async () => {
    server.use(http.get(`${API_URL}/tasks`, () => new HttpResponse(null, { status: 503 })));
    await renderScreen();

    expect(await screen.findByText('No fue posible cargar las tareas')).toBeTruthy();
    expect(screen.queryByText('Cargando tareas...')).toBeNull();
  });

  it('filtra, completa, cancela y confirma la eliminación de tareas cargadas', async () => {
    server.use(
      http.get(`${API_URL}/tasks`, () =>
        HttpResponse.json([
          { id: '1', title: 'Preparar informe', status: 'pending' },
          { id: '2', title: 'Revisar accesibilidad', status: 'pending' },
        ])
      )
    );
    await renderScreen();
    await screen.findByText('Preparar informe');

    await fireEvent.press(
      screen.getByRole('button', {
        name: 'Marcar tarea Revisar accesibilidad como completada',
      })
    );

    await fireEvent.press(screen.getByRole('button', { name: 'Completadas' }));
    expect(screen.getByText('Revisar accesibilidad')).toBeTruthy();
    expect(screen.queryByText('Preparar informe')).toBeNull();

    await fireEvent.press(screen.getByRole('button', { name: 'Pendientes' }));
    expect(screen.getByText('Preparar informe')).toBeTruthy();
    expect(screen.queryByText('Revisar accesibilidad')).toBeNull();

    await fireEvent.press(screen.getByRole('button', { name: 'Todas' }));
    await fireEvent.press(
      screen.getByRole('button', { name: 'Eliminar tarea Preparar informe' })
    );
    expect(screen.getByText(/¿Seguro que quieres eliminar "Preparar informe"/)).toBeTruthy();

    await fireEvent.press(screen.getByRole('button', { name: 'Cancelar eliminación' }));
    expect(screen.queryByText('Eliminar tarea')).toBeNull();
    expect(screen.getByText('Preparar informe')).toBeTruthy();

    await fireEvent.press(
      screen.getByRole('button', { name: 'Eliminar tarea Preparar informe' })
    );
    await fireEvent.press(
      screen.getByRole('button', { name: 'Confirmar eliminación de Preparar informe' })
    );

    expect(screen.queryByText('Preparar informe')).toBeNull();
    expect(screen.getByText('Revisar accesibilidad')).toBeTruthy();
  });
});
