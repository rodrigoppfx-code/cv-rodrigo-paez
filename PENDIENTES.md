# Pendientes — Hoja de vida web de Rodrigo Páez Parra

_Solo lo que falta. Al terminar un punto, **bórralo de aquí** y regístralo con fecha en `ESTADO.md`. Lo ya hecho queda en `ESTADO.md` y en el historial de GitHub._

_Última revisión: 15 de octubre de 2026._

## 1. Diploma de EUDE — doble titulación del Magíster
- Agregar el diploma de EUDE Business School de la **doble titulación del Magíster en Administración Internacional** (Politécnico Grancolombiano, 2026).
- Dónde: pestaña **Formación** de `index.html` (fila «Magíster en Administración Internacional · Politécnico Grancolombiano · 2026»), hoja de vida en Word (Drive) y LinkedIn.
- No confundir con el Máster en Marketing, Dirección Comercial e IA Generativa (también de EUDE, en curso; punto 2).
- Si se publica el archivo del diploma, guardarlo en `brand/` sin datos personales sensibles (número de documento, códigos de verificación privados).

## 2. Cuando termine el Máster en Marketing, Dirección Comercial e IA Generativa (EUDE)
Cambiar «En curso» por el año de grado, agregar el diploma y **actualizar también el video de presentación**.
- Web (`index.html`): encabezado (lista de títulos debajo del nombre) y pestaña **Formación** (primera fila, etiqueta «EN CURSO»).
- **Video** (`brand/video/presentacion.mp4`):
  - La voz dice «…y cursando un Máster en Marketing, Dirección Comercial e IA Generativa»: cambiar en `video-fuente/guion.json` (línea `r1`) por la versión de egresado y regenerar la voz.
  - La escena «Quién soy» muestra «En curso» junto al máster: quitarlo en `video-fuente/film.js` (lista `creds` de la escena `S.r1`).
  - Exportar de nuevo siguiendo `video-fuente/LEEME.md`.
- Hoja de vida en Word (Drive) y LinkedIn.

## 3. Logros destacados en la web
- Decidir con Rodrigo cuáles mostrar, cuántas tarjetas y dónde. Las opciones siguientes son **ideas, no decisiones aprobadas**:

| Opción | Experiencia | Contexto que puede abrirse al pulsar el logro |
|---|---|---|
| Crecimiento comercial 2023–2025 | Avovite | Contribución al crecimiento del capital comercializado, clientes y unidades; conservar las cifras exactas del bloque aprobado. |
| Tres soluciones tecnológicas con IA | Avovite | Campus comercial, simulador financiero y simulador de propuestas; conservar la galería y las restricciones actuales de demostraciones. |
| Recuperación de cartera | Avovite | Diseño del proceso, responsable y seguimiento; sin inventar porcentajes de recuperación. |
| Renovación del CRM | AXA | Aporte a requisitos y validación; aproximadamente 90% de avance durante la vinculación, sin presentarlo como proyecto terminado. |
| Farmacovigilancia administrativa | Prevenmédica | Procedimientos, formatos y reporte centralizado conforme a lineamientos del laboratorio. |
| Reconocimiento conTACTO | SoulMedical | Reconocimiento por la calidad y oportunidad del servicio y el apoyo a enfermería y pacientes. |

- Idea de interacción: título breve del logro, empresa/cargo y un «+» que abra el contexto completo aprobado.
- conTACTO: carta del 29 de julio de 2013 (en público basta «julio de 2013»), emitida por **Prevenmédica E.U. IPS** por el servicio prestado desde SoulMedical; no atribuir empleo en Prevenmédica en 2013. No publicar la carta original; una imagen requeriría copia autorizada y sin datos de terceros.
- Los textos de las experiencias ya están publicados en la pestaña Experiencia de `index.html`; no cambiar cifras ni atribuciones sin aprobación de Rodrigo.

## 4. CV adjunta en Magneto y LinkedIn
- Reemplazar la hoja de vida adjunta en Magneto y LinkedIn por la versión actual del Word de Drive (manual).

## 5. Pendientes manuales anteriores
- CV en Word: agregar la línea «Proyectos» con el enlace de Vercel.
- LinkedIn Destacado: enlace a Proyectos y corregir la imagen del enlace al perfil.
- Respaldo del Simulador en GitHub: el código está solo en Vercel; subirlo desde el equipo de Rodrigo a un repo privado `simulador-avovite`.
