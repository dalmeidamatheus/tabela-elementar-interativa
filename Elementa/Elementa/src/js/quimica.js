(function () {
  var E = window.EL_;
  if (!E) { return; }
  var BYS = E.BYS;
  var METAL = { alc: 1, alt: 1, trans: 1, pos: 1, lan: 1, act: 1 };
  var DIAT = { H: 1, N: 1, O: 1, F: 1, Cl: 1, Br: 1, I: 1 };
  var ATIV = ['Li', 'K', 'Ba', 'Sr', 'Ca', 'Na', 'Mg', 'Be', 'Al', 'Mn', 'Zn', 'Cr', 'Fe', 'Cd', 'Co', 'Ni', 'Sn', 'Pb', 'H', 'Cu', 'Hg', 'Ag', 'Pt', 'Au'];
  var HALO = ['F', 'Cl', 'Br', 'I'];
  var CARGA = { Fe: 2, Cu: 2, Sn: 2, Pb: 2, Hg: 2, Mn: 2, Co: 2, Ni: 2, Cr: 3, Au: 3, Ag: 1, Ti: 4 };
  var CARGA_OX = { Fe: 3, Cu: 2, Sn: 2, Pb: 2, Mn: 2, Cr: 3, Co: 2, Ni: 2 };
  var NMOX = { C: 'CO2', S: 'SO2', P: 'P2O5', Si: 'SiO2', H: 'H2O', N: 'NO', B: 'B2O3', As: 'As2O3' };
  var ACIDO_OX = { CO2: 'H2CO3', SO2: 'H2SO3', SO3: 'H2SO4', P2O5: 'H3PO4', N2O5: 'HNO3' };
  var AN_POLI = [['C2H3O2', -1], ['Cr2O7', -2], ['HCO3', -1], ['HPO4', -2], ['SCN', -1], ['MnO4', -1], ['ClO4', -1], ['ClO3', -1],
    ['CrO4', -2], ['NO3', -1], ['NO2', -1], ['SO4', -2], ['SO3', -2], ['CO3', -2], ['PO4', -3], ['OH', -1], ['CN', -1]];
  var GAS = { H2: 1, O2: 1, N2: 1, Cl2: 1, F2: 1, CO2: 1, NH3: 1, SO2: 1, H2S: 1, CH4: 1, C2H6: 1, C3H8: 1, C4H10: 1, C2H2: 1, NO: 1, NO2: 1, CO: 1, C2H4: 1 };
  var LIQ = { H2O: 1, Br2: 1, Hg: 1, H2O2: 1, C2H6O: 1, C2H4O2: 1, C8H18: 1, C4H8O2: 1 };
  var NOMES = { agua: 'H2O', glicose: 'C6H12O6', frutose: 'C6H12O6', sacarose: 'C12H22O11', etanol: 'C2H6O', alcool: 'C2H6O',
    'gas oxigenio': 'O2', 'gas carbonico': 'CO2', 'dioxido de carbono': 'CO2', 'gas hidrogenio': 'H2', 'gas nitrogenio': 'N2', amonia: 'NH3',
    metano: 'CH4', propano: 'C3H8', butano: 'C4H10', octano: 'C8H18', acetileno: 'C2H2', 'acido acetico': 'C2H4O2', 'acido lactico': 'C3H6O3',
    'acido piruvico': 'C3H4O3', glicina: 'C2H5NO2', alanina: 'C3H7NO2', serina: 'C3H7NO3', cisteina: 'C3H7NO2S', ureia: 'CH4N2O',
    glicerol: 'C3H8O3', 'acido palmitico': 'C16H32O2', atp: 'C10H16N5O13P3', adp: 'C10H15N5O10P2', 'sal de cozinha': 'NaCl',
    'soda caustica': 'NaOH', 'acido cloridrico': 'HCl', 'acido sulfurico': 'H2SO4', 'acido nitrico': 'HNO3', 'cal virgem': 'CaO',
    'cal hidratada': 'Ca(OH)2', calcario: 'CaCO3', ferrugem: 'Fe2O3', bicarbonato: 'NaHCO3', 'agua oxigenada': 'H2O2', 'acido fosforico': 'H3PO4',
    'g6p': 'C6H13O9P', 'glicose-6-fosfato': 'C6H13O9P', 'acetato de etila': 'C4H8O2', 'fosfato': 'H3PO4' };
  var NOME_DE = { H2O: 'água', C6H12O6: 'glicose / frutose', C12H22O11: 'sacarose', C2H6O: 'etanol', O2: 'gás oxigênio', CO2: 'gás carbônico', H2: 'gás hidrogênio',
    N2: 'gás nitrogênio', NH3: 'amônia', CH4: 'metano', C3H8: 'propano', C4H10: 'butano', C8H18: 'octano', C2H2: 'acetileno', C2H4O2: 'ácido acético',
    C3H6O3: 'ácido lático', C2H5NO2: 'glicina', C4H8N2O3: 'diglicina (dipeptídeo)', CH4N2O: 'ureia', C3H8O3: 'glicerol', C16H32O2: 'ácido palmítico',
    C10H16N5O13P3: 'ATP', C10H15N5O10P2: 'ADP', H3PO4: 'ácido fosfórico', C6H13O9P: 'glicose-6-fosfato', C4H8O2: 'acetato de etila', C51H98O6: 'tripalmitina (triglicerídeo)',
    NaCl: 'sal de cozinha', NaOH: 'soda cáustica', HCl: 'ácido clorídrico', H2SO4: 'ácido sulfúrico', HNO3: 'ácido nítrico', CaO: 'cal virgem', CaCO3: 'calcário',
    Fe2O3: 'hematita (ferrugem)', NaHCO3: 'bicarbonato de sódio', H2O2: 'água oxigenada', H2CO3: 'ácido carbônico' };
  var BIO2 = { 'C2H4O2|C2H6O': { p: ['C4H8O2', 'H2O'], tipo: 'Condensação', nome: 'Esterificação', nota: 'Ácido + álcool formam éster e água (ligação éster).' },
    'C3H8O3|C16H32O2': { p: ['C51H98O6', 'H2O'], tipo: 'Condensação', nome: 'Formação de triglicerídeo', nota: 'O glicerol liga 3 ácidos graxos por ligações éster, liberando 3 H₂O.' },
    'C10H16N5O13P3|H2O': { p: ['C10H15N5O10P2', 'H3PO4'], tipo: 'Hidrólise', nome: 'Hidrólise do ATP', nota: 'ATP perde um fosfato e libera energia usada pela célula.' },
    'C10H16N5O13P3|C6H12O6': { p: ['C6H13O9P', 'C10H15N5O10P2'], tipo: 'Fosforilação', nome: 'Hexocinase', nota: 'O fosfato do ATP passa para a glicose (glicose-6-fosfato), primeiro passo da glicólise.' },
    'CH4N2O|H2O': { p: ['CO2', 'NH3'], tipo: 'Hidrólise', nome: 'Hidrólise da ureia', nota: 'Catalisada pela urease no solo e em bactérias.' },
    'C12H22O11|H2O': { p: ['C6H12O6', 'C6H12O6'], tipo: 'Hidrólise', nome: 'Hidrólise da sacarose', nota: 'A sacarose se divide em glicose e frutose (mesma fórmula, estruturas diferentes).' },
    'C4H8N2O3|H2O': { p: ['C2H5NO2', 'C2H5NO2'], tipo: 'Hidrólise', nome: 'Quebra do dipeptídeo', nota: 'A ligação peptídica é rompida pela água.' },
    'C4H8O2|H2O': { p: ['C2H4O2', 'C2H6O'], tipo: 'Hidrólise', nome: 'Hidrólise do éster', nota: 'Inverso da esterificação.' } };
  var DEC = { H2O: { p: ['H2', 'O2'], nome: 'Eletrólise da água' }, H2O2: { p: ['H2O', 'O2'], nome: 'Decomposição da água oxigenada (catalase)' },
    H2CO3: { p: ['CO2', 'H2O'], nome: 'Decomposição do ácido carbônico' }, KClO3: { p: ['KCl', 'O2'], nome: 'Decomposição do clorato de potássio' },
    NaHCO3: { p: ['Na2CO3', 'H2O', 'CO2'], nome: 'Decomposição do bicarbonato' }, NH4Cl: { p: ['NH3', 'HCl'], nome: 'Decomposição do cloreto de amônio' },
    C6H12O6: { p: ['C2H6O', 'CO2'], nome: 'Fermentação alcoólica', nota: 'Leveduras convertem glicose em etanol e CO₂ (sem oxigênio).' } };

  function limpar(f) { return String(f).replace(/[₀-₉]/g, function (c) { return String(c.charCodeAt(0) - 8320); }).replace(/\s+/g, '').replace(/[{]/g, '(').replace(/[}]/g, ')'); }
  function somar(a, b, k) { for (var s in b) { a[s] = (a[s] || 0) + b[s] * k; } return a; }
  function ler(s, i, abre) {
    var obj = {}, m, n;
    while (i < s.length) {
      var c = s.charAt(i);
      if (c === '(' || c === '[') {
        var r = ler(s, i + 1, true);
        if (!r) { return null; }
        i = r[1]; n = 1; m = /^[0-9]+/.exec(s.substr(i));
        if (m) { n = Number(m[0]); i += m[0].length; }
        somar(obj, r[0], n);
      } else if (c === ')' || c === ']') {
        return abre ? [obj, i + 1] : null;
      } else if (/[A-Z]/.test(c)) {
        var sim = c, nx = s.charAt(i + 1);
        if (/[a-z]/.test(nx) && BYS[c + nx]) { sim = c + nx; i += 2; } else { i += 1; }
        if (!BYS[sim]) { return null; }
        n = 1; m = /^[0-9]+/.exec(s.substr(i));
        if (m) { n = Number(m[0]); i += m[0].length; }
        obj[sim] = (obj[sim] || 0) + n;
      } else { return null; }
    }
    return abre ? null : [obj, i];
  }
  function parse(f) {
    var partes = limpar(f).split(/[·*]/), tot = {}, k;
    for (k = 0; k < partes.length; k++) {
      var p = partes[k], mult = 1, m;
      if (k > 0) { m = /^[0-9]+/.exec(p); if (m) { mult = Number(m[0]); p = p.substr(m[0].length); } }
      var r = ler(p, 0, false);
      if (!r || !Object.keys(r[0]).length) { return null; }
      somar(tot, r[0], mult);
    }
    return tot;
  }
  function massa(o) { var m = 0, s; for (s in o) { m += BYS[s].m * o[s]; } return m; }
  function hill(o) {
    var ks = Object.keys(o), tem = !!o.C;
    ks.sort(function (a, b) {
      if (tem) { if (a === 'C') { return -1; } if (b === 'C') { return 1; } if (a === 'H') { return -1; } if (b === 'H') { return 1; } }
      return a < b ? -1 : a > b ? 1 : 0;
    });
    return ks.map(function (s) { return s + (o[s] > 1 ? o[s] : ''); }).join('');
  }
  function canon(f) { var o = parse(f); return o ? hill(o) : f; }
  function mostrar(f) { return String(f).replace(/([A-Za-z\)\]])([0-9]+)/g, function (_, a, n) { return a + E.sub(n); }).replace(/\*/g, '·'); }
  function semAcento(s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim(); }
  var ELNOME = {};
  E.EL.forEach(function (e) { ELNOME[semAcento(e.n)] = DIAT[e.s] ? e.s + '2' : e.s; });
  function resolver(t) {
    t = String(t).trim();
    if (!t) { return null; }
    var k = semAcento(t);
    if (NOMES[k]) { return NOMES[k]; }
    if (ELNOME[k]) { return ELNOME[k]; }
    return parse(t) ? t.replace(/\s+/g, '') : null;
  }
  function elemento(f) {
    var o = parse(f), ks = o ? Object.keys(o) : [];
    return ks.length === 1 ? ks[0] : null;
  }
  function canonEl(s) { return DIAT[s] ? s + '2' : s; }

  function mdc(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
  function fr(a, b) { if (b < 0) { a = -a; b = -b; } var g = mdc(a, b) || 1; return [a / g, b / g]; }
  function fsub(x, y) { return fr(x[0] * y[1] - y[0] * x[1], x[1] * y[1]); }
  function fmul(x, y) { return fr(x[0] * y[0], x[1] * y[1]); }
  function fdiv(x, y) { return fr(x[0] * y[1], x[1] * y[0]); }
  function balancear(reag, prod) {
    var esp = reag.concat(prod), comps = esp.map(parse), i, c, j;
    if (comps.some(function (x) { return !x; })) { return { erro: 'Alguma fórmula não é válida.' }; }
    var els = {};
    comps.forEach(function (x) { for (var s in x) { els[s] = 1; } });
    var rows = Object.keys(els), n = esp.length;
    for (i = 0; i < rows.length; i++) {
      var ne = 0, np = 0;
      for (j = 0; j < n; j++) { if (comps[j][rows[i]]) { if (j < reag.length) { ne++; } else { np++; } } }
      if (!ne || !np) { return { erro: 'O elemento ' + rows[i] + ' precisa aparecer nos dois lados da equação.' }; }
    }
    var M = rows.map(function (el) { return comps.map(function (x, k) { return [(x[el] || 0) * (k < reag.length ? 1 : -1), 1]; }); });
    var piv = [], r = 0;
    for (c = 0; c < n && r < M.length; c++) {
      var p = -1;
      for (i = r; i < M.length; i++) { if (M[i][c][0] !== 0) { p = i; break; } }
      if (p < 0) { continue; }
      var t = M[r]; M[r] = M[p]; M[p] = t;
      var d = M[r][c];
      M[r] = M[r].map(function (v) { return fdiv(v, d); });
      for (i = 0; i < M.length; i++) {
        if (i !== r && M[i][c][0] !== 0) { (function (ii) { var f = M[ii][c]; M[ii] = M[ii].map(function (v, k) { return fsub(v, fmul(f, M[r][k])); }); })(i); }
      }
      piv.push(c); r++;
    }
    var livres = [];
    for (c = 0; c < n; c++) { if (piv.indexOf(c) < 0) { livres.push(c); } }
    if (!livres.length) { return { erro: 'Não existe combinação de coeficientes que feche a conta.' }; }
    var x = new Array(n);
    livres.forEach(function (lc) { x[lc] = [1, 1]; });
    piv.forEach(function (pc, ri) { var s = [0, 1]; livres.forEach(function (lc) { s = fsub(s, fmul(M[ri][lc], x[lc])); }); x[pc] = s; });
    var den = 1;
    x.forEach(function (v) { den = den * v[1] / mdc(den, v[1]); });
    var inteiros = x.map(function (v) { return v[0] * den / v[1]; });
    if (inteiros.some(function (v) { return v <= 0; })) { return { erro: 'Sem solução com coeficientes positivos: confira reagentes e produtos.' }; }
    var g = inteiros.reduce(mdc);
    return { coef: inteiros.map(function (v) { return v / g; }), indet: livres.length > 1 };
  }

  function cargaCat(s, tabela) { var e = BYS[s], pos = e.ox.filter(function (q) { return q > 0; }); return (tabela && tabela[s]) || CARGA[s] || pos[0] || 1; }
  function ions(f) {
    var s = limpar(f), i, m;
    for (i = 0; i < AN_POLI.length; i++) {
      var P = AN_POLI[i][0], q = AN_POLI[i][1], na = 1, pre = null;
      m = new RegExp('^(.+?)\\(' + P + '\\)([0-9]*)$').exec(s);
      if (m) { pre = m[1]; na = m[2] ? Number(m[2]) : 1; }
      else { m = new RegExp('^(.+?)' + P + '([0-9]*)$').exec(s); if (m) { pre = m[1]; na = m[2] ? Number(m[2]) : 1; } }
      if (pre === null) { continue; }
      var cat = catDe(pre);
      if (!cat) { continue; }
      var qc = Math.abs(q) * na / cat.n;
      if (qc !== Math.round(qc) || qc < 1) { continue; }
      return { cat: { f: cat.f, q: qc }, an: { f: P, q: q, poli: true } };
    }
    var o = parse(s), ks = o ? Object.keys(o) : [];
    if (ks.length === 2) {
      var a = ks[0], b = ks[1];
      if (BYS[a].en !== null && BYS[b].en !== null && BYS[a].en > BYS[b].en) { var tt = a; a = b; b = tt; }
      var ea = BYS[a], eb = BYS[b];
      var catOk = METAL[ea.c] || (a === 'H' && (b === 'Cl' || b === 'Br' || b === 'I' || b === 'F' || b === 'S'));
      var neg = eb.ox.filter(function (v) { return v < 0; })[0];
      if (catOk && neg !== undefined && !METAL[eb.c] && !(a === 'H' && b === 'O')) {
        var qq = Math.abs(neg) * o[b] / o[a];
        if (qq === Math.round(qq) && qq >= 1) { return { cat: { f: a, q: qq }, an: { f: b, q: neg, poli: false } }; }
      }
    }
    return null;
  }
  function catDe(pre) {
    var m = /^\(?NH4\)?([0-9]*)$/.exec(pre);
    if (m) { return { f: 'NH4', n: m[1] ? Number(m[1]) : 1 }; }
    var o = parse(pre), ks = o ? Object.keys(o) : [];
    if (ks.length === 1 && (ks[0] === 'H' || METAL[BYS[ks[0]].c])) { return { f: ks[0], n: o[ks[0]] }; }
    return null;
  }
  function monta(cat, an) {
    var q = cat.q, qa = Math.abs(an.q), g = mdc(q, qa), nc = qa / g, na = q / g;
    var cs = cat.f === 'NH4' ? (nc > 1 ? '(NH4)' + nc : 'NH4') : cat.f + (nc > 1 ? nc : '');
    var as = an.poli ? (na > 1 ? '(' + an.f + ')' + na : an.f) : an.f + (na > 1 ? na : '');
    return cs + as;
  }
  function solub(cat, an) {
    if (cat === 'NH4' || { Li: 1, Na: 1, K: 1, Rb: 1, Cs: 1, H: 1 }[cat]) { return true; }
    if ({ NO3: 1, C2H3O2: 1, ClO3: 1, ClO4: 1, NO2: 1, HCO3: 1, MnO4: 1 }[an]) { return true; }
    if ({ Cl: 1, Br: 1, I: 1 }[an]) { return !{ Ag: 1, Pb: 1, Hg: 1 }[cat]; }
    if (an === 'F') { return !{ Ca: 1, Mg: 1, Ba: 1, Sr: 1, Pb: 1 }[cat]; }
    if (an === 'SO4') { return !{ Ba: 1, Sr: 1, Pb: 1, Ca: 1, Ag: 1 }[cat]; }
    if (an === 'OH') { return !!({ Ba: 1, Sr: 1 }[cat]); }
    if ({ CO3: 1, PO4: 1, S: 1, CrO4: 1, SO3: 1, HPO4: 1 }[an]) { return false; }
    return true;
  }
  function estado(f, aq) {
    if (GAS[f]) { return 'g'; }
    if (LIQ[f]) { return 'l'; }
    var el = elemento(f);
    if (el) { return 's'; }
    if (aq) { var io = ions(f); if (io) { return solub(io.cat.f, io.an.f) ? 'aq' : 's'; } }
    return '';
  }

  function chaves(tb) { var o = {}, k; for (k in tb) { o[canon(k)] = tb[k]; } return o; }
  function chavesPar(tb) { var o = {}, k; for (k in tb) { o[k.split('|').map(canon).sort().join('|')] = tb[k]; } return o; }
  DEC = chaves(DEC); BIO2 = chavesPar(BIO2); ACIDO_OX = chaves(ACIDO_OX);
  var NH3C = canon('NH3');

  function res(tipo, nome, reag, prod, nota, aq) {
    return { tipo: tipo, nome: nome || '', reag: reag, prod: prod, nota: nota || '', est: function (f) { return estado(f, aq); } };
  }
  function oxidoDe(m) {
    var q = cargaCat(m, CARGA_OX);
    return monta({ f: m, q: q }, { f: 'O', q: -2, poli: false });
  }
  function sintese(a, b) {
    var ea = elemento(a), eb = elemento(b);
    if (!ea || !eb || ea === eb) { return null; }
    var x = ea, y = eb;
    if (y === 'O' || x === 'O') {
      var outro = x === 'O' ? y : x;
      if (METAL[BYS[outro].c]) { return res('Síntese', 'Oxidação do metal', [a, b], [oxidoDe(outro)], 'O metal cede elétrons ao oxigênio e forma o óxido.'); }
      if (NMOX[outro]) { return res('Síntese', outro === 'C' || outro === 'H' ? 'Combustão completa' : 'Formação de óxido', [a, b], [NMOX[outro]], 'O não metal reage com o oxigênio.'); }
      return null;
    }
    var m = METAL[BYS[x].c] ? x : METAL[BYS[y].c] ? y : null;
    var nm = m === x ? y : x;
    if (m && !METAL[BYS[nm].c]) {
      var neg = BYS[nm].ox.filter(function (v) { return v < 0; })[0];
      if (neg === undefined) { return null; }
      return res('Síntese', 'Formação de composto iônico', [a, b], [monta({ f: m, q: cargaCat(m, CARGA_OX) }, { f: nm, q: neg, poli: false })], 'O metal cede elétrons e o não metal os recebe.');
    }
    if (x === 'H' || y === 'H') {
      var o2 = x === 'H' ? y : x, ng = BYS[o2].ox.filter(function (v) { return v < 0; })[0];
      if (ng === undefined || METAL[BYS[o2].c]) { return null; }
      return res('Síntese', 'Formação de composto molecular', [a, b], [['N', 'P', 'As', 'C', 'Si'].indexOf(o2) >= 0 ? o2 + 'H' + Math.abs(ng) : 'H' + (Math.abs(ng) > 1 ? Math.abs(ng) : '') + o2], 'Os átomos compartilham elétrons.');
    }
    return null;
  }
  function combustao(a, b) {
    var org = canon(a) === 'O2' ? b : a, o = parse(org);
    if (!o || !o.C || !o.H) { return null; }
    var prod = ['CO2', 'H2O'];
    if (o.N) { prod.push('N2'); }
    if (o.S) { prod.push('SO2'); }
    return res('Combustão', 'Combustão completa', [a, b], prod, 'Composto orgânico + O₂ → CO₂ + H₂O (oxidação completa, libera energia). É também a base química da respiração celular.');
  }
  function oxidoAgua(a, b) {
    var w = canon(a) === 'H2O' ? a : canon(b) === 'H2O' ? b : null;
    if (!w) { return null; }
    var ox = w === a ? b : a, co = canon(ox), io = ions(ox);
    if (ACIDO_OX[co]) { return res('Síntese', 'Óxido ácido + água → ácido', [a, b], [ACIDO_OX[co]], 'Óxidos de não metais reagem com água formando ácidos.'); }
    if (io && io.an.f === 'O' && io.cat.f !== 'H') { return res('Síntese', 'Óxido básico + água → base', [a, b], [monta(io.cat, { f: 'OH', q: -1, poli: true })], 'Óxidos de metais alcalinos e alcalino-terrosos formam hidróxidos.'); }
    return null;
  }
  function oxidoCO2(a, b) {
    var c = canon(a) === 'CO2' ? a : canon(b) === 'CO2' ? b : null;
    if (!c) { return null; }
    var ox = c === a ? b : a, io = ions(ox);
    if (io && io.an.f === 'O') { return res('Síntese', 'Óxido básico + CO₂ → carbonato', [a, b], [monta(io.cat, { f: 'CO3', q: -2, poli: true })], 'Óxido de metal absorve CO₂ e forma carbonato.'); }
    return null;
  }
  function amonia(a, b) {
    var n = canon(a) === NH3C ? a : canon(b) === NH3C ? b : null;
    if (!n) { return null; }
    var ac = n === a ? b : a, io = ions(ac);
    if (io && io.cat.f === 'H') { return res('Síntese', 'Amônia + ácido → sal de amônio', [a, b], [monta({ f: 'NH4', q: 1 }, io.an)], 'A amônia captura H⁺ do ácido.', true); }
    return null;
  }
  function trocaSimples(a, b) {
    var ea = elemento(a), eb = elemento(b), el, comp;
    if (ea && !eb) { el = ea; comp = b; } else if (eb && !ea) { el = eb; comp = a; } else { return null; }
    var reag = [a, b];
    if (canon(comp) === 'H2O') {
      if ({ Li: 1, K: 1, Ba: 1, Sr: 1, Ca: 1, Na: 1 }[el]) { return res('Simples troca', 'Metal ativo + água', reag, [monta({ f: el, q: cargaCat(el) }, { f: 'OH', q: -1, poli: true }), 'H2'], 'Metais alcalinos e alcalino-terrosos deslocam o hidrogênio da água.'); }
      return { semReacao: true, tipo: 'Sem reação', nome: '', nota: el + ' não desloca o hidrogênio da água em condições normais.', reag: reag, prod: [] };
    }
    var io = ions(comp);
    if (!io) { return null; }
    if (METAL[BYS[el].c]) {
      var cat = io.cat.f, ia = ATIV.indexOf(el), ic = ATIV.indexOf(cat);
      if (ia < 0 || ic < 0 || cat === 'NH4') { return null; }
      if (ia < ic) {
        var novo = monta({ f: el, q: cargaCat(el) }, io.an);
        return res('Simples troca', cat === 'H' ? 'Metal + ácido' : 'Deslocamento de metal', reag, [novo, canonEl(cat)],
          el + ' é mais reativo que ' + cat + ' (série de reatividade), então toma o lugar dele no composto.', true);
      }
      return { semReacao: true, tipo: 'Sem reação', nome: '', nota: el + ' é menos reativo que ' + cat + ': não consegue deslocá-lo (série de reatividade).', reag: reag, prod: [] };
    }
    if (HALO.indexOf(el) >= 0 && !io.an.poli && HALO.indexOf(io.an.f) >= 0) {
      if (HALO.indexOf(el) < HALO.indexOf(io.an.f)) {
        return res('Simples troca', 'Deslocamento de halogênio', reag, [monta(io.cat, { f: el, q: -1, poli: false }), canonEl(io.an.f)], el + ' é mais reativo que ' + io.an.f + ' (F > Cl > Br > I).', true);
      }
      return { semReacao: true, tipo: 'Sem reação', nome: '', nota: el + ' é menos reativo que ' + io.an.f + ': não ocorre deslocamento.', reag: reag, prod: [] };
    }
    return null;
  }
  function dupla(a, b) {
    var A = ions(a), B = ions(b);
    if (!A || !B) { return null; }
    var reag = [a, b];
    var p1 = { cat: A.cat, an: B.an }, p2 = { cat: B.cat, an: A.an }, prod = [], ev = [], neutraliza = false;
    [p1, p2].forEach(function (p) {
      var f = monta(p.cat, p.an);
      if (p.cat.f === 'H' && p.an.f === 'OH') { prod.push('H2O'); neutraliza = true; return; }
      if (f === 'H2CO3') { prod.push('CO2', 'H2O'); ev.push('gás'); return; }
      if (f === 'H2SO3') { prod.push('SO2', 'H2O'); ev.push('gás'); return; }
      if (p.cat.f === 'NH4' && p.an.f === 'OH') { prod.push('NH3', 'H2O'); ev.push('gás'); return; }
      prod.push(f);
      if (!solub(p.cat.f, p.an.f)) { ev.push('precipitado'); }
    });
    if (neutraliza) { return res('Neutralização', 'Ácido + base → sal + água', reag, prod, 'H⁺ do ácido e OH⁻ da base formam água; os outros íons formam o sal.', true); }
    if (ev.length) { return res('Dupla troca', ev.indexOf('gás') >= 0 ? 'Formação de gás' : 'Precipitação', reag, prod, ev.indexOf('gás') >= 0 ? 'Um dos produtos escapa como gás (e/ou forma água), por isso a reação avança.' : 'Um dos produtos é insolúvel e precipita, removendo íons da solução (regras de solubilidade simplificadas).', true); }
    return { semReacao: true, tipo: 'Sem reação', nome: '', nota: 'Todos os possíveis produtos são solúveis: os íons continuam dissolvidos e não há reação líquida.', reag: reag, prod: [] };
  }
  function decompor(a) {
    var c = canon(a), reag = [a];
    if (DEC[c]) { return res('Decomposição', DEC[c].nome, reag, DEC[c].p, DEC[c].nota || 'Um composto se divide em substâncias mais simples.'); }
    var io = ions(a);
    if (io && io.an.f === 'CO3' && io.cat.f !== 'NH4' && io.cat.f !== 'H') { return res('Decomposição', 'Decomposição térmica de carbonato', reag, [monta(io.cat, { f: 'O', q: -2, poli: false }), 'CO2'], 'Aquecido, o carbonato libera CO₂ e deixa o óxido.'); }
    if (io && io.an.f === 'OH' && io.cat.f !== 'H' && !{ Na: 1, K: 1, Li: 1 }[io.cat.f]) { return res('Decomposição', 'Desidratação de hidróxido', reag, [monta(io.cat, { f: 'O', q: -2, poli: false }), 'H2O'], 'Aquecido, o hidróxido perde água e forma o óxido.'); }
    if (io && !io.an.poli) { return res('Decomposição', 'Eletrólise / decomposição em elementos', reag, [canonEl(io.cat.f), canonEl(io.an.f)], 'Corrente elétrica ou calor separam o composto em seus elementos.'); }
    return null;
  }
  function condensar(a, b) {
    var A = parse(a), B = parse(b);
    if (!A || !B) { return null; }
    var t = somar(somar({}, A, 1), B, 1);
    t.H = (t.H || 0) - 2; t.O = (t.O || 0) - 1;
    if (t.H < 0 || t.O < 0) { return null; }
    if (!t.H) { delete t.H; }
    if (!t.O) { delete t.O; }
    return res('Condensação', 'Condensação (desidratação)', [a, b], [hill(t), 'H2O'], 'Duas moléculas se unem liberando uma molécula de água: é assim que se formam ligações peptídicas, glicosídicas e ésteres.');
  }
  function prever(ent, modo) {
    if (!ent.length) { return { erro: 'Digite ao menos um reagente.' }; }
    if (ent.length === 1) { return decompor(ent[0]) || { erro: 'Não reconheci uma decomposição para ' + ent[0] + '. Tente uma equação completa ou outro composto.' }; }
    if (ent.length > 2) { return { erro: 'A previsão aceita até dois reagentes. Para três ou mais, informe a equação completa e use Balancear.' }; }
    var a = ent[0], b = ent[1], r = null;
    if (modo === 'cond') { return condensar(a, b) || { erro: 'Não foi possível condensar esses dois compostos.' }; }
    if (modo === 'comb') { return combustao(a, b) || { erro: 'Combustão precisa de um composto com C e H e do O₂.' }; }
    if (modo === 'hid') {
      var k0 = [canon(a), canon(b)].sort().join('|');
      return (BIO2[k0] && BIO2[k0].tipo === 'Hidrólise') ? res('Hidrólise', BIO2[k0].nome, [a, b], BIO2[k0].p, BIO2[k0].nota) : { erro: 'Não conheço a hidrólise desse composto (catálogo: ATP, sacarose, ureia, dipeptídeo, éster).' };
    }
    var k = [canon(a), canon(b)].sort().join('|');
    if (BIO2[k]) { return res(BIO2[k].tipo, BIO2[k].nome, [a, b], BIO2[k].p, BIO2[k].nota); }
    r = sintese(a, b) || combustao(a, b) || oxidoAgua(a, b) || oxidoCO2(a, b) || amonia(a, b) || trocaSimples(a, b) || dupla(a, b);
    if (r && r.reag && [canon(a), canon(b)].sort().join('|') === 'CO2|H2O') { r.nota += ' Com luz e clorofila ocorre a fotossíntese: CO₂ + H₂O → C₆H₁₂O₆ + O₂ (use a equação completa).'; }
    return r || { erro: 'Não reconheci esse par de reagentes nas classes que sei prever (síntese, decomposição, troca simples/dupla, neutralização, combustão, condensação, hidrólise).' };
  }

  function lerEq(txt) {
    var t = String(txt).replace(/→|⇒|⟶|=>|==|=/g, '->').split('->'), lados = [];
    var erro = null;
    t.forEach(function (lado) {
      var termos = [];
      lado.split('+').forEach(function (x) {
        x = x.trim().replace(/^[0-9]+\s*(?=[A-Za-zÀ-ú(\[])/, '');
        if (!x) { return; }
        var f = resolver(x);
        if (!f) { erro = 'Não reconheci ' + x + '. Use fórmulas (H2O) ou nomes comuns (água, glicose).'; } else { termos.push(f); }
      });
      lados.push(termos);
    });
    if (erro) { return { erro: erro }; }
    return { reag: lados[0] || [], prod: lados[1] || null };
  }
  function formatar(reag, prod, coef, estf) {
    var fmt = function (f, c) { return (c && c > 1 ? c + ' ' : '') + mostrar(f) + (estf && estf(f) ? '(' + estf(f) + ')' : ''); };
    var l = reag.map(function (f, i) { return fmt(f, coef ? coef[i] : 1); }).join(' + ');
    var r = prod.map(function (f, i) { return fmt(f, coef ? coef[reag.length + i] : 1); }).join(' + ');
    return l + ' → ' + r;
  }
  function conservacao(reag, prod, coef) {
    var L = {}, R = {};
    reag.forEach(function (f, i) { somar(L, parse(f), coef[i]); });
    prod.forEach(function (f, i) { somar(R, parse(f), coef[reag.length + i]); });
    return Object.keys(L).map(function (s) { return { s: s, l: L[s], r: R[s] || 0 }; });
  }
  function estequio(esp, coef, i, g) {
    var mol = g / massa(parse(esp[i])) / coef[i];
    return esp.map(function (f, j) { return { f: f, mol: mol * coef[j], g: mol * coef[j] * massa(parse(f)) }; });
  }

  var TCOR = { 'Síntese': '#3F7CC4', 'Decomposição': '#F2553C', 'Simples troca': '#F7A823', 'Dupla troca': '#12A3A8', 'Neutralização': '#46A87F', 'Combustão': '#C8743A', 'Condensação': '#E65C8A', 'Hidrólise': '#6EC1E4', 'Fosforilação': '#9A5A4B', 'Balanceamento': '#12303A', 'Sem reação': '#7C8A8F' };
  window.QUI = { TCOR: TCOR, parse: parse, massa: massa, hill: hill, canon: canon, mostrar: mostrar, resolver: resolver, balancear: balancear, prever: prever,
    lerEq: lerEq, formatar: formatar, conservacao: conservacao, estequio: estequio, estado: estado, NOME_DE: NOME_DE, ions: ions, monta: monta };
})();
