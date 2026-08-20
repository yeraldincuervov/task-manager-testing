# Actividad 4 - Rendimiento, seguridad, contrato de API e integración continua

## Objetivo

Esta actividad evalúa la aplicación Task Manager mediante mediciones reproducibles de rendimiento, una revisión básica contra OWASP Mobile Top 10 2024, validación de contratos HTTP con Zod y un pipeline de integración continua con cobertura mínima.

## Cambios realizados

- Se actualizaron los parches recomendados de Expo SDK 54: `expo ~54.0.37`, `expo-constants ~18.0.14` y `jest-expo ~54.0.18`.
- Las respuestas de `GET /tasks` y `POST /tasks` ahora se validan con Zod antes de ingresar al estado de la aplicación.
- El contenido recuperado desde AsyncStorage también se valida antes de utilizarse.
- Las pruebas de contrato ahora atraviesan `taskService`, HTTP simulado con MSW y los esquemas Zod.
- Se actualizó GitHub Actions para usar Node 22.14, ejecutar todas las pruebas, exigir 70 % de cobertura y publicar el reporte como artefacto.
- Se creó un flujo Maestro específico y se ejecutaron cinco iteraciones con Flashlight sobre un emulador Android.

## 1. Análisis de rendimiento

### Entorno

| Elemento | Configuración utilizada |
|---|---|
| Dispositivo | Pixel 10 virtual de Android Studio |
| Sistema | Android 16, API 36 |
| Arquitectura | x86_64 |
| Resolución | 1080 × 2424, densidad 420 |
| Memoria del emulador | Aproximadamente 2.4 GB |
| Aplicación | APK `preview`, paquete `com.taskmanager.app` |
| Compilación EAS | `91c78de9-0a07-4d9c-94e9-6b6d74a38c1f` |
| Flashlight | 0.18.0 |
| Maestro | 2.8.0 |

Se utilizó una APK independiente y no Expo Go, para evitar que Metro y las herramientas de desarrollo alteraran las mediciones.

### Escenario automatizado

El archivo [`.maestro/actividad_4_rendimiento.yaml`](../.maestro/actividad_4_rendimiento.yaml) realiza siempre el mismo recorrido:

1. Limpia el estado y abre la aplicación.
2. Entra al flujo Todo List.
3. Crea tres tareas.
4. Marca una tarea como completada.
5. Filtra las tareas completadas.
6. Regresa al listado completo y valida el resultado.

Antes de medir se ejecutó el flujo de manera aislada. Después se ejecutaron cinco iteraciones con una ventana de medición de 15 segundos:

```powershell
flashlight test `
  --bundleId com.taskmanager.app `
  --testCommand "maestro test .maestro\actividad_4_rendimiento.yaml" `
  --iterationCount 5 `
  --duration 15000 `
  --resultsFilePath "docs\evidencias\actividad-4\rendimiento.json" `
  --resultsTitle "Task Manager - Actividad 4"
```

Las cinco iteraciones finalizaron con estado `SUCCESS` y cero reintentos.

### Resultados de Flashlight

| Iteración | Muestras | Duración del flujo | FPS promedio | FPS mínimo | RAM promedio | RAM máxima |
|---:|---:|---:|---:|---:|---:|---:|
| 1 | 31 | 40.23 s | 59.20 | 41.79 | 187.42 MB | 197.86 MB |
| 2 | 31 | 41.59 s | 59.29 | 43.12 | 186.49 MB | 197.26 MB |
| 3 | 31 | 40.29 s | 59.25 | 43.09 | 186.99 MB | 197.50 MB |
| 4 | 31 | 39.85 s | 59.20 | 42.84 | 186.55 MB | 197.38 MB |
| 5 | 31 | 39.95 s | 59.10 | 42.95 | 186.56 MB | 197.36 MB |
| **Global** | **155** | — | **59.21** | **41.79** | **186.80 MB** | **197.86 MB** |

