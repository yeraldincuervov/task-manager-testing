# Task Manager - Taller de pruebas

Este proyecto corresponde al taller de la materia **Pruebas y Calidad de Software Móvil**. La aplicación está desarrollada con Expo SDK 54 y React Native. Para las pruebas se utilizaron Jest y React Native Testing Library.

Repositorio del proyecto: [github.com/yeraldincuervov/task-manager-testing](https://github.com/yeraldincuervov/task-manager-testing)

## Trabajo realizado para la Actividad 2

Antes de agregar nuevos casos revisé las pruebas que ya tenía el proyecto. La idea fue conservarlas porque estaban funcionando y complementar los escenarios que todavía no se habían validado. En total se mantuvieron las 41 pruebas iniciales y se agregaron 18, para un resultado final de 59 pruebas.

### Pruebas de funciones

Se agregaron 6 casos para las funciones que validan el título de una tarea y filtran las tareas por estado. Se tuvieron en cuenta entradas que pueden causar problemas, por ejemplo:

- Un título con valor `null`.
- Textos que solo contienen espacios, tabulaciones o saltos de línea.
- Títulos con espacios al inicio y al final.
- Listas de tareas vacías.
- Un estado de filtro no permitido.

Estos casos complementan las validaciones que ya existían. También permiten utilizar los matchers solicitados en el taller: `toBe`, `toEqual`, `toContain` y `toThrow`.

### Pruebas del hook

Se agregaron 4 pruebas para `useCreateTask`. Se verificó que inicie en estado `idle`, que cambie a `loading` al comenzar la creación y que termine en `success` o `error`, según la respuesta recibida. Para comprobar estos cambios se usaron `renderHook` y `act`.

El servicio que crea las tareas se reemplazó durante estas pruebas con `jest.mock()`. Se tomó esta decisión para controlar si la respuesta era exitosa, quedaba pendiente o generaba un error, sin depender de una API externa. De esta manera la prueba se concentra en el comportamiento del hook.

### Pruebas de componentes

Se agregaron 6 casos para `TaskForm` y `ConfirmDeleteDialog`. En el formulario se comprobó que un texto formado solo por espacios no se envíe y que los espacios sobrantes se eliminen antes de guardar. En el diálogo se revisó que permanezca oculto cuando corresponde y que las opciones de cancelar y confirmar ejecuten la acción correcta.

Para simular el uso de la pantalla se utilizaron `fireEvent.press` y `fireEvent.changeText`. Los elementos se localizaron con `getByText`, `getByRole` y `getByTestId`. También se usaron funciones `jest.fn()` para registrar las acciones sin realizar una eliminación real.

### Pruebas del servicio

Se agregaron 2 pruebas para `fetchTasks`. La primera comprueba que se retorne la lista de tareas cuando la respuesta es correcta. La segunda simula un error del servidor y verifica que se muestre el error esperado.

Estas pruebas se agregaron porque el reporte inicial mostraba una cobertura baja en `src/services`. Se utilizó MSW, que ya estaba configurado en el proyecto, para simular las respuestas de la API sin conectarse a un servicio real. Esto permite probar tanto una respuesta exitosa como una respuesta con error de forma controlada.

## Comparación de cobertura

La cobertura se midió antes y después de agregar los nuevos casos de prueba.

| Indicador | Antes | Después | Diferencia |
|---|---:|---:|---:|
| Pruebas aprobadas | 41 | 59 | +18 |
| Statements | 93.10 % | 100 % | +6.90 puntos |
| Branches | 88.57 % | 94.28 % | +5.71 puntos |
| Functions | 93.75 % | 96.87 % | +3.12 puntos |
| Lines | 93.33 % | 100 % | +6.67 puntos |

Los nuevos casos permitieron cubrir caminos que no se estaban ejecutando, especialmente el manejo de errores de `useCreateTask` y las respuestas exitosa y fallida de `fetchTasks`. Después de los cambios, las carpetas `src/utils`, `src/hooks` y `src/services` quedaron con 100 % de cobertura en todos sus indicadores. La cobertura global de branches y functions no llegó al 100 % porque todavía existen caminos sin probar en otros archivos, pero se encuentra por encima del mínimo de 70 % configurado en el proyecto.

## Ejecución de las pruebas

Para ejecutar todas las pruebas y generar el reporte de cobertura se utilizó el siguiente comando:

```powershell
npm test -- --coverage
```

Resultado obtenido:

```text
Test Suites: 15 passed, 15 total
Tests:       59 passed, 59 total
Statements:  100%
Branches:    94.28%
Functions:   96.87%
Lines:       100%
```

El reporte completo generado por Jest despues de ejecutar el comando queda en [coverage/lcov-report/index.html](coverage/lcov-report/index.html).
