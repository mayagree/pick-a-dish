/* SLIDE 04 - WHO POPULARIZED THE IDEA: an editorial spread */
(function () {
  const { html, C, Chars, Line, Pill, Micro, Star, useSlide } = window.P;

  function S04(props, ref) {
    const root = useSlide(ref, (q) => {
      const tl = gsap.timeline({ paused: true });
      // 2004 grows into the frame; each digit from its own direction
      tl.fromTo(q('.y2004'), { scale: 0.18, transformOrigin: '0% 100%' }, { scale: 1, duration: 1.5, ease: 'studio' }, 0);
      const dirs = [{ y: -700, rotation: -40 }, { x: -600, rotation: 30 }, { y: 700, rotation: 25 }, { x: 700, rotation: -30 }];
      q('.dg').forEach((d, i) => tl.fromTo(d, { ...dirs[i], x: dirs[i].x || 0, y: dirs[i].y || 0 }, { x: 0, y: 0, rotation: 0, duration: 1.3, ease: 'punch' }, 0.1 + i * 0.08));

      // the name - letters slide in around the year
      tl.fromTo(q('.hd .mi'), { yPercent: 110 }, { yPercent: 0, duration: 0.8 }, 0.5);
      tl.fromTo(q('.name .ch'), { autoAlpha: 0, xPercent: (i) => (i % 2 ? -260 : 260), yPercent: (i) => (i % 3 - 1) * 90, rotation: (i) => (i % 2 ? -25 : 25) }, { autoAlpha: 1, xPercent: 0, yPercent: 0, rotation: 0, duration: 1.1, ease: 'punch', stagger: { each: 0.05, from: 'random' } }, 0.6);

      // the book graphic unfolds
      tl.fromTo(q('.book'), { rotationY: -100, rotation: -30, x: -120 }, { rotationY: 0, rotation: -9, x: 0, duration: 1.4, ease: 'studio' }, 1.0);
      tl.fromTo(q('.book .bl'), { yPercent: 110 }, { yPercent: 0, duration: 0.7, stagger: 0.07 }, 1.8);
      tl.fromTo(q('.bcap'), { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: 'studio' }, 2.3);

      // small editorial details, one after another
      tl.fromTo(q('.para'), { clipPath: 'inset(0% 0% 100% 0%)', y: 30 }, { clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: 1.0, ease: 'studio' }, 1.9);
      tl.fromTo(q('.note'), { clipPath: 'inset(0% 0% 0% 100%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'studio' }, 2.5);
      tl.fromTo(q('.star4'), { scale: 0, rotation: 200 }, { scale: 1, rotation: 0, duration: 1.2 }, 1.2);
      tl.fromTo(q('.tick'), { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 0.8, ease: 'studio', stagger: 0.05 }, 0.9);
      return { enter: tl };
    });

    return html`<div className="slide s04" ref=${root}>
      <div className="abs" style=${{ left: '80px', top: '96px', display: 'flex', gap: '10px' }}>
        ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => html`<div key=${i} className="tick" style=${{ width: '46px', height: '6px', background: i === 7 ? C.orange : C.black }}></div>`)}
      </div>
      <div className="abs ltr" style=${{ left: '80px', top: '124px' }}><${Micro}>ISSUE 04 - WHO · WHEN · WHAT<//></div>

      <div className="y2004 ltr">${'2004'.split('').map((d, i) => html`<span key=${i} className="dg">${d}</span>`)}</div>

      <div className="book-wrap">
        <div className="book">
          <div className="abs" style=${{ right: 0, top: 0, bottom: 0, width: '34px', background: C.black }}></div>
          <div className="abs ltr" style=${{ left: '30px', top: '34px', right: '60px', textAlign: 'left' }}>
            <${Micro}><span className="mask"><span className="mi bl">BOOK · 2004</span></span><//>
            <div style=${{ fontWeight: 900, fontSize: '46px', lineHeight: 0.92, marginTop: '22px', letterSpacing: '-0.02em' }}>
              <span className="mask"><span className="mi bl">The</span></span>
              <span className="mask"><span className="mi bl">Paradox</span></span>
              <span className="mask"><span className="mi bl">of Choice</span></span>
            </div>
            <div style=${{ fontFamily: 'var(--f-serif)', fontSize: '30px', lineHeight: 1.05, marginTop: '18px' }}>
              <span className="mask"><span className="mi bl">Why More</span></span>
              <span className="mask"><span className="mi bl">Is Less</span></span>
            </div>
          </div>
          <div className="abs ltr" style=${{ left: '30px', bottom: '30px' }}><${Micro}><span className="mask"><span className="mi bl">BARRY SCHWARTZ</span></span><//></div>
          <div className="abs" style=${{ left: '196px', bottom: '74px', width: '84px', height: '84px', borderRadius: '50%', background: C.orange }}></div>
          <div className="abs" style=${{ left: '160px', bottom: '74px', width: '84px', height: '84px', borderRadius: '50%', border: '5px solid ' + C.black }}></div>
        </div>
      </div>
      <div className="abs bcap" style=${{ left: '1000px', top: '930px' }}><${Micro} cls="he" dir="rtl" style=${{ fontSize: '15px' }}>* ייצוג גרפי של הספר - לא העטיפה המקורית<//></div>

      <${Star} cls="star4" fill=${C.black} points=${12} inner=${0.6} style=${{ left: '1000px', top: '150px', width: '130px', height: '130px' }} />

      <div className="col">
        <div className="hd"><${Line} style=${{ fontWeight: 800, fontSize: '50px', lineHeight: 1 }}>מי עומד מאחורי הרעיון?<//></div>
        <div className="name" style=${{ marginTop: '34px' }}><div><${Chars} text="בארי" /></div><div><${Chars} text="שוורץ" /></div></div>
        <p className="para" style=${{ margin: '44px 0 0' }}>
          בשנת 2004 פרסם הפסיכולוג בארי שוורץ את הספר <b>"פרדוקס הבחירה"</b>, שבו הסביר מדוע יותר אפשרויות לא תמיד מובילות להחלטות טובות יותר - או לשביעות רצון גבוהה יותר.
        </p>
        <div className="note" style=${{ marginTop: '26px' }}>
          הרעיון נשען על מחקרים קודמים על <b>עומס בחירה</b> - בין היתר של שינה איינגר ומארק לפר <span className="ltr" style=${{ fontFamily: 'var(--f-mono)', fontSize: '17px' }}>(Iyengar & Lepper, 2000)</span>.
        </div>
      </div>
    </div>`;
  }

  window.P.slides.push({ id: 's04', Comp: React.forwardRef(S04), bg: C.grey, ink: C.black, chrome: true, transitionIn: 'panels', title: 'מי עומד מאחורי הרעיון?' });
})();
