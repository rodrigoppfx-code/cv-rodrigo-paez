/* mejoras.js — interacciones y movimiento (aditivo; no cambia textos existentes). */
(function () {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;

  // Solo modo crema: limpia cualquier preferencia de tema guardada antes
  root.removeAttribute('data-theme'); try { localStorage.removeItem('rpp-theme'); } catch (e) {}

  function init() {
    // ── Barra de progreso ────────────────────────────────────────────────
    const bar = document.createElement('div'); bar.className = 'mx-progress'; bar.setAttribute('aria-hidden', 'true'); document.body.appendChild(bar);

    // ── Nombre letra a letra ─────────────────────────────────────────────
    const h1 = $('[data-heroname]');
    if (h1 && !reduce()) {
      const txt = h1.textContent; h1.setAttribute('aria-label', txt); h1.textContent = '';
      let i = 0; // cada palabra en un bloque que no se parte; cada letra entra por separado
      txt.split(' ').forEach((wd, wi) => {
        if (wi) h1.appendChild(document.createTextNode(' '));
        const w = document.createElement('span'); w.className = 'mx-w'; w.setAttribute('aria-hidden', 'true');
        [...wd].forEach((c) => { const s = document.createElement('span'); s.className = 'mx-ch'; s.textContent = c; s.style.setProperty('--i', i++); w.appendChild(s); });
        h1.appendChild(w); i++;
      });
    }

    // ── Presentación profesional (Quién soy): vista previa sin sonido; con un clic arranca desde el inicio con sonido ──
    const pres = $('[data-pres]');
    if (pres) {
      const v = $('video', pres), b = $('.mx-pres-play', pres), SRC = 'brand/video/presentacion.mp4';
      const preview = () => { if (pres.classList.contains('on') || reduce()) return; if (!v.src) v.src = SRC; v.muted = true; v.loop = true; const p = v.play(); if (p && p.catch) p.catch(() => {}); };
      if ('IntersectionObserver' in window) new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) preview(); else if (!pres.classList.contains('on')) v.pause(); }), { threshold: 0.3 }).observe(pres);
      else preview();
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!v.src) v.src = SRC;
        pres.classList.add('on'); v.loop = false; v.muted = false; v.controls = true; v.currentTime = 0;
        const p = v.play(); if (p && p.catch) p.catch(() => {});
      });
      v.addEventListener('ended', () => { pres.classList.remove('on'); v.controls = false; preview(); });
      // pausa si se cambia de pestaña
      document.getElementById('app')?.addEventListener('click', (e) => { if (e.target.closest('[data-go]') && !v.paused) v.pause(); });
    }

    // ── Botón flotante ───────────────────────────────────────────────────
    const wa = $('footer[data-contact] a[href*="wa.me"]'); // mismo enlace de WhatsApp del botón de contacto
    const fab = document.createElement('a'); fab.className = 'mx-fab'; fab.href = wa ? wa.href : 'contacto.html';
    if (wa) { fab.target = '_blank'; fab.rel = 'noopener'; }
    fab.setAttribute('aria-label', wa ? 'Conversemos por WhatsApp' : 'Conversemos: ir al formulario de contacto');
    fab.innerHTML = '<span class="mx-dot" aria-hidden="true"></span>Conversemos'; document.body.appendChild(fab);
    requestAnimationFrame(() => fab.classList.add('on')); // siempre disponible

    // ── Scroll: progreso, botón flotante, línea de tiempo ────────────────
    let ticking = false;
    const onScroll = () => {
      ticking = false;
      const h = document.documentElement.scrollHeight - innerHeight;
      bar.style.setProperty('--p', h > 0 ? (scrollY / h).toFixed(4) : 0);
      const tl = $('.mx-tl');
      if (tl && tl.offsetParent) {
        const r = tl.getBoundingClientRect(), k = Math.min(1, Math.max(0, (innerHeight * 0.6 - r.top) / r.height));
        tl.style.setProperty('--tl', k.toFixed(3));
        $$(':scope > article', tl).forEach((a) => a.classList.toggle('on', a.getBoundingClientRect().top + 38 < innerHeight * 0.6));
      }
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    addEventListener('resize', onScroll); onScroll();

    // ── Aparición al bajar ───────────────────────────────────────────────
    const io = 'IntersectionObserver' in window ? new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }) : null;
    const reveal = (els, step = 60) => els.forEach((el, i) => {
      if (!io || reduce() || el.classList.contains('mx-rv')) return;
      el.classList.add('mx-rv'); el.style.setProperty('--d', Math.min(i, 8) * step + 'ms'); io.observe(el);
    });
    $$('[data-panel]').forEach((p) => {
      reveal($$(':scope > div:not(:first-child) > *, :scope > p', p).filter((el) => !el.matches('.pjwrap, .mx-filter')));
    });
    $$('.g3p, .g3, .g4, .g5, .skills-grid').forEach((g) => reveal([...g.children], 70));
    $$('[data-panel] [data-secnum] + span').forEach((l) => { if (io && !reduce()) { l.classList.add('mx-line'); io.observe(l); } });

    // ── Tarjetas: foco y 3D ──────────────────────────────────────────────
    $$('.g3, .g4, .g5, .skills-grid').forEach((g) => g.classList.add('mx-spot'));
    if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
      $$('.skills-grid > .hv1, .g3 > .hv1, .g4 > .hv1').forEach((c) => {
        c.classList.add('mx-tilt');
        c.addEventListener('pointermove', (e) => { if (reduce()) return; const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
          c.style.transform = `rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 9).toFixed(2)}deg) translateZ(6px)`; });
        c.addEventListener('pointerleave', () => { c.style.transform = ''; });
      });
    }

    // ── Experiencia: línea de tiempo ─────────────────────────────────────
    const exp = $('[data-panel="experiencia"] [data-exp]');
    if (exp) exp.parentElement.classList.add('mx-tl');

    // ── Proyectos: filtro por tema ───────────────────────────────────────
    const TAGS = { propuestas: ['ventas', 'automatizacion'], simulador: ['ventas'], campus: ['procesos', 'ia'], analizador: ['ia', 'procesos'], agenda: ['ia', 'automatizacion'], web: ['ia'] };
    const NAMES = [['todos', 'Todos'], ['ventas', 'Ventas'], ['procesos', 'Procesos'], ['automatizacion', 'Automatización'], ['ia', 'IA']];
    const wrap = $('.pjwrap');
    if (wrap) {
      const f = document.createElement('div'); f.className = 'mx-filter'; f.setAttribute('role', 'group'); f.setAttribute('aria-label', 'Filtrar proyectos por tema');
      f.innerHTML = NAMES.map(([k, n], i) => `<button type="button" class="mx-chip" data-f="${k}" aria-pressed="${i ? 'false' : 'true'}">${n}</button>`).join('');
      wrap.parentElement.insertBefore(f, wrap); wrap.style.marginTop = '0';
      f.addEventListener('click', (e) => {
        const b = e.target.closest('[data-f]'); if (!b) return; e.stopPropagation();
        const k = b.getAttribute('data-f');
        $$('[data-f]', f).forEach((x) => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
        const btns = $$('.pjlist [data-pjgo]'); let first = null;
        btns.forEach((x) => { const ok = k === 'todos' || (TAGS[x.getAttribute('data-pjgo')] || []).includes(k); x.classList.toggle('mx-dim', !ok); if (ok && !first) first = x; });
        const cur = $('.pjlist [data-pjgo][aria-current="true"]');
        if (first && cur && cur.classList.contains('mx-dim')) first.click();
      });
    }

    // ── Propuestas: antes / ahora ────────────────────────────────────────
    const imp = $$('[data-pj="propuestas"] .g3p > div').pop();
    if (imp) {
      const ba = document.createElement('div'); ba.className = 'mx-ba'; ba.setAttribute('aria-hidden', 'true');
      ba.innerHTML = '<div class="mx-ba-row"><span>Antes</span><span class="mx-ba-bar"><i style="--w:1"></i></span><b>~5 min</b></div>' +
        '<div class="mx-ba-row now"><span>Ahora</span><span class="mx-ba-bar"><i style="--w:.2"></i></span><b>~1 min</b></div>';
      imp.appendChild(ba);
      if (io && !reduce()) io.observe(ba); else ba.classList.add('in');
    }

    // ── Visor de capturas: anterior / siguiente, teclado y deslizar ──────
    const lb = $('[data-lightbox]');
    if (lb) {
      let list = [], idx = 0;
      const prev = document.createElement('button'), next = document.createElement('button'), cnt = document.createElement('span');
      prev.className = 'mx-lbnav prev'; next.className = 'mx-lbnav next'; prev.type = next.type = 'button';
      prev.innerHTML = '←'; next.innerHTML = '→'; prev.setAttribute('aria-label', 'Captura anterior'); next.setAttribute('aria-label', 'Captura siguiente'); cnt.className = 'mx-lbcount';
      lb.append(prev, next, cnt);
      const show = (i) => {
        if (!list.length) return; idx = (i + list.length) % list.length; const t = list[idx], img = $('[data-lb-img]', lb);
        img.style.opacity = '0'; setTimeout(() => { img.src = t.getAttribute('data-src'); img.alt = t.getAttribute('data-alt') || ''; img.style.opacity = '1'; }, 160);
        $('[data-lb-cap]', lb).textContent = t.getAttribute('data-cap') || ''; cnt.textContent = `${idx + 1} / ${list.length}`;
        t.click(); // sincroniza la miniatura activa en la página
      };
      new MutationObserver(() => {
        if (!lb.open) return;
        const art = $('[data-pj]:not([style*="none"])'); list = art ? $$('[data-thumb]', art) : [];
        const cur = $('[data-mainimg]', art || document); const src = cur ? cur.getAttribute('src') : '';
        idx = Math.max(0, list.findIndex((t) => src && src.endsWith(t.getAttribute('data-src'))));
        const many = list.length > 1; prev.hidden = next.hidden = cnt.hidden = !many; cnt.textContent = `${idx + 1} / ${list.length}`;
      }).observe(lb, { attributes: true, attributeFilter: ['open'] });
      prev.addEventListener('click', (e) => { e.stopPropagation(); show(idx - 1); });
      next.addEventListener('click', (e) => { e.stopPropagation(); show(idx + 1); });
      lb.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') show(idx - 1); if (e.key === 'ArrowRight') show(idx + 1); });
      let x0 = null;
      lb.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
      lb.addEventListener('touchend', (e) => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1)); x0 = null; });
    }

    // ── Resultados: cifras que cuentan hacia arriba ──────────────────────
    $$('[data-fig]').forEach((el) => {
      const txt = el.textContent.trim(), nums = txt.match(/\d[\d.]*/g);
      if (!nums || nums.length !== 1) return; // solo cifras simples (no «$160 MM COP + USD 33.000»)
      const raw = nums[0], target = parseInt(raw.replace(/\./g, ''), 10), [pre, post] = txt.split(raw);
      const card = el.closest('.hv1'); if (card) card.classList.add('mx-figcard');
      const fmt = (n) => Math.round(n).toLocaleString('es-CO');
      const run = () => {
        if (reduce()) return; const t0 = performance.now(), D = 1600;
        const step = (now) => { const k = Math.min(1, (now - t0) / D), e = 1 - Math.pow(1 - k, 3); el.textContent = pre + fmt(target * e) + post; if (k < 1) requestAnimationFrame(step); else el.textContent = txt; };
        requestAnimationFrame(step);
      };
      if (io && !reduce()) {
        const o = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { run(); card && card.classList.add('in'); o.disconnect(); } }), { threshold: 0.4 });
        o.observe(el);
      } else if (card) card.classList.add('in');
    });

    // ── Formación y Cursos: año grande de fondo ──────────────────────────
    $$('[data-panel="formacion"] .vrow, [data-panel="cursos"] .g3 > div').forEach((row) => {
      const y = (row.textContent.match(/(?<!\d)(19|20)\d{2}(?!\d)/) || [])[0]; if (y) { row.setAttribute('data-year', y); row.classList.add('mx-year'); }
    });

    // ── Herramientas: etiquetas que aparecen en cascada ──────────────────
    $$('[data-panel="herramientas"] .g5 > div > div:last-child').forEach((box) => {
      if (!box.innerHTML.includes('<br')) return;
      const items = box.innerHTML.split(/<br\s*\/?>/i).map((x) => x.trim()).filter(Boolean);
      box.innerHTML = items.map((x, i) => `<span class="mx-tag" style="--d:${i * 70}ms">${x}</span>`).join('');
      box.classList.add('mx-tags'); if (io && !reduce()) io.observe(box); else box.classList.add('in');
    });

    // ── Cierre: titular grande antes del contacto ────────────────────────
    const fwrap = $('footer[data-contact] > div');
    if (fwrap) {
      const cta = document.createElement('div'); cta.className = 'mx-close';
      cta.innerHTML = '<p class="mx-close-h">Conversemos</p><p class="mx-close-s">Si buscas a alguien que sume a tu equipo, conversemos.</p>';
      fwrap.parentElement.insertBefore(cta, fwrap);
      if (io && !reduce()) io.observe(cta); else cta.classList.add('in');
    }

    // Recalcular al cambiar de pestaña (la línea de tiempo y el botón dependen del panel visible)
    document.getElementById('app')?.addEventListener('click', () => setTimeout(onScroll, 80));
    addEventListener('hashchange', () => setTimeout(onScroll, 120));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
