/* SLIDE 09 - THE TAKEAWAY: "יותר" floods the screen, collapses, and one statement remains */
(function () {
  const { html, C, Chars, Line, Micro, useSlide } = window.P;

  const SIZES = [130, 80, 160, 70, 120, 90, 150, 70, 110, 100]; // sums to 1080
  let acc = 0;
  const ROWS = SIZES.map((s, i) => {
    const top = acc; acc += s;
    const n = Math.ceil(2400 / (s * 2.0));
    return { top, s, n, dir: i % 2 ? 1 : -1 };
  });

  function S09(props, ref) {
    const root = useSlide(ref, (q) => {
      const tl = gsap.timeline({ paused: true });
      // 1 - "more" multiplies, fast
      tl.fromTo(q('.m'), { scale: 0 }, { scale: 1, duration: 0.3, ease: 'back.out(3)', stagger: { each: 0.0075, from: 'random' } }, 0.05);
      q('.mrow').forEach((row, i) => tl.fromTo(row, { x: ROWS[i].dir * -160 }, { x: ROWS[i].dir * 160, duration: 2.3, ease: 'power1.inOut' }, 0));
      // 2 - everything merges into a single line at the centre, then vanishes
      q('.mrow').forEach((row, i) => tl.to(row, { y: 540 - (ROWS[i].top + ROWS[i].s / 2), scaleY: 0.02, duration: 0.75, ease: 'studio' }, 2.0 + Math.abs(i - 4.5) * 0.025));
      tl.to(q('.mrow'), { scaleX: 0, duration: 0.45, ease: 'power3.in' }, 2.75);
      tl.fromTo(q('.flash'), { scaleX: 0 }, { scaleX: 1, duration: 0.4, ease: 'studio' }, 2.7);
      tl.to(q('.flash'), { scaleY: 0, duration: 0.35, ease: 'power3.in' }, 3.1);
      // 3 - the residue: one huge, quiet "יותר" in the background
      tl.fromTo(q('.ghostword'), { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.4, ease: 'glide' }, 3.05);
      // 4 - one powerful statement
      tl.fromTo(q('.hl .ch'), { yPercent: 120, rotation: 8 }, { yPercent: 0, rotation: 0, duration: 0.9, ease: 'punch', stagger: 0.025 }, 3.2);
      tl.fromTo(q('.strike'), { scaleX: 0, transformOrigin: '100% 50%' }, { scaleX: 1, duration: 0.6, ease: 'studio' }, 4.0);
      tl.fromTo(q('.less'), { scale: 0, rotation: -40 }, { scale: 1, rotation: 0, duration: 0.8, ease: 'punch' }, 4.2);
      tl.fromTo(q('.sub .mi'), { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.1 }, 4.35);
      return { enter: tl };
    });

    return html`<div className="slide s09" ref=${root}>
      <div className="abs ghostword" style=${{ left: '-60px', right: '-60px', top: '30px', textAlign: 'center', fontWeight: 900, fontSize: '760px', lineHeight: 1, color: '#F1F1F3', whiteSpace: 'nowrap' }}>יותר</div>

      ${ROWS.map((row, i) => html`<div key=${i} className="mrow" style=${{ top: row.top + 'px', height: row.s + 'px', fontSize: row.s * 0.92 + 'px', lineHeight: row.s + 'px' }}>
        ${Array.from({ length: row.n }, (_, k) => {
          const v = (i * 7 + k * 3) % 11;
          return html`<span key=${k} className=${'m' + (v === 0 ? ' o' : v === 5 || v === 8 ? ' s' : '')}>יותר</span>`;
        })}
      </div>`)}
      <div className="abs flash" style=${{ left: 0, right: 0, top: '536px', height: '8px', background: C.orange }}></div>

      <div className="abs hl" style=${{ right: '110px', top: '170px', fontWeight: 900, fontSize: '176px', lineHeight: 0.98, letterSpacing: '-0.012em' }}>
        <div className="mask"><${Chars} text="יותר זה לא תמיד" /></div>
        <div className="mask"><div style=${{ position: 'relative', display: 'inline-block' }}>
          <${Chars} text="טוב יותר." />
          <div className="abs strike" style=${{ left: 0, right: 0, bottom: '-6px', height: '14px', background: C.orange }}></div>
        </div></div>
      </div>

      <div className="abs less" style=${{ left: '120px', top: '600px', width: '330px', height: '330px', borderRadius: '50%', background: C.orange, color: C.black, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style=${{ fontWeight: 900, fontSize: '120px', lineHeight: 0.9 }}>פחות</div>
        <div className="ltr" style=${{ marginTop: '14px' }}><${Micro}>LESS, BUT CLEARER<//></div>
      </div>

      <div className="abs sub" style=${{ right: '110px', top: '640px', width: '1060px', fontSize: '46px', lineHeight: 1.25, fontWeight: 400, color: C.black }}>
        <${Line}>עיצוב טוב לא מבטל את חופש הבחירה -<//>
        <${Line}><b style=${{ color: C.pink, fontWeight: 800 }}>הוא הופך את הבחירה לפשוטה וברורה יותר.</b><//>
      </div>
    </div>`;
  }

  window.P.slides.push({ id: 's09', Comp: React.forwardRef(S09), bg: C.white, ink: C.black, chrome: true, transitionIn: 'blinds', title: 'יותר זה לא תמיד טוב יותר.' });
})();
