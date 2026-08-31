# Sorpresa de cumpleaños para Ale 🌷

## Probar ahora
Abre `index.html` en el navegador.

La versión entregada tiene:
- `testMode: true`
- La sorpresa ocurre 15 segundos después de abrir la página.

Para usar la fecha real, abre `script.js` y cambia:

    testMode: false

La fecha ya está configurada para:
**9 de septiembre de 2026, 00:00, hora de Colombia (UTC-5).**

## Música
Por derechos de autor, las canciones no están incluidas en este ZIP.

Coloca legalmente tus archivos de audio en:

- `assets/audio/aprender-a-quererte.mp3`
- `assets/audio/tu-cumpleanos.mp3`

Nombres configurados:
- Espera: Aprender a quererte — Morat
- Cumpleaños: Tu cumpleaños — Diomedes Díaz

IMPORTANTE: Los navegadores modernos suelen bloquear audio automático hasta que la persona toca la pantalla.
Por eso la página incluye el botón **“Toca para escuchar la música”**. Después de ese primer toque,
el cambio de canción al llegar a cero sí puede hacerse automáticamente.

## Publicar gratis
Puedes subir la carpeta completa a Netlify Drop o desplegarla con GitHub Pages.
`index.html` debe quedar en la raíz.

## Personalización rápida
El texto de la carta está dentro de `index.html`, en el bloque `#letterText`.
La fecha está en `script.js`, dentro de `CONFIG`.

## Cielo dinámico
Antes del cumpleaños, la página usa la hora de Colombia (`America/Bogota`):
- 06:00 a 17:59: sol y cielo de día.
- 18:00 a 05:59: luna, estrellas y constelación de Virgo.
- Hay pétalos de tulipán flotando suavemente.
- Una estrella fugaz cruza el cielo pocos segundos después de abrir la página y luego ocasionalmente.

## Probar día y noche

En `script.js`, dentro de `CONFIG`, cambia:

    skyMode: "night"

Valores disponibles:

- `"night"`: fuerza luna, estrellas y constelación de Virgo.
- `"day"`: fuerza sol y cielo diurno.
- `"auto"`: usa automáticamente la hora real de Colombia.

Para la versión final que recibirá Ale usa:

    testMode: false,
    skyMode: "auto"

## Audio en la primera interacción

La canción de espera intenta reproducirse directamente con el primer toque, clic
o tecla del usuario. Ya no se muestra el antiguo mensaje de "agrega el MP3".

Si un navegador excepcionalmente bloquea ese primer intento, el control mostrará
"Toca para escuchar la música 🎵" y permitirá intentarlo de nuevo.


## v18 — estabilidad móvil
- Se eliminó el failsafe que podía revelar la UI antes de cargar `script.js`.
- Diagnóstico opcional con `?debug=1`.
- Watchdog para contador/frases y resincronización al volver de segundo plano.
- Tarjeta móvil más compacta para dejar visible el cielo y Virgo.


## v20 — experiencia final
- Últimos 10 segundos en modo cinematográfico.
- La música de espera se apaga poco a poco y el jardín entra en calma.
- Secuencia: “Llegó el momento…”, estrella fugaz especial, florecimiento, “Feliz cumpleaños, Ale 🌸”.
- La canción de cumpleaños entra durante la secuencia; luego aparecen confeti, foto y contenido por capas.
- Botón “↻ Volver a vivir este momento” que repite desde 10 segundos sin recargar.
- Easter egg de huellitas de Lucas, Lupe y Max.
- Firma final “Un jardín en septiembre 🌷”.
