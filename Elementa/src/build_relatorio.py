"""Monta o relatório (PBIR) do Elementa: 4 páginas e seus visuais.

Uso:  python src/build_relatorio.py      (feche o Power BI Desktop antes)
"""
import json
import shutil
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
REL = RAIZ / "Elementa.Report"
HTML_VISUAL = "htmlContent443BE3AD55E043BF878BED274D3A6855"
SCH = "https://developer.microsoft.com/json-schemas/fabric/item/report/definition/"
LARGURA, ALTURA = 1280, 720
PAPEL, PAINEL, TINTA, ACENTO = "#F8FAFC", "#FFFFFF", "#12303A", "#F2553C"

PAGINAS = [  # (id, nome, tipo, sufixo de medida)
    ("e1e1000000000000aa01", "Tabela", "tabela", None),
    ("e1e1000000000000aa02", "Átomo", "js", "Átomo"),
    ("e1e1000000000000aa03", "Ligações", "js", "Ligações"),
    ("e1e1000000000000aa04", "Reações", "js", "Reações"),
    ("e1e1000000000000aa05", "Tendências", "js", "Tendências"),
    ("e1e1000000000000aa06", "Descobertas", "js", "Descobertas"),
    ("e1e1000000000000aa07", "Quiz", "js", "Quiz"),
]


def lit(v): return {"expr": {"Literal": {"Value": v}}}
def cor(h): return {"solid": {"color": lit(f"'{h}'")}}
def medida(n, t="_Medidas"): return {"Measure": {"Expression": {"SourceRef": {"Entity": t}}, "Property": n}}
def coluna(t, n): return {"Column": {"Expression": {"SourceRef": {"Entity": t}}, "Property": n}}


def container(fundo=None, raio=0, pad=0):
    o = {"title": [{"properties": {"show": lit("false")}}], "dropShadow": [{"properties": {"show": lit("false")}}],
         "visualHeader": [{"properties": {"show": lit("false")}}],
         "padding": [{"properties": {k: lit(f"{pad}D") for k in ("top", "bottom", "left", "right")}}]}
    if fundo:
        o["background"] = [{"properties": {"show": lit("true"), "color": cor(fundo), "transparency": lit("0D")}}]
        o["border"] = [{"properties": {"show": lit("true"), "color": cor("#E6E0D2"), "radius": lit(f"{raio}D")}}]
    else:
        o["background"] = [{"properties": {"show": lit("false")}}]
        o["border"] = [{"properties": {"show": lit("false")}}]
    return o


def pos(x, y, w, h, z): return {"x": x, "y": y, "z": z, "width": w, "height": h, "tabOrder": z}


def html_visual(p, html, css, sampling=None, clicavel=False):
    proj = {"content": {"projections": [{"field": medida(html), "queryRef": f"_Medidas.{html}", "nativeQueryRef": html}]}}
    query = {"queryState": proj}
    if sampling:
        proj["sampling"] = {"projections": [{"field": coluna(*sampling), "queryRef": ".".join(sampling),
                                             "nativeQueryRef": sampling[1], "active": True}]}
        query["sortDefinition"] = {"sort": [{"field": coluna(*sampling), "direction": "Ascending"}], "isDefaultSort": True}
    objects = {"stylesheet": [{"properties": {"stylesheet": {"expr": medida(css)}}}],
               "contentFormatting": [{"properties": {"showRawHtml": lit("false")}}],
               "crossFilter": [{"properties": {"enabled": lit("true" if clicavel else "false"), "useTransparency": lit("false")}}],
               "compatibility": [{"properties": {"legacyRendering": lit("true")}}]}
    return p, {"visualType": HTML_VISUAL, "query": query, "objects": objects,
               "visualContainerObjects": container(), "drillFilterOtherVisuals": True}


def estados(padrao, sel, hover=None):
    out = [{"properties": padrao, "selector": {"id": "default"}}]
    if hover:
        out.append({"properties": hover, "selector": {"id": "interaction:hover"}})
    out.append({"properties": sel, "selector": {"id": "selection:selected"}})
    return out


