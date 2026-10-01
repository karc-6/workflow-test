/* =========================================================================
   Shamama — A Retrospective — script.js
   Vanilla JS only. Edit the DATA section below to change photos, videos,
   and the letters.
   ========================================================================= */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.matchMedia("(max-width: 720px)").matches;

  /* =====================================================================
     1. DATA
     ===================================================================== */
  const PHOTOS = [
    { file: "photo1.jpg", caption: "My favourite human" },
    { file: "photo2.jpg", caption: "Always silly" },
    { file: "photo3.jpg", caption: "Through it all" },
    { file: "photo4.jpg", caption: "Little joys" },
    { file: "photo5.jpg", caption: "You glow" },
    { file: "photo6.jpg", caption: "Same chaos, same us" },
    { file: "photo7.jpg", caption: "More adventures with you" },
    { file: "photo8.jpg", caption: "That laugh, again" },
    { file: "photo9.jpg", caption: "Us, unfiltered" },
    { file: "photo10.jpg", caption: "Still my favourite plan" }
  ];

  const VIDEOS = [
    { file: "video1.mp4", caption: "Our silly moments", duration: "0:14" },
    { file: "video2.mp4", caption: "All the random bits", duration: "0:09" },
    { file: "video3.mp4", caption: "A little memory for you", duration: "0:20" }
  ];

  // order + size determine the gallery wall's hang. sizes: wide, feature, portrait, square
  const WALL_LAYOUT = [
    { media: PHOTOS[0], size: "wide" },
    { media: VIDEOS[0], size: "feature" },
    { media: PHOTOS[1], size: "square" },
    { media: PHOTOS[2], size: "portrait" },
    { media: PHOTOS[3], size: "square" },
    { media: VIDEOS[1], size: "feature" },
    { media: PHOTOS[4], size: "portrait" },
    { media: PHOTOS[5], size: "square" },
    { media: PHOTOS[6], size: "square" },
    { media: VIDEOS[2], size: "feature" },
    { media: PHOTOS[7], size: "portrait" },
    { media: PHOTOS[8], size: "square" },
    { media: PHOTOS[9], size: "square" }
  ];

  const NAME = "SHAMAMA";

  const LETTERS = [
    {
      title: "For the girl who always answers the phone",
      body: "Some people give advice. You just pick up. Every single time, no matter what was going on in your own life. I hope this year gives you back a fraction of what you give everyone else."
    },
    {
      title: "For the years ahead",
      body: "I don't know exactly what this year holds for you, but I know you'll meet it the way you meet everything — stubborn, warm, and a little dramatic about it. I like our odds."
    },
    {
      title: "For the small, ordinary days",
      body: "Not every memory here is a big one. Most of them are nothing — a car ride, a dumb joke, waiting for food to arrive. Turns out those were the good part all along."
    }
  ];

  const SONG_TITLE = "a song for you";

  /* =====================================================================
     2. Helpers
     ===================================================================== */
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const rand = (min, max) => Math.random() * (max - min) + min;
  const el = (tag, cls) => { const n = document.createElement(tag); if (cls) n.className = cls; return n; };
  const pad2 = (n) => String(n).padStart(2, "0");

  /* =====================================================================
     3. Entrance kicker date
     ===================================================================== */
  function setEntranceDate() {
    const el = $("#entranceKicker");
    const d = new Date();
    const formatted = d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
    el.textContent = "private exhibition \u00B7 opened " + formatted;
  }

  /* =====================================================================
     4. Drifting dust
     ===================================================================== */
  function buildDust() {
    if (prefersReduced) return;
    const host = $("#dust");
    const count = isMobile ? 10 : 20;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const m = el("span", "mote");
      m.style.left = rand(0, 100) + "%";
      m.style.top = rand(20, 95) + "%";
      m.style.setProperty("--mx", rand(-30, 30) + "px");
      m.style.animationDuration = rand(16, 30) + "s";
      m.style.animationDelay = rand(0, 18) + "s";
      frag.appendChild(m);
    }
    host.appendChild(frag);
  }

  /* =====================================================================
     5. Gallery wall
     ===================================================================== */
  let photoSequence = []; // for lightbox prev/next
  let lightboxIndex = -1;

  function frameMarkup(item, plateNum) {
    const m = item.media;
    if (m.duration !== undefined) {
      return (
        '<button type="button" class="frame frame--' + item.size + ' reveal-on-scroll" data-type="video" data-file="' + m.file +
        '" data-caption="' + m.caption + '">' +
        '<span class="frame__img"><span class="frame__video-thumb"><span class="frame__play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>' +
        '<span class="frame__duration">' + m.duration + '</span></span></span>' +
        '<span class="frame__plate"><span class="frame__num">' + pad2(plateNum) + '</span><span class="frame__cap">' + m.caption + '</span></span>' +
        '</button>'
      );
    }
    return (
      '<button type="button" class="frame frame--' + item.size + ' reveal-on-scroll" data-type="photo" data-file="' + m.file +
      '" data-caption="' + m.caption + '">' +
      '<span class="frame__img"><img loading="lazy" src="images/' + m.file + '" alt=""></span>' +
      '<span class="frame__plate"><span class="frame__num">' + pad2(plateNum) + '</span><span class="frame__cap">' + m.caption + '</span></span>' +
      '</button>'
    );
  }

  function buildWall() {
    const host = $("#wall");
    const frag = document.createDocumentFragment();
    WALL_LAYOUT.forEach((item, i) => {
      const wrap = el("div");
      wrap.innerHTML = frameMarkup(item, i + 1);
      const frame = wrap.firstElementChild;
      frame.style.transitionDelay = (i % 6) * 70 + "ms";
      frag.appendChild(frame);
      if (item.media.duration === undefined) {
        photoSequence.push({ file: item.media.file, caption: item.media.caption });
      }
      const img = $("img", frame);
      if (img) {
        img.addEventListener("error", () => {
          frame.classList.add("img-missing");
          $(".frame__img", frame).setAttribute("data-filename", frame.dataset.file);
        });
      }
    });
    host.appendChild(frag);
  }

  /* =====================================================================
     6. Memories in motion
     6a. Drift  — her photos and videos, faint and weightless, behind
                  everything on the page.
     6b. Forge  — the Her Name room. Her memories orbit her name; catch
                  one and set it into a letter, and the letter develops
                  into that photograph (or plays that video). Seven
                  memories later, the name is made of her.
     ===================================================================== */
  let cursorHint = "";
  function setCursorHint(text) { cursorHint = text || ""; }

  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  };
  const calmNow = () => prefersReduced || document.body.classList.contains("calm-mode");
  function onCalmChange(cb) {
    new MutationObserver(cb).observe(document.body, { attributes: true, attributeFilter: ["class"] });
  }

  /* ---------- 6a. Drift ---------- */
  function setupDrift() {
    const host = $("#drift");
    if (!host) return;
    const photos = shuffle(PHOTOS.map((m) => ({ type: "photo", file: m.file })));
    const videos = isMobile ? [] : shuffle(VIDEOS.map((m) => ({ type: "video", file: m.file }))).slice(0, 2);
    const total = isMobile ? 7 : 12;
    const picks = shuffle(photos.slice(0, total - videos.length).concat(videos));
    const playing = [];

    picks.forEach((m, i) => {
      const item = el("div", "drift__item");
      const inner = el("div", "drift__inner");
      const w = isMobile ? rand(150, 230) : rand(210, 370);
      const portrait = Math.random() > 0.45;
      item.style.width = w.toFixed(0) + "px";
      item.style.height = (portrait ? w * 1.3 : w * 0.8).toFixed(0) + "px";
      item.style.left = (((i + rand(0.1, 0.9)) / picks.length) * 100 - 8).toFixed(1) + "%";
      // most sit clearly in the foreground of the backdrop; a few hang further back, softer
      const far = Math.random() < 0.28;
      const o = far ? rand(0.24, 0.34) : m.type === "video" ? rand(0.4, 0.56) : rand(0.5, 0.72);
      inner.style.setProperty("--o", o.toFixed(2));
      inner.style.setProperty("--b", (far ? rand(1.4, 2.4) : 0).toFixed(1) + "px");

      if (prefersReduced) {
        item.style.animation = "none";
        inner.style.animation = "none";
        item.style.top = rand(4, 64).toFixed(0) + "%";
      } else {
        const dur = rand(80, 140);
        item.style.animationDuration = dur.toFixed(0) + "s";
        item.style.animationDelay = (-rand(0, dur)).toFixed(1) + "s";
        inner.style.animationDuration = rand(10, 18).toFixed(1) + "s";
        inner.style.animationDelay = (-rand(0, 10)).toFixed(1) + "s";
      }

      let media;
      if (m.type === "video") {
        media = document.createElement("video");
        media.muted = true; media.loop = true; media.playsInline = true;
        media.setAttribute("muted", ""); media.setAttribute("playsinline", "");
        media.preload = "metadata";
        media.src = "videos/" + m.file;
        playing.push(media);
      } else {
        media = document.createElement("img");
        media.alt = ""; media.decoding = "async"; media.loading = "lazy";
        media.src = "images/" + m.file;
      }
      // a memory that isn't there yet just isn't drawn — no empty ghosts
      media.addEventListener("error", () => item.remove());
      inner.appendChild(media);
      item.appendChild(inner);
      host.appendChild(item);
    });

    const sync = () => playing.forEach((v) => (calmNow() ? v.pause() : v.play().catch(() => {})));
    sync();
    onCalmChange(sync);
  }

  /* ---------- 6b. Forge ---------- */
  function setupForge() {
    const stage = $("#forge");
    const canvas = $("#forgeCanvas");
    const layer = $("#forgeCards");
    const ticksHost = $("#forgeTicks");
    const hintEl = $("#forgeHint");
    if (!stage || !canvas || !layer) return;

    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const TRACK = 0.06;
    const ticks = [];
    let W = 0, H = 0, cw = 92, ch = 118, family = "serif";
    let letters = [];
    let cards = [];
    let particles = [];
    let hoverTarget = -1;
    let active = null;
    let complete = false;
    let running = false, last = 0, time = 0;

    for (let i = 0; i < NAME.length; i++) {
      const t = el("span");
      ticksHost.appendChild(t);
      ticks.push(t);
    }

    const lerp = (a, b, t) => a + (b - a) * t;
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

    /* ----- layout: fit the name, cut a mask + buffer for every letter ----- */
    function layout() {
      const rect = stage.getBoundingClientRect();
      W = Math.round(rect.width);
      if (!W) return;
      const small = W < 800;
      cw = small ? 64 : 92;
      ch = Math.round(cw * 1.28);
      stage.style.setProperty("--cw", cw + "px");
      stage.style.setProperty("--ch", ch + "px");
      family = (getComputedStyle(document.body).getPropertyValue("--font-display") || "serif").trim();

      const rows = small ? [NAME.slice(0, 4), NAME.slice(4)] : [NAME];
      ctx.font = "600 100px " + family;
      const adv100 = {};
      NAME.split("").forEach((c) => { adv100[c] = ctx.measureText(c).width; });
      const rowEm = (s) => s.split("").reduce((a, c) => a + adv100[c] / 100, 0) + TRACK * (s.length - 1);
      const widest = Math.max.apply(null, rows.map(rowEm));
      const fs = small ? Math.min((W * 0.8) / widest, 120) : Math.min((W * 0.72) / widest, 168);
      const lineH = fs * 1.04;
      const blockH = rows.length * lineH;
      H = Math.round(blockH + 2 * (ch * 0.95 + 46));
      stage.style.height = H + "px";
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);

      const prev = letters;
      letters = [];
      let idx = 0;
      rows.forEach((row, r) => {
        let x = (W - rowEm(row) * fs) / 2;
        const baseline = H / 2 - blockH / 2 + r * lineH + lineH * 0.8;
        row.split("").forEach((c) => {
          const adv = (adv100[c] / 100) * fs;
          const pad = fs * 0.09;
          const box = { x0: x - pad, y0: baseline - fs * 0.76 - pad, x1: x + adv + pad, y1: baseline + fs * 0.05 + pad };
          const bw = box.x1 - box.x0, bh = box.y1 - box.y0;
          const L = { ch: c, x, adv, fs, baseline, box, bw, bh, card: prev[idx] ? prev[idx].card : null, dev: prev[idx] ? prev[idx].dev : 0, res: false };
          L.tmp = document.createElement("canvas");
          L.tmp.width = Math.round(bw * dpr); L.tmp.height = Math.round(bh * dpr);
          L.tctx = L.tmp.getContext("2d");
          L.mask = document.createElement("canvas");
          L.mask.width = L.tmp.width; L.mask.height = L.tmp.height;
          const m = L.mask.getContext("2d");
          m.setTransform(dpr, 0, 0, dpr, 0, 0);
          m.font = "600 " + fs + "px " + family;
          m.textBaseline = "alphabetic"; m.textAlign = "left";
          m.fillStyle = "#fff"; m.strokeStyle = "#fff"; m.lineJoin = "round"; m.lineWidth = fs * 0.05;
          m.fillText(c, x - box.x0, baseline - box.y0);
          m.strokeText(c, x - box.x0, baseline - box.y0);
          letters.push(L);
          x += adv + TRACK * fs;
          idx++;
        });
      });
    }

    /* ----- the cards ----- */
    function buildCards() {
      const list = shuffle(
        PHOTOS.map((m) => ({ type: "photo", file: m.file, caption: m.caption }))
          .concat(VIDEOS.map((m) => ({ type: "video", file: m.file, caption: m.caption })))
      );
      const use = isMobile ? list.slice(0, 10) : list;
      use.forEach((m, i) => {
        const node = el("div", "orbit-card" + (m.type === "video" ? " is-video" : ""));
        node.setAttribute("role", "button");
        node.tabIndex = 0;
        node.setAttribute("aria-label", (m.type === "video" ? "Video: " : "Photo: ") + m.caption + ". Press Enter to set it into the next letter.");
        let media;
        if (m.type === "video") {
          media = document.createElement("video");
          media.muted = true; media.loop = true; media.playsInline = true;
          media.setAttribute("muted", ""); media.setAttribute("playsinline", "");
          media.preload = "metadata";
          media.src = "videos/" + m.file;
        } else {
          media = document.createElement("img");
          media.alt = ""; media.draggable = false;
          media.src = "images/" + m.file;
        }
        node.appendChild(media);
        layer.appendChild(node);
        const c = {
          el: node, mediaEl: media, type: m.type, seed: Math.random() * 6.28,
          theta: (i / use.length) * Math.PI * 2 + rand(-0.12, 0.12),
          omega: (Math.PI * 2) / rand(42, 72),
          rm: rand(0.94, 1), tilt: rand(-7, 7),
          speed: 1, hover: false, mode: "orbit",
          x: 0, y: 0, vx: 0, vy: 0, scale: 0.9, opacity: 0, z: "", pe: "",
          gx: 0, gy: 0, down: null, samples: [], snap: null
        };
        node.addEventListener("pointerdown", (e) => onDown(e, c));
        node.addEventListener("pointermove", (e) => onMove(e, c));
        node.addEventListener("pointerup", (e) => onUp(e, c, false));
        node.addEventListener("pointercancel", (e) => onUp(e, c, true));
        node.addEventListener("pointerenter", () => { c.hover = true; if (!active) setCursorHint("Drag"); });
        node.addEventListener("pointerleave", () => { c.hover = false; if (!active) setCursorHint(""); });
        node.addEventListener("keydown", (e) => {
          if (e.key !== "Enter" && e.key !== " ") return;
          e.preventDefault();
          const t = nextEmpty();
          if (t >= 0 && (c.mode === "orbit" || c.mode === "returning")) sendTo(c, t);
        });
        if (m.type === "video" && !isMobile && !calmNow()) media.play().catch(() => {});
        cards.push(c);
      });
      onCalmChange(() => cards.forEach((c) => {
        if (c.type !== "video" || c.mode === "consumed") return;
        if (calmNow() || isMobile) c.mediaEl.pause(); else c.mediaEl.play().catch(() => {});
      }));
    }

    /* ----- helpers ----- */
    const toStage = (e) => {
      const r = stage.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const nextEmpty = () => letters.findIndex((L) => !L.card && !L.res);
    const filledCount = () => letters.filter((L) => L.card).length;
    const letterAt = (x, y) => letters.findIndex((L) => x >= L.box.x0 && x <= L.box.x1 && y >= L.box.y0 && y <= L.box.y1);

    function pickTarget(x, y) {
      let best = -1, bestD = Infinity;
      letters.forEach((L, i) => {
        if (L.card || L.res) return;
        const padX = L.fs * 0.14, padY = L.fs * 0.2;
        if (x < L.box.x0 - padX || x > L.box.x1 + padX || y < L.box.y0 - padY || y > L.box.y1 + padY) return;
        const d = Math.hypot(x - (L.box.x0 + L.box.x1) / 2, y - (L.box.y0 + L.box.y1) / 2);
        if (d < bestD) { bestD = d; best = i; }
      });
      return best;
    }

    function orbitPos(c) {
      const rx = (W / 2 - cw * 0.55) * c.rm;
      const ry = (H / 2 - ch * 0.62) * (0.9 + 0.1 * c.rm);
      const tilt = -0.06;
      const ex = Math.cos(c.theta) * rx, ey = Math.sin(c.theta) * ry;
      const s = Math.sin(c.theta);
      return {
        x: W / 2 + ex * Math.cos(tilt) - ey * Math.sin(tilt),
        y: H / 2 + ex * Math.sin(tilt) + ey * Math.cos(tilt),
        depth: (s + 1) / 2,
        front: s > 0
      };
    }

    /* ----- particles ----- */
    function burst(x, y, n) {
      if (calmNow()) return;
      for (let i = 0; i < n && particles.length < 320; i++) {
        const a = Math.random() * Math.PI * 2, sp = rand(40, 260);
        particles.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0, max: rand(0.5, 1.15), r: rand(0.8, 2.3) });
      }
    }
    function trail(x, y) {
      if (calmNow() || particles.length > 300) return;
      particles.push({ x: x + rand(-8, 8), y: y + rand(-8, 8), vx: rand(-24, 24), vy: rand(-34, 10), life: 0, max: rand(0.4, 0.85), r: rand(0.6, 1.6) });
    }

    /* ----- pointer interaction ----- */
    function onDown(e, c) {
      if (active || c.mode === "snapping" || c.mode === "consumed") return;
      e.preventDefault();
      try { c.el.setPointerCapture(e.pointerId); } catch (_) {}
      const p = toStage(e);
      active = c;
      c.mode = "held";
      c.gx = c.x - p.x; c.gy = c.y - p.y;
      const now = performance.now();
      c.down = { x: p.x, y: p.y, t: now, moved: false };
      c.samples = [{ x: c.x, y: c.y, t: now }];
      c.el.classList.add("is-held");
    }

    function onMove(e, c) {
      if (active !== c) return;
      const p = toStage(e);
      if (!c.down.moved && Math.hypot(p.x - c.down.x, p.y - c.down.y) > 7) c.down.moved = true;
      c.x = clamp(p.x + c.gx, 8, W - 8);
      c.y = clamp(p.y + c.gy, 8, H - 8);
      c.samples.push({ x: c.x, y: c.y, t: performance.now() });
      while (c.samples.length > 8) c.samples.shift();
      hoverTarget = c.down.moved ? pickTarget(c.x, c.y) : -1;
      setCursorHint(hoverTarget >= 0 ? "Drop" : "Drag");
      if (c.down.moved) trail(c.x, c.y);
    }

    function onUp(e, c, cancelled) {
      if (active !== c) return;
      try { c.el.releasePointerCapture(e.pointerId); } catch (_) {}
      c.el.classList.remove("is-held");
      active = null;
      setCursorHint("");
      const isTap = !c.down.moved && performance.now() - c.down.t < 500 && !cancelled;
      let target = -1;
      if (isTap) target = nextEmpty();
      else if (hoverTarget >= 0) target = hoverTarget;
      hoverTarget = -1;
      if (target >= 0) { sendTo(c, target); return; }
      let vx = 0, vy = 0;
      const s = c.samples;
      if (s.length > 1) {
        const a = s[Math.max(0, s.length - 4)], b = s[s.length - 1];
        const dt = (b.t - a.t) / 1000;
        if (dt > 0.001) { vx = (b.x - a.x) / dt; vy = (b.y - a.y) / dt; }
      }
      const sp = Math.hypot(vx, vy);
      if (sp > 1100) { vx *= 1100 / sp; vy *= 1100 / sp; }
      c.vx = vx; c.vy = vy;
      c.mode = "returning";
    }

    stage.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".orbit-card")) return;
      const p = toStage(e);
      const i = letterAt(p.x, p.y);
      if (i >= 0 && letters[i].card && letters[i].dev >= 1) eject(i);
    });
    stage.addEventListener("pointermove", (e) => {
      if (active || e.target.closest(".orbit-card")) return;
      const p = toStage(e);
      const i = letterAt(p.x, p.y);
      setCursorHint(i >= 0 && letters[i].card && letters[i].dev >= 1 ? "Return" : "");
    });
    stage.addEventListener("pointerleave", () => { if (!active) setCursorHint(""); });

    /* ----- filling and emptying letters ----- */
    function sendTo(c, idx) {
      const L = letters[idx];
      L.res = true;
      c.mode = "snapping";
      c.snap = { x0: c.x, y0: c.y, s0: c.scale, t0: time, dur: 0.46, idx };
      c.el.classList.add("is-snapping");
    }

    function fillLetter(c, idx) {
      const L = letters[idx];
      L.res = false;
      L.card = c;
      L.dev = calmNow() ? 1 : 0;
      c.mode = "consumed";
      c.snap = null;
      c.el.classList.remove("is-snapping", "is-held");
      c.el.classList.add("is-consumed");
      c.el.style.opacity = "0";
      c.el.style.pointerEvents = "none";
      c.el.style.zIndex = "-1";
      if (c.type === "video") c.mediaEl.play().catch(() => {});
      burst((L.box.x0 + L.box.x1) / 2, (L.box.y0 + L.box.y1) / 2, 46);
      hintEl.classList.add("is-gone");
      const k = filledCount();
      ticks.forEach((t, i) => t.classList.toggle("is-on", i < k));
      if (k === letters.length) {
        complete = true;
        stage.classList.add("is-complete");
        setTimeout(() => burst(W / 2, H / 2, 90), 1500);
      }
    }

    function eject(idx) {
      const L = letters[idx];
      const c = L.card;
      if (!c) return;
      L.card = null;
      L.dev = 0;
      c.mode = "returning";
      c.x = (L.box.x0 + L.box.x1) / 2;
      c.y = (L.box.y0 + L.box.y1) / 2;
      c.vx = rand(-260, 260);
      c.vy = rand(-320, -120);
      c.scale = 0.6;
      c.opacity = 0;
      c.el.classList.remove("is-consumed");
      c.el.style.zIndex = "";
      complete = false;
      stage.classList.remove("is-complete");
      const k = filledCount();
      ticks.forEach((t, i) => t.classList.toggle("is-on", i < k));
      burst(c.x, c.y, 24);
    }

    /* ----- per-frame update ----- */
    function update(dt, calm) {
      cards.forEach((c) => {
        if (c.mode === "consumed") return;
        c.speed += ((c.hover ? 0.12 : 1) * (complete ? 0.55 : 1) - c.speed) * Math.min(1, dt * 5);
        if (!calm && c.mode !== "held" && c.mode !== "snapping") c.theta += c.omega * dt * c.speed;
        const o = orbitPos(c);
        let targetScale = 0.8 + 0.3 * o.depth;
        let targetOpacity = (0.5 + 0.5 * o.depth) * (complete ? 0.3 : 1);
        let z = o.front ? "3" : "0";
        let pe = o.front ? "auto" : "none";

        if (c.mode === "orbit") {
          c.x = o.x; c.y = o.y;
        } else if (c.mode === "returning") {
          c.vx += ((o.x - c.x) * 16 - c.vx * 6.4) * dt;
          c.vy += ((o.y - c.y) * 16 - c.vy * 6.4) * dt;
          c.x += c.vx * dt; c.y += c.vy * dt;
          if (Math.hypot(o.x - c.x, o.y - c.y) < 3 && Math.hypot(c.vx, c.vy) < 24) c.mode = "orbit";
          z = "4"; pe = "auto";
        } else if (c.mode === "held") {
          targetScale = 1.22; targetOpacity = 1; z = "6"; pe = "auto";
        } else if (c.mode === "snapping") {
          const p = Math.min(1, (time - c.snap.t0) / c.snap.dur);
          const e = p * p * (3 - 2 * p);
          const L = letters[c.snap.idx];
          c.x = lerp(c.snap.x0, (L.box.x0 + L.box.x1) / 2, e);
          c.y = lerp(c.snap.y0, (L.box.y0 + L.box.y1) / 2, e);
          c.scale = lerp(c.snap.s0, 0.5, e);
          c.opacity = 1 - e * 0.92;
          z = "6"; pe = "none";
          if (p >= 1) { fillLetter(c, c.snap.idx); return; }
        }

        if (c.mode !== "snapping") {
          const k = Math.min(1, dt * 10);
          c.scale += (targetScale - c.scale) * k;
          c.opacity += (targetOpacity - c.opacity) * k;
        }
        const lean = clamp(c.vx * 0.02, -10, 10);
        const rot = c.tilt + Math.sin(time * 0.6 + c.seed) * 2 + (c.mode === "held" ? lean : 0);
        c.el.style.transform = "translate3d(" + (c.x - cw / 2).toFixed(1) + "px," + (c.y - ch / 2).toFixed(1) + "px,0) rotate(" + rot.toFixed(1) + "deg) scale(" + c.scale.toFixed(3) + ")";
        c.el.style.opacity = c.opacity.toFixed(3);
        if (z !== c.z) { c.el.style.zIndex = z; c.z = z; }
        if (pe !== c.pe) { c.el.style.pointerEvents = pe; c.pe = pe; }
      });

      letters.forEach((L) => {
        if (L.card && L.dev < 1) L.dev = calm ? 1 : Math.min(1, L.dev + dt / 1.8);
      });
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt;
        if (p.life >= p.max) { particles.splice(i, 1); continue; }
        p.x += p.vx * dt; p.y += p.vy * dt;
        p.vx *= 0.985; p.vy = p.vy * 0.985 + 22 * dt;
      }
    }

    /* ----- drawing ----- */
    function drawMedia(t, card, w, h) {
      const m = card && card.mediaEl;
      let mw = 0, mh = 0, ok = false;
      if (m) {
        if (m.tagName === "VIDEO") { ok = m.readyState >= 2 && m.videoWidth > 0; mw = m.videoWidth; mh = m.videoHeight; }
        else { ok = m.complete && m.naturalWidth > 0; mw = m.naturalWidth; mh = m.naturalHeight; }
      }
      if (!ok) {
        const s = (Math.sin(time * 0.8) + 1) / 2;
        const g = t.createLinearGradient(0, 0, w, h);
        g.addColorStop(0, "#4b3f6e");
        g.addColorStop(0.35 + s * 0.3, "#c9a961");
        g.addColorStop(1, "#8b3a4a");
        t.fillStyle = g;
        t.fillRect(0, 0, w, h);
        return;
      }
      const sc = Math.max(w / mw, h / mh) * 1.06;
      const dw = mw * sc, dh = mh * sc;
      const sway = card.type === "photo" ? Math.sin(time * 0.35 + card.seed) * 0.035 * w : 0;
      t.drawImage(m, (w - dw) / 2 + sway, (h - dh) / 2, dw, dh);
    }

    function drawFilled(L) {
      const t = L.tctx, bw = L.bw, bh = L.bh;
      t.setTransform(dpr, 0, 0, dpr, 0, 0);
      t.globalCompositeOperation = "source-over";
      t.clearRect(0, 0, bw, bh);
      drawMedia(t, L.card, bw, bh);
      t.globalCompositeOperation = "lighter";
      t.fillStyle = "rgba(201,169,97,.14)";
      t.fillRect(0, 0, bw, bh);
      t.globalCompositeOperation = "destination-in";
      t.drawImage(L.mask, 0, 0, bw, bh);
      if (L.dev < 1) {
        const e = 1 - Math.pow(1 - L.dev, 3);
        const edge = e * (bh + 44);
        const g = t.createLinearGradient(0, edge - 44, 0, edge);
        g.addColorStop(0, "rgba(0,0,0,1)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        t.fillStyle = g;
        t.fillRect(0, 0, bw, bh);
        t.globalCompositeOperation = "source-atop";
        const g2 = t.createLinearGradient(0, edge - 52, 0, edge - 6);
        g2.addColorStop(0, "rgba(255,240,200,0)");
        g2.addColorStop(1, "rgba(255,240,200,.8)");
        t.fillStyle = g2;
        t.fillRect(0, edge - 52, bw, 46);
      } else if (complete && !calmNow()) {
        const sx = ((time * 0.22) % 1.6) * (W + 320) - 320 - L.box.x0;
        t.globalCompositeOperation = "source-atop";
        const g = t.createLinearGradient(sx - 90, 0, sx + 90, 0);
        g.addColorStop(0, "rgba(255,246,222,0)");
        g.addColorStop(0.5, "rgba(255,246,222,.42)");
        g.addColorStop(1, "rgba(255,246,222,0)");
        t.fillStyle = g;
        t.fillRect(0, 0, bw, bh);
      }
      t.globalCompositeOperation = "source-over";

      // halo under the developed letter
      ctx.save();
      ctx.shadowColor = "rgba(201,169,97,.6)";
      ctx.shadowBlur = 30 * Math.min(1, L.dev * 1.5);
      ctx.fillStyle = "rgba(201,169,97,.22)";
      ctx.fillText(L.ch, L.x, L.baseline);
      ctx.lineWidth = L.fs * 0.05 + 3;
      ctx.strokeStyle = "rgba(240,222,170," + (0.3 + 0.55 * Math.min(1, L.dev * 1.5)).toFixed(2) + ")";
      ctx.shadowBlur = 0;
      ctx.strokeText(L.ch, L.x, L.baseline);
      ctx.restore();
      ctx.drawImage(L.tmp, L.box.x0, L.box.y0, bw, bh);
    }

    function drawGlass(L, isTarget, isNext, calm) {
      ctx.fillStyle = isTarget ? "rgba(227,205,151,.16)" : "rgba(242,237,225,.045)";
      ctx.fillText(L.ch, L.x, L.baseline);
      const breathe = isNext && !calm ? 0.14 * Math.sin(time * 2.2) : 0;
      ctx.lineWidth = isTarget ? 2.2 : 1.4;
      ctx.strokeStyle = isTarget ? "#f2ede1" : "rgba(201,169,97," + (0.5 + breathe).toFixed(2) + ")";
      if (isTarget) { ctx.shadowColor = "rgba(227,205,151,.95)"; ctx.shadowBlur = 28; }
      ctx.strokeText(L.ch, L.x, L.baseline);
      ctx.shadowBlur = 0;
    }

    function draw(calm) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.textBaseline = "alphabetic";
      ctx.textAlign = "left";
      ctx.lineJoin = "round";
      const nextIdx = nextEmpty();
      letters.forEach((L, i) => {
        ctx.font = "600 " + L.fs + "px " + family;
        if (L.card) drawFilled(L);
        else drawGlass(L, i === hoverTarget, i === nextIdx, calm);
      });
      if (particles.length) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        particles.forEach((p) => {
          const a = 1 - p.life / p.max;
          ctx.fillStyle = "rgba(255,226,150," + (a * 0.9).toFixed(2) + ")";
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();
      }
    }

    function frame(now) {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      time += dt;
      const calm = calmNow();
      update(dt, calm);
      draw(calm);
      requestAnimationFrame(frame);
    }

    /* ----- boot ----- */
    layout();
    buildCards();
    cards.forEach((c) => { const o = orbitPos(c); c.x = o.x; c.y = o.y; });

    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout).catch(() => {});
    let resizeTimer = null;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(layout, 150);
    });

    document.addEventListener("room:change", (e) => {
      const on = e.detail.open === "guestbook";
      if (on && !running) {
        layout();
        running = true;
        last = performance.now();
        requestAnimationFrame(frame);
      } else if (!on) {
        running = false;
      }
    });
  }

  /* =====================================================================
     7. Correspondence vitrines
     ===================================================================== */
  function buildVitrines() {
    const host = $("#vitrines");
    LETTERS.forEach((letter, i) => {
      const card = el("article", "vitrine reveal-on-scroll");
      card.style.transitionDelay = (i % 3) * 80 + "ms";
      card.innerHTML =
        '<button type="button" class="vitrine__seal" aria-expanded="false">' +
        '<span class="vitrine__title">' + letter.title + "</span>" +
        '<span class="vitrine__mark">break the seal</span>' +
        "</button>" +
        '<div class="vitrine__letter"><p>' + letter.body + "</p></div>";
      host.appendChild(card);
      const btn = $(".vitrine__seal", card);
      btn.addEventListener("click", () => {
        const open = card.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
        $(".vitrine__mark", card).textContent = open ? "seal broken" : "break the seal";
      });
    });
  }

  /* =====================================================================
     8. Lightbox (photos, with prev/next)
     ===================================================================== */
  const lightbox = $("#lightbox");
  const lightboxImg = $("#lightboxImg");
  const lightboxCaption = $("#lightboxCaption");
  const lightboxNum = $("#lightboxNum");

  function showLightboxAt(idx) {
    if (!photoSequence.length) return;
    lightboxIndex = (idx + photoSequence.length) % photoSequence.length;
    const data = photoSequence[lightboxIndex];
    lightboxImg.src = "images/" + data.file;
    lightboxImg.alt = data.caption;
    lightboxCaption.textContent = data.caption;
    lightboxNum.textContent = "Plate " + pad2(lightboxIndex + 1);
  }
  function openLightbox(file) {
    const idx = photoSequence.findIndex((p) => p.file === file);
    showLightboxAt(idx === -1 ? 0 : idx);
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    $("#lightboxClose").focus();
  }
  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
  }
  $("#lightboxClose").addEventListener("click", closeLightbox);
  $("#lightboxBackdrop").addEventListener("click", closeLightbox);
  $("#lightboxPrev").addEventListener("click", () => showLightboxAt(lightboxIndex - 1));
  $("#lightboxNext").addEventListener("click", () => showLightboxAt(lightboxIndex + 1));

  /* =====================================================================
     9. Video modal
     ===================================================================== */
  const videoModal = $("#videoModal");
  const videoPlayer = $("#videoModalPlayer");
  const videoCaption = $("#videoModalCaption");
  const videoFallback = $("#videoModalFallback");

  function openVideoModal(data) {
    videoFallback.hidden = true;
    videoPlayer.hidden = false;
    videoPlayer.src = "videos/" + data.file;
    videoCaption.textContent = data.caption;
    videoModal.classList.add("is-open");
    videoModal.setAttribute("aria-hidden", "false");
    videoPlayer.onerror = function () {
      videoPlayer.hidden = true;
      videoFallback.hidden = false;
      videoFallback.textContent = "Add videos/" + data.file + " to play this memory.";
    };
    $("#videoModalClose").focus();
  }
  function closeVideoModal() {
    videoPlayer.pause();
    videoPlayer.removeAttribute("src");
    videoPlayer.load();
    videoModal.classList.remove("is-open");
    videoModal.setAttribute("aria-hidden", "true");
  }
  $("#videoModalClose").addEventListener("click", closeVideoModal);
  $("#videoModalBackdrop").addEventListener("click", closeVideoModal);

  /* =====================================================================
     10. Delegated frame clicks
     ===================================================================== */
  $("#wall").addEventListener("click", (e) => {
    const frame = e.target.closest(".frame");
    if (!frame) return;
    if (frame.dataset.type === "video") {
      openVideoModal({ file: frame.dataset.file, caption: frame.dataset.caption });
    } else {
      openLightbox(frame.dataset.file);
    }
  });

  /* =====================================================================
     11. The Reveal
     ===================================================================== */
  const revealBtn = $("#revealBtn");
  const revealOverlay = $("#revealOverlay");
  const revealMotes = $("#revealMotes");

  function spawnMotes() {
    revealMotes.innerHTML = "";
    const count = isMobile ? 20 : 40;
    for (let i = 0; i < count; i++) {
      const m = el("span", "reveal-mote");
      m.style.left = rand(5, 95) + "%";
      m.style.animationDuration = rand(3.4, 5.6) + "s";
      m.style.animationDelay = rand(0, 1.6) + "s";
      const size = rand(3, 6);
      m.style.width = size + "px";
      m.style.height = size + "px";
      revealMotes.appendChild(m);
    }
  }
  function openReveal() {
    spawnMotes();
    revealOverlay.classList.add("is-open");
    revealOverlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    $("#revealClose").focus();
  }
  function closeReveal() {
    revealOverlay.classList.remove("is-open");
    revealOverlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  revealBtn.addEventListener("click", openReveal);
  $("#revealClose").addEventListener("click", closeReveal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (revealOverlay.classList.contains("is-open")) closeReveal();
      else if (lightbox.classList.contains("is-open")) closeLightbox();
      else if (videoModal.classList.contains("is-open")) closeVideoModal();
      else if (openRoomId) closeRoom();
      return;
    }
    if (lightbox.classList.contains("is-open")) {
      if (e.key === "ArrowRight") showLightboxAt(lightboxIndex + 1);
      if (e.key === "ArrowLeft") showLightboxAt(lightboxIndex - 1);
    }
  });

  /* =====================================================================
     12. Music player
     ===================================================================== */
  const audio = $("#bgAudio");
  const playBtn = $("#playerPlay");
  const iconPlay = $(".icon-play", playBtn);
  const iconPause = $(".icon-pause", playBtn);
  const progress = $("#playerProgress");
  const progressFill = $("#playerProgressFill");
  const playerTitle = $("#playerTitle");
  const volumeInput = $("#playerVolume");

  playerTitle.textContent = SONG_TITLE;
  audio.volume = 0.6;

  playBtn.addEventListener("click", () => {
    if (audio.paused) {
      const p = audio.play();
      if (p && p.catch) {
        p.catch(() => {
          playerTitle.textContent = "add audio/birthday-song.mp3";
          setTimeout(() => (playerTitle.textContent = SONG_TITLE), 2200);
        });
      }
    } else {
      audio.pause();
    }
  });
  audio.addEventListener("play", () => { iconPlay.hidden = true; iconPause.hidden = false; });
  audio.addEventListener("pause", () => { iconPlay.hidden = false; iconPause.hidden = true; });
  audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;
    progressFill.style.width = (audio.currentTime / audio.duration) * 100 + "%";
  });
  progress.addEventListener("click", (e) => {
    if (!audio.duration) return;
    const rect = progress.getBoundingClientRect();
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
  });
  volumeInput.addEventListener("input", () => { audio.volume = parseFloat(volumeInput.value); });

  /* =====================================================================
     13. Nav + room rail active state, scroll reveal
     ===================================================================== */
  let revealIO = null;
  function setupObservers() {
    revealIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
  }
  // every time a room opens, its contents unveil again
  function armReveals(panel) {
    $$(".reveal-on-scroll", panel).forEach((elm) => {
      elm.classList.remove("is-visible");
      revealIO.observe(elm);
    });
  }

  /* =====================================================================
     14. Motion toggle
     ===================================================================== */
  function setupMotionToggle() {
    const toggle = $("#motionToggle");
    const stored = localStorage.getItem("shamama-calm-mode") === "1";
    if (stored || prefersReduced) {
      document.body.classList.add("calm-mode");
      toggle.setAttribute("aria-pressed", "true");
    }
    toggle.addEventListener("click", () => {
      const on = document.body.classList.toggle("calm-mode");
      toggle.setAttribute("aria-pressed", on ? "true" : "false");
      localStorage.setItem("shamama-calm-mode", on ? "1" : "0");
    });
  }

  /* =====================================================================
     15. Custom gallery cursor
     ===================================================================== */
  function setupCursor() {
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!canHover) return;
    document.body.classList.add("has-custom-cursor");
    const cursor = $("#cursor");
    const label = $("#cursorLabel");
    let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    let tx = cx, ty = cy;
    let hinted = false;

    window.addEventListener("mousemove", (e) => { tx = e.clientX; ty = e.clientY; });

    function raf() {
      cx += (tx - cx) * 0.22;
      cy += (ty - cy) * 0.22;
      cursor.style.transform = "translate3d(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px,0) translate(-50%,-50%)";
      if (cursorHint) {
        if (label.textContent !== cursorHint) label.textContent = cursorHint;
        cursor.classList.add("is-active");
        hinted = true;
      } else if (hinted) {
        hinted = false;
        label.textContent = "";
        cursor.classList.remove("is-active");
      }
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    document.addEventListener("mouseover", (e) => {
      const frame = e.target.closest(".frame");
      const seal = e.target.closest(".vitrine__seal");
      const door = e.target.closest(".door, .entrance__cue");
      const closer = e.target.closest(".lightbox__close, .video-modal__close, .lightbox__nav, .reveal-overlay__close, .room__close");
      if (frame) {
        cursor.classList.add("is-active");
        label.textContent = frame.dataset.type === "video" ? "Play" : "View";
      } else if (seal) {
        cursor.classList.add("is-active");
        label.textContent = seal.closest(".vitrine").classList.contains("is-open") ? "Close" : "Read";
      } else if (door) {
        cursor.classList.add("is-active");
        label.textContent = "Enter";
      } else if (closer) {
        cursor.classList.add("is-active");
        label.textContent = "Close";
      } else {
        cursor.classList.remove("is-active");
        label.textContent = "";
      }
    });
  }

  /* =====================================================================
     16. Exhibition-walk scroll progress
     ===================================================================== */
  function setupProgress() { /* driven by setupRooms() — see updateProgress */ }

  /* =====================================================================
     17. Wall track-light (follows the cursor across the gallery wall)
     ===================================================================== */
  function setupWallSpotlight() {
    if (isMobile) return;
    const wall = $("#wall");
    const spot = $("#wallSpotlight");
    wall.addEventListener("mousemove", (e) => {
      const rect = wall.getBoundingClientRect();
      spot.style.left = (e.clientX - rect.left) + "px";
      spot.style.top = (e.clientY - rect.top) + "px";
    });
    wall.addEventListener("mouseenter", () => wall.classList.add("is-lit"));
    wall.addEventListener("mouseleave", () => wall.classList.remove("is-lit"));
  }

  /* =====================================================================
     18. Entrance parallax fade (drifts up and fades as you leave it)
     ===================================================================== */
  function setupEntranceParallax() {
    if (prefersReduced || isMobile) return;
    const inner = $("#entranceInner");
    window.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      inner.style.setProperty("--px", (x * -10).toFixed(1));
      inner.style.setProperty("--py", (y * -6).toFixed(1));
    });
  }

  /* =====================================================================
     One slide, four rooms
     Everything lives on the entrance. Nav, the roman-numeral rail and the
     doors under the message all open a room as a panel over the slide;
     the page itself never scrolls.
     ===================================================================== */
  const ROOMS = ["collection", "guestbook", "correspondence", "reveal"];
  const visited = new Set(["entrance"]);
  let openRoomId = null;
  let lastTrigger = null;

  function updateProgress() {
    const fill = $("#progressFill");
    if (fill) fill.style.width = (visited.size / (ROOMS.length + 1)) * 100 + "%";
  }
  function markActive(id) {
    const key = id || "entrance";
    $$(".site-nav__link, .room-rail a").forEach((l) => l.classList.toggle("is-active", l.dataset.room === key));
  }
  function hideRoom(id) {
    const panel = document.getElementById(id);
    if (!panel) return;
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
  }
  function openRoom(id, trigger) {
    if (!ROOMS.includes(id)) { closeRoom(); return; }
    if (openRoomId === id) return;
    const panel = document.getElementById(id);
    if (!panel) return;
    if (openRoomId) hideRoom(openRoomId);
    else lastTrigger = trigger || document.activeElement;
    armReveals(panel);
    const scroller = $(".room__scroll", panel);
    if (scroller) scroller.scrollTop = 0;
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    openRoomId = id;
    document.body.classList.add("has-room");
    markActive(id);
    visited.add(id);
    updateProgress();
    history.replaceState(null, "", "#" + id);
    document.dispatchEvent(new CustomEvent("room:change", { detail: { open: id } }));
    const close = $(".room__close", panel);
    if (close) close.focus({ preventScroll: true });
  }
  function closeRoom() {
    if (!openRoomId) { markActive(null); return; }
    hideRoom(openRoomId);
    openRoomId = null;
    document.body.classList.remove("has-room");
    markActive(null);
    history.replaceState(null, "", location.pathname + location.search);
    document.dispatchEvent(new CustomEvent("room:change", { detail: { open: null } }));
    if (lastTrigger && document.contains(lastTrigger) && lastTrigger.focus) lastTrigger.focus({ preventScroll: true });
    lastTrigger = null;
  }
  function setupRooms() {
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href").slice(1);
      if (id !== "entrance" && !ROOMS.includes(id)) return;
      e.preventDefault();
      if (id === "entrance") closeRoom(); else openRoom(id, a);
    });
    $$(".room").forEach((panel) => {
      $(".room__close", panel).addEventListener("click", closeRoom);
      panel.addEventListener("click", (e) => { if (e.target === panel) closeRoom(); });
    });
    const fromHash = () => {
      const id = location.hash.slice(1);
      if (ROOMS.includes(id)) openRoom(id); else if (!id || id === "entrance") closeRoom();
    };
    window.addEventListener("hashchange", fromHash);
    updateProgress();
    fromHash();
  }

  /* =====================================================================
     Init
     ===================================================================== */
  document.addEventListener("DOMContentLoaded", () => {
    setEntranceDate();
    buildDust();
    buildWall();
    setupDrift();
    setupForge();
    buildVitrines();
    setupObservers();
    setupMotionToggle();
    setupCursor();
    setupProgress();
    setupWallSpotlight();
    setupEntranceParallax();
    setupRooms();
  });
})();
