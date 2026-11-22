/* SLIDE 05 - WHAT HAPPENS WITH TOO MANY OPTIONS: three effects, one per click */
(function () {
  const { html, C, rng, Line, Micro, useSlide } = window.P;

  const COL_LEFT = [1272, 676, 80]; // RTL: 01 on the right
  // overload shapes around "עומס מחשבתי"
  const r = rng(505);
  const SHAPES = Array.from({ length: 34 }, (_, i) => {
    const a = (i / 34) * Math.PI * 2 + r.range(-0.15, 0.15);
    const rad = r.range(0.62, 1.05);
    const kind = i % 4;
    const s = r.range(26, 64);
    return {
      x: 284 + Math.cos(a) * 250 * rad - s / 2, y: 350 + Math.sin(a) * 175 * rad - s / 2,
      w: kind === 3 ? s * 2 : s, h: s, br: kind === 1 ? '6px' : '999px',
      bg: [C.yellow, C.pink, C.white, C.orange, C.black][i % 5], rot: r.range(-40, 40),
    };
  });
  // regret: chosen node + alternative paths
  const ALTS = [40, 125, 210, 295];

  function S05(props, ref) {
    const root = useSlide(ref, (q) => {
      const enter = gsap.timeline({ paused: true });
      enter.fromTo(q('.hd .mi'), { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.1 }, 0.1);
      enter.fromTo(q('.frame'), { clipPath: 'inset(100% 0% 0% 0% round 34px)' }, { clipPath: 'inset(0% 0% 0% 0% round 34px)', duration: 1.0, ease: 'studio', stagger: 0.12 }, 0.35);
      enter.fromTo(q('.ghostnum'), { yPercent: 60, rotation: -10 }, { yPercent: 0, rotation: 0, duration: 1, ease: 'punch', stagger: 0.12 }, 0.6);

      const reveal = (tl, c) => {
        tl.fromTo(q(`.c${c} .fill`), { clipPath: 'inset(100% 0% 0% 0% round 34px)' }, { clipPath: 'inset(0% 0% 0% 0% round 34px)', duration: 0.75, ease: 'studio' }, 0);
        tl.fromTo(q(`.c${c} .num .mi`), { yPercent: 110 }, { yPercent: 0, duration: 0.8 }, 0.25);
        tl.fromTo(q(`.c${c} .cap .mi`), { yPercent: 110 }, { yPercent: 0, duration: 0.8, stagger: 0.08 }, 0.5);
        tl.fromTo(q(`.c${c} .en .mi`), { yPercent: 110 }, { yPercent: 0, duration: 0.6 }, 0.7);
      };

      /* 01 - INDECISION: the word swings between two slots before settling */
      const s1 = gsap.timeline({ paused: true });
      reveal(s1, 1);
      s1.fromTo(q('.c1 .slot'), { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'studio', stagger: 0.1 }, 0.3);
      s1.fromTo(q('.c1 .swing'), { scale: 0 }, { scale: 1, duration: 0.5, ease: 'back.out(2)' }, 0.55);
      const ys = [140, 0, 140, 0, 140, 40, 140];
      const ds = [0.42, 0.38, 0.34, 0.3, 0.26, 0.22, 0.5];
      let t = 1.05;
      ys.forEach((y, i) => { s1.to(q('.c1 .swing'), { y, rotation: i % 2 ? 2 : -2, duration: ds[i], ease: 'power2.inOut' }, t); t += ds[i]; });
      s1.to(q('.c1 .swing'), { rotation: 0, duration: 0.3 }, t);
      s1.to(q('.c1 .slot2'), { borderStyle: 'solid', duration: 0.01 }, t);

      /* 02 - MENTAL LOAD: shapes multiply and close in on the headline */
      const s2 = gsap.timeline({ paused: true });
      reveal(s2, 2);
      s2.fromTo(q('.c2 .ttl .mi'), { yPercent: 110 }, { yPercent: 0, duration: 0.8, stagger: 0.1 }, 0.3);
      s2.fromTo(q('.c2 .sh'), { scale: 0, x: 0, y: 0, rotation: 0 },
        { scale: 1, rotation: (i) => SHAPES[i].rot, duration: 0.45, ease: 'back.out(3)', stagger: { each: 0.035, from: 'random' } }, 0.6);
      s2.to(q('.c2 .sh'), { x: (i) => (284 - SHAPES[i].x - SHAPES[i].w / 2) * 0.16, y: (i) => (350 - SHAPES[i].y - SHAPES[i].h / 2) * 0.16, duration: 0.9, ease: 'power2.inOut' }, 1.9);
      s2.fromTo(q('.c2 .ttl'), { scale: 1 }, { scale: 0.94, duration: 0.9, ease: 'power2.inOut' }, 1.9);

      /* 03 - REGRET: one choice splits into the paths not taken */
      const s3 = gsap.timeline({ paused: true });
      reveal(s3, 3);
      s3.fromTo(q('.c3 .ttl .mi'), { yPercent: 110 }, { yPercent: 0, duration: 0.8 }, 0.3);
      s3.fromTo(q('.c3 .chosen'), { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.6, ease: 'back.out(2.5)' }, 0.6);
      s3.fromTo(q('.c3 .path'), { strokeDashoffset: 600 }, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut', stagger: 0.12 }, 1.0);
      s3.fromTo(q('.c3 .alt'), { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.5, ease: 'back.out(2.5)', stagger: 0.12 }, 1.6);
      s3.fromTo(q('.c3 .altq'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.12 }, 1.8);
      s3.to(q('.c3 .chosen'), { scale: 0.86, transformOrigin: '50% 50%', duration: 0.6, ease: 'power2.inOut' }, 2.3);

      return { enter, steps: [s1, s2, s3] };
    });

    const col = (c, bg, fg, children) => html`<div className=${'colx c' + c} style=${{ left: COL_LEFT[c - 1] + 'px' }}>
      <div className="frame"></div>
      <div className="ghostnum">0${c}</div>
      <div className="fill" style=${{ background: bg, color: fg }}>
        <div className="num"><${Line}>0${c}<//></div>
        ${children}
      </div>
    </div>`;

    return html`<div className="slide s05" ref=${root}>
      <div className="abs hd" style=${{ right: '80px', top: '66px' }}>
        <${Line}><${Micro} cls="he" dir="rtl" style=${{ color: C.blue }}>שלוש תופעות אפשריות - הן תלויות באדם, במצב ובמורכבות הבחירה<//><//>
        <${Line} style=${{ fontWeight: 900, fontSize: '86px', lineHeight: 1, marginTop: '14px' }}>מה קורה כשיש יותר מדי אפשרויות?<//>
      </div>

      ${col(1, C.pink, C.black, html`
        <div className="abs slot slot1" style=${{ left: '36px', right: '36px', top: '250px', height: '124px', border: '3px dashed ' + C.black, borderRadius: '999px' }}></div>
        <div className="abs slot slot2" style=${{ left: '36px', right: '36px', top: '390px', height: '124px', border: '3px dashed ' + C.black, borderRadius: '999px' }}></div>
        <div className="abs swing pill" style=${{ left: '36px', right: '36px', top: '250px', height: '124px', background: C.black, color: C.pink, fontWeight: 900, fontSize: '70px' }}>התלבטות</div>
        <div className="cap"><${Line}>קשה יותר לקבל החלטה.<//></div>
        <div className="en"><${Line}><${Micro}>INDECISION<//><//></div>`)}

      ${col(2, C.blue, C.white, html`
        ${SHAPES.map((s, i) => html`<div key=${i} className="abs sh" style=${{ left: s.x + 'px', top: s.y + 'px', width: s.w + 'px', height: s.h + 'px', borderRadius: s.br, background: s.bg }}></div>`)}
        <div className="ttl" style=${{ right: 0, left: 0, top: '268px', display: 'flex', justifyContent: 'center', zIndex: 2 }}>
          <div style=${{ background: C.black, color: C.white, borderRadius: '44px', padding: '14px 40px 22px', textAlign: 'center', fontSize: '78px' }}><${Line}>עומס<//><${Line}>מחשבתי<//></div>
        </div>
        <div className="cap"><${Line}>ההשוואה בין האפשרויות<//><${Line}>דורשת מאמץ.<//></div>
        <div className="en"><${Line}><${Micro}>COGNITIVE LOAD<//><//></div>`)}

      ${col(3, C.yellow, C.black, html`
        <div className="ttl"><${Line}>חרטה<//></div>
        <svg className="abs" style=${{ left: '36px', top: '250px', width: '496px', height: '300px', overflow: 'visible' }} viewBox="0 0 496 300">
          ${ALTS.map((y, i) => html`<path key=${'p' + i} className="path" d=${`M430 150 C300 150 260 ${y + 18} 70 ${y + 18}`} fill="none" stroke=${C.black} strokeWidth="4" strokeDasharray="600" strokeDashoffset="600" />`)}
          ${ALTS.map((y, i) => html`<g key=${'a' + i}>
            <circle className="alt" cx="52" cy=${y + 18} r="24" fill=${C.yellow} stroke=${C.black} strokeWidth="4" />
            <text className="altq" x="52" y=${y + 29} textAnchor="middle" fontFamily="Heebo" fontWeight="900" fontSize="30" fill=${C.black}>?</text>
          </g>`)}
          <g className="chosen">
            <circle cx="440" cy="150" r="46" fill=${C.black} />
            <path d="M420 151 L435 166 L462 136" stroke=${C.yellow} strokeWidth="9" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
        <div className="cap"><${Line}>גם אחרי שבחרנו, אנחנו עלולים<//><${Line}>לחשוב שאולי הייתה אפשרות<//><${Line}>טובה יותר.<//></div>
        <div className="en"><${Line}><${Micro}>REGRET<//><//></div>`)}
    </div>`;
  }

  window.P.slides.push({ id: 's05', Comp: React.forwardRef(S05), bg: C.white, ink: C.black, chrome: true, transitionIn: 'iris', origin: [765, 745], title: 'מה קורה כשיש יותר מדי אפשרויות?' });
})();