def botoes(p, tabela, col, colunas):
    """Segmentador de botões em linha (Colorir por)."""
    objects = {
        "general": [{"properties": {"selfFilterEnabled": lit("false")}}],
        "selection": [{"properties": {"singleSelect": lit("true")}}],
        "layout": [{"properties": {"style": lit("'Cards'"), "orientation": lit("2L"), "autoGrid": lit("false"),
                                   "columnCount": lit(f"{colunas}L"), "rowCount": lit("1L"), "cellPadding": lit("4L")}}],
        "overFlow": [{"properties": {"overFlowStyle": lit("1L"), "overFlowDirection": lit("0L")}}],
        "value": estados({"show": lit("true"), "fontColor": cor("#40565C"), "fontSize": lit("9D"), "bold": lit("true"),
                          "horizontalAlignment": lit("'center'")}, {"fontColor": cor("#FFFFFF")}, {"fontColor": cor(TINTA)}),
        "label": [{"properties": {"show": lit("false")}}],
        "fillCustom": estados({"show": lit("true"), "fillColor": cor(PAINEL), "transparency": lit("0D")},
                              {"fillColor": cor(TINTA)}, {"fillColor": cor("#EFE9DC")}),
        "outline": estados({"show": lit("true"), "lineColor": cor("#E6E0D2"), "weight": lit("1D")},
                           {"lineColor": cor(TINTA), "weight": lit("1D")}),
        "shapeCustomRectangle": [{"properties": {"tileShape": lit("'rectangleRounded'"), "rectangleRoundedCurve": lit("6L")}}],
        "selectionIcon": [{"properties": {"show": lit("false")}}],
    }
    return p, {"visualType": "advancedSlicerVisual",
               "query": {"queryState": {"Values": {"projections": [{"field": coluna(tabela, col), "queryRef": f"{tabela}.{col}",
                                                                    "nativeQueryRef": col, "active": True}]}}},
               "objects": objects, "visualContainerObjects": container(None, 0, 0), "drillFilterOtherVisuals": True}


def navegador(p):
    def est(a, b, c):
        return [{"properties": a, "selector": {"id": "default"}}, {"properties": b, "selector": {"id": "hover"}},
                {"properties": c, "selector": {"id": "selected"}}]
    objects = {
        "layout": [{"properties": {"cellPadding": lit("4L")}}],
        "shape": [{"properties": {"tileShape": lit("'rectangleRounded'"), "rectangleRoundedCurve": lit("6L")}}],
        "fill": est({"show": lit("true"), "fillColor": cor(PAINEL), "transparency": lit("0D")},
                    {"fillColor": cor("#EFE9DC")}, {"fillColor": cor(ACENTO)}),
        "text": est({"show": lit("true"), "fontColor": cor("#40565C"), "fontSize": lit("9D"), "bold": lit("true")},
                    {"fontColor": cor(TINTA)}, {"fontColor": cor("#FFFFFF")}),
        "outline": est({"show": lit("true"), "lineColor": cor("#E6E0D2"), "weight": lit("1D")},
                       {"lineColor": cor(TINTA)}, {"lineColor": cor(ACENTO)}),
    }
    return p, {"visualType": "pageNavigator", "objects": objects, "visualContainerObjects": container(),
               "drillFilterOtherVisuals": True}


VISUAIS_TABELA = {
    "01": html_visual(pos(0, 0, LARGURA, ALTURA, 0), "<HTML> Fundo", "<CSS> Fundo"),
    "02": html_visual(pos(26, 10, 270, 52, 1000), "<HTML> Marca", "<CSS> Marca"),
    "03": botoes(pos(300, 20, 440, 32, 2000), "Colorir", "Modo", 6),
    "04": navegador(pos(750, 20, 514, 32, 20000)),
    "05": html_visual(pos(24, 70, 940, 504, 3000), "<HTML> Grade", "<CSS> Grade", sampling=("Grade", "Slot"), clicavel=True),
    "06": html_visual(pos(128, 72, 520, 134, 4000), "<HTML> Legenda", "<CSS> Legenda", sampling=("Categorias", "Ordem"), clicavel=True),
    "07": html_visual(pos(128, 208, 520, 22, 5000), "<HTML> Escala", "<CSS> Escala"),
    "08": html_visual(pos(984, 70, 280, 186, 6000), "<HTML> Ficha", "<CSS> Ficha"),
    "09": html_visual(pos(984, 262, 280, 166, 7000), "<HTML> Átomo", "<CSS> Átomo"),
    "10": html_visual(pos(984, 434, 280, 210, 8000), "<HTML> Dados", "<CSS> Dados"),
    "11": html_visual(pos(984, 650, 280, 58, 9000), "<HTML> Fato", "<CSS> Fato"),
    "12": html_visual(pos(24, 584, 468, 124, 10000), "<HTML> Tendência Grupo", "<CSS> Tendência"),
    "13": html_visual(pos(500, 584, 464, 124, 11000), "<HTML> Tendência Período", "<CSS> Tendência"),
}


