# LÉEME PRIMERO — Hoja de vida web de Rodrigo Páez Parra

**Autor y dueño:** Rodrigo Páez Parra (linkedin.com/in/rodrigopaezparra).
Sitio diseñado y construido por él con apoyo de IA (Claude Design, Codex, Claude Code).

## Antes de cualquier cambio
1. Lee este archivo completo y `ESTADO.md`.
2. No cambies textos, diseño ni enlaces sin que Rodrigo lo pida.
3. Haz los cambios en `main`; Vercel publica solo. Revisa en computador y celular.
4. Al terminar, actualiza `ESTADO.md` (fecha, qué cambió, pendientes).

Este archivo resume el estado de la hoja de vida web y de todos los proyectos de Rodrigo Páez Parra.
Estado detallado y pendientes: ver `ESTADO.md`.

## Este repositorio
Hoja de vida web de Rodrigo Páez Parra (Director Comercial, Ingeniero Industrial, Magíster en Administración Internacional).
- Publicado en **Vercel**, proyecto `rodrigo-paez-parra` → https://rodrigo-paez-parra.vercel.app
  - Proyectos: https://rodrigo-paez-parra.vercel.app/proyectos (o `/#proyectos`)
  - Proyecto puntual: `/#propuestas`, `/#simulador`, `/#campus`, `/#analizador`, `/#agenda`, `/#web`
- **GitHub Pages** (enlace antiguo) sigue activo y redirige solo a Vercel.
- Cada push a `main` publica automáticamente en Vercel (1–2 min). No hay build.

## Archivos
- `index.html`: sitio completo (8 pestañas; la 08 es "Proyectos con IA"). HTML/CSS/JS estático, sin dependencias. Convertido desde un diseño de Claude Design (no reescribir textos sin pedirlo).
- `proyectos.html`: solo redirige a `index.html#proyectos` y tiene la vista previa (Open Graph) para LinkedIn.
- `contacto.html` + `contacto.js`: formulario de contacto (Web3Forms).
- `brand/`: foto, video del encabezado, `og-perfil.png` y `og-proyectos.png` (1200×627, vista previa en LinkedIn).
- `brand/proyectos/capturas/`: 13 capturas reales de los 6 proyectos (WebP), con datos sensibles difuminados.
- `brand/proyectos/_archivo/`: maquetas SVG antiguas (respaldo, no se usan).
- `vercel.json`: `cleanUrls` para usar rutas sin `.html`.

## Reglas
- Todo en español. UTF-8 (verificar tildes y ñ).
- No inventar cifras. Única métrica de proyectos: propuestas de ~5 a ~1 minuto.
- Avovite se menciona solo como "en mi rol de Director Comercial"; no promocionar la empresa. Rodrigo trabaja como prestador de servicios independiente; las herramientas son suyas.
- Sin demos en vivo, sin enlaces a las apps y sin descargables de proyectos.
- Capturas: nunca mostrar precios, valores, nombres de asesores ni datos de clientes.
- CV en Word (.docx): no usar controles de contenido (`w:sdt`, `goog_rdk_*`), cuadros de texto ni campos; todo como texto normal; verificar que el texto se extraiga completo (ATS).

## Mapa de proyectos (cuenta GitHub `rodrigoppfx-code`)
| Proyecto | Repo | Publicación |
|---|---|---|
| Hoja de vida web | `cv-rodrigo-paez` (público) | Vercel `rodrigo-paez-parra` |
| Propuestas y financiación | `Plantilla-de-Simulacion-Financiacion` (público) | Vercel `propuestas-avovite`, `precios-avovite`, `avovite-propuestas-admin` |
| Campus de onboarding | `Avovite-Comercial-Manual` (privado) | Vercel `campus-avovite-comercial` |
| Analizador de CV (ATS, API DeepSeek) | `ANALIZADOR-DE-CV` (privado) | Vercel `analizador-de-cv` |
| Simulador comercial | **sin repo** (solo en Vercel) | Vercel `simulador-avovite` |
| Agenda con video IA (HeyGen, Apps Script, Gmail) | `confirmacion-reuniones` (público) | GitHub Pages |
| Otros personales | `bomba-timer`, `calculadora-interes-compuesto`, `propuestas-comerciales`, `FINAL-BOT` (privado, MQL5) | — |

Pendiente conocido: el Simulador no tiene copia en GitHub. Su código fuente está en el equipo de Rodrigo; subirlo a un repo privado `simulador-avovite` y conectarlo en Vercel (Settings → Git).

## Herramientas usadas para construir
Claude Design, Codex, ChatGPT, Claude Code. Integraciones: HeyGen, API de DeepSeek, Google Sheets/Apps Script, Gmail, Vercel, GitHub Pages.
