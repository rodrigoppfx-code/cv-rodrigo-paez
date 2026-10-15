/* film.js — "La persona correcta en tu equipo" · Rodrigo Páez Parra
   Estilo editorial premium: crema / tinta / rojo, Instrument Serif + Inter. Todo es función de t. */
(function () {
  const { seg, pop, E, clamp, lerp, rgba, rng, noise1, background } = MC;
  const B = window.MARCA, C = B.colors;
  const V = window.VOZ;
  const LN = (id) => V.lines.find((l) => l.id === id);
  const at = (line, txt) => { const w = V.words.find((w) => w.line === line && w.text.toLowerCase().startsWith(txt.toLowerCase())); return w ? w.start : LN(line).start; };
  const SERIF = "Instrument Serif", SERIF_I = "Instrument Serif Italic", SANS = "Inter";

  // ── Tipografía ─────────────────────────────────────────────────────────
  const font = (ctx, fam, size, wt = 400) => { ctx.font = `${wt} ${size}px "${fam}"`; };
  function label(ctx, str, x, y, o = {}) { // versalitas con tracking (como el menú de la web)
    const u = MC.L.u, size = (o.size ?? 22) * u;
    ctx.save(); font(ctx, SANS, size, o.weight ?? 700); ctx.letterSpacing = `${0.16 * size}px`;
    ctx.textAlign = o.align ?? "left"; ctx.textBaseline = "middle"; ctx.globalAlpha *= o.alpha ?? 1;
    ctx.fillStyle = o.color ?? C.ink3; ctx.fillText(str.toUpperCase(), x, y);
    const w = ctx.measureText(str.toUpperCase()).width; ctx.restore(); return w;
  }
  // Titular con ajuste de líneas y entrada palabra a palabra. words: [{t, red?, it?}] o string
  function headline(ctx, words, x, y, o) {
    const u = MC.L.u, size = o.size * u, lh = size * (o.lh ?? 1.02), maxW = o.maxW;
    if (typeof words === "string") words = words.split(" ").map((t) => ({ t }));
    const items = words.map((w) => { font(ctx, w.it ? SERIF_I : SERIF, size); return { ...w, w: ctx.measureText(w.t).width }; });
    font(ctx, SERIF, size); const sp = ctx.measureText(" ").width;
    const lines = [[]]; let cw = 0;
    for (const it of items) { if (cw && cw + sp + it.w > maxW) { lines.push([]); cw = 0; } lines[lines.length - 1].push(it); cw += (cw ? sp : 0) + it.w; }
    let k = 0; const t0 = o.t0, stag = o.stagger ?? 0.07;
    lines.forEach((ln, li) => {
      const lw = ln.reduce((a, b) => a + b.w, 0) + sp * (ln.length - 1);
      let xx = o.align === "center" ? x - lw / 2 : x;
      const yy = y + li * lh;
      ctx.save(); ctx.beginPath(); ctx.rect(xx - size, yy - size * 1.05, lw + size * 2, size * 1.52); ctx.clip();
      for (const it of ln) {
        const ws = it.at ?? t0 + k * stag, a = seg(o.t, ws, ws + 0.75, E.outExpo);
        if (a > 0) {
          ctx.save(); ctx.globalAlpha *= Math.min(1, a * 1.6); font(ctx, it.it ? SERIF_I : SERIF, size);
          ctx.textBaseline = "alphabetic"; ctx.fillStyle = it.red ? C.red : (o.color ?? C.ink);
          if (it.red) { ctx.shadowColor = rgba(C.red, 0.35); ctx.shadowBlur = 26 * u * a; }
          const oy = (1 - a) * size * 1.1;
          ctx.translate(xx, yy + oy); ctx.rotate((1 - a) * 0.06); ctx.fillText(it.t, 0, 0); ctx.rotate(-(1 - a) * 0.06); ctx.translate(-xx, -(yy + oy));
          ctx.shadowBlur = 0;
          if (it.under) { const ua = seg(o.t, ws + 0.35, ws + 0.95, E.inOutCubic); ctx.fillStyle = C.red; ctx.fillRect(xx, yy + size * 0.12, it.w * ua, Math.max(2, 3 * u)); }
          if (it.strike) { const sa = seg(o.t, it.strike, it.strike + 0.5, E.inOutCubic); ctx.fillStyle = C.red; ctx.fillRect(xx - 4 * u, yy - size * 0.3, (it.w + 8 * u) * sa, Math.max(2, 4 * u)); }
          ctx.restore();
        }
        it.x = xx; it.y = yy; xx += it.w + sp; k++;
      }
      ctx.restore();
    });
    return { h: lines.length * lh, lines: lines.length, items };
  }
  const hair = (ctx, x, y, w, a = 1, col = C.line) => { if (a <= 0) return; ctx.fillStyle = col; ctx.fillRect(x, y, w * a, Math.max(1, 1.5 * MC.L.u)); };

  // ── Capa editorial común: cabecera, capítulo, progreso y subtítulos ────
  const CHAP = { p1: "El problema", p2: "El problema", p3: "El problema", p4: "El problema", g1: "La clave", g2: "La clave",
    r1: "Quién soy", r2: "Cómo te ayudo", r3: "Resultados", c1: "Mi propuesta", c2: "Conversemos" };
  let NOCHROME = false;
  const bufs = {};
  const buf = (k) => { const { W, H } = MC.L, key = k + W + "x" + H; if (!bufs[key]) { const c = document.createElement("canvas"); c.width = W; c.height = H; bufs[key] = c; } const c = bufs[key], g = c.getContext("2d"); g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W, H); return c; };
  function cube(ctx, A, Bc, k) {
    const { W, H, u } = MC.L, d = W / 2, f = W * 1.5, N = 90, cx = W / 2, cy = H / 2, th = k * Math.PI / 2;
    ctx.fillStyle = "#E7E2D7"; ctx.fillRect(0, 0, W, H);
    const zoom = 1 - 0.1 * Math.sin(Math.PI * k);
    const faces = [{ src: A, a: th }, { src: Bc, a: th - Math.PI / 2 }].sort((p, q) => Math.cos(p.a) - Math.cos(q.a));
    ctx.save(); ctx.translate(cx, cy); ctx.scale(zoom, zoom); ctx.translate(-cx, -cy);
    { const sg = ctx.createRadialGradient(cx, cy + H * 0.52, 0, cx, cy + H * 0.52, W * 0.6); sg.addColorStop(0, rgba(C.ink, 0.28)); sg.addColorStop(1, rgba(C.ink, 0));
      ctx.fillStyle = sg; ctx.beginPath(); ctx.ellipse(cx, cy + H * 0.52, W * 0.6, H * 0.07, 0, 0, Math.PI * 2); ctx.fill(); }
    for (const F of faces) {
      if (Math.cos(F.a) <= 0.001) continue;
      const proj = (x) => { const X = x * Math.cos(F.a) - d * Math.sin(F.a), Z = -x * Math.sin(F.a) - d * Math.cos(F.a) + d, sc = f / (f + Z); return [cx + X * sc, sc]; };
      for (let i = 0; i < N; i++) {
        const x0 = -W / 2 + (i / N) * W, x1 = -W / 2 + ((i + 1) / N) * W, [s0, k0] = proj(x0), [s1, k1] = proj(x1), sc = (k0 + k1) / 2, w = s1 - s0;
        if (w <= 0) continue;
        ctx.drawImage(F.src, (i / N) * W, 0, W / N + 1, H, s0, cy - (H * sc) / 2, w + 0.8, H * sc);
      }
      const sh = 0.35 * (1 - Math.cos(F.a)); if (sh > 0.01) { const [l] = proj(-W / 2), [r, kr] = proj(W / 2); const [, kl] = proj(-W / 2);
        ctx.fillStyle = rgba(C.ink, sh); ctx.beginPath(); ctx.moveTo(l, cy - H * kl / 2); ctx.lineTo(r, cy - H * kr / 2); ctx.lineTo(r, cy + H * kr / 2); ctx.lineTo(l, cy + H * kl / 2); ctx.fill(); }
    }
    ctx.restore();
  }
  const TD3 = 0.5;
  function with3D(id, prevId, draw) { // los primeros TD3 s de la escena: cubo 3D desde la escena anterior
    return (ctx, lt, dur, L, t) => {
      if (!prevId || lt >= TD3) return draw(ctx, lt, dur, L, t);
      const sc = MC.film.scenes, me = sc.find((x) => x.id === id), pv = sc.find((x) => x.id === prevId);
      NOCHROME = true;
      const A = buf("A"), Bc = buf("B");
      pv.draw(A.getContext("2d"), t - pv.start, pv.end - pv.start, L, t); draw(Bc.getContext("2d"), lt, dur, L, t);
      NOCHROME = false;
      cube(ctx, A, Bc, E.inOutCubic(clamp(lt / TD3)));
      chrome(ctx, t, id);
    };
  }
  function chrome(ctx, t, id) {
    if (NOCHROME) return;
    const { W, H, u, portrait } = MC.L, m = (portrait ? 70 : 90) * u, top = (portrait ? 90 : 70) * u;
    label(ctx, "Rodrigo Páez Parra", m, top, { color: C.ink, size: 20 });
    label(ctx, CHAP[id], W - m, top, { align: "right", color: C.red, size: 20 });
    hair(ctx, m, top + 30 * u, W - 2 * m, 1);
    ctx.fillStyle = C.ink; ctx.fillRect(m, top + 30 * u, (W - 2 * m) * clamp(t / V.duration), Math.max(1, 1.5 * u));
    const cm = 26 * u, ca = 0.5; ctx.save(); ctx.strokeStyle = rgba(C.ink, 0.35); ctx.lineWidth = 1.5 * u;
    [[m, H - m * 0.9, 1, -1], [W - m, H - m * 0.9, -1, -1]].forEach(([x, y, sx, sy]) => { ctx.beginPath(); ctx.moveTo(x, y + sy * cm); ctx.lineTo(x, y); ctx.lineTo(x + sx * cm, y); ctx.stroke(); });
    ctx.restore();
    MC.vignette(ctx, 0.08, C.ink);
    subtitles(ctx, t);
    wipes(ctx, t);
  }
  const groups = (() => { const out = []; let cur = null;
    V.words.forEach((w, i) => { const p = V.words[i - 1];
      if (!cur || cur.words.length >= (MC.L?.portrait ? 4 : 6) || (p && (w.line !== p.line || w.start - p.end > 0.3)) || /[.!?…:,]$/.test(p?.text ?? "")) { cur = { words: [], start: w.start, end: w.end }; out.push(cur); }
      cur.words.push(w); cur.end = w.end; });
    out.forEach((g, i) => { g.end = Math.min(out[i + 1]?.start ?? g.end + 0.5, g.end + 0.5); }); return out; });
  let G = null;
  function subtitles(ctx, t) {
    if (/[?&]nosub/.test(location.search)) return; // portadas sin subtítulos
    G = G || groups(); const g = G.find((g) => t >= g.start && t < g.end); if (!g) return;
    const { W, H, u, portrait } = MC.L, size = (portrait ? 40 : 34) * u, y = portrait ? H * 0.9 : H * 0.92;
    ctx.save(); font(ctx, SANS, size, 500); ctx.textBaseline = "middle";
    const sp = size * 0.28, ws = g.words.map((w) => ctx.measureText(w.text).width), tot = ws.reduce((a, b) => a + b, 0) + sp * (ws.length - 1);
    let x = W / 2 - tot / 2; const a = seg(t, g.start - 0.05, g.start + 0.2);
    ctx.globalAlpha = a;
    g.words.forEach((w, i) => { const on = t >= w.start && t < w.end + 0.08;
      ctx.fillStyle = on ? C.red : t >= w.start ? C.ink : rgba(C.ink, 0.32); ctx.fillText(w.text, x, y); x += ws[i] + sp; });
    ctx.restore();
  }
  const GHOST = { p1: "01", p2: "02", p3: "03", p4: "04", g1: "?", g2: "!", r1: "R", r2: "04", r3: "%", c1: "+", c2: "→" };
  function bg(ctx, t) {
    background(ctx);
    const { W, H, u, portrait } = MC.L, sc = MC.film.scenes.find((s) => t >= s.start - 0.6 && t < s.end) ?? MC.film.scenes[0], lt = t - sc.start;
    // retícula editorial que se desliza (capa lejana)
    ctx.save(); ctx.strokeStyle = rgba(C.ink, 0.045); ctx.lineWidth = 1;
    const step = (portrait ? W / 4 : W / 8), off = (t * 14 * u) % step;
    for (let x = -step + off; x < W + step; x += step) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    ctx.restore();
    // acentos de motion graphics al entrar cada escena
    { const k = clamp(lt / 1.1), e = E.outCubic(k), cxr = portrait ? W * 0.92 : W * 0.95, cyr = portrait ? H * 0.12 : H * 0.15;
      if (k < 1) { ctx.save(); ctx.strokeStyle = rgba(C.red, 0.35 * (1 - k)); ctx.lineWidth = 2 * u; ctx.beginPath(); ctx.arc(cxr, cyr, 20 * u + e * 260 * u, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
      const sw = seg(lt, 0.05, 0.75, E.inOutCubic), sw2 = seg(lt, 0.25, 0.95, E.inOutCubic);
      if (sw2 < 1) { ctx.fillStyle = C.red; ctx.fillRect(W * sw2, H - 6 * u, W * (sw - sw2), 3 * u); }
      ctx.save(); ctx.strokeStyle = rgba(C.ink, 0.22); ctx.lineWidth = 1.5 * u;
      [[0.12, 0.82], [0.88, 0.3], [0.5, 0.92]].forEach(([fx, fy], i) => { const a = seg(lt, 0.1 + i * 0.1, 0.6 + i * 0.1, E.outBack), x = W * fx, y = H * fy, r = 9 * u * a;
        if (a <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(t * 0.6 + i); ctx.beginPath(); ctx.moveTo(-r, 0); ctx.lineTo(r, 0); ctx.moveTo(0, -r); ctx.lineTo(0, r); ctx.stroke(); ctx.restore(); });
      ctx.restore(); }
    // número fantasma gigante con parallax
    const g = GHOST[sc.id]; if (g) {
      const a = seg(lt, 0, 0.9, E.outCubic), size = (portrait ? 900 : 860) * u;
      ctx.save(); font(ctx, SERIF, size); ctx.textBaseline = "alphabetic"; ctx.textAlign = "right";
      ctx.strokeStyle = rgba(C.ink, 0.07 * a); ctx.lineWidth = 2 * u;
      const x = W + 40 * u - lt * 22 * u + (1 - a) * 160 * u, y = portrait ? H * 0.98 : H * 1.08;
      ctx.strokeText(g, x, y); ctx.restore();
    }
    // partículas de polvo (flotan, deterministas)
    const r = rng("dust"); ctx.save();
    for (let i = 0; i < 38; i++) {
      const x0 = r() * W, y0 = r() * H, sp = 8 + r() * 26, ph = r() * 6.28, sz = (1 + r() * 2.2) * u, red = r() < 0.18;
      const y = ((y0 - t * sp * u) % H + H) % H, x = x0 + Math.sin(t * 0.4 + ph) * 24 * u;
      ctx.fillStyle = red ? rgba(C.red, 0.35) : rgba(C.ink, 0.16); ctx.beginPath(); ctx.arc(x, y, sz, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
  // Cortinilla de acto (roja + tinta) que tapa el corte, tipo shape-layer de After Effects
  const ACTS = () => [LN("g1").start - 0.25, LN("c1").start - 0.25];
  function wipes(ctx, t) {
    const { W, H, u } = MC.L;
    for (const T of ACTS()) {
      const d = 0.7, k0 = (t - (T - d / 2)) / d; if (k0 <= 0 || k0 >= 1.12) continue;
      [[C.red, 0], [C.ink, 0.12]].forEach(([col, lag]) => {
        const k = E.inOutCubic(clamp((k0 - lag) / 0.88)); if (k <= 0 || k >= 1) return;
        const sk = H * 0.35, x = lerp(-W - sk * 2, W + sk, k), w = W + sk;
        ctx.save(); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x + sk, 0); ctx.lineTo(x + sk + w, 0); ctx.lineTo(x + w, H); ctx.lineTo(x, H); ctx.closePath(); ctx.fill(); ctx.restore();
      });
    }
  }

  // ── Ilustraciones de línea ────────────────────────────────────────────
  function chart(ctx, cx, cy, w, h, t, t0) { // ventas que se estancan bajo la meta
    const u = MC.L.u, lw = 3 * u;
    hair(ctx, cx - w / 2, cy + h / 2, w, seg(t, t0, t0 + 0.6), C.ink);
    const gy = cy - h * 0.32, ga = seg(t, t0 + 0.1, t0 + 0.6);
    ctx.save(); ctx.setLineDash([10 * u, 10 * u]); ctx.strokeStyle = rgba(C.ink, 0.45); ctx.lineWidth = 1.5 * u;
    ctx.beginPath(); ctx.moveTo(cx - w / 2, gy); ctx.lineTo(cx - w / 2 + w * ga, gy); ctx.stroke(); ctx.restore();
    label(ctx, "Meta", cx + w / 2, gy - 22 * u, { align: "right", alpha: ga, size: 18 });
    const pts = [[0, .78], [.14, .55], [.28, .42], [.42, .36], [.56, .4], [.7, .38], [.84, .44], [1, .46]];
    const k = seg(t, t0 + 0.2, t0 + 1.5, E.inOutCubic), n = (pts.length - 1) * k;
    ctx.save(); ctx.strokeStyle = C.red; ctx.lineWidth = lw; ctx.lineJoin = ctx.lineCap = "round"; ctx.beginPath();
    let lx = 0, ly = 0;
    for (let i = 0; i <= Math.floor(n) + 1 && i < pts.length; i++) {
      const f = i <= n ? 1 : n - Math.floor(n); const p0 = pts[Math.max(0, i - 1)], p1 = pts[i];
      const px = lerp(p0[0], p1[0], i === 0 ? 1 : f), py = lerp(p0[1], p1[1], i === 0 ? 1 : f);
      lx = cx - w / 2 + px * w; ly = cy - h / 2 + py * h; i === 0 ? ctx.moveTo(lx, ly) : ctx.lineTo(lx, ly);
    }
    ctx.shadowColor = rgba(C.red, 0.45); ctx.shadowBlur = 22 * u; ctx.stroke(); ctx.restore();
    if (k > 0) { ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(lx, ly, 7 * u, 0, Math.PI * 2); ctx.fill(); }
    const gap = seg(t, t0 + 1.5, t0 + 1.9);
    if (gap > 0) { ctx.save(); ctx.globalAlpha = gap; ctx.strokeStyle = C.red; ctx.lineWidth = 1.5 * u; ctx.beginPath(); ctx.moveTo(lx + 24 * u, gy + 8 * u); ctx.lineTo(lx + 24 * u, ly - 10 * u); ctx.stroke(); ctx.restore();
      label(ctx, "Brecha", lx + 36 * u, (gy + ly) / 2, { color: C.red, alpha: gap, size: 18 }); }
  }
  function gearPath(ctx, r, teeth) {
    ctx.beginPath();
    for (let i = 0; i < teeth * 4; i++) { const a = (i / (teeth * 4)) * Math.PI * 2, rr = (i % 4 < 2) ? r : r * 0.84; i ? ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); }
    ctx.closePath();
  }
  function gears(ctx, cx, cy, s, t, t0) {
    const u = MC.L.u, lt = t - t0, a = seg(t, t0, t0 + 0.6);
    const stopAt = at("p2", "traba"), jam = clamp((t - stopAt) / 0.4);
    // giran fluido y se atascan cuando la voz dice "traba"
    const run = (tt) => Math.min(tt, stopAt - t0) * 1.4;
    const shiver = jam > 0 ? Math.sin(t * 60) * 0.025 * (1 - clamp((t - stopAt - 0.6) / 1.2)) : 0;
    const ang = run(lt) + shiver;
    const g = [{ x: -0.36, y: 0.08, r: 0.42, n: 12, d: 1 }, { x: 0.43, y: -0.2, r: 0.3, n: 9, d: -12 / 9 }];
    const sh = MC.shake(t, 9 * jam * (1 - clamp((t - stopAt - 0.3) / 0.9)), "gear", 14);
    { const sg = ctx.createRadialGradient(cx, cy + s * 0.62, 0, cx, cy + s * 0.62, s * 0.8); sg.addColorStop(0, rgba(C.ink, 0.16 * a)); sg.addColorStop(1, rgba(C.ink, 0));
      ctx.fillStyle = sg; ctx.beginPath(); ctx.ellipse(cx, cy + s * 0.62, s * 0.8, s * 0.09, 0, 0, Math.PI * 2); ctx.fill(); }
    ctx.save(); ctx.translate(sh.x, sh.y); ctx.rotate(sh.r); ctx.globalAlpha = a; ctx.lineWidth = 3 * u; ctx.lineJoin = "round";
    g.forEach((q, i) => {
      ctx.save(); ctx.translate(cx + q.x * s, cy + q.y * s); ctx.rotate(ang * q.d + (i ? 0.17 : 0));
      for (let k = 6; k >= 1; k--) { ctx.save(); ctx.translate(k * 2.2 * u, k * 2.2 * u); ctx.strokeStyle = rgba(jam > 0 && i ? C.red : C.ink, 0.07); gearPath(ctx, q.r * s, q.n); ctx.stroke(); ctx.restore(); }
      ctx.fillStyle = C.bg; gearPath(ctx, q.r * s, q.n); ctx.fill();
      ctx.strokeStyle = jam > 0 && i ? C.red : C.ink; gearPath(ctx, q.r * s, q.n); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, q.r * s * 0.28, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    });
    ctx.restore();
    if (jam > 0) { // onda de choque
      const k = clamp((t - stopAt) / 0.8); ctx.save(); ctx.strokeStyle = rgba(C.red, 0.5 * (1 - k)); ctx.lineWidth = 2 * u;
      ctx.beginPath(); ctx.arc(cx + 0.06 * s, cy - 0.1 * s, 30 * u + k * 180 * u, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
    if (jam > 0) { const p = pop(t, stopAt + 0.05, 0.5); ctx.save(); ctx.translate(cx + 0.06 * s, cy - 0.1 * s); ctx.scale(p, p);
      ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(0, 0, 30 * u, 0, Math.PI * 2); ctx.fill();
      font(ctx, SANS, 36 * u, 700); ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("!", 0, 2 * u); ctx.restore(); }
  }
  function target(ctx, cx, cy, r, t, t0) { // diana 3D inclinada que oscila; flechas que vienen hacia ella y fallan
    const u = MC.L.u, a = seg(t, t0, t0 + 0.7, E.outCubic);
    const tilt = 0.5 + 0.22 * Math.sin(t * 1.3), ry = Math.cos(tilt), dx = noise1(t * 0.8, "tg-x") * r * 0.3, dy = noise1(t * 0.8, "tg-y") * r * 0.12;
    const X = cx + dx, Y = cy + dy, depth = 26 * u * Math.sin(tilt) + 8 * u;
    ctx.save(); ctx.globalAlpha = a; ctx.translate(X, Y); ctx.scale(0.85 + 0.15 * a, 0.85 + 0.15 * a);
    // sombra en el piso
    const sg = ctx.createRadialGradient(0, r * 1.25, 0, 0, r * 1.25, r * 1.1); sg.addColorStop(0, rgba(C.ink, 0.18)); sg.addColorStop(1, rgba(C.ink, 0));
    ctx.fillStyle = sg; ctx.beginPath(); ctx.ellipse(0, r * 1.25, r * 1.1, r * 0.18, 0, 0, Math.PI * 2); ctx.fill();
    // canto (volumen)
    ctx.fillStyle = "#D9D3C7"; ctx.beginPath(); ctx.ellipse(0, depth, r, r * ry, 0, 0, Math.PI); ctx.lineTo(-r, 0); ctx.ellipse(0, 0, r, r * ry, 0, Math.PI, 0, true); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgba(C.ink, 0.35); ctx.lineWidth = 1.5 * u; ctx.beginPath(); ctx.ellipse(0, depth, r, r * ry, 0, 0, Math.PI); ctx.stroke();
    // cara con anillos
    const fg = ctx.createLinearGradient(0, -r, 0, r); fg.addColorStop(0, "#FFFFFF"); fg.addColorStop(1, "#EFEAE0");
    ctx.fillStyle = fg; ctx.beginPath(); ctx.ellipse(0, 0, r, r * ry, 0, 0, Math.PI * 2); ctx.fill();
    [1, 0.78, 0.56, 0.34].forEach((kk, i) => { ctx.strokeStyle = rgba(C.ink, 0.25 + i * 0.15); ctx.lineWidth = (i ? 1.8 : 2.5) * u; ctx.beginPath(); ctx.ellipse(0, 0, r * kk, r * kk * ry, 0, 0, Math.PI * 2); ctx.stroke(); });
    ctx.save(); ctx.shadowColor = rgba(C.red, 0.5); ctx.shadowBlur = 24 * u; ctx.fillStyle = C.red; ctx.beginPath(); ctx.ellipse(0, 0, r * 0.14, r * 0.14 * ry, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    // flechas: llegan desde la cámara (grandes → pequeñas) y se clavan lejos del centro
    [[-0.86, -0.4, 0.0], [0.82, 0.55, 0.32], [-0.5, 0.86, 0.64]].forEach(([fx, fy, d], i) => {
      const k = seg(t, t0 + 0.3 + d, t0 + 0.65 + d, E.inCubic); if (k <= 0) return;
      const ex = fx * r, ey = fy * r * ry, sc = lerp(3.2, 1, k), sx = ex + (fx < 0 ? -1 : 1) * r * 1.6 * (1 - k), sy = ey + r * 1.4 * (1 - k);
      const ang = Math.atan2(r * 1.4, (fx < 0 ? -1 : 1) * r * 1.6), len = 120 * u * sc * (0.55 + 0.45 * (1 - k * 0.6));
      const hit = t >= t0 + 0.65 + d, wob = hit ? Math.sin((t - t0 - 0.65 - d) * 40) * 0.06 * Math.exp(-(t - t0 - 0.65 - d) * 5) : 0;
      ctx.save(); ctx.translate(sx, sy); ctx.rotate(ang + wob); ctx.globalAlpha *= Math.min(1, k * 3);
      ctx.strokeStyle = C.ink; ctx.lineWidth = 3 * u * sc * 0.6; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(len, 0); ctx.stroke();
      ctx.fillStyle = C.red; [-1, 1].forEach((sd) => { ctx.beginPath(); ctx.moveTo(len * 0.78, 0); ctx.lineTo(len, sd * 16 * u * sc * 0.6); ctx.lineTo(len * 0.95, 0); ctx.fill(); });
      ctx.restore();
      if (hit) { const kk = clamp((t - t0 - 0.65 - d) / 0.6); ctx.strokeStyle = rgba(C.ink, 0.4 * (1 - kk)); ctx.lineWidth = 1.5 * u; ctx.beginPath(); ctx.ellipse(ex, ey, 10 * u + kk * 50 * u, (10 * u + kk * 50 * u) * ry, 0, 0, Math.PI * 2); ctx.stroke(); }
    });
    ctx.restore();
  }
  function sphere(ctx, x, y, r, col) {
    const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r);
    if (col === "red") { g.addColorStop(0, "#F07A62"); g.addColorStop(0.55, C.red); g.addColorStop(1, "#6E1206"); }
    else { g.addColorStop(0, "#8A8F92"); g.addColorStop(0.55, "#2B2E30"); g.addColorStop(1, "#0B0C0D"); }
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  function funnel(ctx, cx, cy, s, t, t0) { // embudo 3D (cono con perspectiva) donde las esferas se atascan
    const u = MC.L.u, a = seg(t, t0, t0 + 0.6, E.outCubic), top = cy - s * 0.42, neck = cy + s * 0.14, bot = cy + s * 0.5, wTop = s * 0.58, wNeck = s * 0.075, e = 0.24;
    ctx.save(); ctx.globalAlpha = a; ctx.lineWidth = 2.5 * u;
    // sombra
    const sg = ctx.createRadialGradient(cx, bot + 30 * u, 0, cx, bot + 30 * u, s * 0.4); sg.addColorStop(0, rgba(C.ink, 0.16)); sg.addColorStop(1, rgba(C.ink, 0));
    ctx.fillStyle = sg; ctx.beginPath(); ctx.ellipse(cx, bot + 30 * u, s * 0.4, s * 0.06, 0, 0, Math.PI * 2); ctx.fill();
    // interior del cono (parte de atrás) con sombreado
    const gi = ctx.createLinearGradient(cx - wTop, 0, cx + wTop, 0); gi.addColorStop(0, "#D8D2C6"); gi.addColorStop(0.5, "#F4F0E8"); gi.addColorStop(1, "#CFC8BA");
    ctx.fillStyle = gi; ctx.beginPath(); ctx.ellipse(cx, top, wTop, wTop * e, 0, Math.PI, 0); ctx.lineTo(cx + wNeck, neck); ctx.ellipse(cx, neck, wNeck, wNeck * e, 0, 0, Math.PI); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgba(C.ink, 0.35); ctx.beginPath(); ctx.ellipse(cx, top, wTop, wTop * e, 0, Math.PI, 0); ctx.stroke();
    // tubo
    const gt = ctx.createLinearGradient(cx - wNeck, 0, cx + wNeck, 0); gt.addColorStop(0, "#BDB5A6"); gt.addColorStop(0.5, "#F2EEE6"); gt.addColorStop(1, "#B3AB9B");
    ctx.fillStyle = gt; ctx.fillRect(cx - wNeck, neck, wNeck * 2, bot - neck);
    // esferas
    const r = rng("funnel"), N = 46, rad = 13 * u;
    const balls = [];
    for (let i = 0; i < N; i++) {
      const spawn = t0 + 0.1 + i * 0.03, k = t - spawn; const sx = cx + (r() - 0.5) * wTop * 1.4, jit = r(); if (k <= 0) continue;
      const row = Math.floor(Math.sqrt(i * 1.6)), inRow = i - Math.floor((row * row) / 1.6), yStack = neck - rad * 1.2 - row * rad * 1.9;
      const half = wNeck + (neck - yStack) * (wTop - wNeck) / (neck - top) - rad * 1.3, cols = Math.max(1, Math.floor((half * 2) / (rad * 2.15)));
      const xs = cx - half + rad + ((inRow % cols) + 0.5) * ((half * 2 - rad * 2) / cols) + (jit - 0.5) * 4 * u;
      const passes = i % 9 === 0, fall = top - s * 0.3 + 1500 * u * k * k;
      let x, y;
      if (passes) { y = Math.min(fall, bot + s * 0.25); x = lerp(sx, cx, clamp((y - top) / (neck - top))); if (y > bot + s * 0.2) continue; }
      else { y = Math.min(fall, yStack); x = lerp(sx, xs, clamp((y - (top - s * 0.3)) / (yStack - (top - s * 0.3)))); }
      balls.push([x, y, passes ? "red" : "ink"]);
    }
    balls.sort((p, q) => p[1] - q[1]).forEach(([x, y, c]) => sphere(ctx, x, y, rad, c));
    // frente del cono: bordes y aro superior delantero
    ctx.strokeStyle = C.ink; ctx.lineWidth = 3 * u;
    ctx.beginPath(); ctx.moveTo(cx - wTop, top); ctx.lineTo(cx - wNeck, neck); ctx.lineTo(cx - wNeck, bot); ctx.moveTo(cx + wTop, top); ctx.lineTo(cx + wNeck, neck); ctx.lineTo(cx + wNeck, bot); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(cx, top, wTop, wTop * e, 0, 0, Math.PI); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(cx, bot, wNeck, wNeck * e, 0, 0, Math.PI * 2); ctx.stroke();
    // brillo del aro
    ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 2 * u; ctx.beginPath(); ctx.ellipse(cx, top + 3 * u, wTop * 0.96, wTop * e * 0.9, 0, 0.3, Math.PI - 0.3); ctx.stroke();
    ctx.restore();
  }

  // ── Escenas ───────────────────────────────────────────────────────────
  const order = ["p1", "p2", "p3", "p4", "g1", "g2", "r1", "r2", "r3", "c1", "c2"];
  const S = {};
  const Lx = () => { const { W, H, u, portrait } = MC.L; return { W, H, u, portrait, m: (portrait ? 70 : 150) * u, colW: portrait ? W - 140 * u : W * 0.5 }; };

  // Pregunta + ilustración (escenas del problema)
  function problem(id, num, words, art) {
    return (ctx, lt, dur, L, t) => {
      bg(ctx, t); const { W, H, u, portrait, m, colW } = Lx(), t0 = LN(id).start - 0.15;
      const cam = 1 + 0.03 * seg(t, t0, t0 + dur + 0.5, E.linear);
      ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(cam, cam); ctx.translate(-W / 2, -H / 2);
      const ty = portrait ? H * 0.22 : H * 0.36;
      label(ctx, num, m, ty - (portrait ? 70 : 80) * u, { color: C.red, alpha: seg(t, t0, t0 + 0.4) });
      headline(ctx, words, m, ty + (portrait ? 40 : 40) * u, { size: portrait ? 112 : 100, maxW: colW, t: t, t0: t0 + 0.05 });
      if (portrait) art(ctx, W / 2, H * 0.62, Math.min(W * 0.8, 760 * u), t, t0);
      else art(ctx, W * 0.76, H * 0.52, 640 * u, t, t0);
      ctx.restore(); chrome(ctx, t, id);
    };
  }
  S.p1 = problem("p1", "01 — Facturación", [{ t: "¿Tu" }, { t: "empresa" }, { t: "no" }, { t: "está" }, { t: "facturando", red: true, under: true }, { t: "lo" }, { t: "que" }, { t: "debería?" }],
    (ctx, x, y, s, t, t0) => chart(ctx, x, y, s, s * 0.62, t, t0 + 0.3));
  S.p2 = problem("p2", "02 — Operación", [{ t: "¿Tu" }, { t: "operación" }, { t: "se" }, { t: "traba", red: true, it: true, at: at("p2", "traba") }, { t: "a" }, { t: "cada" }, { t: "paso?" }],
    (ctx, x, y, s, t, t0) => gears(ctx, x - s * 0.04, y, s * (MC.L.portrait ? 0.62 : 0.72), t, t0));
  S.p3 = problem("p3", "03 — Metas", [{ t: "¿No" }, { t: "tienes" }, { t: "claras" }, { t: "tus" }, { t: "metas?", red: true, under: true }],
    (ctx, x, y, s, t, t0) => target(ctx, x, y, s * 0.42, t, t0));
  S.p4 = problem("p4", "04 — Cuellos de botella", [{ t: "¿Cuellos", red: true, it: true }, { t: "de", red: true, it: true }, { t: "botella", red: true, it: true }, { t: "a" }, { t: "cada" }, { t: "rato?" }],
    (ctx, x, y, s, t, t0) => funnel(ctx, x, y, s * 0.95, t, t0));

  S.g1 = (ctx, lt, dur, L, t) => {
    bg(ctx, t); const { W, H, u, portrait, m } = Lx(), t0 = LN("g1").start - 0.1, maxW = W - 2 * m;
    const strike = at("g1", "otra") + 0.45;
    headline(ctx, [{ t: "La" }, { t: "solución" }, { t: "no" }, { t: "siempre" }, { t: "es" }, { t: "otra", strike }, { t: "herramienta.", strike: strike + 0.1 }],
      portrait ? m : W / 2, portrait ? H * 0.4 : H * 0.45, { size: portrait ? 112 : 112, maxW: portrait ? maxW : W * 0.72, t, t0, align: portrait ? "left" : "center", color: C.ink2 });
    chrome(ctx, t, "g1");
  };
  S.g2 = (ctx, lt, dur, L, t) => {
    bg(ctx, t); const { W, H, u, portrait, m } = Lx(), t0 = LN("g2").start - 0.1, maxW = W - 2 * m;
    const pc = at("g2", "persona");
    const zoom = 1 + 0.04 * seg(t, t0, t0 + 4, E.linear);
    ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(zoom, zoom); ctx.translate(-W / 2, -H / 2);
    headline(ctx, [{ t: "Es" }, { t: "tener" }, { t: "en" }, { t: "tu" }, { t: "equipo" }, { t: "a" }, { t: "la" }, { t: "persona", it: true, red: true, at: pc }, { t: "correcta.", it: true, red: true, under: true, at: pc + 0.25 }],
      portrait ? m : W / 2, portrait ? H * 0.4 : H * 0.45, { size: portrait ? 124 : 124, maxW: portrait ? maxW : W * 0.78, t, t0, align: portrait ? "left" : "center" });
    ctx.restore(); chrome(ctx, t, "g2");
  };

  S.r1 = (ctx, lt, dur, L, t) => {
    bg(ctx, t); const { W, H, u, portrait, m } = Lx(), t0 = LN("r1").start - 0.2;
    const ph = portrait ? 380 * u : 380 * u, px = portrait ? m + ph / 2 + 14 * u : W * 0.24, py = portrait ? H * 0.25 : H * 0.48;
    const pa = seg(t, t0, t0 + 0.8, E.outCubic), ring = seg(t, t0 + 0.2, t0 + 1.4, E.inOutCubic);
    ctx.save(); ctx.globalAlpha = pa; ctx.translate(px, py); const sc = 0.92 + 0.08 * pa; ctx.scale(sc, sc);
    ctx.save(); ctx.shadowColor = rgba(C.ink, 0.28); ctx.shadowBlur = 50 * u; ctx.shadowOffsetY = 24 * u; ctx.fillStyle = C.bg; ctx.beginPath(); ctx.arc(0, 0, ph / 2, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.arc(0, 0, ph / 2, 0, Math.PI * 2); ctx.clip();
    const im = MC.IMG.foto; if (im) { const k = Math.max(ph / im.width, ph / im.height) * (1.06 - 0.04 * seg(t, t0, t0 + 6, E.linear)); ctx.drawImage(im, -im.width * k / 2, -im.height * k / 2, im.width * k, im.height * k); }
    ctx.restore();
    ctx.strokeStyle = C.red; ctx.lineWidth = 3 * u; ctx.beginPath(); ctx.arc(0, 0, ph / 2 + 14 * u, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ring); ctx.stroke();
    ctx.save(); ctx.rotate(t * 0.25); ctx.setLineDash([3 * u, 14 * u]); ctx.strokeStyle = rgba(C.ink, 0.45 * ring); ctx.lineWidth = 2 * u;
    ctx.beginPath(); ctx.arc(0, 0, ph / 2 + 38 * u, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
    ctx.restore();
    const tx = portrait ? m : W * 0.42, colW = portrait ? W - 2 * m : W * 0.5;
    let ty = portrait ? H * 0.5 : H * 0.38;
    label(ctx, "Soy", tx, ty - 110 * u, { color: C.red, alpha: seg(t, t0 + 0.2, t0 + 0.6) });
    headline(ctx, "Rodrigo Páez Parra", tx, ty + 20 * u, { size: portrait ? 118 : 118, maxW: colW, t, t0: at("r1", "rodrigo") - 0.05, stagger: 0.1 });
    ty += (portrait ? 140 : 110) * u;
    const creds = [["Ingeniero Industrial", at("r1", "ingeniero")], ["Magíster en Administración Internacional", at("r1", "magíster")], ["Máster en Marketing, Dirección Comercial e IA Generativa", at("r1", "máster"), "En curso"]];
    creds.forEach(([s, ts, tag], i) => {
      const y = ty + i * 78 * u, a = seg(t, ts - 0.1, ts + 0.4, E.outCubic);
      hair(ctx, tx, y, colW, seg(t, ts - 0.2, ts + 0.5, E.inOutCubic), i ? C.line : C.ink);
      ctx.save(); ctx.globalAlpha = a; font(ctx, SANS, (portrait ? 30 : 28) * u, 500); ctx.fillStyle = C.ink2; ctx.textBaseline = "middle";
      const maxw = colW - (tag ? 150 * u : 0); let fs = (portrait ? 30 : 28) * u; if (ctx.measureText(s).width > maxw) { fs *= maxw / ctx.measureText(s).width; font(ctx, SANS, fs, 500); }
      ctx.fillText(s, tx, y + 39 * u + (1 - a) * 12 * u); const w = ctx.measureText(s).width; ctx.restore();
      if (tag) label(ctx, tag, tx + w + 18 * u, y + 40 * u, { color: C.red, alpha: a, size: 17 });
    });
    chrome(ctx, t, "r1");
  };

  S.r2 = (ctx, lt, dur, L, t) => {
    bg(ctx, t); const { W, H, u, portrait, m } = Lx(), t0 = LN("r2").start - 0.2;
    label(ctx, "Te ayudo a", m, portrait ? H * 0.15 : H * 0.2, { color: C.red, alpha: seg(t, t0, t0 + 0.4) });
    const items = [["01", "Medir", "tus metas con KPIs claros", at("r2", "medir")], ["02", "Optimizar", "tus procesos", at("r2", "optimizar")], ["03", "Crecer", "en ventas", at("r2", "crecer")]];
    const card = (x, y, w, h, n, a1, a2, ts) => { // tarjeta que gira al frente (rotación en X) con sombra que se proyecta
      const a = seg(t, ts - 0.12, ts + 0.5, E.outCubic), on = t >= ts, k = Math.max(0.001, E.outBack(a, 1.3));
      if (a <= 0) { hair(ctx, x, y, w, 1, C.line); return; }
      ctx.save(); ctx.globalAlpha = a * 0.5; const sg = ctx.createLinearGradient(0, y + h, 0, y + h + 40 * u); sg.addColorStop(0, rgba(C.ink, 0.16)); sg.addColorStop(1, rgba(C.ink, 0));
      ctx.fillStyle = sg; ctx.beginPath(); ctx.moveTo(x + 10 * u, y + h); ctx.lineTo(x + w - 10 * u, y + h); ctx.lineTo(x + w + 20 * u * (1 - a) + 14 * u, y + h + 40 * u); ctx.lineTo(x + 24 * u, y + h + 40 * u); ctx.fill(); ctx.restore();
      ctx.save(); ctx.translate(0, y + h); ctx.transform(1, 0, (1 - a) * -0.3, k, 0, 0); ctx.translate(0, -(y + h)); ctx.globalAlpha = a;
      ctx.shadowColor = rgba(C.ink, 0.14); ctx.shadowBlur = 40 * u; ctx.shadowOffsetY = 18 * u;
      ctx.fillStyle = "#FFFFFF"; MC.rrect(ctx, x, y, w, h, 6 * u); ctx.fill(); ctx.shadowColor = "transparent";
      ctx.fillStyle = on ? C.red : C.line; ctx.fillRect(x, y, w * seg(t, ts, ts + 0.6, E.inOutCubic), 3 * u);
      label(ctx, n, x + 28 * u, y + 44 * u, { color: on ? C.red : C.ink3 });
      font(ctx, SERIF, (portrait ? 118 : 104) * u); ctx.fillStyle = C.ink; ctx.textBaseline = "alphabetic"; ctx.fillText(a1, x + 28 * u, y + h * 0.62, w - 56 * u);
      font(ctx, SANS, (portrait ? 32 : 27) * u, 500); ctx.fillStyle = C.ink2; ctx.fillText(a2, x + 28 * u, y + h * 0.62 + (portrait ? 58 : 50) * u, w - 56 * u);
      ctx.restore();
    };
    if (portrait) { const w = W - 2 * m, h = 280 * u; items.forEach(([n, a1, a2, ts], i) => card(m, H * 0.22 + i * (h + 50 * u), w, h, n, a1, a2, ts)); }
    else { const gap = 30 * u, w = (W - 2 * m - gap * 2) / 3, h = H * 0.36; items.forEach(([n, a1, a2, ts], i) => card(m + i * (w + gap), H * 0.32, w, h, n, a1, a2, ts)); }
    chrome(ctx, t, "r2");
  };

  const fmtN = (n) => Math.round(n).toLocaleString("es-CO");
  function stat(ctx, x, y, t, ts, big, sub, o = {}) {
    const u = MC.L.u, a = seg(t, ts - 0.2, ts + 0.4, E.outCubic), k = seg(t, ts, ts + 1.4, E.outCubic);
    ctx.save(); ctx.globalAlpha = a; ctx.textBaseline = "alphabetic"; font(ctx, SERIF, o.size * u); ctx.fillStyle = o.red ? C.red : C.ink;
    ctx.fillText(big(k), x, y + (1 - a) * 20 * u);
    font(ctx, SANS, (o.sub ?? 30) * u, 500); ctx.fillStyle = C.ink2; ctx.fillText(sub, x, y + (o.sub ?? 30) * 2 * u); ctx.restore();
    hair(ctx, x, y - o.size * 0.95 * u, o.w, seg(t, ts - 0.3, ts + 0.5, E.inOutCubic), C.ink);
  }
  function bars(ctx, x, y, w, h, vals, labs, fmt, t, ts) { // dos barras que crecen (antes → después)
    const u = MC.L.u, max = Math.max(...vals), bw = w * 0.28;
    vals.forEach((v, i) => {
      const k = seg(t, ts + i * 0.35, ts + i * 0.35 + 1.1, E.outExpo), bh = h * (v / max) * k, bx = x + i * w * 0.5;
      if (bh > 1) { ctx.save(); ctx.fillStyle = rgba(C.ink, 0.1); ctx.beginPath(); ctx.moveTo(bx + bw, y); ctx.lineTo(bx + bw + bh * 0.45, y - 1); ctx.lineTo(bx + bw * 0.4 + bh * 0.45, y - 1); ctx.lineTo(bx, y); ctx.fill(); ctx.restore(); }
      ctx.save(); ctx.fillStyle = i ? C.red : rgba(C.ink, 0.18); if (i) { ctx.shadowColor = rgba(C.red, 0.35); ctx.shadowBlur = 24 * u; }
      ctx.fillRect(bx, y - bh, bw, bh); ctx.shadowBlur = 0;
      const dd = 14 * u * k; if (bh > 1) { ctx.fillStyle = i ? "#8E1A0B" : rgba(C.ink, 0.28); ctx.beginPath(); ctx.moveTo(bx + bw, y - bh); ctx.lineTo(bx + bw + dd, y - bh - dd * 0.6); ctx.lineTo(bx + bw + dd, y - dd * 0.6); ctx.lineTo(bx + bw, y); ctx.fill();
        ctx.fillStyle = i ? "#D9452D" : rgba(C.ink, 0.1); ctx.beginPath(); ctx.moveTo(bx, y - bh); ctx.lineTo(bx + dd, y - bh - dd * 0.6); ctx.lineTo(bx + bw + dd, y - bh - dd * 0.6); ctx.lineTo(bx + bw, y - bh); ctx.fill(); }
      ctx.restore();
      label(ctx, labs[i], bx, y + 26 * u, { alpha: k, size: 17 });
      ctx.save(); ctx.globalAlpha = k; font(ctx, SANS, 22 * u, 700); ctx.fillStyle = i ? C.red : C.ink2; ctx.textBaseline = "alphabetic";
      ctx.fillText(fmt(v * k), bx, y - bh - 12 * u); ctx.restore();
    });
    hair(ctx, x - 10 * u, y, w, seg(t, ts - 0.2, ts + 0.4), C.ink);
  }
  S.r3 = (ctx, lt, dur, L, t) => {
    bg(ctx, t); const { W, H, u, portrait, m } = Lx(), t0 = LN("r3").start - 0.2;
    label(ctx, "Resultados · 2023 – 2025", m, portrait ? H * 0.15 : H * 0.2, { color: C.red, alpha: seg(t, t0, t0 + 0.4) });
    headline(ctx, [{ t: "Ya" }, { t: "lo" }, { t: "he" }, { t: "hecho.", it: true, red: true }], m, portrait ? H * 0.24 : H * 0.3, { size: portrait ? 96 : 84, maxW: W, t, t0: t0 + 0.05 });
    const s1 = at("r3", "más"), s2 = at("r3", "241") - 0.3;
    if (portrait) {
      stat(ctx, m, H * 0.45, t, s1, (k) => "+" + fmtN(240 * k) + " %", "en capital comercializado", { size: 210, w: W - 2 * m, red: true });
      bars(ctx, W * 0.62, H * 0.5, W * 0.3, 230 * u, [1580, 5373], ["2023", "2025"], (v) => "$" + fmtN(v) + " MM", t, s1 + 0.3);
      bars(ctx, W * 0.62, H * 0.75, W * 0.3, 190 * u, [241, 994], ["2023", "2025"], fmtN, t, s2 + 0.5);
      stat(ctx, m, H * 0.7, t, s2, (k) => "241 → " + fmtN(lerp(241, 994, seg(t, at("r3", "994"), at("r3", "994") + 1.2, E.outCubic))), "clientes", { size: 170, w: W - 2 * m });
    } else {
      const cw = (W - 2 * m) / 2;
      stat(ctx, m, H * 0.66, t, s1, (k) => "+" + fmtN(240 * k) + " %", "en capital comercializado", { size: 200, w: cw - 60 * u, red: true, sub: 28 });
      bars(ctx, m + cw * 0.62, H * 0.36, cw * 0.32, 150 * u, [1580, 5373], ["2023", "2025"], (v) => "$" + fmtN(v) + " MM", t, s1 + 0.3);
      bars(ctx, m + cw * 1.66, H * 0.36, cw * 0.3, 150 * u, [241, 994], ["2023", "2025"], fmtN, t, s2 + 0.5);
      stat(ctx, m + cw, H * 0.66, t, s2, (k) => "241 → " + fmtN(lerp(241, 994, seg(t, at("r3", "994"), at("r3", "994") + 1.2, E.outCubic))), "clientes", { size: 160, w: cw - 60 * u, sub: 28 });
    }
    chrome(ctx, t, "r3");
  };

  S.c1 = (ctx, lt, dur, L, t) => {
    bg(ctx, t); const { W, H, u, portrait, m } = Lx(), t0 = LN("c1").start - 0.1, maxW = portrait ? W - 2 * m : W * 0.8;
    const x = portrait ? m : W / 2, al = portrait ? "left" : "center", zoom = 1 + 0.05 * seg(t, t0, t0 + 2.2, E.linear);
    ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(zoom, zoom); ctx.translate(-W / 2, -H / 2);
    headline(ctx, [{ t: "Me" }, { t: "sumo" }, { t: "a" }, { t: "tu" }, { t: "equipo.", it: true, red: true, under: true }], x, portrait ? H * 0.47 : H * 0.53, { size: portrait ? 150 : 150, maxW, t, t0, align: al, stagger: 0.08 });
    ctx.restore(); chrome(ctx, t, "c1");
  };
  S.c2 = (ctx, lt, dur, L, t) => {
    bg(ctx, t); const { W, H, u, portrait, m } = Lx(), t0 = LN("c2").start - 0.1, cx = W / 2;
    const cv = at("c2", "conversemos"), maxW = portrait ? W - 2 * m : W * 0.78;
    const hl = headline(ctx, [{ t: "Si" }, { t: "buscas" }, { t: "a" }, { t: "alguien" }, { t: "que" }, { t: "sume" }, { t: "a" }, { t: "tu" }, { t: "equipo," },
      { t: "conversemos.", it: true, red: true, under: true, at: cv }], cx, portrait ? H * 0.34 : H * 0.36, { size: portrait ? 104 : 104, maxW, t, t0, align: "center", stagger: 0.07 });
    // punto rojo con anillos que se expanden al decir «conversemos»
    const last = hl.items[hl.items.length - 1];
    if (last && last.x !== undefined) { const dx = last.x + last.w + 22 * u, dy = last.y - 22 * u, dk = pop(t, cv + 0.35, 0.6, 2.2);
      ctx.save(); ctx.shadowColor = rgba(C.red, 0.6); ctx.shadowBlur = 30 * u; ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(dx, dy, 12 * u * dk, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      [0, 0.18, 0.36].forEach((d) => { const k = clamp((t - cv - 0.4 - d) / 1.3); if (k <= 0 || k >= 1) return;
        ctx.strokeStyle = rgba(C.red, 0.5 * (1 - k)); ctx.lineWidth = 2 * u; ctx.beginPath(); ctx.arc(dx, dy, 12 * u + E.outCubic(k) * 220 * u, 0, Math.PI * 2); ctx.stroke(); }); }
    const a2 = seg(t, cv + 0.5, cv + 1.1, E.outCubic), y2 = (portrait ? H * 0.34 : H * 0.36) + hl.h + 40 * u;
    hair(ctx, cx - 280 * u, y2, 560 * u, a2, C.ink);
    ctx.save(); ctx.globalAlpha = a2; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    font(ctx, SERIF, 64 * u); ctx.fillStyle = C.ink; ctx.fillText("Rodrigo Páez Parra", cx, y2 + 70 * u);
    font(ctx, SANS, 26 * u, 500); ctx.fillStyle = C.ink2; ctx.fillText("Ingeniero Industrial · Magíster en Administración Internacional", cx, y2 + 130 * u, W - 2 * m);
    ctx.restore();
    chrome(ctx, t, "c2");
  };

  // Tiempos: cada escena empieza un poco antes de su línea de voz
  const scenes = order.map((id, i) => {
    const start = i === 0 ? 0 : LN(id).start - 0.25, end = i < order.length - 1 ? LN(order[i + 1]).start - 0.25 : V.duration;
    const CUBE = ["p2", "p3", "p4", "g2", "r2", "r3", "c2"];
    const TIN = { g1: { type: "cut" }, r1: { type: "circle", dur: 0.5 }, c1: { type: "cut" } };
    const draw = CUBE.includes(id) ? with3D(id, order[i - 1], S[id]) : S[id];
    return { id, start, end, draw, tin: i ? (TIN[id] ?? { type: "cut" }) : undefined };
  });

  MC.start({
    brand: B, style: B.style, duration: V.duration, scenes, words: [], captions: false, motionBlur: { samples: 4, shutter: 0.25 },
    images: B.images, defaultFormat: "horizontal",
    voice: (V.tracks ?? V.lines).filter((l) => l.src).map((l) => ({ src: l.src, start: l.start })),
    score(oc, out, K) {
      // Música sobria: tensión en menor durante el problema, se abre en mayor desde "la persona correcta".
      const bpm = 92, beat = 60 / bpm, bar = beat * 4, D = V.duration, turn = LN("g2").start - 0.3;
      const minor = [[45, [57, 60, 64]], [41, [57, 60, 65]], [43, [55, 59, 62]], [40, [56, 59, 64]]];
      const major = [[48, [60, 64, 67]], [43, [59, 62, 67]], [45, [57, 60, 64]], [41, [57, 60, 65]]];
      const bus = oc.createGain(); bus.gain.value = 0.55; bus.connect(out);
      for (let b = 0, t0 = 0; t0 < D - 0.5; b++, t0 += bar) {
        const isMaj = t0 >= turn - 0.01, prog = isMaj ? major : minor, [root, ch] = prog[b % 4];
        K.pad(oc, bus, t0, ch.map((n) => n - 12), bar, 0.03);
        K.bass(oc, bus, t0, root - 12, beat * 1.8, 0.07);
        if (isMaj) for (let k = 0; k < 8; k++) K.pluck(oc, bus, t0 + k * beat / 2, ch[[0, 1, 2, 1, 2, 1, 0, 2][k]] + 12, 0.4, 0.018);
        else for (let k = 0; k < 4; k++) K.pluck(oc, bus, t0 + k * beat, ch[k % 3] + 12, 0.6, 0.012);
        if (t0 >= turn) for (let k = 0; k < 4; k++) K.kick(oc, bus, t0 + k * beat, k % 2 ? 0.05 : 0.09);
      }
      scenes.slice(1).forEach((s) => K.whoosh(oc, out, s.start - 0.2, 0.5, 0.025));
      K.ding(oc, out, at("r3", "más"), 0.04); K.ding(oc, out, at("r3", "994"), 0.04);
      K.kick(oc, out, LN("c2").start, 0.18);
      ACTS().forEach((T) => { K.whoosh(oc, out, T - 0.45, 0.9, 0.07); K.boom(oc, out, T, 0.08); });
      K.pop(oc, out, at("p2", "traba"), 0.06, 300);
    },
  });
})();
