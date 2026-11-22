/* SLIDE 06 - CONNECTION TO GRAPHIC DESIGN: same information, before → after.
   Every UI element exists once; it has a BEFORE style and an AFTER style.
   The click tweens all of them between the two - nothing is deleted. */
(function () {
  const { html, C, rng, Line, Pill, Micro, useSlide } = window.P;

  // card inner canvas: 1060 × 820. RTL columns (right → left)
  const COLX = [724, 386, 48];
  const CW = 292;
  const EL = [];
  const add = (id, cls, content, after) => EL.push({ id, cls, content, after });

  add('title', 't-right', 'התפריט שלנו', { x: 556, y: 46, w: 460, h: 74, fs: 62, fw: 900, bg: 'rgba(0,0,0,0)', fg: C.black, br: 0, bc: 'rgba(0,0,0,0)', g: 0 });
  add('sub', '', 'בחרו מנה אחת · אפשר לסנן לפי העדפה', { x: 476, y: 122, w: 540, h: 40, fs: 23, fw: 400, bg: 'rgba(0,0,0,0)', fg: '#6b6b6b', br: 0, bc: 'rgba(0,0,0,0)', g: 0 });
  ['צמחוני', 'טבעוני', 'ללא גלוטן'].forEach((t, i) =>
    add('chip' + i, '', t, { x: 48 + i * 128, y: 60, w: 118, h: 46, fs: 20, fw: 600, bg: 'rgba(0,0,0,0)', fg: C.black, br: 999, bc: C.black, g: 0 }));
  const CATS = [
    ['ראשונות', [['סלט קיסר', 42], ['חומוס', 34], ['קרפצ׳יו', 48]]],
    ['עיקריות', [['שקשוקה', 52], ['ריזוטו', 68], ['שניצל', 58]]],
    ['קינוחים', [['טירמיסו', 38], ['מלבי', 28], ['כנאפה', 36]]],
  ];
  CATS.forEach(([cat, dishes], ci) => {
    add('cat' + ci, 't-right', cat, { x: COLX[ci], y: 200, w: CW, h: 46, fs: 24, fw: 800, bg: 'rgba(0,0,0,0)', fg: C.black, br: 0, bc: 'rgba(0,0,0,0)', g: ci + 1 });
    dishes.forEach(([d, p], di) =>
      add(`d${ci}${di}`, 'dish', [d, '₪' + p], { x: COLX[ci], y: 262 + di * 78, w: CW, h: 64, fs: 26, fw: 500, bg: '#F1F1F3', fg: C.black, br: 16, bc: 'rgba(0,0,0,0)', g: ci + 1 }));
  });
  add('badge0', '', 'המלצת השף', { x: COLX[1] + 14, y: 250, w: 120, h: 28, fs: 15, fw: 700, bg: C.pink, fg: C.white, br: 999, bc: 'rgba(0,0,0,0)', g: 2 });
  add('badge1', '', 'חדש', { x: COLX[1] + 14, y: 328, w: 64, h: 28, fs: 15, fw: 700, bg: C.blue, fg: C.white, br: 999, bc: 'rgba(0,0,0,0)', g: 2 });
  ['מועדפים', 'שתפו', 'צרו קשר', 'מבצעים'].forEach((t, i) =>
    add('sec' + i, '', t, { x: 48 + i * 132, y: 712, w: 122, h: 54, fs: 20, fw: 600, bg: 'rgba(0,0,0,0)', fg: C.black, br: 999, bc: C.black, g: 0 }));
  add('cta', '', 'הזמינו עכשיו ←', { x: 606, y: 690, w: 410, h: 96, fs: 38, fw: 900, bg: C.orange, fg: C.white, br: 999, bc: C.orange, g: 9 });

  // BEFORE: everything equally loud, competing, rotated, overlapping
  const r = rng(606);
  const LOUD = [[C.orange, C.white], [C.yellow, C.black], [C.pink, C.white], [C.blue, C.white], [C.black, C.yellow], [C.grey, C.blue], ['#7CFF4F', C.black]];
  EL.forEach((e) => {
    const [bg, fg] = r.pick(LOUD);
    const w = Math.round(r.range(190, 300)), h = Math.round(r.range(62, 92));
    e.before = {
      x: r.range(-10, 1060 - w + 10), y: r.range(-6, 820 - h + 6), w, h,
      fs: Math.round(r.range(27, 33)), fw: 800, bg, fg, br: r.pick([0, 999, 10, 999]), bc: r.pick([C.black, 'rgba(0,0,0,0)']), rot: r.range(-13, 13),
    };
  });

  const toVars = (s, rot = 0) => ({
    x: s.x, y: s.y, width: s.w, height: s.h, fontSize: s.fs, fontWeight: s.fw,
    backgroundColor: s.bg, color: s.fg, borderRadius: s.br, borderColor: s.bc, rotation: rot,
  });

  function S06(props, ref) {
    const root = useSlide(ref, (q) => {
      const enter = gsap.timeline({ paused: true });
      const ui = q('.ui');
      ui.forEach((n, i) => gsap.set(n, toVars(EL[i].before, EL[i].before.rot)));

      enter.fromTo(q('.card'), { clipPath: 'inset(50% 50% 50% 50% round 30px)' }, { clipPath: 'inset(0% 0% 0% 0% round 30px)', duration: 1.0, ease: 'studio' }, 0.05);
      enter.fromTo(ui, { scale: 0 }, { scale: 1, duration: 0.42, ease: 'back.out(2.6)', stagger: { each: 0.045, from: 'random' } }, 0.45);
      enter.to(ui, { x: () => '+=' + gsap.utils.random(-26, 26), y: () => '+=' + gsap.utils.random(-18, 18), rotation: () => '+=' + gsap.utils.random(-5, 5), duration: 0.5, ease: 'power2.inOut', stagger: { each: 0.01, from: 'random' } }, 1.7);
      enter.fromTo(q('.side .mi'), { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.09 }, 0.6);
      enter.fromTo(q('.st-before'), { scale: 0 }, { scale: 1, duration: 0.5, ease: 'back.out(2)' }, 1.4);
      enter.fromTo(q('.st-after'), { scaleX: 0, transformOrigin: '100% 50%' }, { scaleX: 1, duration: 0.5, ease: 'studio' }, 1.5);

      /* THE REORGANIZATION */
      const step = gsap.timeline({ paused: true });
      step.to(q('.gridline'), { opacity: 1, duration: 0.25, stagger: 0.05 }, 0);
      step.fromTo(q('.gridline'), { scaleY: 0, transformOrigin: '50% 0%' }, { scaleY: 1, duration: 0.6, ease: 'studio', stagger: 0.05 }, 0);
      // order of arrival: structure first (titles), then groups, then the action
      const order = (i) => { const g = EL[i].after.g; return g === 0 ? 0 : g === 9 ? 0.55 : 0.12 + g * 0.08; };
      ui.forEach((n, i) => {
        step.to(n, { ...toVars(EL[i].after, 0), duration: 1.25, ease: 'studio' }, 0.15 + order(i) + (i % 4) * 0.025);
      });
      step.to(q('.gridline'), { opacity: 0.18, duration: 0.6 }, 1.5);
      // one primary action becomes unmistakable
      step.fromTo(q('[data-id="cta"]'), { scale: 1 }, { scale: 1.07, duration: 0.28, ease: 'power2.out', yoyo: true, repeat: 1 }, 1.75);
      step.fromTo(q('.ring'), { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' }, 1.8);
      // state label: לפני → אחרי
      step.to(q('.st-before'), { backgroundColor: 'rgba(0,0,0,0)', color: C.white, duration: 0.4 }, 1.3);
      step.to(q('.st-after'), { backgroundColor: C.yellow, color: C.black, duration: 0.4 }, 1.3);
      step.fromTo(q('.tag'), { scale: 0, rotation: -10 }, { scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(2.2)', stagger: 0.15 }, 1.6);
      return { enter, steps: [step] };
    });

    return html`<div className="slide s06" ref=${root}>
      <div className="card">
        ${[COLX[0], COLX[1], COLX[2], 1012].map((x, i) => html`<div key=${i} className="gridline" style=${{ left: x + 'px' }}></div>`)}
        ${EL.map((e) => html`<div key=${e.id} data-id=${e.id} className=${'ui ' + e.cls}>
          ${Array.isArray(e.content) ? html`<span>${e.content[0]}</span><span className="pr">${e.content[1]}</span>` : e.content}
        </div>`)}
        <div className="abs ring" style=${{ left: '592px', top: '676px', width: '438px', height: '124px', borderRadius: '999px', border: '3px solid ' + C.black, pointerEvents: 'none' }}></div>
      </div>

      <div className="abs side" style=${{ right: '80px', top: '130px', width: '640px' }}>
        <${Line}><${Micro} dir="ltr" style=${{ color: C.yellow }}>SAME CONTENT - DIFFERENT DESIGN<//><//>
        <div style=${{ fontWeight: 900, fontSize: '96px', lineHeight: 0.95, marginTop: '22px' }}>
          <${Line}>איך זה קשור<//><${Line}>לעיצוב גרפי?<//>
        </div>
        <div style=${{ fontFamily: 'var(--f-serif)', fontWeight: 500, fontSize: '44px', lineHeight: 1.18, marginTop: '40px' }}>
          <${Line}>עיצוב לא רק מציג מידע -<//>
          <${Line}>הוא משפיע על הדרך<//>
          <${Line}>שבה אנחנו בוחרים.<//>
        </div>
      </div>

      <div className="abs" style=${{ right: '80px', top: '640px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '14px' }}>
        <${Pill} cls="tag" style=${{ background: C.white, color: C.black }}>היררכיה ברורה<//>
        <${Pill} cls="tag" style=${{ background: C.white, color: C.black }}>קיבוץ לפי קטגוריות<//>
        <${Pill} cls="tag" style=${{ background: C.orange, color: C.white }}>פעולה ראשית אחת<//>
      </div>

      <div className="abs" style=${{ right: '80px', top: '890px', display: 'flex', gap: '12px' }}>
        <${Pill} cls="st-before" style=${{ background: C.pink, color: C.white, border: '3px solid ' + C.white, fontSize: '28px', fontWeight: 800, padding: '12px 32px 15px' }}>לפני<//>
        <${Pill} cls="st-after" style=${{ background: 'rgba(0,0,0,0)', color: C.white, border: '3px solid ' + C.white, fontSize: '28px', fontWeight: 800, padding: '12px 32px 15px' }}>אחרי<//>
      </div>
    </div>`;
  }

  window.P.slides.push({ id: 's06', Comp: React.forwardRef(S06), bg: C.blue, ink: C.white, chrome: true, transitionIn: 'grid', accent: C.yellow, title: 'איך זה קשור לעיצוב גרפי?' });
})();
