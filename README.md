# Task Manager - Taller de pruebas

Proyecto desarrollado para la materia **Pruebas y Calidad de Software Móvil**. La aplicación utiliza Expo SDK 54, React Native y Expo Router. Las pruebas automatizadas se ejecutan con Jest, React Native Testing Library, MSW y Maestro.

Repositorio: [github.com/yeraldincuervov/task-manager-testing](https://github.com/yeraldincuervov/task-manager-testing)

## Actividades

La documentación de cada entrega se mantiene por separado para facilitar su revisión.

| Actividad | Alcance | Documentación |
|---|---|---|
| Actividad 2 | Ampliación de pruebas unitarias, hooks, componentes y servicios | [Ver Actividad 2](docs/ACTIVIDAD-2.md) |

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
Test Suites: 19 passed, 19 total
Tests:       100 passed, 100 total
```