El resultado completo y sin resumir se conserva en [`rendimiento.json`](evidencias/actividad-4/rendimiento.json).

### Tiempo de arranque

Se midieron cinco inicios en frío con Activity Manager. La opción `-S` detuvo la aplicación antes de cada ejecución y Android reportó `LaunchState: COLD`.

| Iteración | TotalTime | WaitTime |
|---:|---:|---:|
| 1 | 441 ms | 444 ms |
| 2 | 381 ms | 389 ms |
| 3 | 413 ms | 417 ms |
| 4 | 354 ms | 356 ms |
| 5 | 412 ms | 416 ms |
| **Promedio** | **400.2 ms** | **404.4 ms** |

El registro está en [`arranque-en-frio.txt`](evidencias/actividad-4/arranque-en-frio.txt).

### Cuello de botella o área de mejora

No se observó una degradación sostenida: la aplicación mantuvo 59.21 FPS promedio. La principal área de mejora es el **primer render**, donde todas las iteraciones mostraron una caída transitoria a aproximadamente 42–43 FPS antes de estabilizarse cerca de 60 FPS. La memoria también creció desde un mínimo global de 141.85 MB hasta un máximo de 197.86 MB durante la carga, navegación y apertura del teclado.

Se propone perfilar los primeros dos segundos con React Native DevTools, diferir la inicialización de pantallas no visibles y revisar recursos o dependencias cargados al inicio. Después de cualquier optimización se debe repetir exactamente el mismo flujo para comparar datos equivalentes.

## 2. Análisis básico de seguridad

La revisión se realizó contra categorías de OWASP Mobile Top 10 2024.

| Categoría | Resultado | Hallazgo | Corrección aplicada o propuesta |
|---|---|---|---|
| M4: Insufficient Input/Output Validation | Cumple después del ajuste | Antes, `taskService` confiaba en `res.json()` y el caché local se convertía mediante un cast de TypeScript | Se incorporó validación Zod de respuestas GET/POST y del caché de AsyncStorage. Los datos inválidos son rechazados o ignorados |
| M5: Insecure Communication | Cumple en el código revisado | El único endpoint configurado utiliza `https://api.taskmanager.com` y no se encontraron URLs HTTP | Mantener HTTPS en producción, no habilitar tráfico claro y usar un dominio real con certificado válido |
| M9: Insecure Data Storage | Cumplimiento parcial | Los títulos y estados se guardan como JSON sin cifrar en AsyncStorage | No almacenar secretos allí. Si las tareas contienen información sensible, usar almacenamiento cifrado, minimizar los datos y definir una política de eliminación |
| M2: Inadequate Supply Chain Security | Cumplimiento parcial | `npm audit` reportó 22 avisos transitivos: 10 moderados, 12 altos y 0 críticos | Mantener parches compatibles, habilitar alertas de dependencias y planear la migración de Expo. No se aplicó `npm audit fix --force` porque proponía Expo 57, fuera del SDK 54 exigido |

Como comprobación adicional, no se encontraron llamadas `console.log`, tokens, contraseñas ni claves de API dentro de `src` o `app`. Esto reduce el riesgo de exposición accidental en logs, aunque debe revisarse nuevamente cuando se incorpore autenticación.

## 3. Contrato de API con Zod

El contrato está definido en [`src/schemas/taskSchema.ts`](../src/schemas/taskSchema.ts):

| Campo | Tipo | Requisito |
|---|---|---|
| `id` | string | Obligatorio |
| `title` | string | Obligatorio, mínimo un carácter |
| `status` | `pending` o `completed` | Obligatorio |
| `createdAt` | string ISO datetime | Opcional |

[`src/services/taskService.ts`](../src/services/taskService.ts) utiliza `TaskListSchema.safeParse` para `GET /tasks` y `TaskSchema.safeParse` para `POST /tasks`. Si la respuesta no cumple el contrato, genera un error controlado en lugar de propagar datos incorrectos.

