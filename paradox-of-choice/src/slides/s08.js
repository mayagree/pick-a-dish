/* SLIDE 08 - IS OVERLOAD ALWAYS BAD? Expressive chaos… that becomes an intentional poster */
(function () {
  const { html, C, Line, Pill, Micro, Star, useSlide } = window.P;

  // giant overlapping words inside the poster (poster coords = full canvas)
  const WORDS = [
    { t: 'רעש', x: 980, y: 40, fs: 560, c: C.yellow, rot: -6, from: { x: 1400, rotation: 40 } },
    { t: 'עומס', x: -120, y: 260, fs: 480, c: C.black, rot: 4, from: { x: -1600, rotation: -30 } },
    { t: 'הבעה', x: 760, y: 560, fs: 420, c: C.white, rot: -3, from: { y: 900, rotation: 20 } },
    { t: 'קצב', x: 120, y: -60, fs: 300, c: C.blue, rot: 8, from: { y: -800, rotation: -40 } },
    { t: 'צבע', x: 1340, y: 640, fs: 330, c: C.black, rot: -12, from: { x: 1200, y: 600, rotation: 60 } },
    { t: 'אנרגיה', x: -60, y: 760, fs: 300, c: C.yellow, rot: 2, from: { x: -1200, rotation: 25 } },
  ];

  function S08(props, ref) {
    const root = useSlide(ref, (q) => {
      const enter = gsap.timeline({ paused: true });
      enter.fromTo(q('.gw'), { x: (i) => WORDS[i].from.x || 0, y: (i) => WORDS[i].from.y || 0, rotation: (i) => WORDS[i].from.rotation, scale: 1.4 },
        { x: 0, y: 0, rotation: (i) => WORDS[i].rot, scale: 1, duration: 1.4, ease: 'punch', stagger: { each: 0.1, from: 'random' } }, 0);
      enter.fromTo(q('.g-circle'), { scale: 0 }, { scale: 1, duration: 1.2, ease: 'punch' }, 0.3);
      enter.fromTo(q('.g-tri'), { rotation: -180, scale: 0, transformOrigin: '50% 50%' }, { rotation: 0, scale: 1, duration: 1.4 }, 0.4);
      enter.fromTo(q('.g-half'), { rotation: 90, x: -400 }, { rotation: 0, x: 0, duration: 1.2, ease: 'punch' }, 0.5);
      enter.fromTo(q('.g-star'), { rotation: -360, scale: 0 }, { rotation: 0, scale: 1, duration: 1.6 }, 0.2);
      enter.fromTo(q('.g-pill'), { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 0.9, ease: 'studio' }, 0.7);
      // keep it alive for a beat - controlled visual tension
      enter.to(q('.gw'), { rotation: (i) => WORDS[i].rot + (i % 2 ? 4 : -4), x: (i) => (i % 2 ? 30 : -30), duration: 1.1, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 1.4);
      enter.to(q('.g-star'), { rotation: 180, duration: 2.2, ease: 'power1.inOut' }, 1.4);
      enter.fromTo(q('.qpill'), { scale: 0, rotation: -10 }, { scale: 1, rotation: -2, duration: 0.7, ease: 'back.out(2)' }, 1.0);

      /* the reorganization: the chaos is framed - it becomes a poster with a purpose */
      const step = gsap.timeline({ paused: true });
      step.to(q('.poster'), { scale: 0.43, x: 96, y: 300, rotation: -4, boxShadow: '30px 30px 0 0 #101010', borderRadius: 18, duration: 1.4, ease: 'studio' }, 0);
      step.to(q('.qpill'), { rotation: 0, duration: 0.6 }, 0.4);
      step.fromTo(q('.ans .ch, .ans .mi'), { yPercent: 115 }, { yPercent: 0, duration: 1.0, stagger: 0.04 }, 0.7);
      step.fromTo(q('.stmt .mi'), { yPercent: 110 }, { yPercent: 0, duration: 0.8, stagger: 0.08 }, 1.1);
      step.fromTo(q('.vs'), { scale: 0, rotation: 8 }, { scale: 1, rotation: (i) => (i ? 2 : -2), duration: 0.55, ease: 'back.out(2.2)', stagger: 0.15 }, 1.6);
      step.fromTo(q('.pcap .mi'), { yPercent: 110 }, { yPercent: 0, duration: 0.7, stagger: 0.08 }, 1.8);
      return { enter, steps: [step] };
    });

    return html`<div className="slide s08" ref=${root}>
      <div className="poster">
        <div className="abs g-circle" style=${{ left: '520px', top: '140px', width: '560px', height: '560px', borderRadius: '50%', background: C.blue }}></div>
        <svg className="abs g-tri" style=${{ left: '1380px', top: '300px', width: '420px', height: '420px' }} viewBox="0 0 100 100"><path d="M0 100 L100 100 L100 0 Z" fill=${C.orange} /></svg>
        <div className="abs g-half" style=${{ left: '-40px', top: '600px', width: '560px', height: '280px', borderRadius: '280px 280px 0 0', background: C.orange }}></div>
        <div className="abs g-pill" style=${{ left: '600px', top: '860px', width: '760px', height: '150px', borderRadius: '999px', background: C.black }}></div>
        ${WORDS.map((w, i) => html`<div key=${i} className="gw" style=${{ left: w.x + 'px', top: w.y + 'px', fontSize: w.fs + 'px', color: w.c }}>${w.t}</div>`)}
        <${Star} cls="g-star" fill=${C.white} points=${10} inner=${0.38} style=${{ left: '1560px', top: '-60px', width: '330px', height: '330px' }} />
        <div className="abs ltr" style=${{ left: '60px', bottom: '40px', color: C.black }}><${Micro}>EXPRESSIVE POSTER - FIG. 08<//></div>
      </div>

      <div className="abs qpill" style=${{ right: '80px', top: '76px' }}>
        <${Pill} style=${{ background: C.black, color: C.white, fontWeight: 900, fontSize: '58px', padding: '22px 46px 28px' }}>האם עומס הוא תמיד דבר רע?<//>
      </div>

      <div className="abs ans" style=${{ right: '96px', top: '236px', fontWeight: 900, fontSize: '190px', lineHeight: 0.9, color: C.black }}>
        <${Line}>לא בהכרח.<//>
      </div>
      <div className="abs stmt" style=${{ right: '100px', top: '470px', width: '800px', fontSize: '35px', lineHeight: 1.32, fontWeight: 500 }}>
        <${Line}>בעיצוב אקספרסיבי, מורכבות יכולה לעורר<//>
        <${Line}>עניין ולמשוך תשומת לב. אבל כשצריך להבין<//>
        <${Line}>מידע או לקבל החלטה - <b>בהירות הופכת</b><//>
        <${Line}><b>לחשובה במיוחד.</b><//>
      </div>
      <div className="abs" style=${{ right: '100px', top: '700px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '14px' }}>
        <${Pill} cls="vs" style=${{ background: C.pink, color: C.white, fontSize: '28px', fontWeight: 700, padding: '14px 28px 17px', gap: '14px' }}>
          <span>פוסטר, כרזה, מיתוג</span><span style=${{ fontFamily: 'var(--f-serif)' }}>←</span><span>מורכבות שמושכת</span>
        <//>
        <${Pill} cls="vs" style=${{ background: C.blue, color: C.white, fontSize: '28px', fontWeight: 700, padding: '14px 28px 17px', gap: '14px' }}>
          <span>תהליך רכישה, טופס, תפריט</span><span style=${{ fontFamily: 'var(--f-serif)' }}>←</span><span>צריך בהירות</span>
        <//>
      </div>
      <div className="abs pcap" style=${{ left: '96px', top: '835px', width: '840px', fontWeight: 900, fontSize: '36px', lineHeight: 1.2 }}>
        <${Line}>מורכבות יכולה להיות מכוונת -<//>
        <${Line}>כל עוד היא משרתת את המסר.<//>
        <div style=${{ marginTop: '10px' }}><${Line}><${Micro} dir="ltr">EXPRESSIVE COMPLEXITY ≠ CHOICE OVERLOAD<//><//></div>
      </div>
    </div>`;
  }

  window.P.slides.push({ id: 's08', Comp: React.forwardRef(S08), bg: C.yellow, ink: C.black, chrome: true, transitionIn: 'diagonal', cover: C.pink, accent: C.yellow, title: 'האם עומס הוא תמיד דבר רע?' });
})();
