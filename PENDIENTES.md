# Pendientes de actualización — Hoja de vida web de Rodrigo Páez Parra

_Creado: 15 de octubre de 2026._ Al completar un punto, márcalo con `[x]`, anota la fecha y actualiza `ESTADO.md`.

## 1. Diploma de EUDE — doble titulación del Magíster
- [ ] Agregar el diploma de EUDE Business School de la **doble titulación del Magíster en Administración Internacional** (Politécnico Grancolombiano, 2026).
- Dónde: pestaña **Formación** de `index.html` (fila «Magíster en Administración Internacional · Politécnico Grancolombiano · 2026»), y en la hoja de vida en Word (Drive) y LinkedIn.
- No confundir con el Máster en Marketing, Dirección Comercial e IA Generativa (también de EUDE, aún en curso; ver punto 2).
- Si se publica el archivo del diploma, guardarlo en `brand/` sin datos personales sensibles (número de documento, códigos de verificación privados).

## 2. Cuando termine el Máster en Marketing, Dirección Comercial e IA Generativa (EUDE)
- [ ] Cambiar «En curso» por el año de grado, agregar el diploma y **actualizar también el video de presentación**.
- Web (`index.html`):
  - Encabezado: lista de títulos debajo del nombre (etiqueta «En curso»).
  - Pestaña **Formación**: primera fila (etiqueta «EN CURSO»).
- **Video de presentación** (`brand/video/presentacion.mp4`):
  - La voz dice «…y cursando un Máster en Marketing, Dirección Comercial e IA Generativa». Cambiar el texto en `video-fuente/guion.json` (línea `r1`) por la versión de egresado (por ejemplo «…y Máster en Marketing, Dirección Comercial e IA Generativa») y regenerar la voz.
  - La escena «Quién soy» muestra la etiqueta «En curso» junto al máster: quitarla en `video-fuente/film.js` (lista `creds` de la escena `S.r1`).
  - Exportar de nuevo (1080p, horizontal y vertical, ~10 min), acelerar 8 % como la versión actual y cambiar el `?v=` de `presentacion.mp4` en `mejoras.js` (ver `video-fuente/LEEME.md`).
- Hoja de vida en Word (Drive) y LinkedIn.

## 3. Fecha de finalización en Avovite (último trabajo)
- [x] Web: «Octubre de 2022 – Octubre de 2026», publicado el 15 de octubre de 2026.
- [x] Word de Drive y LinkedIn: finalización en octubre de 2026 actualizada y verificada el 15 de octubre de 2026.
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

## 5. Experiencias completas y posibles logros destacados
- [x] Instrucciones y textos aprobados entregados el 15 de octubre de 2026: [Pendientes de actualización de experiencias](PENDIENTES-ACTUALIZACION-EXPERIENCIAS.md).
- [x] Web: seis experiencias completas (45 responsabilidades y 21 logros) con responsabilidades y logros en el mismo desplegable por cargo, publicado el 15 de octubre de 2026. Consultoría ordenada por actividad más reciente, igual que LinkedIn.
- [ ] Definir con Rodrigo la selección y el diseño de logros destacados. Las opciones del documento son ideas, no decisiones aprobadas.
- La fecha de Avovite en la web ya quedó en **octubre de 2026** (punto 3).
- El reconocimiento de conTACTO permanece entre los logros de SoulMedical y se propone como opción destacada, sin publicar la carta original.

## 6. Retirar «Toma de decisiones» de competencias y habilidades
- [x] Web: **Valor → Estrategia** queda «Estrategia comercial y de mercadeo · Propuesta de valor · Estructuración de negocios.» (15 oct 2026).
- [x] Web: tarjeta «Toma de Decisiones» retirada; nueve habilidades renumeradas, sin huecos (5 arriba y 4 abajo en escritorio; la última a todo el ancho en tablet). (15 oct 2026)
- [x] Word de Drive: retirada de Competencias Clave y Habilidades de Gestión, verificado el 15 de octubre de 2026.
- [x] LinkedIn: revisadas las catorce aptitudes; «Toma de decisiones» no figura como aptitud.
- Este retiro se limita a la competencia y la habilidad. La frase sobre el respaldo analítico para la toma de decisiones dentro de la presentación permanece igual.
- Implementación web completada el 15 de octubre de 2026.

## 7. Pendientes anteriores (traídos de `ESTADO.md`)
- [ ] CV en Word: agregar la línea «Proyectos» con el enlace de Vercel (manual).
- [ ] LinkedIn Destacado: enlace a Proyectos y corregir la imagen del enlace al perfil (manual).
- [ ] Aptitudes de LinkedIn: revisión pendiente de aprobación.
- [ ] Respaldo del Simulador en GitHub: el código está solo en Vercel; subirlo desde el equipo de Rodrigo a un repo privado `simulador-avovite`.
