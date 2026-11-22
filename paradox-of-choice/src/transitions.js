/* ==========================================================================
   transitions.js - full-screen choreographed transitions.
   Every transition COVERS the stage with the next slide's background color,
   so the covering shape literally becomes the next slide's canvas.
   cover() resolves when the screen is covered; clear() removes the layer.
   ========================================================================== */
(function () {
  const { C } = window.P;
  const W = 1920, H = 1080;

  function el(parent, css) {
    const d = document.createElement('div');
    Object.assign(d.style, css);
    parent.appendChild(d);
    return d;
  }
  const done = (tl) => new Promise((r) => tl.eventCallback('onComplete', r));

  const T = {
    /* vertical colour panels rising like a grid closing */
    panels(o, { to, dir }) {
      const n = 6, w = W / n, bars = [];
      for (let i = 0; i < n; i++) bars.push(el(o, { left: i * w - 1 + 'px', top: 0, width: w + 2 + 'px', height: H + 'px', background: to }));
      const tl = gsap.timeline();
      tl.fromTo(bars, { yPercent: dir > 0 ? 100 : -100 }, { yPercent: 0, duration: 0.75, ease: 'studio', stagger: { each: 0.06, from: dir > 0 ? 'end' : 'start' } });
      return done(tl);
    },

    /* layered colour sheets - the reference's stacked pills, at full scale */
    stack(o, { to, dir, layers }) {
      const cols = [...(layers || [C.yellow, C.pink]), to];
      const sheets = cols.map((c) => el(o, { left: 0, top: 0, width: W + 'px', height: H + 'px', background: c, borderRadius: '0' }));
      const from = dir > 0 ? -100 : 100;
      const tl = gsap.timeline();
      tl.fromTo(sheets, { xPercent: from, borderRadius: '0 540px 540px 0' }, { xPercent: 0, borderRadius: '0px 0px 0px 0px', duration: 0.85, ease: 'studio', stagger: 0.11 });
      return done(tl);
    },

    /* a single pill expands until it is the whole screen */
    pill(o, { to, origin = [W / 2, H / 2], label, labelColor }) {
      const [x, y] = origin;
      const p = el(o, { left: x - 130 + 'px', top: y - 70 + 'px', width: '260px', height: '140px', background: to, borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', fontFamily: 'var(--f-display)', fontWeight: 900, fontSize: '54px', color: labelColor || C.black, whiteSpace: 'nowrap' });
      if (label) p.textContent = label;
      const tl = gsap.timeline();
      tl.fromTo(p, { scale: 0 }, { scale: 1, duration: 0.42, ease: 'punch' })
        .to(p, { color: 'rgba(0,0,0,0)', duration: 0.15 }, 0.5)
        .to(p, { left: -60, top: -60, width: W + 120, height: H + 120, borderRadius: 0, duration: 0.85, ease: 'studio' }, 0.48);
      return done(tl);
    },

    /* circular iris that opens from a point */
    iris(o, { to, origin = [W / 2, H / 2] }) {
      const [x, y] = origin;
      const d = el(o, { left: 0, top: 0, width: W + 'px', height: H + 'px', background: to, clipPath: `circle(0px at ${x}px ${y}px)` });
      const ring = el(o, { left: x - 60 + 'px', top: y - 60 + 'px', width: '120px', height: '120px', borderRadius: '50%', border: `14px solid ${C.yellow}` });
      const tl = gsap.timeline();
      tl.fromTo(ring, { scale: 0 }, { scale: 22, duration: 0.95, ease: 'studio' }, 0)
        .to(d, { clipPath: `circle(2300px at ${x}px ${y}px)`, duration: 0.95, ease: 'studio' }, 0.08);
      return done(tl);
    },

    /* pills that snap into a grid of squares */
    grid(o, { to, accent = C.yellow }) {
      const cols = 8, rows = 5, w = W / cols, h = H / rows, tiles = [];
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++)
        tiles.push(el(o, { left: c * w - 1 + 'px', top: r * h - 1 + 'px', width: w + 2 + 'px', height: h + 2 + 'px', background: (r + c) % 3 === 0 ? accent : to, borderRadius: '999px' }));
      const tl = gsap.timeline();
      tl.fromTo(tiles, { scale: 0 }, { scale: 1, duration: 0.55, ease: 'punch', stagger: { each: 0.018, grid: [rows, cols], from: 'center' } })
        .to(tiles, { borderRadius: 0, duration: 0.35, ease: 'power2.inOut', stagger: { each: 0.01, grid: [rows, cols], from: 'center' } }, 0.25)
        .to(tiles, { backgroundColor: to, duration: 0.2 }, '>-0.15');
      return done(tl);
    },

    /* diagonal slab sweeping across */
    diagonal(o, { to, dir, accent = C.pink }) {
      const a = el(o, { left: '-600px', top: '-200px', width: W + 1200 + 'px', height: H + 400 + 'px', background: accent });
      const b = el(o, { left: '-600px', top: '-200px', width: W + 1200 + 'px', height: H + 400 + 'px', background: to });
      const sx = dir > 0 ? -1 : 1;
      const tl = gsap.timeline();
      tl.fromTo([a, b], { x: sx * (W + 1400), skewX: -18 }, { x: 0, skewX: -18, duration: 0.85, ease: 'studio', stagger: 0.12 });
      return done(tl);
    },

    /* horizontal blinds, alternating origins */
    blinds(o, { to }) {
      const n = 9, h = H / n, bars = [];
      for (let i = 0; i < n; i++) bars.push(el(o, { left: 0, top: i * h - 1 + 'px', width: W + 'px', height: h + 2 + 'px', background: to, transformOrigin: i % 2 ? '0% 50%' : '100% 50%' }));
      const tl = gsap.timeline();
      tl.fromTo(bars, { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'studio', stagger: { each: 0.045, from: 'center' } });
      return done(tl);
    },
  };

  function cover(o, type, opts) {
    o.innerHTML = '';
    return (T[type] || T.panels)(o, opts);
  }
  function clear(o) {
    gsap.killTweensOf(o.querySelectorAll('div'));
    o.innerHTML = '';
  }

  window.P.transitions = { cover, clear };
})();
