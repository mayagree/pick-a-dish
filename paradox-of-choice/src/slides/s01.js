/* SLIDE 01 - OPENING: "פרדוקס הבחירה" */
(function () {
  const { html, C, rng, Chars, Line, Pill, Micro, Star, Mark, useSlide } = window.P;

  const PILLS = [
    { t: 'אפשרויות', x: 1250, y: 102, r: -7 },
    { t: 'החלטות', x: 190, y: 452, r: 6 },
    { t: 'התלבטות', x: 1050, y: 470, r: -4 },
    { t: 'חופש', x: 1560, y: 860, r: 8 },
    { t: 'חרטה', x: 690, y: 880, r: -6 },
  ];
  const EXTRA_WORDS = ['עוד', 'אולי', 'רגע…', 'מה עדיף?', 'השוואה', 'מבצע', 'חדש!', 'המלצה', 'עוד אחת', 'בטוח?', 'לא יודע', 'אח״כ', 'שתיים?', 'גם וגם', 'מחר', 'או ש…'];
  const r = rng(11);
  const EXTRAS = EXTRA_WORDS.map((t, i) => ({
    t, x: r.range(120, 1640), y: r.range(90, 900), rot: r.range(-18, 18),
    bg: [C.white, C.black, C.pink, C.blue, C.yellow][i % 5],
    fg: [C.black, C.yellow, C.white, C.white, C.orange][i % 5],
  }));

  function S01(props, ref) {
    const root = useSlide(ref, (q) => {
      const tl = gsap.timeline({ paused: true });
      const rnd = gsap.utils.random;

      // 0 - outlined ghost words rip across the canvas, beyond its edges
      tl.fromTo(q('.ghost'),
        { xPercent: (i) => (i % 2 ? -100 : 0), x: (i) => (i % 2 ? 0 : 1920) },
        { xPercent: (i) => (i % 2 ? 0 : -100), x: (i) => (i % 2 ? 1920 : 0), duration: 1.7, ease: 'whip', stagger: 0.14 }, 0);

      // giant words from opposite directions, letters tumbling into line
      tl.fromTo(q('.w1'), { x: 1500, skewX: -24 }, { x: 0, skewX: 0, duration: 1.35 }, 0.2);
      tl.fromTo(q('.w1 .ch'), { yPercent: rnd(-170, 170, 1, true), rotation: rnd(-35, 35, 1, true) }, { yPercent: 0, rotation: 0, duration: 1.15, ease: 'punch', stagger: 0.05 }, 0.25);
      tl.fromTo(q('.w2'), { x: -1500, skewX: 24 }, { x: 0, skewX: 0, duration: 1.35 }, 0.38);
      tl.fromTo(q('.w2 .ch'), { yPercent: rnd(-170, 170, 1, true), rotation: rnd(-35, 35, 1, true) }, { yPercent: 0, rotation: 0, duration: 1.15, ease: 'punch', stagger: 0.05 }, 0.42);

      // pills integrated into the type rows
      tl.fromTo(q('.fp1'), { scaleX: 0, transformOrigin: '100% 50%' }, { scaleX: 1, duration: 1.0, ease: 'studio' }, 0.75);
      tl.fromTo(q('.fp2'), { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 1.0, ease: 'studio' }, 0.9);
      tl.fromTo(q('.fp2 .mi, .fp1 .mi'), { yPercent: 115 }, { yPercent: 0, duration: 0.8, stagger: 0.1 }, 1.4);

      // geometry
      tl.fromTo(q('.star'), { scale: 0, rotation: -260 }, { scale: 1, rotation: 0, duration: 1.8 }, 0.35);
      tl.fromTo(q('.disc'), { x: -500, scale: 0.4 }, { x: 0, scale: 1, duration: 1.2, ease: 'punch' }, 0.55);
      tl.fromTo(q('.half'), { rotation: 180, scale: 0, transformOrigin: '50% 100%' }, { rotation: 0, scale: 1, duration: 1.1, ease: 'punch' }, 0.9);

      // overload: way too many labels pop in… then leave
      tl.fromTo(q('.xp'), { scale: 0, rotation: (i) => EXTRAS[i].rot - 40 }, { scale: 1, rotation: (i) => EXTRAS[i].rot, duration: 0.45, ease: 'back.out(2.4)', stagger: { each: 0.045, from: 'random' } }, 0.55);
      tl.to(q('.xp'), { scale: 0, rotation: '+=50', duration: 0.38, ease: 'power3.in', stagger: { each: 0.025, from: 'random' } }, 1.95);

      // the five words that matter stay
      tl.fromTo(q('.lp'), { scale: 0, rotation: (i) => PILLS[i].r - 30 }, { scale: 1, rotation: (i) => PILLS[i].r, duration: 0.7, ease: 'back.out(2)', stagger: 0.09 }, 1.05);
      tl.to(q('.lp'), { y: -14, duration: 0.25, ease: 'power2.out', stagger: 0.05, yoyo: true, repeat: 1 }, 2.35);

      // editorial details
      tl.fromTo(q('.mark'), { y: -120, rotation: -90 }, { y: 0, rotation: 0, duration: 1 }, 2.2);
      tl.fromTo(q('.s01-foot .mi'), { yPercent: 120 }, { yPercent: 0, duration: 0.8, stagger: 0.08 }, 2.35);
      return { enter: tl };
    });

    return html`<div className="slide s01" ref=${root}>
      <div className="abs disc" style=${{ left: '-150px', top: '700px', width: '380px', height: '380px', borderRadius: '50%', background: C.pink }}></div>
      <div className="abs half" style=${{ left: '1450px', top: '-10px', width: '360px', height: '180px', borderRadius: '0 0 180px 180px', background: C.yellow }}></div>
      <${Star} cls="star" fill=${C.black} style=${{ left: '1690px', top: '330px', width: '190px', height: '190px' }} />

      <div className="row r1" style=${{ top: '120px' }}>
        <div className="big w1"><${Chars} text="פרדוקס" /></div>
        <div className="fillpill fp1" style=${{ background: C.pink }}>
          <${Line} cls="ltr"><span style=${{ fontWeight: 800, fontSize: '54px', color: C.white }}>2026</span><//>
        </div>
      </div>
      <div className="row r2" style=${{ top: '540px' }}>
        <div className="fillpill fp2" style=${{ background: C.blue }}>
          <div className="ltr" style=${{ color: C.white, fontWeight: 900, fontSize: '50px', lineHeight: 0.92, textAlign: 'left' }}>
            <${Line}>THE PARADOX<//><${Line}>OF CHOICE<//>
          </div>
        </div>
        <div className="big w2"><${Chars} text="הבחירה" /></div>
      </div>

      ${['אפשרויות · בחירות · החלטות · ', 'עוד · ועוד · ועוד · ועוד · ', 'מה לבחור? · מה לבחור? · '].map((t, i) => html`
        <div key=${i} className="ghost" style=${{ top: [40, 380, 720][i] + 'px' }}>${t + t}</div>`)}

      ${EXTRAS.map((e, i) => html`<${Pill} key=${'x' + i} cls="xp abs" style=${{ left: e.x + 'px', top: e.y + 'px', background: e.bg, color: e.fg }}>${e.t}<//>`)}
      ${PILLS.map((p, i) => html`<${Pill} key=${'p' + i} cls="pill-serif lp abs" style=${{ left: p.x + 'px', top: p.y + 'px' }}>${p.t}<//>`)}

      <${Mark} cls="mark" style=${{ left: '922px', top: '34px', width: '76px', height: '76px' }} />
      <div className="abs s01-foot" style=${{ left: '300px', right: '80px', bottom: '34px', display: 'flex', justifyContent: 'space-between' }}>
        <${Line}><${Micro} cls="he" dir="rtl">אנה ומיה<//><//>
        <${Line}><${Micro} dir="ltr">MORE OPTIONS - LESS CERTAINTY<//><//>
      </div>
    </div>`;
  }

  window.P.slides.push({ id: 's01', Comp: React.forwardRef(S01), bg: C.orange, ink: C.black, chrome: false, transitionIn: 'stack', title: 'פרדוקס הבחירה - פתיחה' });
})();
