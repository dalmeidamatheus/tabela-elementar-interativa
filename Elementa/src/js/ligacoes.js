/* Página Ligações: tipo de ligação e fórmula entre dois elementos (ΔEN, valência, estados de oxidação). */
(function () {
  var E = window.EL_;
  if (!E) { return; }
  var h = E.h, st = (window.EL_EST.lig = window.EL_EST.lig || { a: 11, b: 17, ativo: 'a' });
  var METAL = { alc: 1, alt: 1, trans: 1, pos: 1, lan: 1, act: 1 };
  var DIAT = { 1: 1, 7: 1, 8: 1, 9: 1, 17: 1, 35: 1, 53: 1 };
  var ANION = { H: 'hidreto', F: 'fluoreto', Cl: 'cloreto', Br: 'brometo', I: 'iodeto', O: 'óxido', S: 'sulfeto', N: 'nitreto', P: 'fosfeto', C: 'carbeto', Se: 'seleneto', As: 'arseneto' };
  var NOMES = { H2O: 'água', CO2: 'dióxido de carbono', CH4: 'metano', NH3: 'amônia', HCl: 'cloreto de hidrogênio (ácido clorídrico em água)', H2S: 'sulfeto de hidrogênio',
    NaCl: 'sal de cozinha (cloreto de sódio)', Fe2O3: 'hematita (ferrugem)', Al2O3: 'alumina', CaO: 'cal virgem', MgO: 'magnésia', SiO2: 'sílica (quartzo, areia)',
    H2: 'gás hidrogênio', O2: 'gás oxigênio', N2: 'gás nitrogênio', Cl2: 'gás cloro', F2: 'gás flúor', HF: 'fluoreto de hidrogênio', CaCl2: 'cloreto de cálcio', KCl: 'cloreto de potássio' };
  var ROMANOS = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
  var PRESETS = [[11, 17], [1, 8], [6, 8], [7, 1], [12, 8], [6, 1], [26, 8], [13, 8], [1, 17], [8, 8], [20, 17], [29, 8]];

  function cap(e) {
    if (e.g === 18) { return 0; }
    if (e.s === 'H') { return 1; }
    if (e.s === 'B') { return 3; }
    return e.g >= 13 ? 18 - e.g : e.val;
  }
  function formula(parts) {
    var p = '', f = '';
    parts.forEach(function (x) { p += x.e.s + (x.n > 1 ? x.n : ''); f += x.e.s + (x.n > 1 ? E.sub(x.n) : ''); });
    return { plain: p, show: f };
  }
  function ionica(c, a) {
    var pos = c.ox.filter(function (x) { return x > 0 && x <= 8; });
    if (!pos.length) { pos = [c.g <= 2 ? c.g : 3]; }
    var neg = a.ox.filter(function (x) { return x < 0; })[0];
    if (neg === undefined) { neg = -(a.g >= 13 ? 18 - a.g : 1); }
    var lista = [];
    pos.slice(0, 3).forEach(function (q) {
      var qa = -neg, g = E.gcd(q, qa), nc = qa / g, na = q / g, f = formula([{ e: c, n: nc }, { e: a, n: na }]);
      lista.push({ q: q, qa: neg, nc: nc, na: na, f: f });
    });
    return lista;
  }
  function analisar(A, B) {
    var r = { A: A, B: B, den: A.en !== null && B.en !== null ? Math.abs(A.en - B.en) : null };
    if (A.z === B.z) {
      if (DIAT[A.z]) { r.tipo = 'Covalente apolar'; r.cor = '#12A3A8'; r.den = 0; r.f = formula([{ e: A, n: 2 }]); r.modo = 'cov'; r.atomos = [A, A];
        r.txt = 'Dois átomos iguais compartilham elétrons por igual: forma uma molécula diatômica.'; }
      else if (METAL[A.c]) { r.tipo = 'Metálica'; r.cor = '#3F7CC4'; r.f = { plain: A.s, show: A.s + 'ₙ' }; r.modo = 'met'; r.atomos = [A, A, A];
        r.txt = 'Os átomos do metal compartilham um mar de elétrons livres: daí vêm a condução elétrica e a maleabilidade.'; }
      else { r.tipo = 'Covalente em rede / átomos isolados'; r.cor = '#12A3A8'; r.f = { plain: A.s, show: A.s }; r.modo = 'cov'; r.atomos = [A, A];
        r.txt = A.g === 18 ? 'Gases nobres têm a camada de valência completa: não formam ligações em condições normais.' : 'Forma redes covalentes ou átomos isolados, dependendo das condições.'; }
      return r;
    }
    if (A.g === 18 || B.g === 18) {
      r.tipo = 'Sem ligação estável'; r.cor = '#7C8A8F'; r.f = { plain: '', show: '—' }; r.modo = 'nada'; r.atomos = [A, B];
      r.txt = 'Gases nobres têm a camada de valência completa e não formam ligações em condições normais.';
      return r;
    }
    var mA = !!METAL[A.c], mB = !!METAL[B.c];
    if (mA && mB) { r.tipo = 'Metálica (liga)'; r.cor = '#3F7CC4'; r.f = { plain: A.s + B.s, show: A.s + '–' + B.s }; r.modo = 'met'; r.atomos = [A, B, A];
      r.txt = 'Dois metais não trocam elétrons: formam ligas, com elétrons livres compartilhados entre todos os átomos.'; return r; }
    if (mA !== mB || (r.den !== null && r.den > 1.7)) {
      var c = (mA && !mB) ? A : (mB && !mA) ? B : (A.en < B.en ? A : B), a = c === A ? B : A;
      var l = ionica(c, a), p = l[0];
      r.tipo = 'Iônica'; r.cor = '#F2553C'; r.modo = 'ion'; r.l = l; r.c = c; r.a = a; r.f = p.f;
      r.cat = p; r.atomos = [];
      r.txt = c.n + ' cede ' + p.q + ' elétron(s) e ' + a.n + ' recebe ' + (-p.qa) + ': formam-se íons de cargas opostas que se atraem (ΔEN ' + E.fmt(r.den) + ').';
      return r;
    }
    var cA = cap(A), cB = cap(B), L = (cA && cB) ? cA * cB / E.gcd(cA, cB) : 0;
    var nA = L ? L / cA : 1, nB = L ? L / cB : 1;
    var Hh = A.s === 'H' ? A : (B.s === 'H' ? B : null), primeiro;
    if (Hh) { var o = Hh === A ? B : A; primeiro = (o.g === 14 || o.g === 15) ? o : Hh; }
    else { primeiro = A.en <= B.en ? A : B; }
    var seg = primeiro === A ? B : A, n1 = primeiro === A ? nA : nB, n2 = primeiro === A ? nB : nA;
    r.f = formula([{ e: primeiro, n: n1 }, { e: seg, n: n2 }]);
    r.polar = r.den !== null && r.den >= 0.4;
    r.tipo = r.polar ? 'Covalente polar' : 'Covalente apolar'; r.cor = r.polar ? '#F7A823' : '#12A3A8'; r.modo = 'cov';
    r.atomos = [];
    var i;
    if (n1 === 1 || n2 === 1) {
      var cen = n1 === 1 ? primeiro : seg, out = n1 === 1 ? seg : primeiro, no = n1 === 1 ? n2 : n1;
      for (i = 0; i < Math.ceil(no / 2); i++) { r.atomos.push(out); }
      r.atomos.push(cen);
      for (i = 0; i < Math.floor(no / 2); i++) { r.atomos.push(out); }
    } else {
      for (i = 0; i < n1; i++) { r.atomos.push(primeiro); }
      for (i = 0; i < n2; i++) { r.atomos.push(seg); }
    }
    r.atomos = r.atomos.slice(0, 5);
    r.txt = 'Os átomos compartilham pares de elétrons para completar o octeto (ΔEN ' + E.fmt(r.den) + '). ' + (r.polar ? 'Como ' + (A.en > B.en ? A.n : B.n) + ' atrai mais os elétrons, a ligação é polar.' : 'A diferença é pequena: os elétrons ficam repartidos quase por igual.') + ' Previsão simplificada pela regra do octeto.';
    return r;
  }
  function nome(r) {
    if (NOMES[r.f.plain]) { return NOMES[r.f.plain]; }
    if (r.modo === 'ion') {
      var romano = r.c.ox.filter(function (x) { return x > 0; }).length > 1 ? ' (' + ROMANOS[r.cat.q] + ')' : '';
      return (ANION[r.a.s] || 'composto de ' + r.a.n.toLowerCase()) + ' de ' + r.c.n.toLowerCase() + romano;
    }
    return r.modo === 'cov' ? 'composto binário' : '';
  }
  function massa(r) {
    if (r.modo === 'ion') { return r.cat.nc * r.c.m + r.cat.na * r.a.m; }
    if (r.modo === 'cov') { var m = 0; var t = r.f.plain; var re = /([A-Z][a-z]?)([0-9]*)/g, x; while ((x = re.exec(t))) { m += E.BYS[x[1]].m * (x[2] ? Number(x[2]) : 1); } return m; }
    return null;
  }
  function cena(r) {
    var s = '', i, n = r.atomos.length, cx0, passo = 120, ra = 34;
    var cat = function (e) { return h('class=~lg-at k-' + e.c + '~'); };
    if (r.modo === 'ion') {
      var seq = [], k;
      for (k = 0; k < r.cat.nc; k++) { seq.push({ e: r.c, q: r.cat.q }); }
      for (k = 0; k < r.cat.na; k++) { seq.push({ e: r.a, q: r.cat.qa }); }
      seq = seq.slice(0, 6); n = seq.length; passo = Math.min(120, 520 / n); cx0 = 300 - (n - 1) * passo / 2;
      seq.forEach(function (x, j) {
        var cx = cx0 + j * passo;
        s += h('<g class=~k-' + x.e.c + '~><circle ' + cat(x.e) + ' cx=~' + cx + '~ cy=~110~ r=~' + ra + '~/><text class=~lg-sy~ x=~' + cx + '~ y=~119~>' + x.e.s + '</text><text class=~lg-q~ x=~' + (cx + 26) + '~ y=~78~>' + E.carga(x.q) + '</text></g>');
        if (j < n - 1 && ((x.q > 0) !== (seq[j + 1].q > 0))) { s += h('<path class=~lg-fl~ d=~M' + (cx + ra + 4) + ' 110 L' + (cx + passo - ra - 4) + ' 110~/><circle class=~lg-ed~ cx=~' + (cx + passo / 2) + '~ cy=~110~ r=~4~/>'); }
      });
      return s;
    }
    passo = r.modo === 'cov' ? 58 : 66; ra = r.modo === 'cov' ? 34 : 30; cx0 = 300 - (n - 1) * passo / 2;
    if (r.modo === 'met') { for (i = 0; i < 14; i++) { s += h('<circle class=~lg-mar~ cx=~' + (120 + (i * 47) % 360) + '~ cy=~' + (60 + (i * 31) % 100) + '~ r=~3~ style=~animation-delay:' + (i * 0.13) + 's~/>'); } }
    r.atomos.forEach(function (e, j) {
      var cx = cx0 + j * passo;
      s += h('<g class=~k-' + e.c + '~><circle ' + cat(e) + ' cx=~' + cx + '~ cy=~110~ r=~' + ra + '~/><text class=~lg-sy~ x=~' + cx + '~ y=~119~>' + e.s + '</text></g>');
      if (r.modo === 'cov' && j < n - 1) { s += h('<circle class=~lg-ed sh~ cx=~' + (cx + passo / 2) + '~ cy=~102~ r=~3.4~/><circle class=~lg-ed sh~ cx=~' + (cx + passo / 2) + '~ cy=~118~ r=~3.4~/>'); }
    });
    return s;
  }
  function montar() {
    var A = E.BYZ[st.a], B = E.BYZ[st.b], r = analisar(A, B), m = massa(r), nm = nome(r);
    var fill = function (x) { return (x.z === st.a || x.z === st.b) ? {} : {}; };
    var sel = {}; sel[st.a] = 1; sel[st.b] = 1;
    var pos = r.den === null ? 0 : Math.min(r.den / 3.3, 1) * 100;
    var alt = r.modo === 'ion' && r.l.length > 1 ? h('<div class=~lg-alt~>Outros estados de oxidação: ' + r.l.slice(1).map(function (x) { return x.f.show + ' (' + r.c.s + E.carga(x.q) + ')'; }).join('   ') + '</div>') : '';
    var slot = function (k, e) { return h('<div class=~lg-slot' + (st.ativo === k ? ' on' : '') + '~ data-a=~slot~ data-v=~' + k + '~><span>' + (k === 'a' ? 'elemento A' : 'elemento B') + '</span><b>' + e.s + '</b><span>' + e.n + '</span></div>'); };
    var pres = PRESETS.map(function (p) { return h('<span class=~bt~ data-a=~pre~ data-v=~' + p[0] + ',' + p[1] + '~>' + E.BYZ[p[0]].s + ' + ' + E.BYZ[p[1]].s + '</span>'); }).join('');
    return E.cabecalho('Ligações', 'tipo de ligação e fórmula entre dois elementos')
      + h('<div class=~cx~ style=~left:28px;top:84px;width:640px;height:376px~><h4>Escolha dois elementos</h4>') + slot('a', A) + slot('b', B)
      + h('<span style=~font-size:10px;color:#7C8A8F~>o próximo clique preenche o elemento em destaque</span><div style=~margin-top:4px~>') + E.mini({ w: 31, h: 22, sel: sel, fill: fill }) + '</div></div>'
      + h('<div class=~cx~ style=~left:28px;top:470px;width:640px;height:230px~><h4>Exemplos</h4>') + pres
      + h('<div class=~lg-med~><i style=~left:calc(' + pos.toFixed(1) + '% - 2px)~></i></div><div class=~lg-esc~><span>0 · apolar</span><span>0,4 · polar</span><span>1,7 · iônica</span><span>3,3</span></div>')
      + h('<div class=~lg-txt~>Diferença de eletronegatividade (ΔEN): <b>' + E.fmt(r.den) + '</b>. Quanto maior, mais desigual é a disputa pelos elétrons.</div></div>')
      + h('<div class=~cx~ style=~left:684px;top:84px;width:568px;height:616px~><h4>Resultado</h4><div class=~lg-for~>' + r.f.show + '</div>' + (nm ? '<div class=~lg-nome~>' + nm + '</div>' : '')
        + '<div class=~lg-tipo~ style=~background:' + r.cor + '~>' + r.tipo.toUpperCase() + '</div>')
      + h('<svg viewBox=~0 0 600 230~ style=~width:100%;height:230px;margin-top:6px~>') + cena(r) + '</svg>'
      + h('<div class=~lg-txt~>' + r.txt + '</div>') + alt
      + (m ? h('<div class=~lg-alt~>Massa molar: ' + E.fmt(m, 2) + ' g/mol</div>') : '') + '</div>';
  }
  var acoes = {
    z: function (v, d) { var o = st.ativo; st[o] = Number(v); st.ativo = o === 'a' ? 'b' : 'a'; d(); },
    slot: function (v, d) { st.ativo = v; d(); },
    pre: function (v, d) { var p = v.split(','); st.a = Number(p[0]); st.b = Number(p[1]); d(); }
  };
  E.iniciar(montar, acoes);
})();
