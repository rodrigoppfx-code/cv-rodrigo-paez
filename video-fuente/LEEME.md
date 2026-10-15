# Fuente del video de presentación
Proyecto de la skill `motion-codigo` (cada cuadro se dibuja con código).
- `guion.json`: frases de la voz. `voz_local.py`: genera la voz (Edge TTS, voz es-MX-JorgeNeural, tono −13 Hz, velocidad +10 %, silencio final recortado).
- `film.js`: escenas, 3D, gráficas y música. `marca/marca.js`: colores y fuentes de la web.
Para regenerar: crear el proyecto con `nuevo.mjs --marca <carpeta con marca.js>`, copiar estos archivos, generar la voz y exportar con `render.mjs` (1080p, horizontal y vertical).

## Cambios frecuentes
- **Foto**: la escena «Quién soy» usa un emblema de crecimiento en lugar de la foto (así no hay que actualizar el video al cambiar la foto). Para poner la foto: copiar `brand/foto-rodrigo.webp` a `marca/assets/foto.webp` del proyecto y, en `film.js` (escena `S.r1`), cambiar el bloque «Emblema de crecimiento» por el dibujo de `MC.IMG.foto` (la versión con foto está en el historial de Git).
- **Gráfica de resultados** (escena `S.r3` y línea `r3` de `guion.json`): +240 %, $1.580 → $5.373 MM y 241 → 994 clientes (2023–2025). Actualizar solo con cifras reales y cambiar también la web (Valor → Resultados).
- **Exportar**: 1080p horizontal y vertical, sin desenfoque de movimiento ni subtítulos; luego acelerar 8 % con ffmpeg (`setpts=PTS/1.08` y `atempo=1.08`) y cambiar el `?v=` de `presentacion.mp4` en `mejoras.js` (caché del navegador).
