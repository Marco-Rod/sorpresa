# Un jardín en septiembre — V2

Fases 1 a 6 en React + TypeScript + Vite 8. La experiencia original permanece intacta en la raíz del repositorio.

## Desarrollo

Desde esta carpeta, con Node 20.19+ o 22.12+:

```sh
npm ci
npm run dev
```

Rutas: `/`, `/memories` y `/memories/2026` (placeholder). Los recuerdos se cargan bajo demanda.

```sh
npm run build
npm run lint
npm test
npm run preview
```

## Arquitectura

`app` contiene el router; `pages`, las pantallas; `components/layout`, el contenedor; `config/birthday.ts`, la configuración para Ale, America/Bogota y el 10 de septiembre de 2027. `styles` contiene variables, reset y estilos móviles con safe areas y reduced motion.

`engines/birthdayEngine.ts` calcula el tiempo restante y la fase desde un timestamp. `hooks/useCountdown.ts` toma una lectura compartida de `Date.now()` para ambos valores cada 250 ms, con setTimeout alineado, y se sincroniza en visibilitychange, pageshow y focus. Pausa en segundo plano y pagehide, elimina listeners al desmontar y deja de programar ticks al llegar al cumpleaños.

El objetivo es el 10 de septiembre de 2027 a las 00:00 de Bogotá (05:00 UTC). La conversión usa UTC-5 explícito para Colombia; no es una conversión genérica de zonas horarias. El reloj depende de la hora del dispositivo: no hay sincronización con un servidor. Cambiar la zona del dispositivo no altera el objetivo.

La Home monta una sola escena: mañana (05–11), día (11–17), atardecer (17–20), noche (20–05), conteo final o cumpleaños. La hora se obtiene con un Intl.DateTimeFormat reutilizado para America/Bogota. El conteo final redondea hacia arriba para no mostrar cero antes del objetivo. `memory` queda reservado en el tipo, sin transición automática todavía.

AppStateProvider envuelve BirthdayProvider y el router. BirthdayProvider es el único consumidor de useCountdown; los componentes usan useBirthday. useBirthdayPhase ofrece una suscripción separada para que las escenas estáticas no se actualicen cada 250 ms. AppStateProvider comparte isVisible mediante useAppState y cubre visibilitychange y restauración de página (pagehide/pageshow). El reloj conserva sus listeners de recuperación de la fase 2; los consumidores no añaden listeners individuales.

useScene comprueba la hora cada 30 segundos mientras la página es visible y la fase depende de la hora. Pausa en background y recalcula al volver. Las fases finales tienen prioridad inmediata y no necesitan comprobar la hora. SceneRenderer monta únicamente el componente seleccionado; estas escenas provisionales pequeñas se importan estáticamente. Los recuerdos conservan su carga bajo demanda.

`effects/StarField.tsx` y `effects/PetalField.tsx` conectan las escenas con los motores. `memories/2026` queda reservado para la migración histórica. React controla interfaz, estados y navegación. Las estrellas y los pétalos usan Canvas y requestAnimationFrame fuera del ciclo de render de React. Esta fase no incluye audio, mascotas ni PWA. No importa ni registra el service worker original.

## Rendimiento (fase 4)

PerformanceProvider está entre AppStateProvider y BirthdayProvider. `usePerformance()` expone quality, fps, reducedMotion y devicePixelRatio. El perfil inicial combina núcleos, resolución, DPR y memoria opcional; es una estimación, no una identificación del teléfono. Reduced motion fuerza LOW al inicio y cuando cambia durante la sesión.

El monitor usa un único requestAnimationFrame y publica una muestra aproximadamente cada segundo, incluso si repite los mismos FPS. fps es null mientras no exista una muestra completa o la página esté oculta. React no actualiza estado por frame. La medición se cancela en segundo plano y se reinicia al volver, descartando muestras y rachas anteriores.

Cuatro muestras consecutivas por debajo de 45 FPS bajan un nivel; tres por debajo de 28 bajan directamente a LOW. Una muestra de al menos 45 reinicia la racha. La calidad nunca sube durante la vida del proveedor, ni al desactivar reduced motion; recargar inicia una sesión nueva.

`config/performance.ts` centraliza cantidades de partículas y opciones visuales. `getCanvasPixelRatio()` limita DPR a 2 / 1.5 / 1 para HIGH / MEDIUM / LOW. El panel FPS/QUALITY solo se monta en desarrollo; muestra un guion cuando no hay medición.

## Canvas y cielo nocturno (fase 5)

`CanvasEngine` ofrece resize, start/stop, pause/resume, renderOnce y destroy. Dibuja antes del primer frame, limita deltaTime a 100 ms y mantiene un único RAF por motor. El resize vuelve a dibujar incluso con el motor parado, para conservar el cielo estático con reduced motion. Destroy cancela el loop e impide reiniciarlo.

`StarFieldEngine` conserva posiciones normalizadas y dibuja 70 / 42 / 22 estrellas por calidad, con parpadeo y deriva sutil. No usa shadowBlur ni estado React por estrella. Al reducir cantidad conserva las posiciones de las estrellas restantes.

