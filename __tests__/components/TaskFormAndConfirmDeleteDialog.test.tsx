import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { ConfirmDeleteDialog } from '../../src/components/ConfirmDeleteDialog';
import { TaskForm } from '../../src/components/TaskForm';

describe('TaskForm - casos adicionales', () => {
  it('no envía un título compuesto únicamente por espacios', async () => {
    // El callback simulado permite observar el contrato del componente sin ejecutar lógica padre.
    const onSubmit = jest.fn();
    await render(<TaskForm onSubmit={onSubmit} />);

    await fireEvent.changeText(screen.getByTestId('input-titulo'), '   ');
    await fireEvent.press(screen.getByRole('button'));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('elimina espacios externos antes de enviar el título', async () => {
    // El callback simulado aísla el formulario y registra exactamente el valor enviado.
    const onSubmit = jest.fn();
    await render(<TaskForm onSubmit={onSubmit} />);

    await fireEvent.changeText(screen.getByTestId('input-titulo'), '  Preparar informe  ');
    await fireEvent.press(screen.getByText('Guardar'));

    expect(onSubmit).toHaveBeenCalledWith('Preparar informe');
    expect(screen.getByTestId('input-titulo').props.value).toBe('');
  });
});

describe('ConfirmDeleteDialog', () => {
  const renderDialog = (visible: boolean, onCancel = jest.fn(), onConfirm = jest.fn()) =>
    render(
      <ConfirmDeleteDialog
        visible={visible}
        taskTitle="Preparar informe"
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    );

  it('oculta el contenido cuando visible es false', async () => {
    await renderDialog(false);

    expect(screen.queryByText('Eliminar tarea')).toBeNull();
  });

  it('muestra el título y las acciones cuando visible es true', async () => {
    await renderDialog(true);

    expect(screen.getByText('Eliminar tarea')).toBeTruthy();
    expect(screen.getByText(/Preparar informe/)).toBeTruthy();
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('ejecuta solo la cancelación al presionar Cancelar', async () => {
    // Los callbacks simulados aíslan el diálogo y permiten identificar qué acción fue elegida.
    const onCancel = jest.fn();
    const onConfirm = jest.fn();
    await renderDialog(true, onCancel, onConfirm);

    await fireEvent.press(screen.getByRole('button', { name: 'Cancelar eliminación' }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('ejecuta solo la confirmación al presionar Sí, eliminar', async () => {
    // Los callbacks simulados verifican la interacción sin ejecutar una eliminación real.
    const onCancel = jest.fn();
    const onConfirm = jest.fn();
    await renderDialog(true, onCancel, onConfirm);

    await fireEvent.press(
      screen.getByRole('button', { name: 'Confirmar eliminación de Preparar informe' })
    );

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();
  });
});
