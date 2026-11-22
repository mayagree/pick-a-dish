/* SLIDE 02 - back to the restaurant experiment: the menu, exploded */
(function () {
  const { html, C, rng, Line, Pill, Micro, useSlide } = window.P;

  const DISHES = ['שקשוקה', 'פסטה ארביאטה', 'סלט קיסר', 'המבורגר', 'ניוקי', 'פיצה מרגריטה', 'ראמן', 'טאקו', 'קרפצ׳יו', 'סביח', 'פלאפל', 'שניצל', 'ריזוטו', 'סושי', 'חומוס', 'קבב', 'מג׳דרה', 'לזניה', 'פאד תאי', 'בורקס', 'סלט יווני', 'כנאפה', 'מלבי', 'טירמיסו', 'פוקאצ׳ה', 'קציצות', 'אנטריקוט', 'ג׳חנון', 'מוסקה', 'באו', 'דים סאם', 'קובה', 'חציל בטחינה', 'מלוואח', 'פנקייק', 'קרם ברולה', 'פטוצ׳יני', 'קארי', 'סלט ניסואז', 'ביריאני'];
  const PILL_STY = [[C.pink, C.white], [C.blue, C.white], [C.black, C.yellow], [C.white, C.black], [C.orange, C.white]];

  // build 9 dense rows, deterministic
  const r = rng(202);
  const ROWS = Array.from({ length: 9 }, (_, ri) => {
    const items = [];
    for (let k = 0; k < 22; k++) {
      const roll = r();
      if (roll < 0.42) items.push({ k: 'w', t: r.pick(DISHES), fs: Math.round(r.range(44, 78)) });
      else if (roll < 0.7) { const s = r.pick(PILL_STY); items.push({ k: 'p', t: r.pick(DISHES), fs: Math.round(r.range(28, 40)), bg: s[0], fg: s[1] }); }
      else if (roll < 0.86) items.push({ k: 'n', t: r() < 0.5 ? '₪' + Math.round(r.range(19, 129)) : 'No.' + String(Math.round(r.range(1, 240))).padStart(3, '0'), fs: Math.round(r.range(22, 34)) });
      else items.push({ k: 'o', t: r.pick(DISHES), fs: Math.round(r.range(70, 104)) });
    }
    return { top: ri * 120, items, dir: ri % 2 ? 1 : -1 };
  });
  const COLS = [{ left: 330 }, { left: 1440 }].map((c, ci) => ({
    ...c, dir: ci ? -1 : 1,
    items: Array.from({ length: 16 }, () => { const s = r.pick(PILL_STY); return { t: r() < 0.5 ? '₪' + Math.round(r.range(19, 99)) : String(Math.round(r.range(1, 99))).padStart(2, '0'), bg: s[0], fg: s[1] }; }),
  }));

  function S02(props, ref) {
    const root = useSlide(ref, (q) => {
      const tl = gsap.timeline({ paused: true });
      const D = 3.3; // the overload builds for D seconds… then freezes

      // options multiply
      tl.fromTo(q('.it'), { scale: 0 }, { scale: 1, duration: 0.32, ease: 'back.out(3)', stagger: { each: 0.0105, from: 'random' } }, 0.05);
      // everything moves, accelerating - horizontal rows vs vertical columns
      q('.mrow').forEach((row, i) => {
        tl.fromTo(row, { x: ROWS[i].dir * -380 }, { x: ROWS[i].dir * 380, duration: D, ease: 'power2.in' }, 0);
      });
      q('.mcol').forEach((col, i) => {
        tl.fromTo(col, { y: COLS[i].dir * -340 }, { y: COLS[i].dir * 340, duration: D, ease: 'power2.in' }, 0);
      });
      // FREEZE - a hard jolt, then stillness
      tl.to(q('.field'), { x: 18, duration: 0.04, yoyo: true, repeat: 5, ease: 'none' }, D);
      tl.set(q('.field'), { x: 0 }, D + 0.25);

      // the question cuts through the noise
      tl.fromTo(q('.band'), { clipPath: 'inset(0% 0% 0% 100%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: 'studio' }, D + 0.2);
      tl.fromTo(q('.hl .mi'), { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.12 }, D + 0.5);
      tl.fromTo(q('.sp'), { scale: 0, rotation: -12 }, { scale: 1, rotation: (i) => [-3, 2, -2][i], duration: 0.55, ease: 'back.out(2.2)', stagger: 0.18 }, D + 0.95);
      tl.fromTo(q('.bandmicro .mi'), { yPercent: 110 }, { yPercent: 0, duration: 0.6 }, D + 1.2);
      return { enter: tl };
    });

    return html`<div className="slide s02" ref=${root}>
      <div className="field">
        ${ROWS.map((row, ri) => html`<div key=${ri} className="mrow" style=${{ top: row.top + 'px' }}>
          ${row.items.map((it, k) => {
            if (it.k === 'p') return html`<span key=${k} className="it p" style=${{ fontSize: it.fs + 'px', background: it.bg, color: it.fg }}>${it.t}</span>`;
            if (it.k === 'n') return html`<span key=${k} className="it n" style=${{ fontSize: it.fs + 'px' }}>${it.t}</span>`;
            return html`<span key=${k} className=${'it ' + it.k} style=${{ fontSize: it.fs + 'px' }}>${it.t}</span>`;
          })}
        </div>`)}
        ${COLS.map((col, ci) => html`<div key=${ci} className="mcol" style=${{ left: col.left + 'px' }}>
          ${col.items.map((it, k) => html`<span key=${k} className="it p ltr" style=${{ fontSize: '30px', background: it.bg, color: it.fg, fontFamily: 'var(--f-mono)' }}>${it.t}</span>`)}
        </div>`)}
      </div>

      <div className="band">
        <div className="abs bandmicro" style=${{ left: '110px', top: '40px', color: C.grey }}>
          <${Line}><${Micro} dir="ltr">FIG. 01 - THE PARADOX OF CHOICE<//><//>
        </div>
      </div>
      <div className="hl">
        <${Line}>למה היה כל כך<//>
        <${Line}>קשה לבחור?<//>
      </div>
      <div className="abs" style=${{ left: '110px', top: '476px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '16px' }}>
        <${Pill} cls="sp" style=${{ background: C.white, color: C.black }}>תפריט ארוך.<//>
        <${Pill} cls="sp" style=${{ background: C.pink, color: C.white }}>זמן קצר.<//>
        <${Pill} cls="sp" style=${{ background: C.blue, color: C.white }}>יותר מדי אפשרויות.<//>
      </div>
    </div>`;
  }

  window.P.slides.push({ id: 's02', Comp: React.forwardRef(S02), bg: C.yellow, ink: C.black, chrome: true, transitionIn: 'stack', layers: [C.pink, C.blue], title: 'למה היה כל כך קשה לבחור?' });
})();
