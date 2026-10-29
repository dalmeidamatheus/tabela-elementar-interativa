"""Pré-visualização estática da página Tabela (só CSS/HTML, sem DAX): gera /tmp/tabela.html com o mesmo HTML das medidas."""
import csv, re, pathlib
S = pathlib.Path(__file__).resolve().parent.parent
rows = list(csv.DictReader(open(S/'dados/elementos.psv', encoding='utf-8'), delimiter=';'))
cats = (S/'m/Categorias.m').read_text(encoding='utf-8')
css = (S/'css/base.css').read_text(encoding='utf-8')
for slug, cor in re.findall(r'\{"(\w+)",\s*"[^"]+",\s*"(#[0-9A-Fa-f]{6})"', cats):
    r, g, b = (int(cor[i:i+2], 16) for i in (1, 3, 5))
    css += f'.k-{slug}{{--k:{cor};--kf:rgba({r},{g},{b},.2)}}\n'
pos = {(int(r['Linha']), int(r['Coluna'])): r for r in rows}
cel = ''
for l in range(1, 11):
    for c in range(1, 19):
        r = pos.get((l, c))
        if l == 8: cel += "<div class='ce gp'></div>"
        elif r: cel += f"<div class='ce k-{r['CatSlug']}'><i>{r['Z']}</i><b>{r['Simbolo']}</b><u>{r['Nome']}</u></div>"
        elif (l, c) in ((6, 3), (7, 3)): cel += f"<div class='ce mk'><b>{'57–71' if l == 6 else '89–103'}</b></div>"
        else: cel += "<div class='ce vz'></div>"
gr = css + (S/'css/grade.css').read_text(encoding='utf-8').replace('.htmlViewerEntry', '.xx')
fi = (S/'css/ficha.css').read_text(encoding='utf-8') + (S/'css/dados.css').read_text(encoding='utf-8') + (S/'css/fato.css').read_text(encoding='utf-8') + (S/'css/atomo.css').read_text(encoding='utf-8') + (S/'css/marca.css').read_text(encoding='utf-8') + (S/'css/fundo.css').read_text(encoding='utf-8')
c = pos[(2, 14)]
ficha = f"<div class='fi k-ame'><div class='fi-top'><span>6</span><span>12,011 u</span></div><div class='fi-s'>C</div><div class='fi-n'>Carbono</div><div class='fi-r'><span class='chip'>Ametais</span></div><div class='fi-p' style='margin-top:6px'>Grupo 14 · Período 2 · bloco p</div><div class='fi-ph'>C</div></div>"
dados = "<div class='pn k-ame'><div class='pn-h'><span class='pn-t'>Propriedades</span></div>" + ''.join(f"<div class='dr'><span>{a}</span><b>{b}</b></div>" for a, b in [('Estado a 20 °C', 'Sólido'), ('Fusão', '3.549,9 °C'), ('Ebulição', '3.824,9 °C'), ('Densidade', '2,267 g/cm³'), ('Eletronegatividade', '2,55'), ('Oxidação', '+4,-4,+2'), ('Configuração', '[He] 2s² 2p²'), ('Descoberta', 'Antiguidade')]) + '</div>'
fato = "<div class='ft k-ame'><div class='ft-t'>VOCÊ SABIA?</div><div class='ft-x'>Base da química orgânica: diamante e grafite são feitos só de carbono.</div></div>"
leg = ''.join(f"<div class='lg k-{s}'><i></i><span>{n}</span><b>{k}</b></div>" for s, n, k in [('alc','Metais alcalinos',6),('alt','Alcalino-terrosos',6),('trans','Metais de transição',38),('pos','Metais de pós-transição',8),('semi','Semimetais',6),('ame','Ametais',7),('hal','Halogênios',5),('nob','Gases nobres',6),('lan','Lantanídeos',15),('act','Actinídeos',15),('desc','Propriedades desconhecidas',10)])
html = f"""<html><head><meta charset='utf-8'><style>{css}{fi}
body{{margin:0;width:1280px;height:720px;position:relative}} .a{{position:absolute}}
.ce{{position:relative;width:50px;height:52px;margin:1px;box-sizing:border-box;border-radius:3px;background:var(--kf);border-top:3px solid var(--k);overflow:hidden}}
.ce i{{position:absolute;left:3px;top:1px;font:600 8px Consolas,monospace;font-style:normal;color:#5A6070}}
.ce b{{display:block;margin-top:10px;text-align:center;font:700 19px Georgia,serif;line-height:1}}
.ce u{{display:block;margin-top:3px;text-align:center;text-decoration:none;font:600 7px 'Segoe UI';color:#4B5263;white-space:nowrap;overflow:hidden}}
.ce.gp{{height:12px;visibility:hidden}} .ce.vz{{visibility:hidden}} .ce.mk{{background:transparent;border:1px dashed #BDB59F}} .ce.mk b{{margin-top:14px;font:600 9px Consolas;color:#8A8F9C}}
.lg{{box-sizing:border-box;width:258px;height:22px;margin:0 1px;padding:0 8px;display:flex;align-items:center;gap:8px;font-size:11px;font-weight:600}}
.lg i{{width:11px;height:11px;border-radius:3px;background:var(--k)}} .lg b{{margin-left:auto;font:600 10px Consolas;color:#8A8F9C}}
</style></head><body><div class='a' style='inset:0'><div class='fd'></div></div>
<div class='a' style='left:26px;top:10px;width:270px;height:52px'><div class='mc'><div class='mc-c'><i>1</i><b>El</b></div><div><div class='mc-n'>Elementa</div><div class='mc-s'>atlas dos elementos · 118</div></div></div></div>
<div class='a' style='left:24px;top:70px;width:940px;height:504px;display:flex;flex-wrap:wrap;align-content:flex-start'>{cel}</div>
<div class='a' style='left:128px;top:72px;width:520px;display:flex;flex-wrap:wrap'>{leg}</div>
<div class='a' style='left:984px;top:70px;width:280px;height:196px'>{ficha}</div>
<div class='a' style='left:984px;top:448px;width:280px;height:196px'>{dados}</div>
<div class='a' style='left:984px;top:650px;width:280px;height:58px'>{fato}</div></body></html>"""
pathlib.Path('/tmp/tabela.html').write_text(html, encoding='utf-8')
