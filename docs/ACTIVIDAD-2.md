# Actividad 2 - Ampliación de pruebas automatizadas

## Objetivo

Para esta actividad se revisaron las pruebas existentes y se conservaron los casos que ya funcionaban. Después se agregaron escenarios que todavía no estaban cubiertos. Se mantuvieron las 41 pruebas iniciales y se incorporaron 18 casos, para alcanzar un total de 59 pruebas.

## Pruebas de funciones

Se agregaron 6 casos para las funciones encargadas de validar el título y filtrar las tareas por estado. Se comprobaron entradas como:

- Un título con valor `null`.
- Textos formados únicamente por espacios, tabulaciones o saltos de línea.
- Títulos con espacios al inicio y al final.
- Listas de tareas vacías.
- Un estado de filtro no permitido.

Estos casos también permitieron utilizar los matchers solicitados en el taller: `toBe`, `toEqual`, `toContain` y `toThrow`.

Archivo principal: [`__tests__/utils/taskUtils.edgeCases.test.ts`](../__tests__/utils/taskUtils.edgeCases.test.ts).

## Pruebas del hook

Se agregaron 4 pruebas para `useCreateTask`. Se verificó que el hook:

- Inicie en estado `idle`.
- Cambie a `loading` al comenzar la creación.
- Termine en `success` cuando la operación sea correcta.
- Termine en `error` cuando falle el servicio.

Se utilizaron `renderHook`, `act` y `jest.mock()` para controlar la respuesta del servicio sin depender de una API externa.

Archivo principal: [`__tests__/hooks/useCreateTask.test.ts`](../__tests__/hooks/useCreateTask.test.ts).

## Pruebas de componentes

Se agregaron 6 casos para `TaskForm` y `ConfirmDeleteDialog`. Se comprobó que:

- Un título formado solo por espacios no sea enviado.
- Los espacios externos se eliminen antes de guardar.
- El diálogo permanezca oculto cuando `visible` sea falso.
- El diálogo muestre el título y las acciones esperadas.
- Cancelar ejecute únicamente la acción de cancelación.
- Confirmar ejecute únicamente la acción de eliminación.

Se utilizaron `fireEvent.press`, `fireEvent.changeText`, `getByText`, `getByRole`, `getByTestId` y callbacks creados con `jest.fn()`.

Archivo principal: [`__tests__/components/TaskFormAndConfirmDeleteDialog.test.tsx`](../__tests__/components/TaskFormAndConfirmDeleteDialog.test.tsx).

## Pruebas del servicio

Se agregaron 2 pruebas para `fetchTasks`:

- Retorno de la lista de tareas ante una respuesta correcta.
- Manejo del error ante una respuesta fallida del servidor.

MSW permitió simular ambas respuestas sin conectarse a un servicio real.

Archivo principal: [`__tests__/services/taskService.test.ts`](../__tests__/services/taskService.test.ts).

## Comparación de cobertura

| Indicador | Antes | Después | Diferencia |
|---|---:|---:|---:|
| Pruebas aprobadas | 41 | 59 | +18 |
| Statements | 93.10 % | 100 % | +6.90 puntos |
| Branches | 88.57 % | 94.28 % | +5.71 puntos |
| Functions | 93.75 % | 96.87 % | +3.12 puntos |
| Lines | 93.33 % | 100 % | +6.67 puntos |

Después de los cambios, `src/utils`, `src/hooks` y `src/services` alcanzaron 100 % de cobertura en todos sus indicadores. La cobertura global también quedó por encima del mínimo de 70 % configurado en el proyecto.

## Resultado de la actividad

```text
Test Suites: 15 passed, 15 total
Tests:       59 passed, 59 total
Statements:  100%
Branches:    94.28%
Functions:   96.87%
Lines:       100%
```

[Volver al README](../README.md)