def escrever(caminho: Path, dados):
    caminho.parent.mkdir(parents=True, exist_ok=True)
    caminho.write_text(json.dumps(dados, ensure_ascii=False, indent=2), encoding="utf-8", newline="\n")


def pagina_json(pid, nome):
    return {"$schema": SCH + "page/2.1.0/schema.json", "name": pid, "displayName": nome, "displayOption": "FitToPage",
            "height": ALTURA, "width": LARGURA,
            "objects": {"background": [{"properties": {"color": cor(PAPEL), "transparency": lit("0D")}}],
                        "outspace": [{"properties": {"color": cor(PAPEL), "transparency": lit("0D")}}]}}


def main():
    if REL.exists():
        shutil.rmtree(REL)
    escrever(RAIZ / "Elementa.pbip", {
        "$schema": "https://developer.microsoft.com/json-schemas/fabric/pbip/pbipProperties/1.0.0/schema.json",
        "version": "1.0", "artifacts": [{"report": {"path": "Elementa.Report"}}], "settings": {"enableAutoRecovery": True}})
    escrever(REL / ".platform", {
        "$schema": "https://developer.microsoft.com/json-schemas/fabric/gitIntegration/platformProperties/2.0.0/schema.json",
        "metadata": {"type": "Report", "displayName": "Elementa"},
        "config": {"version": "2.0", "logicalId": "c2a9d4f1-6b7e-4e0a-8f35-1d9b0a7c4e22"}})
    escrever(REL / "definition.pbir", {
        "$schema": "https://developer.microsoft.com/json-schemas/fabric/item/report/definitionProperties/2.0.0/schema.json",
        "version": "4.0", "datasetReference": {"byPath": {"path": "../Elementa.SemanticModel"}}})
    tema = REL / "StaticResources" / "SharedResources" / "BaseThemes"
    tema.mkdir(parents=True)
    shutil.copy(RAIZ / "src" / "tema" / "Fluent2-CY26SU10.json", tema / "Fluent2-CY26SU10.json")
    d = REL / "definition"
    escrever(d / "version.json", {"$schema": SCH + "versionMetadata/1.0.0/schema.json", "version": "2.0.0"})
    escrever(d / "report.json", {
        "$schema": SCH + "report/3.3.0/schema.json",
        "themeCollection": {"baseTheme": {"name": "Fluent2-CY26SU10", "reportVersionAtImport": {
            "visual": "2.14.0", "report": "3.4.0", "page": "2.3.1"}, "type": "SharedResources"}},
        "objects": {"section": [{"properties": {"verticalAlignment": lit("'Top'")}}],
                    "outspacePane": [{"properties": {"expanded": lit("false"), "visible": lit("false")}}]},
        "publicCustomVisuals": [HTML_VISUAL],
        "resourcePackages": [{"name": "SharedResources", "type": "SharedResources", "items": [
            {"name": "Fluent2-CY26SU10", "path": "BaseThemes/Fluent2-CY26SU10.json", "type": "BaseTheme"}]}],
        "settings": {"useStylableVisualContainerHeader": True, "exportDataMode": "AllowSummarized",
                     "defaultDrillFilterOtherVisuals": True, "allowChangeFilterTypes": True,
                     "useEnhancedTooltips": True, "useDefaultAggregateDisplayName": True}})
    escrever(d / "pages" / "pages.json", {"$schema": SCH + "pagesMetadata/1.1.0/schema.json",
                                          "pageOrder": [p[0] for p in PAGINAS], "activePageName": PAGINAS[0][0]})
    for pid, nome, tipo, suf in PAGINAS:
        pdir = d / "pages" / pid
        escrever(pdir / "page.json", pagina_json(pid, nome))
        if tipo == "tabela":
            itens = {PAGINAS[0][0][-4:] + k: v for k, v in VISUAIS_TABELA.items()}
        else:
            itens = {pid[-4:] + "0101": html_visual(pos(0, 0, LARGURA, ALTURA, 0), f"<HTML> JS {suf}", f"<CSS> JS {suf}"),
                     pid[-4:] + "0199": navegador(pos(750, 20, 514, 32, 20000))}
        for suf_id, (p, v) in itens.items():
            nome_v = "e1e1" + suf_id.rjust(8, "0")
            escrever(pdir / "visuals" / nome_v / "visual.json",
                     {"$schema": SCH + "visualContainer/2.4.0/schema.json", "name": nome_v, "position": p, "visual": v})
        print("página", nome, len(itens), "visuais")


if __name__ == "__main__":
    main()
