# Evidencias E2E de la Actividad 3

Estado: **ejecutado correctamente**.

El flujo [`.maestro/actividad_3_tareas.yaml`](../../.maestro/actividad_3_tareas.yaml) se ejecutó dos veces de forma satisfactoria sobre un celular Android conectado mediante ADB. Cada ejecución comenzó limpiando el estado de `com.taskmanager.app` y produjo dos capturas reales.

## Ejecución 1

Carpeta: [`2026-08-05_213809/actividad_3_tareas`](2026-08-05_213809/actividad_3_tareas).

- [Tarea creada y completada](2026-08-05_213809/actividad_3_tareas/takeScreenshot/actividad-3-tarea-completada.png)
- [Lista vacía después de eliminar la tarea](2026-08-05_213809/actividad_3_tareas/takeScreenshot/actividad-3-flujo-finalizado.png)
- [Registro de Maestro](2026-08-05_213809/actividad_3_tareas/logs/maestro.log)
- [Metadatos de comandos](2026-08-05_213809/actividad_3_tareas/commands.json)
- [Manifiesto de artefactos](2026-08-05_213809/actividad_3_tareas/manifest.json)

## Ejecución 2

Carpeta: [`2026-08-05_213914/actividad_3_tareas`](2026-08-05_213914/actividad_3_tareas).

- [Tarea creada y completada](2026-08-05_213914/actividad_3_tareas/takeScreenshot/actividad-3-tarea-completada.png)
- [Lista vacía después de eliminar la tarea](2026-08-05_213914/actividad_3_tareas/takeScreenshot/actividad-3-flujo-finalizado.png)
- [Registro de Maestro](2026-08-05_213914/actividad_3_tareas/logs/maestro.log)
- [Metadatos de comandos](2026-08-05_213914/actividad_3_tareas/commands.json)
- [Manifiesto de artefactos](2026-08-05_213914/actividad_3_tareas/manifest.json)

## Comportamiento verificado

En ambos registros figuran como `COMPLETED` los pasos principales:

1. Inicio limpio de la aplicación.
2. Navegación a **Flujo Todo List**.
3. Escritura y creación de `Actividad 3 E2E`.
4. Verificación de `Tarea creada exitosamente`.
5. Cambio de la tarea al estado **Completada**.
6. Captura de la tarea completada.
7. Apertura y confirmación del diálogo de eliminación.
8. Verificación de que la tarea dejó de estar visible.
9. Captura del estado final sin tareas.

Los archivos `device-logcat.txt` se conservan en cada ejecución como soporte diagnóstico adicional.

## Repetir la prueba

Con la APK instalada y el celular conectado:

```powershell
maestro test .maestro/actividad_3_tareas.yaml --test-output-dir docs/evidencias
```

[Volver a la documentación de la Actividad 3](../ACTIVIDAD-3.md)
