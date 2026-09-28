/* Barbershop Blanes ViP — PRESS START, biblioteca de cortes y trofeos */
gsap.registerPlugin(ScrollTrigger);
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* ---------- reloj de la barra superior ---------- */
const tick = () => { const d = new Date(); $('#clock').textContent = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };
tick(); setInterval(tick, 20000);

/* ---------- partículas de la pantalla de inicio ---------- */
(function bits() {
  const cv = $('#bits'), ctx = cv.getContext('2d');
  const SY = ['△', '○', '✕', '□'], CO = ['#37d67a', '#ff4d5e', '#4d8dff', '#ff6ad5'];
  let W, H, d, P = [];
  const size = () => { d = Math.min(2, devicePixelRatio || 1); W = cv.width = cv.clientWidth * d; H = cv.height = cv.clientHeight * d; P = Array.from({ length: 46 }, (_, i) => ({ x: Math.random() * W, y: Math.random() * H, s: (12 + Math.random() * 26) * d, v: (.2 + Math.random() * .6) * d, r: Math.random() * 6, vr: (Math.random() - .5) * .01, k: i % 4 })); };
  size(); addEventListener('resize', size);
  let vis = true; new IntersectionObserver(([e]) => { vis = e.isIntersecting; }).observe(cv);
  gsap.ticker.add(() => {
    if (!vis) return;
    ctx.clearRect(0, 0, W, H);
    P.forEach(p => {
      p.y -= p.v; p.r += p.vr; if (p.y < -40) { p.y = H + 40; p.x = Math.random() * W; }
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.globalAlpha = .22;
      ctx.fillStyle = CO[p.k]; ctx.font = `700 ${p.s}px Rubik, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(SY[p.k], 0, 0); ctx.restore();
    });
  });
})();

/* ---------- PRESS START ---------- */
let started = false;
function start() {
  if (started) return; started = true;
  const tl = gsap.timeline();
  tl.to('.press', { scale: 1.2, opacity: 0, duration: .35, ease: 'power2.in' })
    .to('.start__logo', { scale: 1.6, opacity: 0, filter: 'blur(12px)', duration: .7, ease: 'expo.in' }, 0)
    .add(() => $('#dash').scrollIntoView({ behavior: 'smooth' }), .5)
    .to('.start__logo', { scale: 1, opacity: 1, filter: 'blur(0px)', duration: .01 }, 1.6);
}
$('#press').addEventListener('click', start);
addEventListener('keydown', e => { if (!started && scrollY < innerHeight * .5 && !e.metaKey && !e.ctrlKey) { e.preventDefault(); start(); } }, { once: false });
gsap.from('.start__logo > *', { y: 40, opacity: 0, duration: 1, ease: 'expo.out', stagger: .12, delay: .2 });

/* ---------- biblioteca de cortes ---------- */
const GAMES = [
  { t: 'Degradado', tag: 'Recomendado', img: 'assets/maps/g04.jpg', d: 'El clásico de la casa: skin fade limpio, transiciones suaves y acabado a navaja.', s: [['Estilo', 95], ['Rapidez', 80], ['Mantenimiento', 60]] },
  { t: 'Corte clásico', tag: 'Para todos', img: 'assets/maps/g02.jpg', d: 'Tijera y máquina con buenas manos. Te escuchamos y lo adaptamos a lo que quieres.', s: [['Estilo', 80], ['Rapidez', 90], ['Mantenimiento', 85]] },
  { t: 'Barba', tag: 'Combo', img: 'assets/maps/g06.jpg', d: 'Perfilado, rebaje y acabado. Sal con la barba en su mejor nivel.', s: [['Estilo', 88], ['Rapidez', 85], ['Mantenimiento', 70]] },
  { t: 'Limpieza facial', tag: 'Extra', img: 'assets/maps/g03.jpg', d: 'Una limpieza facial muy buena, según los que ya la han probado. El power-up final.', s: [['Relax', 95], ['Rapidez', 70], ['Frescura', 98]] },
  { t: 'Corte niño', tag: 'Peques', img: 'assets/maps/g01.jpg', d: 'Los peques también suben de nivel: paciencia, rapidez y un corte que les encanta.', s: [['Estilo', 85], ['Paciencia', 100], ['Rapidez', 88]] },
  { t: 'Combo VIP', tag: 'Modo leyenda', img: 'assets/maps/g09.jpg', d: 'Corte + barba + limpieza facial, con PS5 y bebida mientras esperas. Nivel máximo.', s: [['Estilo', 100], ['Relax', 100], ['Experiencia', 100]] }
];
(function library() {
  const lib = $('#library');
  lib.innerHTML = GAMES.map((g, i) => `<button class="game" role="option" data-i="${i}"><img src="${g.img}" alt=""><span>${g.t}</span></button>`).join('');
  let cur = -1;
  function select(i) {
    i = (i + GAMES.length) % GAMES.length;
    if (i === cur) return; cur = i;
    const g = GAMES[i];
    $$('.game', lib).forEach((b, k) => { b.classList.toggle('is-on', k === i); b.setAttribute('aria-selected', k === i); });
    $$('.game', lib)[i].scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
    const img = $('#dashImg');
    gsap.to(img, { opacity: 0, scale: 1.05, duration: .25, onComplete: () => { img.src = g.img; gsap.to(img, { opacity: 1, scale: 1, duration: .6 }); } });
    $('#gTag').textContent = g.tag; $('#gTitle').textContent = g.t; $('#gText').textContent = g.d;
    $('#gStats').innerHTML = g.s.map(([n, v]) => `<div class="stat"><span>${n}</span><div class="stat__bar"><i style="transform:scaleX(0)"></i></div><b>${v}</b></div>`).join('');
    requestAnimationFrame(() => $$('#gStats i').forEach((b, k) => { b.style.transform = `scaleX(${g.s[k][1] / 100})`; }));
    gsap.fromTo(['#gTag', '#gTitle', '#gText'], { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: .5, stagger: .05 });
  }
  lib.addEventListener('click', e => { const b = e.target.closest('.game'); if (b) select(+b.dataset.i); });
  addEventListener('keydown', e => {
    const r = $('#dash').getBoundingClientRect();
    if (r.top > innerHeight * .5 || r.bottom < innerHeight * .5) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); select(cur + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); select(cur - 1); }
    if (e.key === 'Enter') $('#gPlay').click();
  });
  select(0);
})();

/* ---------- trofeos que se desbloquean ---------- */
$$('.t').forEach((t, i) => gsap.from(t, { x: -60, opacity: 0, duration: .8, ease: 'back.out(1.4)', scrollTrigger: { trigger: t, start: 'top 90%' } }));
$$('.rank li').forEach(li => gsap.from(li, { y: 30, opacity: 0, duration: .8, ease: 'expo.out', scrollTrigger: { trigger: li, start: 'top 92%' } }));
$$('.sec, .map__card, .map img').forEach(n => gsap.from(n, { y: 40, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: n, start: 'top 88%' } }));
