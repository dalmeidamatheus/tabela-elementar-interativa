const fs = require('fs'), path = require('path');
const puppeteer = require('puppeteer');
const SRC = path.join(__dirname, '..');
const DOCS = path.join(SRC, '..', 'docs');
const psv = fs.readFileSync(path.join(SRC, 'dados/elementos.psv'), 'utf8').trim().split('\n');
const cab = psv[0].split(';');
const linhas = psv.slice(1).map(l => { const o = {}; l.split(';').forEach((v, i) => o[cab[i]] = v); return o; });
const num = (v, d) => v === '' ? 'null' : Number(v).toFixed(d);
const q = s => s.replace(/'/g, "\\'");
const el = linhas.map(r => `[${r.Z},'${r.Simbolo}','${r.Nome}',${Number(r.Massa).toFixed(4)},${r.Grupo || 0},${r.Periodo},'${r.CatSlug}','${r.Bloco}',${num(r.EN, 2)},${num(r.FusaoK, 2)},${num(r.EbulicaoK, 2)},${num(r.DensidadeGcm3, 7)},'${r.Estado}',${r.Ano === '' ? 'null' : r.Ano},'${q(r.Descobridor)}','${r.Camadas}','${r.Oxidacoes}','${r.ConfigNobre}','${q(r.Fato)}',${r.Linha},${r.Coluna},${r.Valencia}]`).join(',');
const cats = fs.readFileSync(path.join(SRC, 'm/Categorias.m'), 'utf8');
const ct = [...cats.matchAll(/\{"(\w+)",\s*"([^"]+)",\s*"(#[0-9A-Fa-f]{6})"/g)].map(m => `${m[1]}:['${m[2]}','${m[3]}']`).join(',');
const dados = `window.EL_DADOS={v:1,el:[${el}],ct:{${ct}}};`;
let css = fs.readFileSync(path.join(SRC, 'css/base.css'), 'utf8');
for (const [, slug, cor] of cats.matchAll(/\{"(\w+)",\s*"[^"]+",\s*"(#[0-9A-Fa-f]{6})"/g)) {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(cor.substr(i, 2), 16));
  css += `.k-${slug}{--k:${cor};--kf:rgba(${r},${g},${b},.2)}\n`;
}
css += fs.readFileSync(path.join(SRC, 'js/comum.css'), 'utf8');
const comum = fs.readFileSync(path.join(SRC, 'js/comum.js'), 'utf8');
(async () => {
  const b = await puppeteer.launch();
  const erros = [];
  const EXTRA = { reacoes: ['quimica'], quiz: ['quimica'] };
  for (const pag of ['atomo', 'ligacoes', 'reacoes', 'tendencias', 'descobertas', 'quiz']) {
    const p = await b.newPage();
    await p.setViewport({ width: 1280, height: 720 });
    p.on('pageerror', e => erros.push(pag + ': ' + e.message));
    p.on('console', m => m.type() === 'error' && erros.push(pag + ' console: ' + m.text()));
    const js = comum + '\n' + (EXTRA[pag] || []).map(f => fs.readFileSync(path.join(SRC, `js/${f}.js`), 'utf8')).join('\n') + '\n' + fs.readFileSync(path.join(SRC, `js/${pag}.js`), 'utf8');
    const pcss = css + fs.readFileSync(path.join(SRC, `js/${pag}.css`), 'utf8');
    await p.setContent(`<html><head><style>${pcss}</style></head><body id="htmlContent"><div id='app-raiz'></div><script>${dados}</script><script>${js}</script></body></html>`);
    await new Promise(r => setTimeout(r, 500));
    await p.screenshot({ path: path.join(DOCS, 'previa-' + pag + '.png') });
    if (pag === 'atomo') { await p.click('[data-a=comum]'); await new Promise(r => setTimeout(r, 300)); await p.screenshot({ path: path.join(DOCS, 'previa-' + pag + '.png') }); }
    if (pag === 'ligacoes') { await p.click('[data-a=pre][data-v="1,8"]'); await new Promise(r => setTimeout(r, 300)); await p.screenshot({ path: path.join(DOCS, 'previa-' + pag + '.png') });
      await p.click('[data-a=pre][data-v="26,8"]'); await new Promise(r => setTimeout(r, 300)); await p.screenshot({ path: path.join(DOCS, 'previa-' + pag + '.png') }); }
    if (pag === 'reacoes') { await p.evaluate(() => document.querySelector('[data-a=ex][data-v^="glicose + O2"]').click()); await new Promise(r => setTimeout(r, 300)); await p.screenshot({ path: path.join(DOCS, 'previa-' + pag + '.png') });
      await p.evaluate(() => document.querySelector('[data-a=ex][data-v^="AgNO3"]').click()); await new Promise(r => setTimeout(r, 300)); await p.screenshot({ path: path.join(DOCS, 'previa-' + pag + '.png') }); }
    if (pag === 'tendencias') { await p.evaluate(() => document.querySelector('[data-a=pre][data-v="1"]').click()); await new Promise(r => setTimeout(r, 300)); await p.screenshot({ path: path.join(DOCS, 'previa-' + pag + '.png') }); }
    if (pag === 'quiz') { await p.evaluate(() => document.querySelector('[data-a=res]').click()); await new Promise(r => setTimeout(r, 300)); await p.screenshot({ path: path.join(DOCS, 'previa-' + pag + '.png') }); }
    if (pag === 'descobertas') { await p.evaluate(() => document.querySelector('[data-a=play]').click()); await new Promise(r => setTimeout(r, 4500)); await p.screenshot({ path: path.join(DOCS, 'previa-' + pag + '.png') }); }
  }
  console.log(erros.length ? erros.join('\n') : 'sem erros de JS');
  await b.close();
})();
