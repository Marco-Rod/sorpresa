# Publicar el cumpleaños de Ale

El sitio es completamente estático: no necesita backend, Node.js ni build.

## Configuración final

Mientras sigas probando puedes mantener `testMode: true`.

Cuando llegue el momento de compartir la URL definitiva con Ale, cambia en `script.js`:

```js
testMode: false,
skyMode: "auto"
```

## Netlify

El proyecto ya incluye `netlify.toml`.

Puedes subir directamente esta carpeta completa. Deben quedar juntos:

- `index.html`
- `styles.css`
- `script.js`
- `assets/`
- `netlify.toml`

No subas únicamente el HTML porque las canciones y la foto viven dentro de `assets/`.

## GitHub Pages

El proyecto incluye `.nojekyll`, así que puede publicarse desde la raíz de un repositorio.

## Vercel

También incluye `vercel.json` y no necesita comando de build.

## Audio

Por políticas de los navegadores no se puede reproducir música antes de cualquier interacción.
La página está preparada para que el primer toque/clic del visitante inicie directamente
`Aprender a quererte · Morat`. Después, el mismo control permite pausar y continuar.
