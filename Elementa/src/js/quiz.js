/* Página Quiz: equações químicas (balancear, produtos, tipo de reação e estequiometria). Motor: quimica.js. */
(function () {
  var E = window.EL_, Q = window.QUI;
  if (!E || !Q) { return; }
  var h = E.h, S = window.EL_EST, st = (S.qz = S.qz || { modo: 'misto', rod: 0, pts: 0, seq: 0, q: null, resp: null, fim: false });
  var melhor = (S.qzMelhor = S.qzMelhor || 0), TOTAL = 10;
  var TIPOS = ['Síntese', 'Decomposição', 'Simples troca', 'Dupla troca', 'Neutralização', 'Combustão', 'Condensação', 'Hidrólise'];
  var POOL = [
    ['Fe + O2', 'Fe2O3', 'Síntese'], ['Na + Cl2', 'NaCl', 'Síntese'], ['H2 + O2', 'H2O', 'Síntese'], ['N2 + H2', 'NH3', 'Síntese'], ['Mg + O2', 'MgO', 'Síntese'],
    ['Al + O2', 'Al2O3', 'Síntese'], ['CaO + H2O', 'Ca(OH)2', 'Síntese'], ['SO3 + H2O', 'H2SO4', 'Síntese'], ['CO2 + H2O', 'C6H12O6 + O2', 'Síntese'],
    ['H2O', 'H2 + O2', 'Decomposição'], ['CaCO3', 'CaO + CO2', 'Decomposição'], ['H2O2', 'H2O + O2', 'Decomposição'], ['KClO3', 'KCl + O2', 'Decomposição'],
    ['NaCl', 'Na + Cl2', 'Decomposição'], ['C6H12O6', 'C2H6O + CO2', 'Decomposição'], ['NaHCO3', 'Na2CO3 + H2O + CO2', 'Decomposição'], ['Al2O3', 'Al + O2', 'Decomposição'],
    ['Zn + HCl', 'ZnCl2 + H2', 'Simples troca'], ['Fe + CuSO4', 'FeSO4 + Cu', 'Simples troca'], ['Mg + H2SO4', 'MgSO4 + H2', 'Simples troca'], ['Cl2 + NaBr', 'NaCl + Br2', 'Simples troca'],
    ['Al + CuCl2', 'AlCl3 + Cu', 'Simples troca'], ['Na + H2O', 'NaOH + H2', 'Simples troca'], ['Zn + AgNO3', 'Zn(NO3)2 + Ag', 'Simples troca'],
    ['AgNO3 + NaCl', 'AgCl + NaNO3', 'Dupla troca'], ['BaCl2 + Na2SO4', 'BaSO4 + NaCl', 'Dupla troca'], ['Pb(NO3)2 + KI', 'PbI2 + KNO3', 'Dupla troca'],
    ['CaCl2 + Na2CO3', 'CaCO3 + NaCl', 'Dupla troca'], ['FeCl3 + NaOH', 'Fe(OH)3 + NaCl', 'Dupla troca'], ['Na2CO3 + HCl', 'NaCl + H2O + CO2', 'Dupla troca'],
    ['HCl + NaOH', 'NaCl + H2O', 'Neutralização'], ['H2SO4 + NaOH', 'Na2SO4 + H2O', 'Neutralização'], ['HNO3 + Ca(OH)2', 'Ca(NO3)2 + H2O', 'Neutralização'],
    ['H3PO4 + KOH', 'K3PO4 + H2O', 'Neutralização'], ['HCl + Mg(OH)2', 'MgCl2 + H2O', 'Neutralização'], ['H2SO4 + Al(OH)3', 'Al2(SO4)3 + H2O', 'Neutralização'],
    ['CH4 + O2', 'CO2 + H2O', 'Combustão'], ['C2H6O + O2', 'CO2 + H2O', 'Combustão'], ['C3H8 + O2', 'CO2 + H2O', 'Combustão'], ['C6H12O6 + O2', 'CO2 + H2O', 'Combustão'],
    ['C8H18 + O2', 'CO2 + H2O', 'Combustão'], ['C4H10 + O2', 'CO2 + H2O', 'Combustão'], ['C2H2 + O2', 'CO2 + H2O', 'Combustão'],
    ['C6H12O6 + C6H12O6', 'C12H22O11 + H2O', 'Condensação'], ['C2H5NO2 + C2H5NO2', 'C4H8N2O3 + H2O', 'Condensação'], ['C2H4O2 + C2H6O', 'C4H8O2 + H2O', 'Condensação'],
    ['C10H16N5O13P3 + H2O', 'C10H15N5O10P2 + H3PO4', 'Hidrólise'], ['CH4N2O + H2O', 'CO2 + NH3', 'Hidrólise'], ['C12H22O11 + H2O', 'C6H12O6 + C6H12O6', 'Hidrólise']
  ];
  function sorteio(n) { return Math.floor(Math.random() * n); }
  function embaralhar(a) { var i, j, t; for (i = a.length - 1; i > 0; i--) { j = sorteio(i + 1); t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function balanceada(reag, prod, coef) { return Q.conservacao(reag, prod, coef).every(function (x) { return x.l === x.r; }); }
  function nova() {
    var modos = ['bal', 'prod', 'tipo', 'est'], k = st.modo === 'misto' ? modos[sorteio(4)] : st.modo;
    var it = POOL[sorteio(POOL.length)], reag = it[0].split(' + '), prod = it[1].split(' + '), b = Q.balancear(reag, prod), coef = b.coef;
    var q = { k: k, it: it, reag: reag, prod: prod, coef: coef, opc: [], certa: 0 };
    var eqCerta = Q.formatar(reag, prod, coef, null), opts = [], i, tent;
    if (k === 'bal') {
      q.titulo = 'Balanceie a equação'; q.eq = Q.formatar(reag, prod, null, null); opts.push(eqCerta);
      for (tent = 0; tent < 60 && opts.length < 4; tent++) {
        var c = coef.slice(), a = sorteio(c.length), m = sorteio(3);
        if (m === 0) { c[a] += 1; } else if (m === 1 && c[a] > 1) { c[a] -= 1; } else { var o = sorteio(c.length); var tmp = c[a]; c[a] = c[o]; c[o] = tmp; }
        if (balanceada(reag, prod, c)) { continue; }
        var f = Q.formatar(reag, prod, c, null);
        if (opts.indexOf(f) < 0) { opts.push(f); }
      }
    } else if (k === 'prod') {
      q.titulo = 'Quais são os produtos?'; q.eq = reag.map(Q.mostrar).join(' + ') + ' → ?';
      var certa = prod.map(Q.mostrar).join(' + '); opts.push(certa);
      embaralhar(POOL.slice()).forEach(function (p) { var s = p[1].split(' + ').map(Q.mostrar).join(' + '); if (opts.length < 4 && opts.indexOf(s) < 0) { opts.push(s); } });
    } else if (k === 'tipo') {
      q.titulo = 'Que tipo de reação é esta?'; q.eq = eqCerta; opts.push(it[2]);
      embaralhar(TIPOS.slice()).forEach(function (t) { if (opts.length < 4 && opts.indexOf(t) < 0) { opts.push(t); } });
    } else {
      var esp = reag.concat(prod), i0 = sorteio(reag.length), j0 = reag.length + sorteio(prod.length), g = [10, 20, 50, 100][sorteio(4)];
      var M = function (f) { return Q.massa(Q.parse(f)); }, ans = g / M(esp[i0]) * coef[j0] / coef[i0] * M(esp[j0]);
      q.titulo = 'Estequiometria'; q.eq = eqCerta;
      q.pergunta = 'Partindo de ' + g + ' g de ' + Q.mostrar(esp[i0]) + ', quantos gramas de ' + Q.mostrar(esp[j0]) + ' se formam?';
      var fm = function (v) { return E.fmt(v, 1) + ' g'; };
      opts.push(fm(ans));
      [g / M(esp[i0]) * M(esp[j0]), ans * coef[i0] / coef[j0] * coef[i0] / coef[j0], ans * 2, ans / 2, ans * 1.5, ans * 0.75].forEach(function (v) {
        var s = fm(v); if (opts.length < 4 && Math.abs(v - ans) / ans > 0.03 && opts.indexOf(s) < 0) { opts.push(s); }
      });
    }
    var certaTxt = opts[0];
    q.opc = embaralhar(opts.slice(0, 4));
    q.certa = q.opc.indexOf(certaTxt);
    q.expl = '<div class=~eq~>' + Q.formatar(reag, prod, coef, null) + '</div>' + it[2] + (k === 'est' ? ': a razão molar vem dos coeficientes (' + coef[reag.length] + ' : ' + coef[0] + ' etc.) e a massa vem de n × M.' : '.');
    return q;
  }
  function montar() {
    var top = h('<div class=~qz-top~><div class=~qz-st~><small>Rodada</small><b>' + Math.min(st.rod + (st.resp === null ? 1 : 0), TOTAL) + '/' + TOTAL + '</b></div><div class=~qz-st~><small>Pontos</small><b>' + st.pts + '</b></div><div class=~qz-st~><small>Sequência</small><b>' + st.seq + '</b></div><div class=~qz-st~><small>Melhor</small><b>' + melhor + '</b></div></div>');
    var modos = [['misto', 'Misto'], ['bal', 'Balancear'], ['prod', 'Produtos'], ['tipo', 'Tipo de reação'], ['est', 'Estequiometria']].map(function (m) {
      return '<span class=~bt' + (st.modo === m[0] ? ' on' : '') + '~ data-a=~modo~ data-v=~' + m[0] + '~>' + m[1] + '</span>';
    }).join('');
    var dir = h('<div class=~cx~ style=~left:864px;top:84px;width:388px;height:616px~><h4>Modo</h4>' + modos + '<h4 style=~margin-top:16px~>Como pontua</h4><div class=~qz-ex~>10 pontos por acerto, mais bônus de sequência (até +5). São 10 rodadas por partida, sorteadas entre síntese, decomposição, trocas, neutralização, combustão e bioquímica.</div>'
      + (st.resp !== null && st.q ? '<h4 style=~margin-top:16px~>' + (st.resp === st.q.certa ? 'Acertou' : 'Resposta') + '</h4><div class=~qz-ex~>' + st.q.expl + '</div>' : '') + '</div>');
    if (st.fim) {
      return E.cabecalho('Quiz', 'equações químicas') + h('<div class=~cx~ style=~left:28px;top:84px;width:820px;height:616px~>') + top
        + h('<div style=~text-align:center;margin-top:50px~><div class=~qz-p~>Fim da partida</div><div class=~qz-big~>' + st.pts + '</div><div class=~qz-ex~ style=~margin:10px 0 24px~>pontos · recorde da sessão ' + melhor + '</div><span class=~bt ac~ data-a=~novo~>Jogar de novo</span></div></div>') + dir;
    }
    if (!st.q) { st.q = nova(); st.resp = null; }
    var q = st.q, letras = ['A', 'B', 'C', 'D'];
    var ops = q.opc.map(function (o, i) {
      var c = 'qz-op'; if (st.resp !== null) { c += ' fix' + (i === q.certa ? ' ok' : i === st.resp ? ' no' : ''); }
      return h('<div class=~' + c + '~ data-a=~res~ data-v=~' + i + '~><i>' + letras[i] + '</i><span>' + o + '</span></div>');
    }).join('');
    var corpo = h('<div class=~cx~ style=~left:28px;top:84px;width:820px;height:616px~>') + top + h('<div class=~qz-p~>' + q.titulo + '</div><div class=~qz-eq~>' + q.eq + '</div>')
      + (q.pergunta ? h('<div class=~qz-ex~ style=~font-size:14px;margin-bottom:4px~><b>' + q.pergunta + '</b></div>') : '') + ops
      + (st.resp !== null ? h('<div style=~margin-top:16px~><span class=~bt ac~ data-a=~prox~>' + (st.rod >= TOTAL ? 'Ver resultado' : 'Próxima') + '</span></div>') : '') + '</div>';
    return E.cabecalho('Quiz', 'equações químicas') + corpo + dir;
  }
  var acoes = {
    z: function (v, d) { d(); },
    modo: function (v, d) { st.modo = v; st.rod = 0; st.pts = 0; st.seq = 0; st.q = null; st.resp = null; st.fim = false; d(); },
    res: function (v, d) {
      if (st.resp !== null) { return; }
      st.resp = Number(v); st.rod += 1;
      if (st.resp === st.q.certa) { st.seq += 1; st.pts += 10 + Math.min(st.seq - 1, 5); } else { st.seq = 0; }
      if (st.pts > S.qzMelhor) { S.qzMelhor = st.pts; melhor = st.pts; }
      d();
    },
    prox: function (v, d) { if (st.rod >= TOTAL) { st.fim = true; } else { st.q = null; } d(); },
    novo: function (v, d) { st.rod = 0; st.pts = 0; st.seq = 0; st.q = null; st.resp = null; st.fim = false; d(); }
  };
  E.iniciar(montar, acoes);
})();
