import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CreateTaskScreen } from '../../src/screens/CreateTaskScreen';

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

const renderScreen = () =>
  render(
    <SafeAreaProvider initialMetrics={metrics}>
      <CreateTaskScreen />
    </SafeAreaProvider>
  );

describe('CreateTaskScreen - Integración', () => {
  it('crea una tarea, la muestra en la lista y permite eliminarla', async () => {
    await renderScreen();

    await fireEvent.changeText(
      screen.getByPlaceholderText('Escribe el título de la tarea'),
      'Estudiar pruebas de integración'
    );
    await fireEvent.press(screen.getByText('Guardar'));

    await waitFor(() => {
      expect(screen.getByText('Tarea creada exitosamente')).toBeTruthy();
      expect(screen.getByText('Estudiar pruebas de integración')).toBeTruthy();
      expect(screen.getByText('1 tarea')).toBeTruthy();
    });

    await fireEvent.press(screen.getByText('Eliminar'));

    expect(screen.getByText('¿Deseas eliminar “Estudiar pruebas de integración”?')).toBeTruthy();

    await fireEvent.press(screen.getByText('Sí, eliminar'));

    expect(screen.queryByText('Estudiar pruebas de integración')).toBeNull();
    expect(screen.getByText('No hay tareas aún')).toBeTruthy();
  });
});
