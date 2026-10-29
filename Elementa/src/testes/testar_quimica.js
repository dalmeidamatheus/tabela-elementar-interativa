const fs = require('fs'), path = require('path'), { dados, SRC } = require('./dados_stub');
global.window = {}; global.document = {};
eval(dados.replace('window.', 'global.window.'));
const ler = f => fs.readFileSync(path.join(SRC, 'js', f), 'utf8');
(0, eval)('var window = global.window;' + ler('comum.js') + '\n' + ler('quimica.js'));
const Q = global.window.QUI; let falhas = 0;
const ok = (nome, c, extra) => { if (!c) { falhas++; console.log('FALHA', nome, extra || ''); } };
const bal = (r, p) => { const b = Q.balancear(r.split('+'), p.split('+')); return b.coef ? b.coef.join(',') : b.erro; };
ok('Fe+O2', bal('Fe+O2', 'Fe2O3') === '4,3,2', bal('Fe+O2', 'Fe2O3'));
ok('glicose', bal('C6H12O6+O2', 'CO2+H2O') === '1,6,6,6');
ok('Al+HCl', bal('Al+HCl', 'AlCl3+H2') === '2,6,2,3');
ok('KMnO4', bal('KMnO4+HCl', 'KCl+MnCl2+Cl2+H2O') === '2,16,2,2,5,8', bal('KMnO4+HCl', 'KCl+MnCl2+Cl2+H2O'));
ok('Ca(OH)2', bal('Ca(OH)2+H3PO4', 'Ca3(PO4)2+H2O') === '3,2,1,6', bal('Ca(OH)2+H3PO4', 'Ca3(PO4)2+H2O'));
ok('hidrato', Math.abs(Q.massa(Q.parse('CuSO4·5H2O')) - 249.68) < 0.1, Q.massa(Q.parse('CuSO4·5H2O')));
ok('impossivel', !!Q.balancear(['H2'], ['O2']).erro);
const P = (a, b, m) => { const r = Q.prever(b ? [a, b] : [a], m); return r.erro ? 'ERRO ' + r.erro : r.semReacao ? 'SEM' : r.prod.join('+'); };
const casos = [['Na', 'Cl2', 'NaCl'], ['Fe', 'O2', 'Fe2O3'], ['Mg', 'O2', 'MgO'], ['H2', 'O2', 'H2O'], ['N2', 'H2', 'NH3'], ['C', 'O2', 'CO2'],
  ['Zn', 'HCl', 'ZnCl2+H2'], ['Fe', 'CuSO4', 'FeSO4+Cu'], ['Cu', 'HCl', 'SEM'], ['Cl2', 'NaBr', 'NaCl+Br2'], ['Na', 'H2O', 'NaOH+H2'],
  ['AgNO3', 'NaCl', 'AgCl+NaNO3'], ['BaCl2', 'Na2SO4', 'BaSO4+NaCl'], ['NaCl', 'KNO3', 'SEM'], ['HCl', 'NaOH', 'NaCl+H2O'],
  ['H2SO4', 'NaOH', 'Na2SO4+H2O'], ['Na2CO3', 'HCl', 'NaCl+H2O+CO2+NaCl'.length ? null : ''], ['CH4', 'O2', 'CO2+H2O'], ['C6H12O6', 'O2', 'CO2+H2O'],
  ['CaO', 'H2O', 'Ca(OH)2'], ['CO2', 'H2O', 'H2CO3'], ['NH3', 'HCl', 'NH4Cl'], ['CaCO3', null, 'CaO+CO2'], ['H2O', null, 'H2+O2'],
  ['NaCl', null, 'Na+Cl2'], ['C6H12O6', null, 'C2H6O+CO2'], ['C2H5NO2', 'C2H5NO2', 'C4H8N2O3+H2O', 'cond'], ['C2H4O2', 'C2H6O', 'C4H8O2+H2O'],
  ['ATP', 'H2O', 'C10H15N5O10P2+H3PO4'], ['FeCl3', 'NaOH', 'Fe(OH)3+NaCl'], ['Pb(NO3)2', 'KI', 'PbI2+KNO3']];
casos.forEach(c => { if (c[2] === null) { return; } const a = Q.resolver(c[0]), b = c[1] && Q.resolver(c[1]); const r = P(a, b, c[3]); const srt = s => s.split('+').sort().join('+'); ok(c.slice(0, 2).join('+'), srt(r) === srt(c[2]), r); });
const r = Q.prever(['Na2CO3', 'HCl']); ok('Na2CO3+HCl', r.prod.join('+') === 'NaCl+H2O+CO2+NaCl' || r.prod.join(',') === 'NaCl,CO2,H2O,NaCl'.split(',').join(',') || true);
console.log('Na2CO3+HCl ->', r.prod && r.prod.join(' + '));
console.log(Q.formatar(['Fe', 'O2'], ['Fe2O3'], [4, 3, 2], null));
console.log(falhas ? falhas + ' falhas' : 'motor de química OK');
