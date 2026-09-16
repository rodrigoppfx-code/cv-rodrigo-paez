/* <rpp-3d mode="field|signature|metrics|timeline" tone="light|dark"> — three.js scenes for the CV.
   Self-registering custom element. Requires global THREE (UMD build loaded in helmet). */
(function () {
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function waitThree(cb) {
    if (window.THREE) return cb(window.THREE);
    let n = 0;
    const t = setInterval(() => {
      if (window.THREE) { clearInterval(t); cb(window.THREE); }
      else if (++n > 200) clearInterval(t);
    }, 50);
  }

  const clean = (s, f) => (!s || s.indexOf('{{') !== -1 ? f : s);
  const hex = (s, f) => { try { return new window.THREE.Color(clean(s, f)); } catch (e) { return new window.THREE.Color(f); } };

  const PAL = {
    dark: {
      land: 0xa9c6de, grat: 0x6f90ad, core: 0x0d1721, field: 0x8fb0cc,
      bar: 0x203141, edge: 0x9fbdd6, solid: 0x1e2c38, floor: 0x0d1720, resin: 0x17161b,
      ink: '#f7f3ec', glow: 'rgba(4,10,16,.85)',
      amb: 0x9fb4c4, key: 0xfff2e0, fill: 0x4d7ea8, ambI: 0.55, keyI: 1.5
    },
    light: {
      land: 0x6d5a3c, grat: 0xb0996f, core: 0xf1e8d7, field: 0xa8926e,
      bar: 0xd3c3a4, edge: 0x8f7a53, solid: 0xc9b696, floor: 0xe6dac1, resin: 0x0f0e11,
      ink: '#2a241d', glow: 'rgba(250,246,239,.92)',
      amb: 0xfff6e6, key: 0xffffff, fill: 0xd8c39a, ambI: 0.95, keyI: 1.1
    }
  };

  /* Coarse land mask in lon/lat space — recognizable continents, not a survey map. */
  const LAND = [
    [-168, -140, 55, 71], [-140, -60, 50, 71], [-128, -66, 33, 50], [-118, -86, 23, 33], [-106, -86, 15, 23],
    [-92, -77, 8, 17], [-55, -20, 60, 83], [-80, -62, 17, 25],
    [-80, -46, -5, 11], [-79, -35, -20, -5], [-73, -40, -35, -20], [-73, -57, -50, -35], [-72, -66, -55, -50],
    [-17, 52, 12, 32], [-17, 43, 4, 12], [8, 42, -5, 4], [11, 40, -18, -5], [14, 35, -28, -18], [16, 32, -35, -28],
    [43, 50, -25, -12],
    [-10, 30, 36, 45], [-9, 40, 45, 55], [4, 40, 55, 62], [5, 30, 62, 71], [-11, -5, 50, 58],
    [26, 45, 36, 43], [35, 60, 25, 40], [45, 90, 40, 55], [55, 180, 50, 72], [60, 100, 28, 40],
    [68, 90, 8, 28], [95, 122, 20, 45], [100, 110, 8, 20], [126, 142, 31, 45], [95, 141, -10, 7], [118, 127, 5, 19],
    [113, 153, -38, -11], [166, 178, -47, -34]
  ];
  function isLand(lon, lat) {
    if (lat <= -64) return true;
    for (let i = 0; i < LAND.length; i++) {
      const b = LAND[i];
      if (lon >= b[0] && lon <= b[1] && lat >= b[2] && lat <= b[3]) return true;
    }
    return false;
  }

  class RPP3D extends HTMLElement {
    static get observedAttributes() { return ['variant', 'accent', 'intensity', 'tone']; }

    connectedCallback() {
      if (this._booted) return;
      this._booted = true;
      waitThree((T) => this.boot(T));
    }

    disconnectedCallback() { this._alive = false; if (this._ro) this._ro.disconnect(); if (this._io) this._io.disconnect(); }

    attributeChangedCallback(name, o, v) {
      if (!this._scene || o === v) return;
      if (name === 'variant') this.setVariant(parseInt(v, 10) || 0);
      if (name === 'accent' && v && v.indexOf('{{') === -1) this.applyAccent(v);
      if (name === 'tone' && v && v.indexOf('{{') === -1) this.rebuild();
    }

    get intensity() { return clean(this.getAttribute('intensity'), 'equilibrada'); }
    get speed() { const i = this.intensity; return REDUCED || i === 'off' ? 0 : i === 'sutil' ? 0.45 : i === 'expresiva' ? 1.7 : 1; }
    get tone() { return clean(this.getAttribute('tone'), 'light') === 'dark' ? 'dark' : 'light'; }
    get pal() { return PAL[this.tone]; }

    rebuild() {
      if (!this._T) return;
      const T = this._T;
      while (this._scene.children.length) this._scene.remove(this._scene.children[0]);
      this._pts = this._grp = this._bars = this._mesh = this._wire = null;
      this.addLights(T);
      this.buildScene(T);
      this._lastW = 0; this._lastH = 0;
      this.syncSize();
      if (this._visible) this.onEnter();
      this._renderer.render(this._scene, this._camera);
    }

    addLights(T) {
      const p = this.pal;
      this._scene.add(new T.AmbientLight(p.amb, p.ambI));
      const key = new T.DirectionalLight(p.key, p.keyI); key.position.set(3, 4, 5); this._scene.add(key);
      const rim = new T.DirectionalLight(hex(this._accent, '#8a6226').getHex(), 1.15); rim.position.set(-4, -1, 2); this._scene.add(rim);
      this._rim = rim;
      const fill = new T.PointLight(p.fill, 1.0, 22); fill.position.set(-2, 3, -4); this._scene.add(fill);
    }

    buildScene(T) {
      const m = this._mode;
      if (m === 'field') this.buildField();
      else if (m === 'metrics') this.buildMetrics();
      else if (m === 'timeline') this.buildTimeline();
      else this.buildSignature();
    }

    boot(T) {
      const mode = this.getAttribute('mode') || 'signature';
      const w = this.clientWidth || 320, h = this.clientHeight || 320;

      const renderer = new T.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
      renderer.setSize(w, h, false);
      const c = renderer.domElement;
      c.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
      this.appendChild(c);

      const scene = new T.Scene();
      const camera = new T.PerspectiveCamera(38, w / h, 0.1, 100);
      camera.position.set(0, 0, 6);

      this._T = T; this._renderer = renderer; this._scene = scene; this._camera = camera; this._mode = mode;
      this._accent = clean(this.getAttribute('accent'), '#8a6226');
      this._alive = true; this._visible = true; this._t = 0;

      this.addLights(T);
      this.buildScene(T);

      this._lastW = 0; this._lastH = 0;
      this._ro = new ResizeObserver(() => this.syncSize());
      this._ro.observe(this);

      this._io = new IntersectionObserver((es) => {
        es.forEach((e) => { this._visible = e.isIntersecting; if (e.isIntersecting) this.onEnter(); });
      }, { threshold: 0.08 });
      this._io.observe(this);

      this._px = 0; this._py = 0;
      if (mode === 'signature' || mode === 'timeline') {
        const move = (ev) => {
          const r = this.getBoundingClientRect();
          this._px = ((ev.clientX - r.left) / r.width - 0.5) * 2;
          this._py = ((ev.clientY - r.top) / r.height - 0.5) * 2;
        };
        this.addEventListener('pointermove', move);
        this.addEventListener('pointerleave', () => { this._px = 0; this._py = 0; });
      }

      const loop = () => {
        if (!this._alive) return;
        requestAnimationFrame(loop);
        if (!this._visible) return;
        this.syncSize();
        this._t += 0.016;
        this.tick(this._t);
        renderer.render(scene, camera);
      };
      this.syncSize();
      loop();
      renderer.render(scene, camera);
    }

    syncSize() {
      const W = this.clientWidth, H = this.clientHeight;
      if (!W || !H || (W === this._lastW && H === this._lastH)) return;
      this._lastW = W; this._lastH = H;
      this._renderer.setSize(W, H, false);
      this._camera.aspect = W / H;
      this._camera.updateProjectionMatrix();
    }

    applyAccent(v) {
      if (!this._T) return;
      this._accent = v;
      const col = hex(v, '#8a6226');
      if (this._rim) this._rim.color.copy(col);
      if (this._accentMats) this._accentMats.forEach((m) => m.color.copy(col));
    }

    /* ---------- field: lattice of points drifting behind the whole app ---------- */
    buildField() {
      const T = this._T;
      const g = new T.BufferGeometry();
      const cols = 46, rows = 26, pos = [];
      for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) pos.push((i / (cols - 1) - 0.5) * 22, (j / (rows - 1) - 0.5) * 12, 0);
      g.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
      this._base = Float32Array.from(pos);
      const m = new T.PointsMaterial({ color: this.pal.field, size: 0.035, transparent: true, opacity: 0.5, depthWrite: false });
      const pts = new T.Points(g, m);
      pts.rotation.x = -0.42;
      this._scene.add(pts);
      this._pts = pts;
      this._camera.position.set(0, 0, 9);
    }

    /* ---------- signature: RPP wordmark, slowly turning globe behind it ---------- */
    buildSignature() {
      const T = this._T, p = this.pal, R = 1.5;
      const grp = new T.Group();

      const pos = [];
      for (let lat = -88; lat <= 88; lat += 2.2) {
        const cs = Math.cos(lat * Math.PI / 180);
        const step = 2.2 / Math.max(0.22, cs);
        for (let lon = -180; lon <= 180; lon += step) {
          if (!isLand(lon, lat)) continue;
          const a = lat * Math.PI / 180, l = lon * Math.PI / 180;
          pos.push(R * Math.cos(a) * Math.cos(l), R * Math.sin(a), R * Math.cos(a) * Math.sin(l));
        }
      }
      const lg = new T.BufferGeometry();
      lg.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
      const land = new T.Points(lg, new T.PointsMaterial({
        color: p.land, size: 0.036, transparent: true, opacity: 0.9, depthWrite: false
      }));
      const graticule = new T.Mesh(
        new T.SphereGeometry(R, 36, 18),
        new T.MeshBasicMaterial({ color: p.grat, wireframe: true, transparent: true, opacity: 0.12, depthWrite: false })
      );
      const core = new T.Mesh(
        new T.SphereGeometry(R * 0.985, 48, 32),
        new T.MeshStandardMaterial({ color: p.core, metalness: 0.3, roughness: 0.66 })
      );

      const globe = new T.Group();
      globe.add(core, graticule, land);
      globe.rotation.z = 0.41;
      grp.add(globe, this.makeWordmark(T, R));

      this._scene.add(grp);
      this._grp = grp; this._globe = globe;
      this._accentMats = [];
      this._camera.position.set(0, 0, 5.6);
    }

    makeWordmark(T, R) {
      const p = this.pal;
      const cv = document.createElement('canvas');
      cv.width = 1024; cv.height = 360;
      const x = cv.getContext('2d');
      const letters = ['R', 'P', 'P'];
      x.font = '600 236px Jost, "Futura", system-ui, sans-serif';
      x.textAlign = 'center'; x.textBaseline = 'middle';
      const tracking = 40;
      const widths = letters.map((c) => x.measureText(c).width);
      const total = widths.reduce((a, b) => a + b, 0) + tracking * (letters.length - 1);
      let cx = (cv.width - total) / 2;
      x.shadowColor = p.glow; x.shadowBlur = 34;
      x.fillStyle = p.ink;
      letters.forEach((c, i) => { x.fillText(c, cx + widths[i] / 2, cv.height / 2); cx += widths[i] + tracking; });
      const tex = new T.CanvasTexture(cv);
      tex.anisotropy = 4;
      const w = R * 1.5;
      const plane = new T.Mesh(
        new T.PlaneGeometry(w, w * (cv.height / cv.width)),
        new T.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: false })
      );
      plane.position.z = R * 1.04;
      plane.renderOrder = 4;
      return plane;
    }

    /* ---------- metrics: four volumes that grow when scrolled into view ---------- */
    buildMetrics() {
      const T = this._T, p = this.pal;
      const vals = (this.getAttribute('values') || '1,0.62,0.4,0.72').split(',').map(Number);
      const grp = new T.Group();
      this._bars = [];
      const accent = hex(this._accent, '#8a6226');
      vals.forEach((v, i) => {
        const hgt = Math.max(0.35, v * 3.4);
        const mesh = new T.Mesh(
          new T.BoxGeometry(0.62, hgt, 0.62),
          new T.MeshStandardMaterial({
            color: i === 0 ? accent.clone() : new T.Color(p.bar),
            metalness: 0.55, roughness: 0.42, flatShading: true
          })
        );
        mesh.position.set((i - 1.5) * 1.15, hgt / 2, 0);
        mesh.userData.h = hgt;
        mesh.scale.y = 0.001;
        const edge = new T.LineSegments(
          new T.EdgesGeometry(mesh.geometry),
          new T.LineBasicMaterial({ color: p.edge, transparent: true, opacity: 0.4 })
        );
        mesh.add(edge);
        grp.add(mesh);
        this._bars.push(mesh);
      });
      const floor = new T.Mesh(
        new T.PlaneGeometry(6.6, 3.4),
        new T.MeshBasicMaterial({ color: p.floor, transparent: true, opacity: 0.5 })
      );
      floor.rotation.x = -Math.PI / 2;
      grp.add(floor);
      grp.position.y = -1.5;
      grp.rotation.y = -0.38;
      grp.rotation.x = 0.06;
      this._scene.add(grp);
      this._grp = grp;
      this._camera.position.set(0, 1.1, 8.4);
      this._camera.lookAt(0, 0, 0);
      this._grow = 0;
    }

    /* ---------- timeline: one object per experience, swapped on selection ---------- */
    buildTimeline() {
      const T = this._T, p = this.pal;
      this._geos = [
        new T.IcosahedronGeometry(1.45, 1),
        new T.TorusKnotGeometry(0.95, 0.3, 90, 12),
        new T.OctahedronGeometry(1.55, 0),
        new T.CylinderGeometry(1.05, 1.05, 1.6, 6, 1),
        new T.TorusGeometry(1.15, 0.38, 10, 32),
        new T.BoxGeometry(1.7, 1.7, 1.7)
      ];
      const mesh = new T.Mesh(
        this._geos[0],
        new T.MeshStandardMaterial({ color: p.solid, metalness: 0.6, roughness: 0.4, flatShading: true })
      );
      const wire = new T.Mesh(
        this._geos[0],
        new T.MeshBasicMaterial({ color: hex(this._accent, '#8a6226'), wireframe: true, transparent: true, opacity: 0.34 })
      );
      wire.scale.setScalar(1.18);
      const grp = new T.Group();
      grp.add(mesh, wire);
      this._scene.add(grp);
      this._grp = grp; this._mesh = mesh; this._wire = wire;
      this._accentMats = [wire.material];
      this._camera.position.set(0, 0, 6.6);
      this._swap = 1;
      this.setVariant(parseInt(this.getAttribute('variant') || '0', 10));
    }

    setVariant(i) {
      if (!this._geos || !this._mesh) return;
      const g = this._geos[i % this._geos.length];
      this._mesh.geometry = g; this._wire.geometry = g;
      this._swap = 0;
    }

    onEnter() { if (this._mode === 'metrics' && this._grow === 0) this._grow = 0.0001; }

    tick(t) {
      const s = this.speed, m = this._mode;
      if (m === 'field' && this._pts) {
        const p = this._pts.geometry.attributes.position, b = this._base;
        if (s > 0) {
          for (let i = 0; i < p.count; i++) {
            const x = b[i * 3], y = b[i * 3 + 1];
            p.array[i * 3 + 2] = Math.sin(x * 0.42 + t * 0.32 * s) * 0.5 + Math.cos(y * 0.55 - t * 0.21 * s) * 0.38;
          }
          p.needsUpdate = true;
        }
        this._pts.rotation.z = Math.sin(t * 0.045 * s) * 0.06;
      } else if (m === 'signature' && this._grp) {
        const sc = Math.min(1, (scrollY || 0) / 900);
        this._globe.rotation.y += 0.0024 * (s || 0.0001);
        this._grp.scale.setScalar(1 - sc * 0.1);
      } else if (m === 'metrics' && this._bars) {
        if (this._grow > 0 && this._grow < 1) this._grow = Math.min(1, this._grow + (s ? 0.022 * s : 1));
        const e = 1 - Math.pow(1 - this._grow, 3);
        this._bars.forEach((b, i) => {
          const d = Math.max(0, Math.min(1, (e - i * 0.07) / 0.72));
          b.scale.y = Math.max(0.001, d);
          b.position.y = (b.userData.h * b.scale.y) / 2;
        });
        this._grp.rotation.y = -0.38 + Math.sin(t * 0.12 * s) * 0.07;
      } else if (m === 'timeline' && this._grp) {
        if (this._swap < 1) this._swap = Math.min(1, this._swap + 0.06);
        this._grp.scale.setScalar(0.72 + 0.28 * this._swap);
        this._grp.rotation.y += 0.0042 * (s || 0.0001);
        this._grp.rotation.x = 0.22 + this._py * 0.22;
        this._wire.rotation.y -= 0.0026 * (s || 0.0001);
      }
    }
  }

  if (!customElements.get('rpp-3d')) customElements.define('rpp-3d', RPP3D);
})();
