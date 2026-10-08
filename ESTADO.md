# Estado del sitio — Hoja de vida web de Rodrigo Páez Parra

_Última actualización: 8 de octubre de 2026_

## Competencias y habilidades — 8 de octubre de 2026
Se actualizaron los seis bloques de competencias y las once habilidades de gestión con el contenido y orden aprobados por Rodrigo, idénticos en la CV de Drive y en la web. Se conservaron cartera e implementación de procesos; se precisaron operaciones administrativas, análisis de datos, evaluación de proyectos y seguimiento de metas, KPIs y OKRs; se retiraron las traducciones de crecimiento y desarrollo de negocios y se cambió Workflows por Flujos de trabajo. Se añadió Autonomía. La presentación y el resto del contenido permanecen iguales. El titular de LinkedIn ya fue publicado y verificado; queda pendiente revisar y aprobar la lista de aptitudes y las cinco destacadas.

## Formato de la presentación — 8 de octubre de 2026
Los cuatro párrafos de «Quién soy» usan el mismo formato del primero: fuente, tamaño adaptable, color e interlineado. Se conserva íntegramente el texto aprobado. Continúa pendiente la revisión del titular de LinkedIn y de los demás bloques del plan.

## Presentación común — 8 de octubre de 2026
Se sustituyó únicamente la presentación de «Quién soy» por los cuatro párrafos aprobados por Rodrigo, con los cuatro ajustes de redacción autorizados. La misma presentación se publica en el perfil profesional del Word de Drive y en «Acerca de» de LinkedIn. Se conservan el titular, las competencias, las habilidades, las aptitudes, la experiencia, los estudios, el diseño y los enlaces. Los demás bloques siguen pendientes de revisión.

## Ajuste de perfil — 7 de octubre de 2026
Se añadió únicamente la frase aprobada sobre análisis, estructuración e integración de datos al primer párrafo de «Quién soy», al perfil profesional del Word de Drive y a «Acerca de» de LinkedIn. Se conservaron el resto del contenido, el diseño, los enlaces y la configuración de privacidad.

## Enlaces oficiales
| Página | Enlace nuevo (Vercel) | Enlace anterior (GitHub Pages, sigue activo) |
|---|---|---|
| Perfil | https://rodrigo-paez-parra.vercel.app | https://rodrigoppfx-code.github.io/cv-rodrigo-paez/ |
| Proyectos | https://rodrigo-paez-parra.vercel.app/proyectos.html | https://rodrigoppfx-code.github.io/cv-rodrigo-paez/proyectos.html |

Usar siempre los enlaces de Vercel en el CV, en LinkedIn y al compartir.

## Cómo se actualiza
1. Todo cambio se hace en este repositorio (rama `main`).
2. Vercel (proyecto `rodrigo-paez-parra`) publica solo en 1–2 minutos.
3. GitHub Pages también se actualiza solo (respaldo).
4. `vercel.json` (`cleanUrls`) permite usar `/proyectos` sin `.html`.
5. Enlaces directos a un proyecto: `/#propuestas`, `/#simulador`, `/#campus`, `/#analizador`, `/#agenda`.

## Hecho (1 oct 2026)
- [x] Nuevo `index.html` (diseño Claude Design convertido a HTML estático, sin dependencias) con 8 pestañas; la 08 es "Proyectos con IA".
- [x] 5 proyectos con 11 capturas reales en `brand/proyectos/capturas/`.
- [x] `proyectos.html` = redirección a `index.html#proyectos` con vista previa para LinkedIn.
- [x] Imágenes de vista previa: `brand/og-perfil.png` y `brand/og-proyectos.png` (1200×627).
- [x] Maquetas SVG antiguas archivadas en `brand/proyectos/_archivo/`.
- [x] GitHub Pages redirige automáticamente al dominio de Vercel.

- [x] Vercel conectado a este repositorio (proyecto `rodrigo-paez-parra`, despliegue automático desde `main`).

## Pendiente
- [ ] CV en Word: agregar línea "Proyectos" con el enlace de Vercel (manual).
- [ ] LinkedIn Destacado: enlace a Proyectos + corregir imagen del enlace al perfil (manual).

## Reglas de contenido
Actualización puntual solicitada por Rodrigo: la introducción de Proyectos queda «Herramientas que he diseñado y construido usando Claude Design, Codex y ChatGPT, con ayuda del feedback del equipo». Este cambio sustituye la mención al rol de Director Comercial únicamente en esa frase; el resto del sitio permanece igual. Publicación verificada el 1 de octubre de 2026 en Vercel, commit c4236d6, con comprobación de escritorio y móvil sin desbordamiento horizontal.

- Avovite se menciona solo como "en mi rol de Director Comercial", sin promocionar la empresa.
- Sin demos en vivo, sin enlaces a las apps y sin descargables.
- Las capturas usan datos de ejemplo; valores, precios y datos internos ocultos.
- No inventar cifras. Única métrica: propuestas de ~5 a ~1 minuto.

## Archivos de referencia
Instructivos entregados: Web (con imágenes), Word y LinkedIn.
Contexto general y reglas: `LEEME-PRIMERO.md`.

## Otros pendientes
- [ ] Respaldo del Simulador en GitHub: el código está solo en Vercel; subirlo desde el equipo de Rodrigo a un repo privado `simulador-avovite`.

## 8 oct 2026 — distribución de habilidades
- [x] Las once habilidades conservan su texto y orden. En escritorio se distribuyen en tres columnas y cuatro filas; las dos tarjetas finales ocupan media fila cada una, sin celdas vacías. En tablet se usan dos columnas y la última tarjeta ocupa todo el ancho; en móvil se usa una columna.
- [ ] Aptitudes de LinkedIn: revisión pendiente de aprobación; este ajuste solo modifica la distribución visual de habilidades en la web.

## 2 oct 2026
- [x] Proyecto 06 «Hoja de vida web ejecutiva» agregado a la pestaña Proyectos (`/#web`), con 2 capturas en `brand/proyectos/capturas/06-web-ejecutiva/`. Numeración pasa a «/ 06»; Agenda → Web → Propuestas.
- [x] Botón «Ver detalle» rediseñado y más visible en los 6 proyectos (fondo crema con borde y texto rojo de acento, cambia a «Ocultar detalle»).
- [x] Optimización de carga: capturas y foto en WebP (4,8 MB → 0,4 MB), video del encabezado comprimido (850 KB → 137 KB), imágenes con carga diferida, caché de 30 días para `brand/` en Vercel. Se eliminaron archivos sin uso (`support.js`, `ambient-architecture.mp4`, PNG de capturas).
- [x] Corrección: las imágenes de proyectos ya no usan carga diferida (causaba que aparecieran tarde); se descargan en segundo plano al cargar la página y quedan listas al abrir cada proyecto.
