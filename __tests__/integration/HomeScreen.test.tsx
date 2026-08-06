import React from 'react';
import { Text } from 'react-native';
import {
  fireEvent,
  renderRouter,
  screen,
} from 'expo-router/testing-library';
import { HomeScreen } from '../../src/screens/HomeScreen';

const routes = {
  index: HomeScreen,
  todo: () => <Text>Pantalla de tareas</Text>,
  checkout: () => <Text>Pantalla de checkout</Text>,
};

describe('HomeScreen - integración con Expo Router', () => {
  it('muestra los dos accesos con nombres y descripciones visibles', async () => {
    const rendered = renderRouter(routes);
    await rendered;

    expect(screen.getByText('Task Manager')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Flujo Todo List' })).toBeTruthy();
    expect(screen.getByText('Crear, completar y eliminar tareas')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Flujo Transaccional' })).toBeTruthy();
    expect(screen.getByText('Datos de usuario, envío y pago')).toBeTruthy();
  });

  it('navega desde el acceso Todo List hasta la ruta correspondiente', async () => {
    const router = renderRouter(routes);
    await router;

    await fireEvent.press(screen.getByRole('link', { name: 'Flujo Todo List' }));

    expect(router.getPathname()).toBe('/todo');
    expect(screen.getByText('Pantalla de tareas')).toBeTruthy();
  });

  it('navega desde el acceso transaccional hasta checkout', async () => {
    const router = renderRouter(routes);
    await router;

    await fireEvent.press(screen.getByRole('link', { name: 'Flujo Transaccional' }));

    expect(router.getPathname()).toBe('/checkout');
    expect(screen.getByText('Pantalla de checkout')).toBeTruthy();
  });
});
