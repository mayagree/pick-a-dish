/* ==========================================================================
   app.js - presentation engine
   - fixed 1920×1080 stage, scaled to fit (letterboxed)
   - one slide mounted at a time; transitions cover the stage, the next slide
     mounts underneath, then the cover is removed and the entrance plays
   - input is locked while anything animates → mashing keys can't break it
   - presenter view in a second window, synced with postMessage
   ========================================================================== */
(function () {
  const { useState, useRef, useEffect, useLayoutEffect } = React;
  const { html, C, slides: SLIDES, transitions: TR } = window.P;
  const N = SLIDES.length;
  const pad = (n) => String(n).padStart(2, '0');

  function useFit() {
    const [s, setS] = useState(1);
    useEffect(() => {
      const fit = () => setS(Math.min(window.innerWidth / 1920, window.innerHeight / 1080));
      fit();
      window.addEventListener('resize', fit);
      return () => window.removeEventListener('resize', fit);
    }, []);
    return s;
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {});
    else document.exitFullscreen?.();
  }

  /* ---------------- audience view ---------------- */
  function Deck() {
    const scale = useFit();
    const [view, setView] = useState({ index: 0, key: 0, mode: 'standby' });
    const [standby, setStandby] = useState(true);
    const [help, setHelp] = useState(false);
    const [mouse, setMouse] = useState(false);

    const busy = useRef(false);
    const idx = useRef(0);
    const step = useRef(0);
    const started = useRef(false);
    const slideRef = useRef(null);
    const overlayRef = useRef(null);
    const chromeRef = useRef(null);
    const pending = useRef(null);
    const presenter = useRef(null);
    const actions = useRef({});

    // after every (re)mount: settle if arriving backwards, then release the waiting navigation
    useLayoutEffect(() => {
      if (view.mode === 'settle' && slideRef.current) slideRef.current.settle();
      const p = pending.current; pending.current = null;
      if (p) p();
    }, [view.key]);


    const mount = (index, mode) => new Promise((res) => {
      pending.current = res;
      setView((v) => ({ index, key: v.key + 1, mode }));
    });

    const broadcast = () => {
      const w = presenter.current;
      if (w && !w.closed) w.postMessage({ type: 'state', index: idx.current, step: step.current, steps: slideRef.current ? slideRef.current.stepCount() : 0, started: started.current }, '*');
    };

    async function goTo(target, dir) {
      if (busy.current || target < 0 || target >= N || target === idx.current) return;
      busy.current = true;
      const to = SLIDES[target], from = SLIDES[idx.current];
      const spec = dir > 0 ? to : from;
      const color = dir > 0 ? (to.cover || to.bg) : to.bg;
      try {
        await TR.cover(overlayRef.current, spec.transitionIn, { to: color, dir, layers: spec.layers, origin: spec.origin, label: dir > 0 ? spec.pillLabel : null, labelColor: C.black, accent: spec.accent });
        idx.current = target; step.current = 0;
        await mount(target, dir > 0 ? 'enter' : 'settle');
        if (dir < 0) step.current = slideRef.current.stepCount();
        TR.clear(overlayRef.current);
        broadcast();
        if (dir > 0) await slideRef.current.play();
      } finally {
        busy.current = false;
        broadcast();
      }
    }

    async function next() {
      if (busy.current) return;
      const s = slideRef.current;
      if (!started.current) {
        started.current = true; busy.current = true; setStandby(false); broadcast();
        await s.play(); busy.current = false; return;
      }
      if (step.current < s.stepCount()) {
        busy.current = true;
        const i = step.current; step.current += 1; broadcast();
        await s.step(i); busy.current = false; return;
      }
      await goTo(idx.current + 1, 1);
    }
    async function prev() {
      if (busy.current || !started.current) return;
      await goTo(idx.current - 1, -1);
    }
    async function replay() {
      if (busy.current) return;
      busy.current = true; started.current = true; setStandby(false);
      step.current = 0;
      await mount(idx.current, 'enter');
      broadcast();
      await slideRef.current.play();
      busy.current = false; broadcast();
    }
    async function jump(i) {
      if (busy.current) return;
      if (!started.current) { started.current = true; setStandby(false); }
      if (i === idx.current) return replay();
      await goTo(i, 1);
    }
    function openPresenter() {
      const url = location.href.split('?')[0].split('#')[0] + '?presenter=1';
      presenter.current = window.open(url, 'paradox-presenter', 'width=1180,height=800');
      setTimeout(broadcast, 800);
    }
    actions.current = { next, prev, replay, jump, openPresenter };

    // ?s=5 opens directly on slide 5, fully settled (rehearsal / review)
    useEffect(() => {
      const s = parseInt(new URLSearchParams(location.search).get('s'), 10);
      if (s >= 1 && s <= N) {
        started.current = true; setStandby(false);
        idx.current = s - 1;
        mount(s - 1, 'settle').then(() => { step.current = slideRef.current.stepCount(); broadcast(); });
      }
    }, []);

    // keyboard (uses physical key codes, so it works on a Hebrew keyboard layout too)
    useEffect(() => {
      const onKey = (e) => {
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        const a = actions.current;
        const k = e.code || e.key;
        if (['ArrowRight', 'ArrowDown', 'Space', 'PageDown', 'Enter', 'NumpadEnter'].includes(k)) { e.preventDefault(); if (!e.repeat) a.next(); }
        else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); if (!e.repeat) a.prev(); }
        else if (k === 'KeyF') toggleFullscreen();
        else if (k === 'KeyR') a.replay();
        else if (k === 'KeyP') a.openPresenter();
        else if (k === 'KeyH' || e.key === '?') setHelp((h) => !h);
        else if (k === 'Escape') setHelp(false);
        else if (k === 'Home') a.jump(0);
        else if (k === 'End') a.jump(N - 1);
        else if (/^Digit[0-9]$/.test(k)) { const d = +k.slice(5); a.jump(d === 0 ? 9 : d - 1); }
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }, []);

    // presenter window → commands
    useEffect(() => {
      const onMsg = (e) => {
        if (!presenter.current || e.source !== presenter.current) return;
        const d = e.data || {};
        if (d.type === 'hello') broadcast();
        if (d.type === 'cmd') {
          const a = actions.current;
          if (d.cmd === 'next') a.next();
          if (d.cmd === 'prev') a.prev();
          if (d.cmd === 'replay') a.replay();
        }
      };
      window.addEventListener('message', onMsg);
      return () => window.removeEventListener('message', onMsg);
    }, []);

    // cursor + tiny controls appear only while the mouse moves
    useEffect(() => {
      let t;
      const onMove = () => { setMouse(true); document.body.classList.remove('hide-cursor'); clearTimeout(t); t = setTimeout(() => { setMouse(false); document.body.classList.add('hide-cursor'); }, 1800); };
      window.addEventListener('mousemove', onMove);
      document.body.classList.add('hide-cursor');
      return () => window.removeEventListener('mousemove', onMove);
    }, []);

    const S = SLIDES[view.index];
    const Comp = S.Comp;
    const ink = S.ink;

    return html`<div className="viewport">
      <div className="stage" style=${{ transform: `translate(-50%, -50%) scale(${scale})`, background: S.bg }}>
        <${Comp} key=${view.key} ref=${slideRef} />

        <div className="chrome" ref=${chromeRef} style=${{ color: ink, transition: 'color .5s' }}>
          <span className="c-title" style=${{ opacity: S.chrome ? 1 : 0 }}>פרדוקס הבחירה</span>
          <span className="c-mid" dir="ltr" style=${{ opacity: S.chrome ? 1 : 0 }}>THE PARADOX OF CHOICE - VISUAL COMMUNICATION</span>
          <span className="c-count">
            <span className="c-num cur"><span key=${view.index}>${pad(view.index + 1)}</span></span>
            <span>/</span><span>${pad(N)}</span>
          </span>
        </div>

        <div className="overlay" ref=${overlayRef}></div>

        ${standby ? html`<div className="standby"><span className="dot"></span>PRESS SPACE TO BEGIN · F FULLSCREEN · P PRESENTER VIEW</div>` : null}
        ${help ? html`<div className="help">
          <h3>שליטה במצגת</h3>
          <div><kbd>→</kbd><kbd>Space</kbd> הבא / השלב הבא בשקף</div>
          <div><kbd>←</kbd> שקף קודם</div>
          <div><kbd>R</kbd> הפעלה מחדש של האנימציה</div>
          <div><kbd>F</kbd> מסך מלא</div>
          <div><kbd>P</kbd> חלון מציג עם הערות</div>
          <div><kbd>1-9</kbd><kbd>0</kbd> קפיצה לשקף</div>
          <div><kbd>H</kbd> הצגה / הסתרה של העזרה</div>
        </div>` : null}
      </div>
      <button onClick=${toggleFullscreen} title="מסך מלא (F)" style=${{ position: 'fixed', left: '14px', bottom: '14px', zIndex: 99, opacity: mouse ? 0.85 : 0, transition: 'opacity .3s', background: '#101010', color: '#fff', border: 0, borderRadius: '999px', padding: '8px 14px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px', cursor: 'pointer' }}>FULLSCREEN ⤢</button>
    </div>`;
  }

  /* ---------------- presenter view ---------------- */
  function Presenter() {
    const [st, setSt] = useState({ index: 0, step: 0, steps: 0, started: false });
    const [now, setNow] = useState(Date.now());
    const t0 = useRef(null);
    const send = (cmd) => window.opener && window.opener.postMessage({ type: 'cmd', cmd }, '*');

    useEffect(() => {
      document.title = 'מציג - פרדוקס הבחירה';
      const onMsg = (e) => {
        if (e.source !== window.opener) return;
        if (e.data && e.data.type === 'state') {
          setSt(e.data);
          if (e.data.started && !t0.current) t0.current = Date.now();
        }
      };
      window.addEventListener('message', onMsg);
      if (window.opener) window.opener.postMessage({ type: 'hello' }, '*');
      const iv = setInterval(() => setNow(Date.now()), 500);
      const onKey = (e) => {
        const k = e.code;
        if (['ArrowRight', 'ArrowDown', 'Space', 'PageDown', 'Enter'].includes(k)) { e.preventDefault(); if (!e.repeat) send('next'); }
        else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); if (!e.repeat) send('prev'); }
        else if (k === 'KeyR') send('replay');
      };
      window.addEventListener('keydown', onKey);
      return () => { window.removeEventListener('message', onMsg); window.removeEventListener('keydown', onKey); clearInterval(iv); };
    }, []);

    const el = t0.current ? Math.floor((now - t0.current) / 1000) : 0;
    const mm = pad(Math.floor(el / 60)), ss = pad(el % 60);
    const S = SLIDES[st.index], NX = SLIDES[st.index + 1];
    const note = window.P.notes[st.index] || { text: [], time: '' };
    const clock = new Date(now).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });

    return html`<div className="presenter" dir="rtl">
      <header>
        <div className="pv-num" dir="ltr">${pad(st.index + 1)}<small>/${pad(N)}</small></div>
        <div className="pv-title">
          <div className="pv-k">שקף נוכחי · ${note.time}</div>
          <div className="pv-t">${S.title}</div>
          ${st.steps ? html`<div className="pv-steps">${Array.from({ length: st.steps }, (_, i) => html`<span key=${i} className=${i < st.step ? 'on' : ''}></span>`)}<em>${st.step < st.steps ? `נותרו ${st.steps - st.step} לחיצות בשקף` : 'השקף הושלם - הלחיצה הבאה עוברת שקף'}</em></div>` : null}
        </div>
        <div className="pv-timer" dir="ltr">${mm}:${ss}<small>${clock}</small></div>
      </header>
      <main>
        ${!st.started ? html`<p className="pv-wait">המצגת ממתינה - לחצו רווח כדי להתחיל את אנימציית הפתיחה.</p>` : null}
        ${note.text.map((p, i) => html`<p key=${i} className=${p.startsWith('[לחיצה]') ? 'cue' : ''}>${p.startsWith('[לחיצה]') ? html`<b>לחיצה ▸</b>${p.replace('[לחיצה]', '')}` : p}</p>`)}
      </main>
      <footer>
        <div><span className="pv-k">הבא:</span> ${NX ? NX.title : '- סוף המצגת -'}</div>
        <div className="pv-btns">
          <button onClick=${() => send('prev')}>→ הקודם</button>
          <button onClick=${() => send('replay')}>↺ הפעלה מחדש</button>
          <button className="pri" onClick=${() => send('next')}>הבא ←</button>
        </div>
      </footer>
    </div>`;
  }

  /* ---------------- boot: wait for fonts so nothing reflows mid-animation ---------------- */
  const isPresenter = new URLSearchParams(location.search).has('presenter');
  const fonts = Promise.all([
    document.fonts.load('900 100px Heebo', 'אבג'),
    document.fonts.load('400 100px Heebo', 'אבג'),
    document.fonts.load('500 40px "Frank Ruhl Libre"', 'אבג'),
    document.fonts.load('500 15px "IBM Plex Mono"', 'ABC'),
  ]).catch(() => {});
  const timeout = new Promise((r) => setTimeout(r, 2500));
  Promise.race([fonts, timeout]).then(() => {
    ReactDOM.createRoot(document.getElementById('root')).render(html`<${isPresenter ? Presenter : Deck} />`);
  });
})();
