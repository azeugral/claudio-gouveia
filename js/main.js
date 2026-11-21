(function () {
  var d = document, html = d.documentElement, hero = d.querySelector('.hero');
  var MAIL = 'Blineloule@hotmail.com', IG = 'claudio_artisttattoo';

  /* ---------- medidas do hero ---------- */
  var grande = d.getElementById('grande'), palco = d.getElementById('palco');
  function ajustar() {
    var vw = html.clientWidth || innerWidth, vh = innerHeight, g = Math.max(16, Math.min(vw * .04, 56));
    var base = vh < 560 ? 70 : vw < 640 ? 200 : 168;
    var ah = Math.max(260, Math.min(vh - 86 - base, 980));
    hero.style.setProperty('--ah', ah + 'px');
    grande.style.setProperty('--fs', '100px');
    var r = grande.scrollWidth / 100;
    var alvo = vw < 640 ? vw - 2 * g : Math.min(vw - 2 * g, ah * 1.02);
    var fs = Math.max(48, Math.min(alvo / r, 210)).toFixed(1) + 'px';
    grande.style.setProperty('--fs', fs); hero.style.setProperty('--fs', fs);
  }
  ajustar(); addEventListener('resize', ajustar);
  if (d.fonts && d.fonts.ready) d.fonts.ready.then(ajustar);

  /* ---------- hero: do olhar ao retrato inteiro ----------
     Cada retrato abre no olhar, ampliado, e afasta até a peça inteira em ~1,3 s. Só transform/opacity. */
  var PH = [
    { n: 'cillian', f: [.5, .27], z: 3.4, r: ['Nº 1', 'Cillian Murphy · antebraço'] },
    { n: 'chefe', f: [.55, .28], z: 3.0, r: ['Nº 2', 'Chefe índio com urso · perna'] },
    { n: 'virgem', f: [.62, .44], z: 3.2, r: ['Nº 3', 'Virgem com terço · braço'] },
    { n: 'avo', f: [.55, .38], z: 3.0, r: ['Nº 4', 'Retrato do avô · peito'] }
  ];
  var CICLO = 4600, ZOOM = 1300, EASE = 'cubic-bezier(.2,.75,.1,1)';
  var jan = d.getElementById('qJanela'), qz = d.getElementById('qZoom'), peca = d.getElementById('peca');
  var reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  PH.forEach(function (p) { var im = new Image(); im.src = 'img/h/' + p.n + '.webp'; p.im = im; });
  function num(v) { return '×' + v.toFixed(1).replace('.', ','); }
  function abrir(i, primeira) {
    var p = PH[i], im = jan.querySelector('img:last-child');
    if (!primeira) {
      im = d.createElement('img'); im.src = p.im.src; im.alt = p.r[1].split(' · ')[0] + ', tatuagem realista de Cláudio Gouveia';
      jan.appendChild(im);
      var velhas = [].slice.call(jan.querySelectorAll('img')).slice(0, -1);
      setTimeout(function () { velhas.forEach(function (v) { v.remove(); }); }, 500);
      peca.style.opacity = 0;
      setTimeout(function () { peca.children[0].textContent = p.r[0]; peca.children[1].textContent = p.r[1]; peca.style.opacity = 1; }, 260);
    }
    im.style.transformOrigin = (p.f[0] * 100) + '% ' + (p.f[1] * 100) + '%';
    im.animate([{ transform: 'scale(' + p.z + ')', opacity: 0 }, { opacity: 1, offset: .14 }, { transform: 'scale(1)', opacity: 1 }], { duration: ZOOM, easing: EASE, fill: 'both' });
    im.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.03)' }], { duration: CICLO - ZOOM, delay: ZOOM, easing: 'linear', fill: 'forwards' });
    var t0 = performance.now();
    (function cont(t) {
      var k = Math.min(1, Math.max(0, (t - t0) / ZOOM)), e = 1 - Math.pow(1 - k, 4);
      qz.textContent = num(p.z + (1 - p.z) * e);
      if (k < 1) requestAnimationFrame(cont);
    })(t0);
  }
  if (reduz) qz.textContent = num(1);
  else {
    var atual = 0, vis = true;
    new IntersectionObserver(function (e) { vis = e[0].isIntersecting; }).observe(palco);
    jan.querySelector('img').style.opacity = 0;
    var comeca = function () { setTimeout(function () { abrir(0, true); }, 150); };
    if (d.readyState === 'complete') comeca(); else addEventListener('load', comeca);
    setInterval(function () { if (!vis || d.hidden) return; atual = (atual + 1) % PH.length; abrir(atual); }, CICLO);
  }
  requestAnimationFrame(function () { setTimeout(function () { hero.classList.add('pronto'); }, 30); });

  /* ---------- topo e gaveta ---------- */
  var topo = d.getElementById('topo'), gav = d.getElementById('gaveta'), burger = d.getElementById('burger');
  function rolar() { topo.classList.toggle('solido', scrollY > 30); }
  addEventListener('scroll', rolar, { passive: true }); rolar();
  function gaveta(a) { gav.hidden = !a; burger.setAttribute('aria-expanded', a); d.body.style.overflow = a ? 'hidden' : ''; }
  burger.addEventListener('click', function () { gaveta(gav.hidden); });
  gav.addEventListener('click', function (e) { if (e.target.closest('a')) gaveta(false); });

  /* ---------- revelação ---------- */
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('vis'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
  d.querySelectorAll('.rev').forEach(function (el) { io.observe(el); });

  /* ---------- portfólio ---------- */
  var O = window.OBRAS, grade = d.getElementById('grade'), mais = d.getElementById('verMais'), filtro = 'todos', limite;
  var LIM = function () { return innerWidth <= 820 ? 12 : 24; };
  function lista() { return O.filter(function (o) { return filtro === 'todos' || o.t === filtro; }); }
  function render() {
    var l = lista(); grade.innerHTML = '';
    l.slice(0, limite).forEach(function (o) {
      var f = d.createElement('figure'); f.className = 'obra'; f.dataset.n = o.n; f.tabIndex = 0;
      f.innerHTML = '<img src="img/p/' + o.n + '.webp" alt="' + o.a + ', tatuagem realista de Cláudio Gouveia" width="720" height="900"><figcaption>' + o.a + '</figcaption>';
      grade.appendChild(f);
    });
    mais.parentNode.hidden = l.length <= limite;
  }
  function filtrar(f) {
    filtro = f; limite = LIM();
    d.querySelectorAll('#filtros button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.f === f); });
    render();
  }
  d.getElementById('filtros').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) filtrar(b.dataset.f); });
  d.querySelectorAll('.tema').forEach(function (b) {
    b.addEventListener('click', function () { filtrar(b.dataset.f); d.getElementById('trabalhos').scrollIntoView({ behavior: 'smooth' }); });
  });
  mais.addEventListener('click', function () { limite += LIM(); render(); });
  filtrar('todos');

  /* lightbox */
  var lb = d.getElementById('lb'), lbImg = d.getElementById('lbImg'), lbTit = d.getElementById('lbTit'), idx = 0;
  function mostra(i) { var l = lista(); idx = (i + l.length) % l.length; var o = l[idx]; lbImg.src = 'img/p/' + o.n + 'g.webp'; lbImg.alt = o.a; lbTit.textContent = o.a; }
  function abreLb(n) { var l = lista(); mostra(l.findIndex(function (o) { return o.n === n; })); lb.hidden = false; d.body.style.overflow = 'hidden'; }
  function fechaLb() { lb.hidden = true; d.body.style.overflow = ''; }
  grade.addEventListener('click', function (e) { var f = e.target.closest('.obra'); if (f) abreLb(f.dataset.n); });
  grade.addEventListener('keydown', function (e) { var f = e.target.closest('.obra'); if (f && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); abreLb(f.dataset.n); } });
  d.getElementById('lbX').onclick = fechaLb;
  d.getElementById('lbA').onclick = function () { mostra(idx - 1); };
  d.getElementById('lbB').onclick = function () { mostra(idx + 1); };
  lb.addEventListener('click', function (e) { if (e.target === lb) fechaLb(); });
  d.addEventListener('keydown', function (e) { if (lb.hidden) return; if (e.key === 'Escape') fechaLb(); if (e.key === 'ArrowLeft') mostra(idx - 1); if (e.key === 'ArrowRight') mostra(idx + 1); });
  var TEMA = { retratos: 'Retrato', fe: 'Fé', animais: 'Animal', caveiras: 'Caveira', rosas: 'Rosas e ornamentos', fechados: 'Braço fechado' };
  d.getElementById('lbQuero').onclick = function () {
    var o = lista()[idx]; fechaLb();
    var r = d.querySelector('input[name=tema][value="' + TEMA[o.t] + '"]'); if (r) r.checked = true;
    d.getElementById('fIdeia').value = 'Vi no site a peça "' + o.a + '" e quero uma assim.';
    d.getElementById('marcar').scrollIntoView({ behavior: 'smooth' });
  };

  /* ---------- pedido ---------- */
  var form = d.getElementById('form'), nome = d.getElementById('fNome'), eNome = d.getElementById('eNome'), aviso = d.getElementById('aviso');
  function v(id) { return d.getElementById(id).value.trim(); }
  function rad(n) { return d.querySelector('input[name=' + n + ']:checked').value; }
  function mensagem() {
    var l = ['Olá, Cláudio! Sou ' + v('fNome') + ' e quero um orçamento.', '',
      'Tema: ' + rad('tema'), 'Cobertura: ' + rad('cob'),
      'Local: ' + (v('fLocal') || 'a definir'), 'Tamanho: ' + v('fTam'), 'Disponibilidade: ' + v('fDisp')];
    if (v('fIdeia')) l.push('', 'Ideia: ' + v('fIdeia'));
    l.push('', '(pedido enviado pelo site)');
    return l.join('\n');
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!v('fNome')) { eNome.hidden = false; nome.focus(); return; }
    eNome.hidden = true;
    var via = e.submitter && e.submitter.dataset.via || 'mail', txt = mensagem();
    if (via === 'mail') {
      var assunto = 'Orçamento de tatuagem: ' + rad('tema') + ' (' + v('fNome') + ')';
      location.href = 'mailto:' + MAIL + '?subject=' + encodeURIComponent(assunto) + '&body=' + encodeURIComponent(txt);
    } else {
      var ok = function () { aviso.hidden = false; window.open('https://ig.me/m/' + IG, '_blank', 'noopener'); };
      if (navigator.clipboard) navigator.clipboard.writeText(txt).then(ok, ok); else ok();
    }
  });
  nome.addEventListener('input', function () { if (v('fNome')) eNome.hidden = true; });
})();
