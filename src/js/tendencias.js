(function () {
  var E = window.EL_;
  if (!E) { return; }
  var h = E.h, st = (window.EL_EST.td = window.EL_EST.td || { x: 'z', y: 'en', lx: false, ly: false, lin: true, cat: null, sel: null });
  var P = {
    z: ['Número atômico', function (e) { return e.z; }], m: ['Massa atômica (u)', function (e) { return e.m; }], g: ['Grupo', function (e) { return e.g || null; }],
    p: ['Período', function (e) { return e.p; }], en: ['Eletronegatividade', function (e) { return e.en; }], fu: ['Fusão (°C)', function (e) { return e.fu === null ? null : e.fu - 273.15; }],
    eb: ['Ebulição (°C)', function (e) { return e.eb === null ? null : e.eb - 273.15; }], d: ['Densidade (g/cm³)', function (e) { return e.d; }],
    a: ['Ano de descoberta', function (e) { return e.a; }], val: ['Elétrons de valência', function (e) { return e.val; }]
  };
  var CHAVES = ['z', 'm', 'g', 'p', 'en', 'fu', 'eb', 'd', 'a', 'val'];
  var PRE = [['Periodicidade: Z × eletroneg.', 'z', 'en', false, false, true], ['Densidade × fusão', 'fu', 'd', false, true, false], ['Massa × Z', 'z', 'm', false, false, true],
    ['Ebulição × fusão', 'fu', 'eb', false, false, false], ['Descoberta × Z', 'z', 'a', false, false, false], ['Valência × grupo', 'g', 'val', false, false, false]];
  function nice(a, b, n) {
    var span = b - a || 1, pas = Math.pow(10, Math.floor(Math.log(span / n) / Math.LN10)), er = span / n / pas;
    pas *= er >= 5 ? 5 : er >= 2 ? 2 : 1;
    var t = [], v = Math.ceil(a / pas) * pas;
    for (; v <= b + pas * 0.001; v += pas) { t.push(Math.round(v / pas) * pas); }
    return t;
  }
  function montar() {
    var W = 860, H = 470, ml = 62, mr = 18, mt = 14, mb = 46, pts = [], i;
    E.EL.forEach(function (e) {
      var vx = P[st.x][1](e), vy = P[st.y][1](e);
      if (vx === null || vy === null) { return; }
      if ((st.lx && vx <= 0) || (st.ly && vy <= 0)) { return; }
      pts.push({ e: e, x: st.lx ? Math.log(vx) / Math.LN10 : vx, y: st.ly ? Math.log(vy) / Math.LN10 : vy, rx: vx, ry: vy });
    });
    var xs = pts.map(function (p) { return p.x; }), ys = pts.map(function (p) { return p.y; });
    var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
    var px = (x1 - x0) * 0.04 || 1, py = (y1 - y0) * 0.06 || 1;
    x0 -= px; x1 += px; y0 -= py; y1 += py;
    var X = function (v) { return ml + (v - x0) / (x1 - x0) * (W - ml - mr); }, Y = function (v) { return H - mb - (v - y0) / (y1 - y0) * (H - mt - mb); };
    var s = '', tk;
    nice(x0, x1, 8).forEach(function (v) { s += h('<line class=~td-gr~ x1=~' + X(v).toFixed(1) + '~ x2=~' + X(v).toFixed(1) + '~ y1=~' + mt + '~ y2=~' + (H - mb) + '~/><text class=~td-tx~ x=~' + X(v).toFixed(1) + '~ y=~' + (H - mb + 16) + '~ text-anchor=~middle~>' + (st.lx ? E.fmt(Math.pow(10, v), v < 0 ? 4 : 0) : E.fmt(v, Math.abs(v) < 10 && v % 1 ? 1 : 0)) + '</text>'); });
    nice(y0, y1, 6).forEach(function (v) { s += h('<line class=~td-gr~ x1=~' + ml + '~ x2=~' + (W - mr) + '~ y1=~' + Y(v).toFixed(1) + '~ y2=~' + Y(v).toFixed(1) + '~/><text class=~td-tx~ x=~' + (ml - 8) + '~ y=~' + (Y(v) + 3).toFixed(1) + '~ text-anchor=~end~>' + (st.ly ? E.fmt(Math.pow(10, v), v < 0 ? 4 : 0) : E.fmt(v, Math.abs(v) < 10 && v % 1 ? 1 : 0)) + '</text>'); });
    s += h('<line class=~td-ax~ x1=~' + ml + '~ x2=~' + (W - mr) + '~ y1=~' + (H - mb) + '~ y2=~' + (H - mb) + '~/><line class=~td-ax~ x1=~' + ml + '~ x2=~' + ml + '~ y1=~' + mt + '~ y2=~' + (H - mb) + '~/>');
    s += h('<text class=~td-tt~ x=~' + ((ml + W - mr) / 2) + '~ y=~' + (H - 8) + '~ text-anchor=~middle~>' + P[st.x][0] + (st.lx ? ' (log)' : '') + '</text><text class=~td-tt~ transform=~translate(14,' + ((mt + H - mb) / 2) + ') rotate(-90)~ text-anchor=~middle~>' + P[st.y][0] + (st.ly ? ' (log)' : '') + '</text>');
    if (st.lin) { s += h('<polyline class=~td-lin~ points=~' + pts.slice().sort(function (a, b) { return a.e.z - b.e.z; }).map(function (p) { return X(p.x).toFixed(1) + ',' + Y(p.y).toFixed(1); }).join(' ') + '~/>'); }
    pts.forEach(function (p) {
      var dim = st.cat && p.e.c !== st.cat, sel = st.sel === p.e.z;
      s += h('<circle class=~td-pt~ data-a=~pt~ data-v=~' + p.e.z + '~ cx=~' + X(p.x).toFixed(1) + '~ cy=~' + Y(p.y).toFixed(1) + '~ r=~' + (sel ? 8 : 5.5) + '~ fill=~' + E.cor(p.e.c) + '~ fill-opacity=~' + (dim ? 0.12 : 0.9) + '~ stroke=~' + (sel ? '#12303A' : '#fff') + '~ stroke-width=~' + (sel ? 2 : 1) + '~><title>' + E.esc(p.e.n) + ' (' + p.e.s + ')  ' + E.fmt(p.rx, 2) + ' ; ' + E.fmt(p.ry, 2) + '</title></circle>');
      if (sel || (!dim && pts.length < 60 && !st.cat)) { s += h('<text class=~td-tx~ x=~' + (X(p.x) + 8).toFixed(1) + '~ y=~' + (Y(p.y) - 7).toFixed(1) + '~ style=~fill:#12303A~>' + p.e.s + '</text>'); }
    });
    var n = pts.length, mx = xs.reduce(function (a, b) { return a + b; }, 0) / n, my = ys.reduce(function (a, b) { return a + b; }, 0) / n, sxy = 0, sxx = 0, syy = 0;
    pts.forEach(function (p) { sxy += (p.x - mx) * (p.y - my); sxx += (p.x - mx) * (p.x - mx); syy += (p.y - my) * (p.y - my); });
    var r = sxx && syy ? sxy / Math.sqrt(sxx * syy) : 0;
    var forca = Math.abs(r) > 0.8 ? 'forte' : Math.abs(r) > 0.5 ? 'moderada' : Math.abs(r) > 0.25 ? 'fraca' : 'praticamente nenhuma';
    var lbl = function (k, atual, acao) { return '<span class=~bt' + (atual === k ? ' on' : '') + '~ data-a=~' + acao + '~ data-v=~' + k + '~>' + P[k][0] + '</span>'; };
    var cats = Object.keys(E.CAT).map(function (c) { return '<span class=~td-lg' + (st.cat && st.cat !== c ? ' off' : '') + ' k-' + c + '~ data-a=~cat~ data-v=~' + c + '~><i></i>' + E.catNome(c) + '</span>'; }).join('');
    var se = st.sel ? E.BYZ[st.sel] : null;
    var selTxt = se ? '<div class=~td-sel~><b>' + se.n + '</b> (' + se.s + ') · ' + P[st.x][0] + ': <b>' + E.fmt(P[st.x][1](se), 2) + '</b> · ' + P[st.y][0] + ': <b>' + E.fmt(P[st.y][1](se), 2) + '</b></div>' : '<div class=~td-sel~>Clique num ponto para ver os valores do elemento.</div>';
    return E.cabecalho('Tendências', 'propriedades periódicas e correlações')
      + h('<div class=~cx td-lt~ style=~left:28px;top:84px;width:300px;height:616px;overflow:auto~>'
        + '<div class=~td-r~ style=~margin:0 0 12px;padding:10px 12px;background:#F5F2EB;border-radius:10px~><b>r = ' + E.fmt(r, 2) + '</b><br>correlação ' + forca + ' (' + n + ' elementos com dados).</div>'
        + '<h4>Eixo X</h4>' + CHAVES.map(function (k) { return lbl(k, st.x, 'x'); }).join('')
        + '<h4 style=~margin-top:10px~>Eixo Y</h4>' + CHAVES.map(function (k) { return lbl(k, st.y, 'y'); }).join('')
        + '<h4 style=~margin-top:10px~>Opções</h4><span class=~bt' + (st.lx ? ' on' : '') + '~ data-a=~lx~>X em log</span><span class=~bt' + (st.ly ? ' on' : '') + '~ data-a=~ly~>Y em log</span><span class=~bt' + (st.lin ? ' on' : '') + '~ data-a=~lin~>Ligar por Z</span>'
        + '<h4 style=~margin-top:10px~>Atalhos</h4>' + PRE.map(function (p, i) { return '<span class=~bt~ data-a=~pre~ data-v=~' + i + '~>' + p[0] + '</span>'; }).join('')
        + '</div>')
      + h('<div class=~cx~ style=~left:344px;top:84px;width:908px;height:616px~><h4>Cada ponto é um elemento</h4><div style=~margin-bottom:6px~>' + cats + '</div>'
        + '<svg viewBox=~0 0 ' + W + ' ' + H + '~ style=~width:100%;height:' + H + 'px~>' + s + '</svg>' + selTxt + '</div>');
  }
  var acoes = {
    z: function (v, d) { d(); },
    x: function (v, d) { st.x = v; st.lx = false; d(); }, y: function (v, d) { st.y = v; st.ly = false; d(); },
    lx: function (v, d) { st.lx = !st.lx; d(); }, ly: function (v, d) { st.ly = !st.ly; d(); }, lin: function (v, d) { st.lin = !st.lin; d(); },
    cat: function (v, d) { st.cat = st.cat === v ? null : v; d(); }, pt: function (v, d) { st.sel = Number(v); d(); },
    pre: function (v, d) { var p = PRE[Number(v)]; st.x = p[1]; st.y = p[2]; st.lx = p[3]; st.ly = p[4]; st.lin = p[5]; d(); }
  };
  E.iniciar(montar, acoes);
})();