Las pruebas en [`__tests__/contract/taskApi.contract.test.ts`](../__tests__/contract/taskApi.contract.test.ts) comprueban mediante MSW:

- Respuesta válida de `GET /tasks`.
- Respuesta inválida de `GET /tasks`, con `id` numérico.
- Respuesta válida de `POST /tasks`.
- Respuesta inválida de `POST /tasks`, sin `status`.

Esto verifica el recorrido completo `taskService → fetch → MSW → Zod`, no solamente objetos construidos dentro de la prueba.

## 4. Integración continua

El workflow [`.github/workflows/tests.yml`](../.github/workflows/tests.yml) se ejecuta ante cualquier `push` o `pull_request` y realiza:

1. Descarga del repositorio.
2. Configuración de Node 22.14 con caché de npm.
3. Instalación reproducible mediante `npm ci`.
4. Verificación de tipos con TypeScript.
5. Análisis estático de accesibilidad.
6. Suite completa con cobertura y ejecución secuencial.
7. Publicación de `coverage/` como artefacto durante 14 días.

Jest conserva el umbral global mínimo del 70 % para branches, functions, lines y statements. Si cualquier indicador queda por debajo, Jest retorna un código de error y el pipeline falla.

La misma secuencia se reprodujo localmente con éxito. La evidencia visual de GitHub Actions debe agregarse como `docs/evidencias/actividad-4/pipeline-exitoso.png` después de subir estos cambios; no se inventó una captura local porque el requisito exige una ejecución real en GitHub.

## 5. Compatibilidad

Se ejecutaron las comprobaciones oficiales del proyecto:

```text
expo install --check: Dependencies are up to date
expo-doctor: 18/18 checks passed. No issues detected
```

La aplicación fue compilada con Expo SDK 54 e instalada y ejecutada correctamente en Android 16/API 36. Esto complementa la ejecución anterior de la Actividad 3 en un Samsung Galaxy S26 Ultra con Android 16.

## 6. Resultado final de pruebas y cobertura

Comparación antes y después de la Actividad 4:

| Indicador | Antes | Después | Diferencia |
|---|---:|---:|---:|
| Suites aprobadas | 21 | 21 | Sin cambio |
| Pruebas aprobadas | 108 | 109 | +1 |
| Statements | 98.41 % | 98.46 % | +0.05 puntos |
| Branches | 92.30 % | 92.72 % | +0.42 puntos |
| Functions | 93.90 % | 93.90 % | Sin cambio |
| Lines | 99.38 % | 99.40 % | +0.02 puntos |

Resultado final local:

```text
Test Suites: 21 passed, 21 total
Tests:       109 passed, 109 total
Snapshots:   0 total
```

También finalizaron correctamente TypeScript y `npm run lint:a11y`.

## 7. Evidencias y reproducción

- [Reporte JSON de Flashlight](evidencias/actividad-4/rendimiento.json)
- [Mediciones de arranque en frío](evidencias/actividad-4/arranque-en-frio.txt)
- [Inventario de evidencias](evidencias/actividad-4/README.md)
- [Compilación EAS utilizada](https://expo.dev/accounts/yeraldincuervo/projects/task-manager/builds/91c78de9-0a07-4d9c-94e9-6b6d74a38c1f)

Comandos de verificación general:

```powershell
npm ci
npx tsc --noEmit
npm run lint:a11y
npm run test:coverage -- --ci --runInBand
npx expo install --check
npx expo-doctor
```

## Referencias

- [Expo SDK 54](https://docs.expo.dev/versions/v54.0.0/)
- [OWASP Mobile Top 10](https://owasp.org/www-project-mobile-top-10/)
- [Zod](https://zod.dev/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Jest: coverageThreshold](https://jestjs.io/docs/configuration#coveragethreshold-object)
- [Flashlight](https://docs.flashlight.dev/)

[Volver al README](../README.md)
