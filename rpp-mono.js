/* <rpp-mono> — the real RPP mark, extruded in metal, turning very slowly.
   Geometry is TRACED from the brand PNG (no hand-authored letterforms):
   contours are extracted with marching squares, nested into shapes + holes,
   then extruded. Requires global THREE (UMD).
   Attributes: src, tone="light|dark", accent, motion="off|sutil|equilibrada". */
(function () {
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clean = (s, f) => (!s || s.indexOf('{{') !== -1 ? f : s);

  function waitThree(cb) {
    if (window.THREE) return cb(window.THREE);
    let n = 0;
    const t = setInterval(() => {
      if (window.THREE) { clearInterval(t); cb(window.THREE); }
      else if (++n > 240) clearInterval(t);
    }, 50);
  }

  /* ---- mask extraction ------------------------------------------------- */
  function masks(img) {
    const W = 520, H = Math.max(1, Math.round(img.height / img.width * 520));
    const cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    const cx = cv.getContext('2d', { willReadFrequently: true });
    cx.drawImage(img, 0, 0, W, H);
    const d = cx.getImageData(0, 0, W, H).data;
    const dark = new Uint8Array(W * H), red = new Uint8Array(W * H);
    for (let i = 0, p = 0; i < d.length; i += 4, p++) {
      const r = d[i], g = d[i + 1], b = d[i + 2], a = d[i + 3];
      if (a < 40) continue;
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      const isRed = r > 110 && r - Math.max(g, b) > 45;
      if (isRed) red[p] = 1;
      else if (lum < 128) dark[p] = 1;
    }
    return { dark, red, W, H };
  }

  /* ---- marching squares: trace every boundary loop --------------------- */
  function contours(mask, W, H) {
    const at = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? 0 : mask[y * W + x]);
    // corner grid: value = filled cell count around that lattice point
    const seen = new Set();
    const loops = [];
    const key = (x, y, dir) => x + ',' + y + ',' + dir;

    // walk edges of filled cells (square tracing on the pixel lattice)
    const edgeSeen = new Set();
    const ekey = (x1, y1, x2, y2) => x1 + ':' + y1 + '>' + x2 + ':' + y2;

    // collect boundary edges, oriented so filled is on the left
    const edges = new Map();
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        if (!at(x, y)) continue;
        if (!at(x, y - 1)) addEdge(x + 1, y, x, y);         // top
        if (!at(x + 1, y)) addEdge(x + 1, y + 1, x + 1, y); // right
        if (!at(x, y + 1)) addEdge(x, y + 1, x + 1, y + 1); // bottom
        if (!at(x - 1, y)) addEdge(x, y, x, y + 1);         // left
      }
    }
    function addEdge(x1, y1, x2, y2) {
      const k = x1 + ',' + y1;
      if (!edges.has(k)) edges.set(k, []);
      edges.get(k).push([x2, y2]);
    }

    edges.forEach((outs, k) => {
      outs.forEach((to) => {
        const from = k.split(',').map(Number);
        const ek = ekey(from[0], from[1], to[0], to[1]);
        if (edgeSeen.has(ek)) return;
        const loop = [];
        let cx = from[0], cy = from[1], nx = to[0], ny = to[1];
        let guard = 0;
        edgeSeen.add(ek);
        loop.push([cx, cy]);
        while (guard++ < 200000) {
          loop.push([nx, ny]);
          const nk = nx + ',' + ny;
          const cand = edges.get(nk);
          if (!cand) break;
          let picked = null;
          for (let i = 0; i < cand.length; i++) {
            const kk = ekey(nx, ny, cand[i][0], cand[i][1]);
            if (!edgeSeen.has(kk)) { picked = cand[i]; edgeSeen.add(kk); break; }
          }
          if (!picked) break;
          cx = nx; cy = ny; nx = picked[0]; ny = picked[1];
          if (nx === loop[0][0] && ny === loop[0][1]) { loop.push([nx, ny]); break; }
        }
        if (loop.length > 12) loops.push(loop);
      });
    });
    return loops;
  }

  function area(poly) {
    let a = 0;
    for (let i = 0, n = poly.length; i < n; i++) {
      const p = poly[i], q = poly[(i + 1) % n];
      a += p[0] * q[1] - q[0] * p[1];
    }
    return a / 2;
  }

  function simplify(poly, tol) {
    // Ramer–Douglas–Peucker on a closed ring
    const d2 = (p, a, b) => {
      const dx = b[0] - a[0], dy = b[1] - a[1];
      const L = dx * dx + dy * dy;
      if (!L) return (p[0] - a[0]) ** 2 + (p[1] - a[1]) ** 2;
      let t = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / L;
      t = Math.max(0, Math.min(1, t));
      const px = a[0] + t * dx - p[0], py = a[1] + t * dy - p[1];
      return px * px + py * py;
    };
    const rec = (pts, i, j, out) => {
      let idx = -1, max = 0;
      for (let k = i + 1; k < j; k++) {
        const dd = d2(pts[k], pts[i], pts[j]);
        if (dd > max) { max = dd; idx = k; }
      }
      if (max > tol * tol && idx > 0) { rec(pts, i, idx, out); rec(pts, idx, j, out); }
      else out.push(pts[j]);
    };
    if (poly.length < 5) return poly;
    const out = [poly[0]];
    rec(poly, 0, poly.length - 1, out);
    return out;
  }

  function inside(pt, poly) {
    let c = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
      if (((yi > pt[1]) !== (yj > pt[1])) && (pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi)) c = !c;
    }
    return c;
  }

  function buildShapes(T, mask, W, H, tol) {
    const loops = contours(mask, W, H)
      .map((l) => simplify(l, tol))
      .filter((l) => l.length > 3 && Math.abs(area(l)) > 24);
    loops.sort((a, b) => Math.abs(area(b)) - Math.abs(area(a)));

    const outers = [], holes = [];
    loops.forEach((l) => {
      const parent = outers.find((o) => inside(l[0], o));
      if (parent) holes.push({ ring: l, parent });
      else outers.push(l);
    });

    return outers.map((o) => {
      const s = new T.Shape();
      o.forEach((p, i) => (i ? s.lineTo(p[0], p[1]) : s.moveTo(p[0], p[1])));
      s.closePath();
      holes.filter((h) => h.parent === o).forEach((h) => {
        const p = new T.Path();
        h.ring.forEach((q, i) => (i ? p.lineTo(q[0], q[1]) : p.moveTo(q[0], q[1])));
        p.closePath();
        s.holes.push(p);
      });
      return s;
    });
  }

  class RPPMono extends HTMLElement {
    static get observedAttributes() { return ['tone', 'accent', 'motion']; }

    connectedCallback() {
      if (this._booted) return;
      this._booted = true;
      waitThree((T) => this.boot(T));
    }

    disconnectedCallback() {
      this._alive = false;
      if (this._ro) this._ro.disconnect();
      if (this._io) this._io.disconnect();
    }

    attributeChangedCallback(n, o, v) {
      if (!this._scene || o === v || !v || v.indexOf('{{') !== -1) return;
      if (n === 'tone') this.applyTone();
      if (n === 'accent') this.applyAccent();
    }

    get tone() { return clean(this.getAttribute('tone'), 'light') === 'dark' ? 'dark' : 'light'; }
    get motion() { return clean(this.getAttribute('motion'), 'sutil'); }
    get speed() { const m = this.motion; return REDUCED || m === 'off' ? 0 : m === 'equilibrada' ? 1 : 0.5; }

    boot(T) {
      const w = this.clientWidth || 360, h = this.clientHeight || 360;
      const renderer = new T.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
      renderer.setSize(w, h, false);
      renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
      this.appendChild(renderer.domElement);

      const scene = new T.Scene();
      const camera = new T.PerspectiveCamera(30, w / h, 0.05, 60);
      camera.position.set(0, 0, 9);

      this._T = T; this._renderer = renderer; this._scene = scene; this._camera = camera;
      this._alive = true; this._visible = true; this._t = 0; this._px = 0; this._py = 0;

      this.addLights(T);

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => { this.buildFrom(T, img); this.applyTone(); this.fit(); renderer.render(scene, camera); };
      img.onerror = () => { this._grp = new T.Group(); scene.add(this._grp); };
      img.src = clean(this.getAttribute('src'), 'brand/RPP_Logo_Negro.png');

      this._ro = new ResizeObserver(() => {
        const W = this.clientWidth || 1, Hh = this.clientHeight || 1;
        renderer.setSize(W, Hh, false); camera.aspect = W / Hh; camera.updateProjectionMatrix();
        this.fit();
      });
      this._ro.observe(this);

      this._io = new IntersectionObserver((es) => es.forEach((e) => { this._visible = e.isIntersecting; }), { threshold: 0.04 });
      this._io.observe(this);

      this.addEventListener('pointermove', (ev) => {
        const r = this.getBoundingClientRect();
        this._px = ((ev.clientX - r.left) / r.width - 0.5) * 2;
        this._py = ((ev.clientY - r.top) / r.height - 0.5) * 2;
      });
      this.addEventListener('pointerleave', () => { this._px = 0; this._py = 0; });

      const loop = () => {
        if (!this._alive) return;
        requestAnimationFrame(loop);
        if (!this._visible || !this._grp) return;
        this._t += 0.016;
        const s = this.speed;
        this._grp.rotation.y = 0.2 + Math.sin(this._t * 0.07 * s) * 0.2 + this._px * 0.12;
        this._grp.rotation.x = this._py * 0.07 + Math.sin(this._t * 0.05 * s) * 0.01;
        renderer.render(scene, camera);
      };
      loop();
    }

    buildFrom(T, img) {
      const { dark, red, W, H } = masks(img);
      const opts = { depth: 9, bevelEnabled: true, bevelThickness: 1.1, bevelSize: 1.0, bevelSegments: 3, curveSegments: 6 };

      const metal = new T.MeshStandardMaterial({ metalness: 0.9, roughness: 0.33 });
      const accent = new T.MeshStandardMaterial({ color: this.accentColor(), metalness: 0.45, roughness: 0.4 });
      this._metal = metal; this._accentMat = accent;

      const inner = new T.Group();
      const addSet = (shapes, mat, z) => {
        shapes.forEach((sh) => {
          const m = new T.Mesh(new T.ExtrudeGeometry(sh, opts), mat);
          m.position.z = z || 0;
          inner.add(m);
        });
      };
      addSet(buildShapes(T, dark, W, H, 1.1), metal, 0);
      addSet(buildShapes(T, red, W, H, 0.9), accent, -1.2);

      // PNG pixel space is y-down; flip, centre, then normalize to unit scale
      inner.scale.y = -1;
      let box = new T.Box3().setFromObject(inner);
      inner.position.sub(box.getCenter(new T.Vector3()));

      const norm = new T.Group();
      norm.add(inner);
      box = new T.Box3().setFromObject(norm);
      const span = box.getSize(new T.Vector3());
      const k = 2 / Math.max(0.001, span.y);
      norm.scale.setScalar(k);

      const grp = new T.Group();
      grp.add(norm);
      grp.rotation.y = 0.2;
      this._scene.add(grp);
      this._grp = grp;
      this._span = span.multiplyScalar(k);
    }

    addLights(T) {
      const sc = this._scene;
      this._hemi = new T.HemisphereLight(0xffffff, 0xd8d4cb, 0.85); sc.add(this._hemi);
      this._key = new T.DirectionalLight(0xffffff, 2.2); this._key.position.set(2.4, 3.4, 5.2); sc.add(this._key);
      this._rim = new T.DirectionalLight(0xffffff, 1.5); this._rim.position.set(-4.2, 1.5, -2.6); sc.add(this._rim);
      this._spec = new T.PointLight(0xffffff, 2.4, 30); this._spec.position.set(-2.2, -3, 6); sc.add(this._spec);
    }

    fit() {
      if (!this._span) return;
      const cam = this._camera;
      const vFov = cam.fov * Math.PI / 180;
      const needH = this._span.y * 1.55;
      const needW = this._span.x * 1.2;
      const dH = (needH / 2) / Math.tan(vFov / 2);
      const dW = (needW / 2) / Math.tan(vFov / 2) / Math.max(0.35, cam.aspect);
      cam.position.z = Math.min(Math.max(dH, dW, 3), 40);
      cam.updateProjectionMatrix();
    }

    accentColor() {
      const T = this._T || window.THREE;
      try { return new T.Color(clean(this.getAttribute('accent'), '#D12917')); } catch (e) { return new T.Color('#D12917'); }
    }

    applyAccent() { if (this._accentMat) this._accentMat.color.copy(this.accentColor()); }

    applyTone() {
      if (!this._metal) return;
      const dark = this.tone === 'dark';
      this._metal.color.set(dark ? 0xdad6cd : 0x2f3336);
      this._hemi.color.set(dark ? 0xbfc6cc : 0xffffff);
      this._hemi.groundColor.set(dark ? 0x101214 : 0xe2ded4);
      this._hemi.intensity = dark ? 0.5 : 0.85;
      this._key.intensity = dark ? 2.7 : 2.2;
      this._rim.intensity = dark ? 1.9 : 1.5;
      this._spec.intensity = dark ? 2.8 : 2.2;
      this.applyAccent();
    }
  }

  if (!customElements.get('rpp-mono')) customElements.define('rpp-mono', RPPMono);
})();
