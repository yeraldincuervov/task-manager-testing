# Task Manager - Taller de pruebas

Proyecto desarrollado para la materia **Pruebas y Calidad de Software Móvil**. La aplicación utiliza Expo SDK 54, React Native y Expo Router. Las pruebas automatizadas se ejecutan con Jest, React Native Testing Library, MSW y Maestro.

Repositorio: [github.com/yeraldincuervov/task-manager-testing](https://github.com/yeraldincuervov/task-manager-testing)

## Actividades

La documentación de cada entrega se mantiene por separado para facilitar su revisión.

| Actividad | Alcance | Estado | Documentación |
|---|---|---|---|
| Actividad 2 | Ampliación de pruebas unitarias, hooks, componentes y servicios | Completada | [Ver Actividad 2](docs/ACTIVIDAD-2.md) |
| Actividad 3 | Pruebas de integración, E2E y accesibilidad | Completada | [Ver Actividad 3](docs/ACTIVIDAD-3.md) |
| Actividad 4 | Rendimiento, seguridad, contrato de API e integración continua | Implementada; evidencia CI pendiente | [Ver Actividad 4](docs/ACTIVIDAD-4.md) |

## Documentación complementaria

Estos documentos se conservan como guías técnicas independientes:

- [Guía de testing](TESTING.md)
- [Guía de Maestro E2E](MAESTRO.md)
- [Explicación del flujo Todo List](FLUJO-TODO-LIST.md)

## Instalación

```powershell
npm install
```

## Ejecución de la aplicación

```powershell
npm start
```

También se puede iniciar directamente en una plataforma:

```powershell
npm run android
npm run ios
npm run web
```

## Ejecución de las pruebas

```powershell
npm test
```

Para generar el reporte de cobertura:

```powershell
npm run test:coverage
```

El reporte HTML queda disponible en [coverage/lcov-report/index.html](coverage/lcov-report/index.html).

## Estado actual

```text
Test Suites: 21 passed, 21 total
Tests:       109 passed, 109 total
Maestro E2E: 2 ejecuciones satisfactorias
```

La Actividad 3 incluye cuatro capturas reales, metadatos y registros de las dos ejecuciones realizadas sobre un celular Android. Las evidencias están disponibles en [docs/evidencias](docs/evidencias/README.md).
