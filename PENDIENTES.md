# Pendientes — Hoja de vida web de Rodrigo Páez Parra

_Solo lo que falta en **este proyecto** (cv-rodrigo-paez). Al terminar un punto, **bórralo de aquí** y regístralo con fecha en `ESTADO.md`._

_Última revisión: 15 de octubre de 2026._

## 1. Diploma de EUDE — doble titulación del Magíster
Agregar el diploma de EUDE Business School de la **doble titulación del Magíster en Administración Internacional** (Politécnico Grancolombiano, 2026). Cambiarlo exactamente igual en los cuatro lugares:
- **Web**: pestaña **Formación** de `index.html`, fila «Magíster en Administración Internacional · Politécnico Grancolombiano · 2026».
- **Word** (hoja de vida en Drive).
- **LinkedIn** (Formación).
- **Video**: no aplica hoy (el video nombra el Magíster sin mencionar la doble titulación). Si se quiere mencionar, ver la guía al final.
- No confundir con el Máster en Marketing, Dirección Comercial e IA Generativa (también de EUDE, en curso; punto 2).
- Si se publica el archivo del diploma, guardarlo en `brand/` sin datos personales sensibles (número de documento, códigos de verificación privados).

## 2. Cuando termine el Máster en Marketing, Dirección Comercial e IA Generativa (EUDE)
Cambiar «En curso» por el año de grado y agregar el diploma, exactamente igual en los cuatro lugares:
- **Web** (`index.html`): encabezado (lista de títulos debajo del nombre, etiqueta «En curso») y pestaña **Formación** (primera fila, etiqueta «EN CURSO»).
- **Word** (hoja de vida en Drive).
- **LinkedIn** (Formación).
- **Video** (`brand/video/presentacion.mp4`):
  - La voz dice «…y cursando un Máster en Marketing, Dirección Comercial e IA Generativa»: cambiar en `video-fuente/guion.json` (línea `r1`) por la versión de egresado y regenerar la voz.
  - La escena «Quién soy» muestra «En curso» junto al máster: quitarlo en `video-fuente/film.js` (lista `creds` de la escena `S.r1`).
  - Exportar de nuevo según la guía de abajo.

---

## Guía: cambios en el video de presentación
El video se hace con código; su fuente está en `video-fuente/` (detalles técnicos en `video-fuente/LEEME.md`).
- **Textos de la voz**: `video-fuente/guion.json`. Después de cambiarlos, regenerar la voz con `voz_local.py` (voz `es-MX-JorgeNeural`, tono −13 Hz, velocidad +10 %).
- **Textos en pantalla y escenas**: `video-fuente/film.js` (cada escena es `S.<id>`: `p1`–`p4` problema, `g1`–`g2` la clave, `r1` quién soy, `r2` cómo ayudo, `r3` resultados, `c1`–`c2` cierre).
- **Foto**: hoy la escena «Quién soy» usa un emblema de crecimiento en lugar de la foto (así no hay que actualizar el video cuando cambie la foto). Para poner la foto: copiar `brand/foto-rodrigo.webp` a `marca/assets/foto.webp` del proyecto del video y, en `film.js` (escena `S.r1`), cambiar el bloque «Emblema de crecimiento» por el dibujo de `MC.IMG.foto` (la versión con foto está en el historial de GitHub).
- **Gráfica de resultados** (escena `S.r3` y línea `r3` de `guion.json`): +240 %, $1.580 → $5.373 MM y 241 → 994 clientes (2023–2025). Actualizar solo con cifras reales y cambiar también la web (Valor → Resultados y los logros de Experiencia).
- **Exportar**: 1080p horizontal (web) y vertical (redes), sin desenfoque de movimiento ni subtítulos; acelerar 8 % con ffmpeg (`setpts=PTS/1.08` y `atempo=1.08`); copiar a `brand/video/presentacion.mp4` y cambiar el `?v=` de `presentacion.mp4` en `mejoras.js` (caché del navegador). Si cambia la escena «Quién soy», regenerar también la portada `brand/video/presentacion-portada.webp`.
