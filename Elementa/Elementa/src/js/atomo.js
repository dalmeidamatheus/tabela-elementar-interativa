(function () {
  var E = window.EL_;
  if (!E) { return; }
  var h = E.h, st = (window.EL_EST.atomo = window.EL_EST.atomo || { z: 11, q: 0 });
  var NG = { '2': 'He', '2,8': 'Ne', '2,8,8': 'Ar', '2,8,18,8': 'Kr', '2,8,18,18,8': 'Xe', '2,8,18,32,18,8': 'Rn' };
  var LETRA = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'];

  function conchas(e, q) {
    var c = e.cam.slice();
    var i;
    for (i = 0; i < q; i++) { c[c.length - 1] -= 1; if (c[c.length - 1] <= 0) { c.pop(); } }
    for (i = 0; i > q; i--) { c[c.length - 1] += 1; }
    return c;
  }
  function limites(e) {
    var n = e.cam.length, ult = e.cam[n - 1], cap = n === 1 ? 2 : 8;
    var neg = Math.min(Math.max(cap - ult, 0), 3);
    if (e.b === 'd' || e.b === 'f') { neg = 0; }
    return { pos: Math.min(ult, 4), neg: neg };
  }
  function svg(e, cam) {
    var A = Math.round(e.m), R = 1.5 * Math.sqrt(A) + 2, n = cam.length;
    var r1 = Math.max(R + 12, 30), passo = n > 1 ? Math.min(34, (96 - r1) / (n - 1)) : 0, s = '', i, k;
    for (k = 0; k < n; k++) { s += h('<circle class=~orb~ cx=~100~ cy=~100~ r=~' + (r1 + k * passo).toFixed(1) + '~/>'); }
    for (i = 0; i < A; i++) {
      var a = i * 2.39996, r = 1.5 * Math.sqrt(i + 0.5);
      var ehP = Math.floor((i + 1) * e.z / A) > Math.floor(i * e.z / A);
      s += h('<circle class=~' + (ehP ? 'pr' : 'ne') + '~ cx=~' + (100 + r * Math.cos(a)).toFixed(2) + '~ cy=~' + (100 + r * Math.sin(a)).toFixed(2) + '~ r=~1.5~/>');
    }
    for (k = 0; k < n; k++) {
      var rr = r1 + k * passo, c = cam[k], j;
      s += h('<g class=~gir' + (k % 2 ? ' inv' : '') + '~ style=~animation-duration:' + (7 + 5 * k) + 's~>');
      for (j = 0; j < c; j++) {
        var ang = 2 * Math.PI * j / c + k;
        s += h('<circle class=~el' + (k === n - 1 ? ' vl' : '') + '~ cx=~' + (100 + rr * Math.cos(ang)).toFixed(2) + '~ cy=~' + (100 + rr * Math.sin(ang)).toFixed(2) + '~ r=~2.2~/>');
      }
      s += '</g>';
    }
    return h('<svg class=~at-svg k-' + e.c + '~ viewBox=~0 0 200 200~>') + s + '</svg>';
  }
  function montar() {
    var e = E.BYZ[st.z], cam = conchas(e, st.q), lim = limites(e);
    var chave = cam.join(','), ng = NG[chave];
    var msg = ng && st.q !== 0 ? 'Mesma distribuição de camadas do gás nobre ' + ng + ': configuração estável, por isso este íon é comum.'
      : st.q === 0 ? 'Átomo neutro: ' + e.z + ' prótons e ' + e.z + ' elétrons. Os elétrons da última camada (em cor) são os de valência e definem como ele reage.'
      : 'Íon ' + e.s + E.carga(st.q) + ': ' + (st.q > 0 ? 'perdeu ' + st.q + ' elétron(s) e ficou positivo (cátion).' : 'ganhou ' + (-st.q) + ' elétron(s) e ficou negativo (ânion).');
    var comum = e.ox.filter(function (x) { return x !== 0 && Math.abs(x) <= 4; })[0];
    var camTxt = cam.map(function (c, i) { return LETRA[i] + ' ' + c; }).join('  ·  ');
    var sel = {}; sel[st.z] = 1;
    var fill = function (x) { return x.z === st.z ? {} : { cls: '' }; };
    return E.cabecalho('Átomo', 'camadas, elétrons e íons')
      + h('<div class=~cx~ style=~left:28px;top:84px;width:556px;height:616px~><h4>Modelo de camadas</h4></div>')
      + svg(e, cam)
      + h('<div class=~cx k-' + e.c + '~ style=~left:600px;top:84px;width:656px;height:352px~><h4>Escolha um elemento</h4>')
      + E.mini({ w: 32, h: 27, sel: sel, fill: fill }) + '</div>'
      + h('<div class=~cx k-' + e.c + '~ style=~left:600px;top:446px;width:656px;height:254px~>')
      + h('<div style=~display:flex;gap:28px~><div style=~width:190px~><div class=~at-sim~>' + e.s + (st.q ? '<sup>' + E.carga(st.q) + '</sup>' : '') + '</div><div class=~at-nome~>' + e.n + '</div></div>')
      + h('<div style=~flex:1~><div class=~at-lin~><div>prótons<b>' + e.z + '</b></div><div>nêutrons<b>' + (Math.round(e.m) - e.z) + '</b></div><div>elétrons<b>' + (e.z - st.q) + '</b></div><div>carga<b>' + (st.q > 0 ? '+' + st.q : st.q) + '</b></div></div>')
      + h('<div class=~at-t~>camadas  ' + camTxt + '</div><div class=~at-t~>config.  ' + e.cfg + '</div></div></div>')
      + h('<div class=~at-m~>' + msg + '</div>')
      + h('<div style=~margin-top:12px~><span class=~bt' + (st.q >= lim.pos ? ' off' : '') + '~ data-a=~mais~>Remover elétron −e⁻</span><span class=~bt' + (-st.q >= lim.neg ? ' off' : '') + '~ data-a=~menos~>Adicionar elétron +e⁻</span>'
        + '<span class=~bt ac' + (comum === undefined ? ' off' : '') + '~ data-a=~comum~>Íon mais comum</span><span class=~bt~ data-a=~neutro~>Neutro</span>'
        + '<span class=~bt~ data-a=~ant~>◀</span><span class=~bt~ data-a=~prox~>▶</span></div></div>');
  }
  var acoes = {
    z: function (v, d) { st.z = Number(v); st.q = 0; d(); },
    mais: function (v, d) { st.q += 1; d(); },
    menos: function (v, d) { st.q -= 1; d(); },
    neutro: function (v, d) { st.q = 0; d(); },
    ant: function (v, d) { st.z = st.z > 1 ? st.z - 1 : 118; st.q = 0; d(); },
    prox: function (v, d) { st.z = st.z < 118 ? st.z + 1 : 1; st.q = 0; d(); },
    comum: function (v, d) {
      var e = E.BYZ[st.z], q = e.ox.filter(function (x) { return x !== 0 && Math.abs(x) <= 4; })[0];
      if (q !== undefined) { st.q = q; }
      d();
    }
  };
  E.iniciar(montar, acoes);
})();
