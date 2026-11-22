/* SLIDE 03 - THE DEFINITION: chaos collapses into one clear sentence */
(function () {
  const { html, C, rng, Line, Pill, Micro, useSlide } = window.P;

  // definition, hand-set into lines. hl = highlighted key word, soft = the hedge words
  const LINES = [
    ['ככל שיש לנו ', { hl: 'יותר', bg: C.orange, fg: C.white }, ' אפשרויות,'],
    ['כך ', { soft: 'לפעמים' }, ' ', { hl: 'קשה', bg: C.pink, fg: C.white }, ' לנו יותר ', { hl: 'לבחור', bg: C.blue, fg: C.white }, ' -'],
    ['ואנחנו ', { soft: 'עלולים' }, ' להיות פחות מרוצים'],
    ['מההחלטה שלנו.'],
  ];

  // leftovers from the previous slide's chaos
  const CLUTTER = ['שקשוקה', '₪48', 'ניוקי', 'No.117', 'ראמן', 'סביח', '₪64', 'טאקו', 'לזניה', 'פלאפל', '₪32', 'כנאפה', 'סושי', 'No.042', 'ריזוטו', 'קבב', 'מלבי', '₪89'];
  const r = rng(303);
  const CL = CLUTTER.map((t, i) => ({
    t, x: r.range(60, 1700), y: r.range(40, 960), rot: r.range(-20, 20), fs: Math.round(r.range(34, 80)),
    pill: i % 3 !== 0, bg: [C.pink, C.blue, C.yellow, C.black, C.orange][i % 5],
  }));
  // four shapes survive and become an ordered legend
  const SH = [
    { w: 64, h: 64, br: '50%', bg: C.orange },
    { w: 64, h: 64, br: '50%', bg: C.pink },
    { w: 64, h: 64, br: '50%', bg: C.blue },
    { w: 150, h: 64, br: '999px', bg: C.yellow },
  ].map((s, i) => ({ ...s, left: 110 + i * 82, dx: r.range(-200, 1500), dy: r.range(100, 800), rot: r.range(-90, 90), sc: r.range(2.5, 5) }));

  function S03(props, ref) {
    const root = useSlide(ref, (q) => {
      const tl = gsap.timeline({ paused: true });
      // clutter is visible on arrival (continuity), then it leaves
      tl.to(q('.cl'), { scale: 0, rotation: '+=70', duration: 0.5, ease: 'power3.in', stagger: { each: 0.028, from: 'random' } }, 0.2);
      tl.fromTo(q('.sh'),
        { x: (i) => SH[i].dx - SH[i].left, y: (i) => SH[i].dy - 110, rotation: (i) => SH[i].rot, scale: (i) => SH[i].sc },
        { x: 0, y: 0, rotation: 0, scale: 1, duration: 1.4, ease: 'studio', stagger: 0.06 }, 0.15);
      tl.fromTo(q('.hd .mi'), { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.08 }, 0.95);
      tl.fromTo(q('.def .mi'), { yPercent: 112, rotation: 2 }, { yPercent: 0, rotation: 0, duration: 1.1, stagger: 0.13 }, 1.15);
      // key words light up in sequence
      tl.fromTo(q('.hlw .bg'), { scaleX: 0, transformOrigin: '100% 50%' }, { scaleX: 1, duration: 0.55, ease: 'studio', stagger: 0.42 }, 2.15);
      q('.hlw .tx').forEach((t, i) => tl.to(t, { color: C.white, duration: 0.2 }, 2.3 + i * 0.42));
      tl.fromTo(q('.soft'), { y: 30, rotation: -6 }, { y: 0, rotation: 0, duration: 0.7, ease: 'punch', stagger: 0.15 }, 2.4);
      // the English formula
      tl.fromTo(q('.eq'), { clipPath: 'inset(0% 100% 0% 0% round 999px)' }, { clipPath: 'inset(0% 0% 0% 0% round 999px)', duration: 0.8, ease: 'studio' }, 3.2);
      tl.fromTo(q('.eq .mi'), { yPercent: 110 }, { yPercent: 0, duration: 0.6 }, 3.45);
      return { enter: tl };
    });

    return html`<div className="slide s03" ref=${root}>
      ${CL.map((c, i) => c.pill
        ? html`<${Pill} key=${i} cls="cl" style=${{ left: c.x + 'px', top: c.y + 'px', fontSize: c.fs * 0.6 + 'px', background: c.bg, color: c.bg === C.yellow ? C.black : C.white, padding: '10px 24px 13px', transform: `rotate(${c.rot}deg)` }}>${c.t}<//>`
        : html`<span key=${i} className="cl" style=${{ left: c.x + 'px', top: c.y + 'px', fontSize: c.fs + 'px', transform: `rotate(${c.rot}deg)` }}>${c.t}</span>`)}

      ${SH.map((s, i) => html`<div key=${i} className="abs sh" style=${{ left: s.left + 'px', top: '110px', width: s.w + 'px', height: s.h + 'px', borderRadius: s.br, background: s.bg }}></div>`)}

      <div className="abs hd" style=${{ right: '110px', top: '96px', textAlign: 'right' }}>
        <${Line}><${Micro} dir="ltr">DEFINITION / הגדרה<//><//>
        <${Line} style=${{ fontWeight: 900, fontSize: '64px', lineHeight: 1, marginTop: '10px' }}>מה זה פרדוקס הבחירה?<//>
      </div>

      <div className="def">
        ${LINES.map((ln, li) => html`<${Line} key=${li}>${ln.map((s, si) => {
          if (typeof s === 'string') return s;
          if (s.soft) return html`<span key=${si} className="soft" style=${{ display: 'inline-block' }}>${s.soft}</span>`;
          return html`<span key=${si} className="hlw"><span className="bg" style=${{ background: s.bg }}></span><span className="tx">${s.hl}</span></span>`;
        })}<//>`)}
      </div>

      <div className="abs eq ltr" style=${{ left: '110px', top: '858px', background: C.black, color: C.white, borderRadius: '999px', padding: '22px 46px 26px' }}>
        <${Line} style=${{ fontWeight: 900, fontSize: '50px', lineHeight: 1, letterSpacing: '-0.01em' }}>MORE CHOICES <span style=${{ color: C.yellow }}>≠</span> MORE SATISFACTION<//>
      </div>
    </div>`;
  }

  window.P.slides.push({ id: 's03', Comp: React.forwardRef(S03), bg: C.white, ink: C.black, chrome: true, transitionIn: 'pill', pillLabel: '?', title: 'מה זה פרדוקס הבחירה?' });
})();