NightScene contiene un único canvas decorativo sobre un gradiente. StarField conserva la instancia al cambiar calidad, actualiza cantidad y DPR y renueva el ResizeObserver con la calidad vigente. Observa también resize de ventana; desmontar desconecta todo y destruye el motor. Visibilidad controla el loop y reduced motion muestra estrellas quietas. Si no hay contexto 2D, el contenido y el gradiente permanecen disponibles.

Las pruebas cubren StrictMode, canvas único, cambio de calidad sin remontaje, DPR después de resize, dibujo estático, pausa/reanudación, límite de delta y limpieza. Las estrellas viven en objetos JS, no en nodos DOM. El monitor FPS global sigue activo en páginas visibles sin animación, como se acordó para esta fase.

QA visual pendiente: durante la noche de Bogotá (20:00–05:00), revisar escritorio y móvil, rotación, pestaña oculta, reduced motion y CPU 6x. Para la prueba de estrés temporal se pueden usar 500 estrellas HIGH, restaurando 70 después. No se realizó esa medición en navegador ni se afirma una mejora de FPS medida; las pruebas de canvas usan un contexto 2D simulado.

Las pruebas simulan frames para validar degradación con muestras idénticas, recuperación de visibilidad, limpieza en StrictMode, cambios de reduced motion y límites DPR. El monitor mide frecuencia de callbacks, no certifica frames pintados por la GPU. Para QA manual usar CPU throttling y reduced motion en DevTools; una escena estática puede conservar FPS altos incluso con throttling. La evaluación con carga visual y dispositivos reales sigue pendiente.

## Partículas y pétalos (fase 6)

`ParticlePool` preasigna objetos y reutiliza su identidad con acquire/release/clear. Los emisores inicializan todos los campos al adquirir una partícula. `ParticleEngine` extiende CanvasEngine con emisión, envejecimiento, liberación por vida/límites y hooks beforeUpdate/afterUpdate. No crea objetos ni nodos DOM por emisión.

`PetalEngine` mantiene un pool fijo de 24 objetos: HIGH permite 24 activos a 2.5/s; MEDIUM, 14 a 1.4/s; LOW, 7 a 0.6/s. Al degradar, recorta inmediatamente los activos sin reconstruir el pool. Descarta emisiones cuando está lleno para no generar ráfagas posteriores. El viento suavizado se comparte entre pétalos, el desplazamiento lateral es acotado y la opacidad depende del progreso de vida conservando la opacidad inicial. Tres colores constantes evitan crear paletas por frame.

SunsetScene (17:00–20:00 Bogotá) monta PetalField como canvas independiente en primer plano. Conserva el motor al cambiar calidad, actualiza DPR y desconecta ResizeObserver/RAF al desmontar. Background pausa; reduced motion detiene y vacía el efecto, también después de resize. El cielo nocturno conserva su canvas separado.

En desarrollo se puede recargar con `/?quality=high`, `/?quality=medium` o `/?quality=low`. Esto selecciona el nivel inicial: la degradación automática sigue activa y reduced motion tiene prioridad. Producción ignora el parámetro. La escena sigue dependiendo de la hora real de Bogotá.

Validación: pruebas del pool, tasas de emisión, límites inmediatos, reciclaje, liberación, viento acotado, fade, reset, DPR, visibilidad, StrictMode y parámetros de desarrollo. Build y lint forman parte de las comprobaciones. La revisión visual del atardecer y las mediciones CPU/FPS en dispositivos reales siguen pendientes; el contexto canvas en las pruebas está simulado.

## Pruebas del reloj y escenas

`npm test` ejecuta pruebas del motor, del ciclo de vida del hook y de la transición visual, con reloj simulado. Cubren límites de fases, recuperación tras 20 segundos en segundo plano, callbacks retrasados, focus/pageshow, suspensión cruzando el cumpleaños y limpieza bajo StrictMode. La configuración real de 2027 no se modifica para probar.

Las pruebas de fase 3 cubren los límites horarios, prioridad de cumpleaños, una sola escena montada, un reloj compartido entre consumidores, ausencia de renders por tick en consumidores de fase y pausa/recuperación de ambos temporizadores bajo StrictMode.

Para QA manual, abrir la Home, cambiar de pestaña y volver tras un límite horario de Bogotá: la escena debe actualizarse de inmediato. Durante los diez segundos anteriores al cumpleaños, el conteo debe reflejar el tiempo actual sin recuperar ticks. Repetir con CPU 6x slowdown en DevTools y en Safari iPhone. Estas comprobaciones en dispositivos reales no están sustituidas por las pruebas simuladas.

## Vercel Preview

Importar el repositorio en un proyecto de preview separado y elegir la rama `v2-react`, con **Root Directory: v2**. Framework: Vite. Build: `npm run build`. Output: `dist`. `v2/vercel.json` permite abrir directamente las rutas de recuerdos.

La configuración Vercel de la raíz sigue sirviendo la versión original. No apuntar el dominio de producción a V2 hasta completar las fases siguientes. La publicación y la asociación del proyecto/dominio se realizan en la cuenta de Vercel; no están efectuadas por estos archivos.

## Validación pendiente

Build y lint pueden ejecutarse con los comandos anteriores. Comprobar navegación y recarga directa de las tres rutas, ancho de 320 px, safe areas y navegación por teclado en el preview. Las mediciones FPS, Lighthouse y pruebas en dispositivos reales pertenecen a fases posteriores; esta base no representa todavía una optimización medida de 2026.
