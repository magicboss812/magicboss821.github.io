const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [];
function resize(){
  const dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  canvas.style.width = innerWidth + 'px';
  canvas.style.height = innerHeight + 'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);
  stars = Array.from({length: Math.min(240, Math.floor(innerWidth * innerHeight / 4200))}, () => ({
    x: Math.random()*innerWidth, y: Math.random()*innerHeight, r: Math.random()*1.4+.25, v: Math.random()*.18+.03, a: Math.random()*Math.PI*2
  }));
}
function draw(){
  ctx.clearRect(0,0,innerWidth,innerHeight);
  for(const s of stars){
    s.y += s.v;
    s.a += .015;
    if(s.y > innerHeight + 4){ s.y = -4; s.x = Math.random()*innerWidth; }
    ctx.globalAlpha = .35 + Math.sin(s.a)*.25;
    ctx.fillStyle = '#dbeafe';
    ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
  }
  ctx.globalAlpha = 1;
  requestAnimationFrame(draw);
}
resize(); draw(); addEventListener('resize', resize);

const slides = [...document.querySelectorAll('.slide')];
const links = [...document.querySelectorAll('.deck-nav a')];
const progress = document.querySelector('.progress span');
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting){
      e.target.classList.add('in-view');
      links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    }
  });
}, {threshold: .45});
slides.forEach(s => io.observe(s));
addEventListener('scroll', () => {
  const h = document.documentElement;
  const pct = h.scrollTop / (h.scrollHeight - h.clientHeight);
  progress.style.width = (pct * 100).toFixed(2) + '%';
}, {passive: true});

addEventListener('keydown', e => {
  if(!['ArrowRight','ArrowDown','PageDown','ArrowLeft','ArrowUp','PageUp'].includes(e.key)) return;
  e.preventDefault();
  const current = slides.findIndex(s => {
    const r = s.getBoundingClientRect();
    return r.top <= innerHeight*.45 && r.bottom >= innerHeight*.45;
  });
  const dir = ['ArrowRight','ArrowDown','PageDown'].includes(e.key) ? 1 : -1;
  const next = Math.max(0, Math.min(slides.length-1, current + dir));
  slides[next].scrollIntoView({behavior:'smooth'});
});
