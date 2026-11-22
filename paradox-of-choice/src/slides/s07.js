/* SLIDE 07 - DESIGN PRINCIPLES: each animation IS the principle */
(function () {
  const { html, C, rng, Line, Micro, useSlide } = window.P;

  const PX = [1300, 690, 80];        // panel lefts (RTL: 01 on the right)
  const RULES = [1265, 655];
  const PW = 540;

  // 01 hierarchy: six equal boxes → one dominant focal point
  const HB_BEFORE = Array.from({ length: 6 }, (_, i) => ({ x: (i % 3) * 187, y: Math.floor(i / 3) * 150, w: 166, h: 134 }));
  const HB_AFTER = [{ x: 0, y: 0, w: 540, h: 176 }, ...Array.from({ length: 5 }, (_, k) => ({ x: k * 111, y: 196, w: 96, h: 90 }))];

  // 02 grouping: scattered → three categories
  const r = rng(707);
  const GROUP_ITEMS = Array.from({ length: 12 }, (_, i) => {
    const g = i % 3, k = Math.floor(i / 3);
    const kind = [{ w: 52, h: 52, br: '50%', bg: C.pink }, { w: 52, h: 52, br: '8px', bg: C.blue }, { w: 96, h: 44, br: '999px', bg: C.orange }][g];
    const fx = [380, 190, 0][g] + (160 - kind.w) / 2; // RTL: first group on the right
    return { ...kind, g, sx: r.range(0, PW - kind.w), sy: r.range(0, 280 - kind.h), rot: r.range(-60, 60), fx, fy: 22 + k * 64 };
  });

  // 03 progressive disclosure: three stages
  const STAGES = [
    { label: 'בחרו קטגוריה', chips: ['ראשונות', 'עיקריות', 'קינוחים'] },
    { label: 'בחרו מנה', chips: ['שקשוקה', 'ריזוטו', 'שניצל'] },
    { label: 'אישור', chips: [] },
  ];

  function S07(props, ref) {
    const root = useSlide(ref, (q) => {
      const enter = gsap.timeline({ paused: true });
      enter.fromTo(q('.hd .mi'), { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.1 }, 0.1);
      enter.fromTo(q('.rule'), { scaleY: 0 }, { scaleY: 1, duration: 1.1, ease: 'studio', stagger: 0.12 }, 0.35);
      enter.fromTo(q('.pnum .mi'), { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.12 }, 0.6);
      enter.fromTo(q('.topline'), { scaleX: 0, transformOrigin: '100% 50%' }, { scaleX: 1, duration: 1.2, ease: 'studio' }, 0.2);

      const text = (tl, p) => {
        tl.to(q(`.p${p} .pnum`), { color: [C.orange, C.blue, C.pink][p - 1], duration: 0.3 }, 0);
        tl.fromTo(q(`.p${p} .ptxt .mi`), { yPercent: 110 }, { yPercent: 0, duration: 0.8, stagger: 0.08 }, 0.05);
      };

      /* 01 VISUAL HIERARCHY */
      const s1 = gsap.timeline({ paused: true });
      text(s1, 1);
      s1.fromTo(q('.hb'), { scale: 0, x: (i) => HB_BEFORE[i].x, y: (i) => HB_BEFORE[i].y, width: (i) => HB_BEFORE[i].w, height: (i) => HB_BEFORE[i].h },
        { scale: 1, duration: 0.45, ease: 'back.out(2)', stagger: 0.06 }, 0.35);
      s1.to(q('.hb'), { x: (i) => HB_AFTER[i].x, y: (i) => HB_AFTER[i].y, width: (i) => HB_AFTER[i].w, height: (i) => HB_AFTER[i].h, backgroundColor: (i) => (i ? C.grey : C.orange), duration: 1.1, ease: 'studio', stagger: 0.04 }, 1.25);
      s1.fromTo(q('.hb0 .lbl'), { yPercent: 120 }, { yPercent: 0, duration: 0.6 }, 2.0);

      /* 02 GROUPING */
      const s2 = gsap.timeline({ paused: true });
      text(s2, 2);
      s2.fromTo(q('.gi'), { scale: 0, x: (i) => GROUP_ITEMS[i].sx, y: (i) => GROUP_ITEMS[i].sy, rotation: (i) => GROUP_ITEMS[i].rot },
        { scale: 1, duration: 0.4, ease: 'back.out(2.5)', stagger: { each: 0.04, from: 'random' } }, 0.35);
      s2.to(q('.gi'), { x: (i) => GROUP_ITEMS[i].fx, y: (i) => GROUP_ITEMS[i].fy, rotation: 0, duration: 1.1, ease: 'studio', stagger: { each: 0.03, from: 'random' } }, 1.2);
      s2.fromTo(q('.gframe'), { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.8)', stagger: 0.08 }, 1.9);

      /* 03 PROGRESSIVE DISCLOSURE - revealed in stages, not all at once */
      const s3 = gsap.timeline({ paused: true });
      text(s3, 3);
      s3.fromTo(q('.pline'), { scaleX: 0, transformOrigin: '100% 50%' }, { scaleX: 1, duration: 1.8, ease: 'power1.inOut' }, 0.5);
      STAGES.forEach((_, i) => {
        const t = 0.45 + i * 0.75;
        s3.fromTo(q(`.dot${i}`), { scale: 0 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' }, t);
        s3.fromTo(q(`.prow${i}`), { clipPath: 'inset(0% 0% 100% 0%)', y: -16 }, { clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: 0.55, ease: 'studio' }, t + 0.1);
        s3.fromTo(q(`.prow${i} .chip`), { scale: 0 }, { scale: 1, duration: 0.35, ease: 'back.out(2.4)', stagger: 0.06 }, t + 0.3);
        if (i > 0) s3.to(q(`.prow${i - 1}`), { opacity: 0.35, duration: 0.4 }, t);
      });
      return { enter, steps: [s1, s2, s3] };
    });

    const panel = (p, num, term, en, desc, demo) => html`<div className=${'panel p' + p} style=${{ left: PX[p - 1] + 'px', width: PW + 'px' }}>
      <div className="pnum" style=${{ color: '#d9d9de' }}><${Line}>${num}<//></div>
      <div className="ptxt">
        <div className="pterm"><${Line}>${term}<//></div>
        <div style=${{ marginTop: '10px' }}><${Line}><${Micro} dir="ltr">${en}<//><//></div>
        <div className="pdesc"><${Line}>${desc}<//></div>
      </div>
      <div className="demo">${demo}</div>
    </div>`;

    return html`<div className="slide s07" ref=${root}>
      <div className="abs hd" style=${{ right: '80px', top: '70px' }}>
        <${Line}><${Micro} cls="he" dir="rtl">שלושה עקרונות עיצוב שמקלים על הבחירה<//><//>
        <${Line} style=${{ fontWeight: 900, fontSize: '104px', lineHeight: 1, marginTop: '10px', letterSpacing: '-0.01em' }}>איך אפשר להקל על הבחירה?<//>
      </div>
      <div className="abs topline" style=${{ left: '80px', right: '80px', top: '268px', height: '3px', background: C.black }}></div>
      ${RULES.map((x, i) => html`<div key=${i} className="rule" style=${{ left: x + 'px' }}></div>`)}

      ${panel(1, '01', 'היררכיה חזותית', 'VISUAL HIERARCHY', 'להדגיש את מה שחשוב.', html`
        ${HB_BEFORE.map((_, i) => html`<div key=${i} className=${'db hb hb' + i} style=${{ background: C.grey }}>
          ${i === 0 ? html`<span className="mask"><span className="mi lbl" style=${{ fontSize: '44px', fontWeight: 900 }}>הכי חשוב</span></span>` : null}
        </div>`)}`)}

      ${panel(2, '02', 'חלוקה לקבוצות', 'GROUPING', 'לארגן אפשרויות לפי קטגוריות.', html`
        ${[380, 190, 0].map((x, i) => html`<div key=${'f' + i} className="abs gframe" style=${{ left: x + 'px', top: '6px', width: '160px', height: '276px', border: '3px dashed ' + C.black, borderRadius: '24px' }}></div>`)}
        ${GROUP_ITEMS.map((g, i) => html`<div key=${i} className="abs gi" style=${{ left: 0, top: 0, width: g.w + 'px', height: g.h + 'px', borderRadius: g.br, background: g.bg }}></div>`)}`)}

      ${panel(3, '03', 'חשיפה הדרגתית', 'PROGRESSIVE DISCLOSURE', 'להציג את המידע בזמן הנכון.', html`
        <div className="abs" style=${{ right: '22px', left: '22px', top: '20px', height: '4px', background: '#e4e4e8' }}></div>
        <div className="abs pline" style=${{ right: '22px', left: '22px', top: '20px', height: '4px', background: C.pink }}></div>
        ${STAGES.map((s, i) => html`<div key=${'d' + i} className=${'abs dot dot' + i} style=${{ right: i * 225 + 'px', top: 0, width: '44px', height: '44px', borderRadius: '50%', background: C.black, color: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--f-mono)', fontWeight: 600, fontSize: '20px' }}>${i + 1}</div>`)}
        ${STAGES.map((s, i) => html`<div key=${'r' + i} className=${'abs prow prow' + i} style=${{ right: 0, left: 0, top: 70 + i * 74 + 'px', height: '62px', display: 'flex', alignItems: 'center', gap: '10px', borderRadius: '16px', background: i === 2 ? C.pink : '#F1F1F3', color: i === 2 ? C.white : C.black, padding: '0 18px' }}>
          <span style=${{ fontWeight: 800, fontSize: '24px', flex: 'none' }}>${s.label}</span>
          ${s.chips.map((c, k) => html`<span key=${k} className="chip pill" style=${{ fontSize: '17px', fontWeight: 600, padding: '7px 12px 9px', border: '2px solid ' + C.black, background: k === 1 ? C.black : 'transparent', color: k === 1 ? C.white : C.black }}>${c}</span>`)}
          ${i === 2 ? html`<span style=${{ marginRight: 'auto', fontWeight: 900, fontSize: '26px' }}>←</span>` : null}
        </div>`)}`)}
    </div>`;
  }

  window.P.slides.push({ id: 's07', Comp: React.forwardRef(S07), bg: C.white, ink: C.black, chrome: true, transitionIn: 'pill', pillLabel: 'סדר', origin: [891, 868], title: 'איך אפשר להקל על הבחירה?' });
})();
