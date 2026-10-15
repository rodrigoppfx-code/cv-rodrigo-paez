# Pendientes de actualización — Hoja de vida web de Rodrigo Páez Parra

_Creado: 15 de octubre de 2026._ Al completar un punto, márcalo con `[x]`, anota la fecha y actualiza `ESTADO.md`.

## 1. Diploma de EUDE Business School (máster)
- [ ] Agregar el diploma de EUDE que hace falta del Máster en Marketing, Dirección Comercial e IA Generativa.
- Dónde: pestaña **Formación** de `index.html` (fila «Máster en Marketing, Dirección Comercial e IA Generativa · EUDE Business School»).
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
