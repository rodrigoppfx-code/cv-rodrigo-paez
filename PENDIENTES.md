# Pendientes de actualización — Hoja de vida web de Rodrigo Páez Parra

_Creado: 15 de octubre de 2026._ Al completar un punto, márcalo con `[x]`, anota la fecha y actualiza `ESTADO.md`.

## 1. Diploma de EUDE — doble titulación del Magíster
- [ ] Agregar el diploma de EUDE Business School de la **doble titulación del Magíster en Administración Internacional** (Politécnico Grancolombiano, 2026).
- Dónde: pestaña **Formación** de `index.html` (fila «Magíster en Administración Internacional · Politécnico Grancolombiano · 2026»), y en la hoja de vida en Word (Drive) y LinkedIn.
- No confundir con el Máster en Marketing, Dirección Comercial e IA Generativa (también de EUDE, aún en curso; ver punto 2).
- Si se publica el archivo del diploma, guardarlo en `brand/` sin datos personales sensibles (número de documento, códigos de verificación privados).

## 2. Cuando termine el máster actual
- [ ] Cambiar «En curso» por el año de grado y actualizar el diploma.
- Lugares que dicen «En curso» o «cursando» el máster:
  - `index.html` → encabezado (lista de títulos debajo del nombre).
  - `index.html` → pestaña **Formación** (primera fila, etiqueta «EN CURSO»).
  - Video de presentación (`brand/video/presentacion.mp4`): la voz dice «cursando un Máster…» y la escena 7 muestra la etiqueta «En curso». Para cambiarlo: editar `video-fuente/guion.json` (línea `r1`) y `video-fuente/film.js` (lista `creds` de la escena `r1`), regenerar la voz y exportar de nuevo (ver `video-fuente/LEEME.md`).
  - Hoja de vida en Word (Drive) y LinkedIn.

## 3. Fecha de finalización en Avovite (último trabajo)
- [ ] Reemplazar «Actualidad» por la fecha real de finalización.
- Dónde:
  - `index.html` → pestaña **Experiencia**, primera fila: «Octubre de 2022 – Actualidad · Avovite S.A.S. · Director Comercial · Remoto».
  - Hoja de vida en Word (Drive) y LinkedIn.
- Recordar la regla: Avovite se menciona solo como «en mi rol de Director Comercial», sin promocionar la empresa.

## 4. Video de presentación: foto y gráfica (cuando se necesite)
- [ ] **Foto**: hoy la escena «Quién soy» del video usa un emblema de crecimiento (barras 3D, flecha y sello) en lugar de la foto, para no tener que actualizarlo cada vez que cambie la foto. Si se quiere volver a poner la foto o cambiarla:
  1. Reemplazar `video-fuente/marca/assets/foto.webp` (copiar la misma foto de `brand/foto-rodrigo.webp`).
  2. En `video-fuente/film.js`, escena `S.r1`, cambiar el bloque «Emblema de crecimiento» por el dibujo de la foto (`MC.IMG.foto`). La versión con foto está en el historial de Git (commit anterior a «sin foto»).
  3. Volver a exportar (1080p, ~10 min) y cambiar el `?v=` de `presentacion.mp4` en `mejoras.js`.
- [ ] **Gráfica de resultados** (escena 9 del video): +240 %, $1.580 → $5.373 MM y 241 → 994 clientes (2023–2025). Si hay cifras nuevas, actualizar en `video-fuente/film.js` (escena `S.r3`, funciones `stat` y `bars`) y en `video-fuente/guion.json` (línea `r3`), y en la web (pestaña Valor → Resultados). No inventar cifras.
