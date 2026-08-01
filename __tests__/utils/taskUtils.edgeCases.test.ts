import { filterTasksByStatus } from '../../src/utils/filterTasks';
import { validateTaskTitle } from '../../src/utils/validateTask';
import { Task } from '../../src/types';

describe('Casos límite adicionales de las utilidades de tareas', () => {
  describe('validateTaskTitle', () => {
    it('trata un valor null inesperado como un título obligatorio', () => {
      expect(validateTaskTitle(null as unknown as string)).toBe('El título es obligatorio');
    });

    it('rechaza una cadena compuesta por tabulaciones y saltos de línea', () => {
      expect(validateTaskTitle('\t\n')).toBe('El título es obligatorio');
    });

    it('valida la longitud después de eliminar los espacios externos', () => {
      expect(validateTaskTitle('  Abc  ')).toBe(null);
    });
  });

  describe('filterTasksByStatus', () => {
    const tasks: Task[] = [
      { id: '1', title: 'Preparar informe', status: 'pending' },
      { id: '2', title: 'Revisar cobertura', status: 'completed' },
    ];

    it('devuelve un arreglo vacío al filtrar una lista sin tareas', () => {
      expect(filterTasksByStatus([], 'pending')).toEqual([]);
    });

    it('incluye la tarea pendiente esperada en el resultado', () => {
      const result = filterTasksByStatus(tasks, 'pending');

      expect(result).toContain(tasks[0]);
    });

    it('lanza un error descriptivo cuando el estado es null', () => {
      expect(() =>
        filterTasksByStatus(tasks, null as unknown as Parameters<typeof filterTasksByStatus>[1])
      ).toThrow('Estado inválido: null');
    });
  });
});
