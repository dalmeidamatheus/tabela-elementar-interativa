/* Página Reações: balanceamento, previsão de produtos por classe de reação e estequiometria (motor: quimica.js). */
(function () {
  var E = window.EL_, Q = window.QUI;
  if (!E || !Q) { return; }
  var h = E.h, st = (window.EL_EST.rc = window.EL_EST.rc || { txt: 'Fe + O2', modo: 'auto', sel: 0, g: 10 });
  var MODOS = [['auto', 'Automático'], ['comb', 'Combustão'], ['cond', 'Condensação (−H₂O)'], ['hid', 'Hidrólise (+H₂O)']];
  var EX1 = [['Ferro + oxigênio', 'Fe + O2'], ['Sódio + cloro', 'Na + Cl2'], ['Zinco + HCl', 'Zn + HCl'], ['Ferro + CuSO₄', 'Fe + CuSO4'], ['Cobre + HCl', 'Cu + HCl'],
    ['AgNO₃ + NaCl', 'AgNO3 + NaCl'], ['HCl + NaOH', 'HCl + NaOH'], ['Na₂CO₃ + HCl', 'Na2CO3 + HCl'], ['Metano + O₂', 'CH4 + O2'], ['Decompor CaCO₃', 'CaCO3'],
    ['Balancear KMnO₄ + HCl', 'KMnO4 + HCl -> KCl + MnCl2 + Cl2 + H2O'], ['Ca(OH)₂ + H₃PO₄', 'Ca(OH)2 + H3PO4 -> Ca3(PO4)2 + H2O']];
  var EX2 = [['Fotossíntese', 'CO2 + H2O -> C6H12O6 + O2'], ['Respiração celular', 'glicose + O2'], ['Fermentação alcoólica', 'glicose'], ['Hidrólise do ATP', 'ATP + água'],
    ['Glicose + ATP (hexocinase)', 'glicose + ATP'], ['Ligação peptídica', 'glicina + glicina', 'cond'], ['Sacarose + água', 'sacarose + água'], ['Ureia + água', 'ureia + água'],
    ['Esterificação', 'ácido acético + etanol'], ['Triglicerídeo', 'glicerol + ácido palmítico']];
  var R = null;

  function calc() {
    var L = Q.lerEq(st.txt);
    if (L.erro) { return { erro: L.erro }; }
    if (!L.reag.length) { return { erro: 'Digite uma equação (Fe + O2 -> Fe2O3) ou só os reagentes (Fe + O2).' }; }
    var reag = L.reag, prod, tipo = 'Balanceamento', nome = 'Equação informada', nota = 'Coeficientes calculados resolvendo o sistema de conservação de átomos de cada elemento.', est = null, cor = null;
    if (L.prod && L.prod.length) { prod = L.prod; }
    else {
      var p = Q.prever(reag, st.modo);
      if (p.erro) { return { erro: p.erro }; }
      if (p.semReacao) { return { sem: true, reag: reag, nota: p.nota }; }
      prod = p.prod; tipo = p.tipo; nome = p.nome; nota = p.nota; est = p.est;
    }
    var b = Q.balancear(reag, prod);
    if (b.erro) { return { erro: b.erro }; }
    return { reag: reag, prod: prod, coef: b.coef, tipo: tipo, nome: nome, nota: nota, est: est, indet: b.indet };
  }
  function nm(f) { return Q.NOME_DE[Q.canon(f)] || ''; }
  function montar() {
    var cor = '#F2553C', corpo;
    if (!R) { R = calc(); }
    if (R.erro) { corpo = '<div class=~rc-erro~>' + E.esc(R.erro) + '</div>'; }
    else if (R.sem) {
      corpo = '<div class=~rc-eq~>' + R.reag.map(Q.mostrar).join(' + ') + ' → sem reação</div><span class=~rc-tp~ style=~background:#7C8A8F~>Sem reação</span><div class=~rc-nota~ style=~--c:#7C8A8F~>' + E.esc(R.nota) + '</div>';
    } else {
      cor = Q.TCOR[R.tipo] || cor;
      var esp = R.reag.concat(R.prod), n = esp.length, i;
      var sel = Math.min(st.sel, n - 1);
      var cons = Q.conservacao(R.reag, R.prod, R.coef).map(function (x) { return '<span>' + x.s + ': ' + x.l + ' = ' + x.r + (x.l === x.r ? ' ✓' : ' ✗') + '</span>'; }).join('');
      var linhas = '', btn = '';
      for (i = 0; i < n; i++) {
        var M = Q.massa(Q.parse(esp[i]));
        linhas += '<tr><td>' + Q.mostrar(esp[i]) + (nm(esp[i]) ? ' <span style=~color:#7C8A8F~>· ' + nm(esp[i]) + '</span>' : '') + '</td><td class=~n~>' + R.coef[i] + '</td><td class=~n~>' + E.fmt(M, 2) + '</td><td class=~n~>' + E.fmt(M * R.coef[i], 2) + '</td></tr>';
        btn += '<span class=~bt' + (i === sel ? ' on' : '') + '~ data-a=~esp~ data-v=~' + i + '~>' + Q.mostrar(esp[i]) + '</span>';
      }
      var est = Q.estequio(esp, R.coef, sel, st.g), res = '';
      est.forEach(function (x, j) { res += '<tr><td>' + Q.mostrar(x.f) + (j < R.reag.length ? ' <span style=~color:#7C8A8F~>reagente</span>' : ' <span style=~color:#7C8A8F~>produto</span>') + '</td><td class=~n~>' + E.fmt(x.mol, 3) + ' mol</td><td class=~n~><b>' + E.fmt(x.g, 2) + ' g</b></td></tr>'; });
      corpo = '<div class=~rc-eq~>' + Q.formatar(R.reag, R.prod, R.coef, R.est) + '</div>'
        + '<span class=~rc-tp~ style=~background:' + cor + '~>' + R.tipo + '</span><span class=~rc-nome~>' + E.esc(R.nome) + '</span>'
        + '<div class=~rc-nota~ style=~--c:' + cor + '~>' + E.esc(R.nota) + (R.indet ? ' Atenção: existem várias combinações possíveis de coeficientes; mostrei a menor.' : '') + '</div>'
        + '<div class=~rc-cons~>' + cons + '</div>'
        + '<table class=~rc-tb~><tr><th>Espécie</th><th>Coef.</th><th>M (g/mol)</th><th>massa (g)</th></tr>' + linhas + '</table>'
        + '<div class=~rc-grupo~ style=~margin-top:4px~>Estequiometria: quantos gramas?</div><div>' + btn + '</div>'
        + '<input class=~rc-g~ id=~gr~ value=~' + st.g + '~ data-i=~g~ data-enter=~g~/> <span style=~font-size:12px;color:#40565C~>g de ' + Q.mostrar(esp[sel]) + '</span>'
        + '<table class=~rc-tb~ style=~margin-top:6px~>' + res + '</table>';
    }
    var chips = function (lista) { return lista.map(function (x) { return '<span class=~bt~ data-a=~ex~ data-v=~' + E.esc(x[1]) + '|' + (x[2] || 'auto') + '~>' + x[0] + '</span>'; }).join(''); };
    var modos = MODOS.map(function (m) { return '<span class=~bt' + (st.modo === m[0] ? ' on' : '') + '~ data-a=~modo~ data-v=~' + m[0] + '~>' + m[1] + '</span>'; }).join('');
    return E.cabecalho('Reações', 'balanceamento, previsão de produtos e estequiometria')
      + h('<div class=~cx~ style=~left:28px;top:84px;width:560px;height:214px~><h4>Equação ou reagentes</h4><input class=~rc-in~ id=~eq~ value=~' + E.esc(st.txt) + '~ data-enter=~go~/>'
        + '<div class=~rc-dica~>Aceita fórmulas (Fe2O3, Ca(OH)2, CuSO4·5H2O) e nomes (água, glicose, ATP). Com seta (->) balanceia; só com reagentes, prevê os produtos.</div>'
        + '<span class=~bt ac~ data-a=~go~>Resolver</span>' + modos + '</div>')
      + h('<div class=~cx~ style=~left:28px;top:308px;width:560px;height:392px~><h4>Exemplos</h4><div class=~rc-grupo~ style=~margin-top:0~>Inorgânica</div>' + chips(EX1) + '<div class=~rc-grupo~>Bioquímica</div>' + chips(EX2) + '</div>')
      + h('<div class=~cx~ style=~left:604px;top:84px;width:648px;height:616px;overflow:auto~><h4>Resultado</h4>' + corpo + '</div>');
  }
  function capt() { var el = document.getElementById('eq'); if (el) { st.txt = el.value; } }
  var acoes = {
    z: function (v, d) { d(); },
    go: function (v, d) { capt(); st.sel = 0; R = null; d(); },
    modo: function (v, d) { capt(); st.modo = v; st.sel = 0; R = null; d(); },
    ex: function (v, d) { var p = v.split('|'); st.txt = p[0]; st.modo = p[1] || 'auto'; st.sel = 0; R = null; d(); },
    esp: function (v, d) { capt(); st.sel = Number(v); d(); },
    g: function (v, d) { var x = parseFloat(String(v).replace(',', '.')); if (x > 0) { st.g = x; } d(); }
  };
  R = null;
  E.iniciar(montar, acoes);
})();
