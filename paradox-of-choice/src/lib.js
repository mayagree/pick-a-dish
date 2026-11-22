/* ==========================================================================
   lib.js - shared design-system primitives, hooks and helpers
   (React + htm, no build step; everything hangs off window.P)
   ========================================================================== */
(function () {
  const { useRef, useLayoutEffect, useImperativeHandle, Fragment } = React;
  const html = htm.bind(React.createElement);

  /* ---------- motion language: custom curves ---------- */
  gsap.registerPlugin(CustomEase);
  CustomEase.create('studio', 'M0,0 C0.72,0 0.16,1 1,1');          // strong in-out
  CustomEase.create('glide', 'M0,0 C0.14,0.9 0.26,1 1,1');          // long expo-like settle
  CustomEase.create('punch', 'M0,0 C0.12,0.66 0.22,1.2 0.5,1.06 0.7,0.97 0.84,1 1,1'); // overshoot
  CustomEase.create('whip', 'M0,0 C0.56,0 0.08,1 1,1');             // fast sweep
  gsap.defaults({ ease: 'glide', duration: 1 });

  const C = {
    orange: '#FF4500', yellow: '#FFC233', pink: '#EF3054', blue: '#3928FF',
    grey: '#CDD0D6', black: '#101010', white: '#FFFFFF',
  };

  /* ---------- deterministic randomness (layouts stay identical on replay) ---------- */
  function rng(seed) {
    let a = seed >>> 0;
    const next = () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    next.range = (min, max) => min + next() * (max - min);
    next.pick = (arr) => arr[Math.floor(next() * arr.length)];
    return next;
  }

  /* ---------- typography helpers ----------
     Hebrew letters are not joined, so splitting per-letter is safe.
     Each word is wrapped in a nowrap span so lines never break mid-word.
     Only split Hebrew this way - numbers/Latin go inside dir="ltr". */
  function Chars({ text, cls = 'ch' }) {
    const words = text.split(' ');
    return words.map((w, i) => html`<${Fragment} key=${i}><span className="word">${
      Array.from(w).map((c, j) => html`<span key=${j} className=${cls}>${c}</span>`)
    }</span>${i < words.length - 1 ? ' ' : null}</${Fragment}>`);
  }

  /* Masked line: outer clips, inner (.mi) slides */
  function Line({ children, cls = '', style }) {
    return html`<span className=${'mask ' + cls} style=${style}><span className="mi">${children}</span></span>`;
  }

  function Pill({ children, cls = '', style, dir }) {
    return html`<span className=${'pill ' + cls} style=${style} dir=${dir}>${children}</span>`;
  }

  function Micro({ children, cls = '', style, dir }) {
    return html`<span className=${'micro ' + cls} style=${style} dir=${dir}>${children}</span>`;
  }

  /* ---------- geometric vocabulary ---------- */
  function starPath(points, outer, inner) {
    let d = '';
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? outer : inner;
      const a = (Math.PI / points) * i - Math.PI / 2;
      d += (i ? 'L' : 'M') + (Math.cos(a) * r).toFixed(2) + ',' + (Math.sin(a) * r).toFixed(2);
    }
    return d + 'Z';
  }
  function Star({ cls = '', style, fill = C.black, points = 8, inner = 0.42 }) {
    return html`<svg className=${'shape ' + cls} style=${style} viewBox="-50 -50 100 100">
      <path d=${starPath(points, 50, 50 * inner)} fill=${fill} /></svg>`;
  }
  /* the deck's mark: one path that splits into two choices */
  function Mark({ cls = '', style, color = C.black }) {
    return html`<svg className=${'shape ' + cls} style=${style} viewBox="0 0 100 100" fill="none">
      <path d="M50 92 V58 C50 40 26 40 26 22 M50 58 C50 40 74 40 74 22" stroke=${color} strokeWidth="11" strokeLinecap="round" />
      <circle cx="26" cy="17" r="12" fill=${color} />
      <circle cx="74" cy="17" r="9" stroke=${color} strokeWidth="6" />
    </svg>`;
  }

  /* ---------- slide lifecycle hook ----------
     build(q, rootEl) returns { enter: Timeline, steps: [Timeline...] }
     All timelines are created paused, inside a gsap.context, so a slide
     can be torn down and rebuilt (replay) with zero leftovers. */
  function useSlide(ref, build) {
    const root = useRef(null);
    const api = useRef({ steps: [] });
    useLayoutEffect(() => {
      const ctx = gsap.context(() => {
        const q = gsap.utils.selector(root.current);
        const res = build(q, root.current) || {};
        api.current = { enter: res.enter, steps: res.steps || [] };
      }, root);
      return () => ctx.revert();
    }, []);
    useImperativeHandle(ref, () => ({
      stepCount: () => api.current.steps.length,
      play: () => run(api.current.enter),
      step: (i) => run(api.current.steps[i]),
      settle: () => {
        if (api.current.enter) api.current.enter.progress(1);
        api.current.steps.forEach((s) => s.progress(1));
      },
    }), []);
    return root;
  }
  function run(tl) {
    return new Promise((resolve) => {
      if (!tl) return resolve();
      tl.eventCallback('onComplete', () => resolve());
      tl.play(0);
    });
  }

  window.P = { html, C, rng, Chars, Line, Pill, Micro, Star, Mark, starPath, useSlide, slides: [] };
})();
