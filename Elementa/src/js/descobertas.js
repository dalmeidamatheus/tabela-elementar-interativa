/* Página Descobertas: linha do tempo que preenche a tabela conforme os elementos foram descobertos. */
(function () {
  var E = window.EL_;
  if (!E) { return; }
  var h = E.h, S = window.EL_EST, st = (S.desc = S.desc || { ano: 1750, play: false, vel: 1 });
  var MIN = 1600, MAX = 2012;
  var DEC = {}, d0;
  E.EL.forEach(function (e) { if (e.a !== null && e.a >= 1650) { d0 = Math.floor(e.a / 10) * 10; DEC[d0] = (DEC[d0] || 0) + 1; } });
  function conhecido(e, y) { return e.a === null || e.a <= y; }
  function contar(y) { return E.EL.filter(function (e) { return conhecido(e, y); }).length; }
  function barras(y) {
    var s = '', x0 = 30, w = 11, maxv = 0, d;
    for (d = 1650; d <= 2010; d += 10) { maxv = Math.max(maxv, DEC[d] || 0); }
    for (d = 1650; d <= 2010; d += 10) {
      var v = DEC[d] || 0, hh = v / maxv * 120, i = (d - 1650) / 10;
      s += h('<rect class=~ds-bar' + (d <= y ? ' on' : '') + '~ x=~' + (x0 + i * 15) + '~ y=~' + (140 - hh) + '~ width=~' + w + '~ height=~' + hh + '~ rx=~2~/>');
      if (i % 4 === 0) { s += h('<text class=~ds-ax~ x=~' + (x0 + i * 15 + 5) + '~ y=~154~>' + d + '</text>'); }
    }
    var cx = x0 + (Math.min(Math.max(y, 1650), 2010) - 1650) / 10 * 15;
    s += h('<line x1=~' + cx + '~ x2=~' + cx + '~ y1=~6~ y2=~142~ stroke=~#12303A~ stroke-width=~1.4~/>');
    s += h('<text class=~ds-an~ x=~' + (x0 + 24 * 15) + '~ y=~22~>gases nobres e terras-raras</text>');
    s += h('<text class=~ds-an~ x=~' + (x0 + 31 * 15) + '~ y=~44~>elementos sintéticos</text>');
    s += h('<text class=~ds-an~ x=~' + (x0 + 11 * 15) + '~ y=~44~>era dos metais e gases</text>');
    return h('<svg viewBox=~0 0 590 162~ style=~width:100%~>') + s + '</svg>';
  }
  function montar() {
    var y = st.ano, n = contar(y);
    var fill = function (e) {
      if (!conhecido(e, y)) { return { cls: 'dim' }; }
      return e.a === y ? { cls: 'novo' } : {};
    };
    var rec = E.EL.filter(function (e) { return e.a !== null && e.a <= y; }).sort(function (a, b) { return b.a - a.a || b.z - a.z; }).slice(0, 7);
    var lista = rec.map(function (e) { return h('<div class=~ds-li k-' + e.c + '~><b>' + e.a + '</b><i>' + e.s + '</i><span>' + e.n + ' · ' + E.esc(e.ds) + '</span></div>'); }).join('');
    return E.cabecalho('Descobertas', 'como a tabela foi sendo preenchida')
      + h('<div class=~cx~ style=~left:28px;top:84px;width:664px;height:352px~><h4>Elementos conhecidos em ' + y + '</h4>') + E.mini({ w: 32, h: 27, fill: fill }) + '</div>'
      + h('<div class=~cx~ style=~left:28px;top:446px;width:664px;height:254px~><h4>Descobertas por década</h4>') + barras(y) + '</div>'
      + h('<div class=~cx~ style=~left:708px;top:84px;width:544px;height:200px~><h4>Linha do tempo</h4><div style=~display:flex;align-items:flex-end;gap:16px~><div class=~ds-n~>' + n + '<small> / 118</small></div><div class=~ds-ano~>' + y + '</div></div>')
      + h('<input class=~ds-sl~ type=~range~ min=~' + MIN + '~ max=~' + MAX + '~ value=~' + y + '~ data-i=~ano~/>')
      + h('<div><span class=~bt ' + (st.play ? 'on' : 'ac') + '~ data-a=~play~>' + (st.play ? '❚❚ Pausar' : '▶ Reproduzir') + '</span><span class=~bt~ data-a=~ini~>⟲ Início</span>'
        + '<span class=~bt' + (st.vel === 1 ? ' on' : '') + '~ data-a=~vel~ data-v=~1~>1×</span><span class=~bt' + (st.vel === 3 ? ' on' : '') + '~ data-a=~vel~ data-v=~3~>3×</span></div></div>')
      + h('<div class=~cx~ style=~left:708px;top:294px;width:544px;height:406px~><h4>Descobertas mais recentes</h4>') + lista + '</div>';
  }
  var timer = window.EL_TIMER_DESC;
  var redesenhar = null;
  function parar() { if (window.EL_TIMER_DESC) { clearInterval(window.EL_TIMER_DESC); window.EL_TIMER_DESC = null; } }
  function tocar() {
    parar();
    window.EL_TIMER_DESC = setInterval(function () {
      st.ano += st.vel;
      if (st.ano >= MAX) { st.ano = MAX; st.play = false; parar(); }
      if (redesenhar) { redesenhar(); }
    }, 140);
  }
  var acoes = {
    z: function (v, d) { d(); },
    play: function (v, d) { if (st.ano >= MAX) { st.ano = MIN; } st.play = !st.play; if (st.play) { tocar(); } else { parar(); } d(); },
    ini: function (v, d) { st.ano = MIN; st.play = false; parar(); d(); },
    vel: function (v, d) { st.vel = Number(v); d(); },
    ano: function (v, d, vivo) {
      st.ano = Number(v); st.play = false; parar();
      if (vivo) { var el = document.querySelector('.ds-ano'); if (el) { el.textContent = st.ano; } return; }
      d();
    }
  };
  parar();
  redesenhar = E.iniciar(montar, acoes);
  if (st.play) { tocar(); }
})();
