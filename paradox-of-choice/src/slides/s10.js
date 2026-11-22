/* SLIDE 10 - THANK YOU: the opening's energy returns, now organised */
(function () {
  const { html, C, Chars, Line, Pill, Micro, Star, Mark, useSlide } = window.P;

  const BURST = [
    { t: 'בחירה', x: 1490, y: 50, r: -8 },
    { t: 'בהירות', x: 640, y: 36, r: 6 },
    { t: 'היררכיה', x: 1060, y: 428, r: -4 },
    { t: 'קבוצות', x: 330, y: 436, r: 5 },
    { t: 'פחות', x: 1470, y: 872, r: -7 },
    { t: 'סדר', x: 760, y: 868, r: 4 },
  ];

  function S10(props, ref) {
    const root = useSlide(ref, (q) => {
      const tl = gsap.timeline({ paused: true });
      const rnd = gsap.utils.random;
      // colour blocks slide into place
      tl.fromTo(q('.blk-y'), { xPercent: 110 }, { xPercent: 0, duration: 1.0, ease: 'studio' }, 0);
      tl.fromTo(q('.blk-p'), { yPercent: -120 }, { yPercent: 0, duration: 1.0, ease: 'studio' }, 0.1);
      // ghost layers sweep through
      tl.fromTo(q('.ghost'),
        { xPercent: (i) => (i % 2 ? -100 : 0), x: (i) => (i % 2 ? 0 : 1920) },
        { xPercent: (i) => (i % 2 ? 0 : -100), x: (i) => (i % 2 ? 1920 : 0), duration: 1.6, ease: 'whip', stagger: 0.12 }, 0);
      // giant text from different directions + a pink echo layer for depth
      tl.fromTo(q('.w1'), { x: -1600, skewX: 20 }, { x: 0, skewX: 0, duration: 1.3 }, 0.25);
      tl.fromTo(q('.w2'), { x: 1600, skewX: -20 }, { x: 0, skewX: 0, duration: 1.3 }, 0.38);
      tl.fromTo(q('.big .ch'), { yPercent: rnd(-150, 150, 1, true), rotation: rnd(-30, 30, 1, true) }, { yPercent: 0, rotation: 0, duration: 1.1, ease: 'punch', stagger: { each: 0.035, from: 'random' } }, 0.3);
      tl.fromTo(q('.echo'), { x: -60, y: -60, opacity: 0 }, { x: 12, y: 12, opacity: 1, duration: 1.0, ease: 'punch' }, 1.0);
      tl.fromTo(q('.fp1'), { scaleX: 0, transformOrigin: '100% 50%' }, { scaleX: 1, duration: 0.9, ease: 'studio' }, 0.8);
      tl.fromTo(q('.fp2'), { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 0.9, ease: 'studio' }, 0.95);
      tl.fromTo(q('.fp1 .mi'), { yPercent: 115 }, { yPercent: 0, duration: 0.8 }, 1.4);
      tl.fromTo(q('.dotshape'), { scale: 0, y: -120 }, { scale: 1, y: 0, duration: 0.9, ease: 'bounce.out', stagger: 0.1 }, 1.35);
      // shapes bounce and spin
      tl.fromTo(q('.star'), { y: -700, rotation: -200 }, { y: 0, rotation: 0, duration: 1.4, ease: 'bounce.out' }, 0.5);
      tl.fromTo(q('.disc'), { scale: 0 }, { scale: 1, duration: 1.1, ease: 'punch' }, 0.7);
      // labels burst outward from the centre
      tl.fromTo(q('.bp'), { x: (i) => 960 - BURST[i].x - 120, y: (i) => 540 - BURST[i].y - 40, scale: 0, rotation: 0 },
        { x: 0, y: 0, scale: 1, rotation: (i) => BURST[i].r, duration: 1.0, ease: 'punch', stagger: 0.05 }, 1.55);
      tl.fromTo(q('.mark'), { scale: 0, rotation: -120 }, { scale: 1, rotation: 0, duration: 0.9, ease: 'back.out(2)' }, 2.2);
      tl.fromTo(q('.s10-foot .mi'), { yPercent: 120 }, { yPercent: 0, duration: 0.8, stagger: 0.08 }, 2.3);
      return { enter: tl };
    });

    const words = (cls) => html`
      <div className="row" style=${{ top: '120px' }}>
        <div className=${'big w1 ' + cls}><${Chars} text="תודה על" /></div>
        <div className="fillpill" style=${{ visibility: 'hidden' }}></div>
      </div>
      <div className="row" style=${{ top: '540px' }}>
        <div className="fillpill" style=${{ visibility: 'hidden' }}></div>
        <div className=${'big w2 ' + cls}><${Chars} text="ההקשבה!" /></div>
      </div>`;

    return html`<div className="slide s10" ref=${root}>
      <div className="abs blk-y" style=${{ left: '1240px', top: '850px', width: '900px', height: '300px', background: C.yellow, borderRadius: '150px 0 0 150px' }}></div>
      <div className="abs blk-p" style=${{ left: '-80px', top: '-120px', width: '520px', height: '360px', background: C.pink, borderRadius: '0 0 260px 0' }}></div>
      <div className="abs disc" style=${{ left: '1700px', top: '-70px', width: '230px', height: '230px', borderRadius: '50%', background: C.black }}></div>
      <${Star} cls="star" fill=${C.blue} points=${8} style=${{ left: '70px', top: '420px', width: '170px', height: '170px' }} />

      ${['תודה · תודה · תודה · ', 'THANK YOU · THANK YOU · ', 'תודה רבה · תודה רבה · '].map((t, i) => html`
        <div key=${i} className=${'ghost' + (i === 1 ? ' ltr' : '')} style=${{ top: [40, 380, 720][i] + 'px' }}>${t + t}</div>`)}

      <div className="echo">${words('echo-w')}</div>
      ${html`<div className="row" style=${{ top: '120px' }}>
          <div className="big w1"><${Chars} text="תודה על" /></div>
          <div className="fillpill fp1" style=${{ background: C.blue }}>
            <${Line} cls="ltr"><span style=${{ color: C.white, fontWeight: 900, fontSize: '78px', letterSpacing: '-0.01em' }}>THANK YOU!</span><//>
          </div>
        </div>
        <div className="row" style=${{ top: '540px' }}>
          <div className="fillpill fp2" style=${{ background: C.yellow, gap: '16px' }}>
            <span className="dotshape" style=${{ width: '64px', height: '64px', borderRadius: '50%', background: C.black, display: 'block' }}></span>
            <span className="dotshape" style=${{ width: '64px', height: '64px', background: C.black, display: 'block' }}></span>
            <span className="dotshape" style=${{ width: '110px', height: '64px', borderRadius: '999px', background: C.pink, display: 'block' }}></span>
          </div>
          <div className="big w2"><${Chars} text="ההקשבה!" /></div>
        </div>`}

      ${BURST.map((p, i) => html`<${Pill} key=${i} cls="pill-serif bp abs" style=${{ left: p.x + 'px', top: p.y + 'px' }}>${p.t}<//>`)}

      <${Mark} cls="mark" style=${{ left: '922px', top: '34px', width: '76px', height: '76px' }} />
      <div className="abs s10-foot" style=${{ left: '300px', right: '80px', bottom: '34px', display: 'flex', justifyContent: 'space-between' }}>
        <${Line}><${Micro} cls="he" dir="rtl">פרדוקס הבחירה · תקשורת חזותית<//><//>
        <${Line}><${Micro} dir="ltr">THE PARADOX OF CHOICE - FIN.<//><//>
      </div>
    </div>`;
  }

  window.P.slides.push({ id: 's10', Comp: React.forwardRef(S10), bg: C.orange, ink: C.black, chrome: false, transitionIn: 'iris', origin: [285, 765], title: 'תודה על ההקשבה!' });
})();
