import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { TaskForm } from '../../src/components/TaskForm';

describe('TaskForm - accesibilidad con jest-native', () => {
  it('expone un nombre y una ayuda accesibles para el campo de título', async () => {
    await render(<TaskForm onSubmit={jest.fn()} />);

    const titleInput = screen.getByLabelText('Título de la tarea');
    expect(titleInput).toHaveProp('accessibilityHint', 'Escribe el título de la nueva tarea');
    expect(titleInput).toBeEnabled();
  });

  it('expone el botón Guardar con un nombre accesible descriptivo', async () => {
    await render(<TaskForm onSubmit={jest.fn()} />);

    const saveButton = screen.getByRole('button', { name: 'Guardar tarea' });
    expect(saveButton).toHaveProp('accessibilityLabel', 'Guardar tarea');
    expect(saveButton).toHaveProp('accessibilityHint', 'Agrega la tarea a la lista');
    expect(saveButton).toBeEnabled();
  });
});
