/* Base das páginas em JavaScript do Elementa. Lê window.EL_DADOS (medida [JS Dados]) e publica window.EL_.
   Campos de el: [z, simbolo, nome, massa, grupo, periodo, cat, bloco, en, fusaoK, ebulicaoK, dens, estado, ano,
   descobridor, camadas, oxidacoes, config, fato, linha, coluna, valencia]. Sem aspas duplas nem crases (vira texto DAX). */
(function () {
  var D = window.EL_DADOS;
  if (!D) { return; }
  var EL = D.el.map(function (r) {
    return { z: r[0], s: r[1], n: r[2], m: r[3], g: r[4], p: r[5], c: r[6], b: r[7], en: r[8], fu: r[9], eb: r[10],
      d: r[11], e: r[12], a: r[13], ds: r[14], cam: r[15].split('|').map(Number),
      ox: r[16] ? r[16].split(',').map(Number) : [], cfg: r[17], fato: r[18], l: r[19], k: r[20], val: r[21] };
  });
  var BYZ = {}, BYS = {};
  EL.forEach(function (e) { BYZ[e.z] = e; BYS[e.s] = e; });
  var CAT = D.ct;
  var SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
  var SUB = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉' };
  function cor(c) { return (CAT[c] || ['', '#999'])[1]; }
  function catNome(c) { return (CAT[c] || [c])[0]; }
  function rgba(hex, a) {
    return 'rgba(' + parseInt(hex.substr(1, 2), 16) + ',' + parseInt(hex.substr(3, 2), 16) + ',' + parseInt(hex.substr(5, 2), 16) + ',' + a + ')';
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/'/g, '&#39;'); }
  function fmt(x, d) { return x === null || x === undefined ? '—' : Number(x).toFixed(d === undefined ? 2 : d).replace('.', ','); }
  function sup(n) { return String(n).replace(/[0-9]/g, function (c) { return SUP[c]; }); }
  function sub(n) { return String(n).replace(/[0-9]/g, function (c) { return SUB[c]; }); }
  function carga(q) {
    if (!q) { return ''; }
    return (Math.abs(q) > 1 ? sup(Math.abs(q)) : '') + (q > 0 ? '⁺' : '⁻');
  }
  function h(s) { return s.split('~').join(String.fromCharCode(39)); }
  function gcd(a, b) { return b ? gcd(b, a % b) : a; }
  function palco(raiz) {
    var p = raiz.querySelector('.palco');
    if (!p) { return; }
    var w = raiz.clientWidth || window.innerWidth, h = raiz.clientHeight || window.innerHeight;
    var s = Math.min(w / 1280, h / 720);
    p.style.transform = 'translate(' + ((w - 1280 * s) / 2) + 'px,' + ((h - 720 * s) / 2) + 'px) scale(' + s + ')';
  }
  /* inicia uma página: injeta o HTML, escala o palco e liga os eventos por data-a */
  function iniciar(montar, acoes) {
    var raiz = document.getElementById('app-raiz');
    if (!raiz) { return; }
    function desenhar() {
      raiz.innerHTML = h('<div class=~palco~>') + montar() + '</div>';
      palco(raiz);
    }
    raiz.addEventListener('click', function (ev) {
      var t = ev.target.closest ? ev.target.closest('[data-a]') : null;
      if (t && acoes[t.getAttribute('data-a')]) { acoes[t.getAttribute('data-a')](t.getAttribute('data-v'), desenhar); }
    });
    raiz.addEventListener('input', function (ev) {
      var t = ev.target;
      if (t && t.getAttribute && t.getAttribute('data-i') && acoes[t.getAttribute('data-i')]) { acoes[t.getAttribute('data-i')](t.value, desenhar, true); }
    });
    raiz.addEventListener('keydown', function (ev) {
      var t = ev.target;
      if (ev.key === 'Enter' && t && t.getAttribute && t.getAttribute('data-enter') && acoes[t.getAttribute('data-enter')]) { acoes[t.getAttribute('data-enter')](t.value, desenhar); }
    });
    raiz.addEventListener('change', function (ev) {
      var t = ev.target;
      if (t && t.getAttribute && t.getAttribute('data-i') && acoes[t.getAttribute('data-i')]) { acoes[t.getAttribute('data-i')](t.value, desenhar, false); }
    });
    window.addEventListener('resize', function () { palco(raiz); });
    desenhar();
    return desenhar;
  }
  /* grade 18 x 10 em miniatura. opt: { w, h, acao, fill(e) -> { cls, st }, sel: {z:1} } */
  function mini(opt) {
    var w = opt.w || 34, hh = opt.h || 30, gap = 2, sel = opt.sel || {}, html = '';
    EL.forEach(function (e) {
      var f = opt.fill ? opt.fill(e) : {};
      var x = (e.k - 1) * (w + gap), y = (e.l - 1) * (hh + gap) + (e.l >= 9 ? 10 : 0);
      html += h('<div class=~mc k-' + e.c + (hh < 26 ? ' p ' : ' ') + (f.cls || '') + (sel[e.z] ? ' sel' : '') + '~ data-a=~' + (opt.acao || 'z') + '~ data-v=~' + e.z
        + '~ title=~' + esc(e.n) + '~ style=~left:' + x + 'px;top:' + y + 'px;width:' + w + 'px;height:' + hh + 'px;' + (f.st || '') + '~><i>' + e.z + '</i><b>' + e.s + '</b></div>');
    });
    var W = 18 * (w + gap), H = 10 * (hh + gap) + 10;
    return h('<div class=~mini~ style=~width:' + W + 'px;height:' + H + 'px~>') + html + '</div>';
  }
  function cabecalho(titulo, sub2) {
    return h('<div class=~cab~><b>' + titulo + '</b><span>' + sub2 + '</span></div>');
  }
  window.EL_ = { v: D.v, EL: EL, BYZ: BYZ, BYS: BYS, CAT: CAT, cor: cor, catNome: catNome, rgba: rgba, esc: esc, fmt: fmt,
    sup: sup, sub: sub, carga: carga, gcd: gcd, iniciar: iniciar, mini: mini, cabecalho: cabecalho, palco: palco,
    h: h };
  window.EL_EST = window.EL_EST || {};
})();
