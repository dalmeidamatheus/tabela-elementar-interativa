"""Gera o modelo semântico (TMDL) do Elementa a partir de src/.

Uso:  python src/build_modelo.py
Feche o Power BI Desktop antes de rodar; reabra o .pbip depois.
"""
import json
import re
import shutil
import uuid
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
SRC = RAIZ / "src"
MODELO = RAIZ / "Elementa.SemanticModel"
T = "\t"

COLUNAS = {
    "Categorias": [("Slug", "string", {}), ("Categoria", "string", {}), ("Cor", "string", {}),
                   ("Ordem", "int64", {})],
    "Colorir": [("Modo", "string", {"sortByColumn": "Ordem"}), ("Ordem", "int64", {})],
    "Elementos": [
        ("Z", "int64", {}), ("Simbolo", "string", {}), ("Nome", "string", {"sortByColumn": "Z"}),
        ("Massa", "double", {}), ("Grupo", "int64", {}), ("Periodo", "int64", {}), ("Bloco", "string", {}),
        ("CatSlug", "string", {}), ("EN", "double", {}), ("FusaoK", "double", {}), ("EbulicaoK", "double", {}),
        ("DensidadeGcm3", "double", {}), ("Estado", "string", {}), ("Ano", "int64", {}),
        ("Descobridor", "string", {}), ("Oxidacoes", "string", {}), ("Camadas", "string", {}),
        ("ConfigCompleta", "string", {}), ("ConfigNobre", "string", {}), ("Valencia", "int64", {}),
        ("Fato", "string", {}), ("Linha", "int64", {}), ("Coluna", "int64", {}), ("Categoria", "string", {}),
        ("FusaoC", "double", {}), ("Descoberta", "string", {}), ("NEn", "double", {}), ("NDens", "double", {}),
        ("NFus", "double", {}), ("NAno", "double", {})],
    "Grade": [
        ("Linha", "int64", {}), ("Coluna", "int64", {}), ("Slot", "int64", {}), ("Z", "int64", {}),
        ("Simbolo", "string", {}), ("Nome", "string", {}), ("CatSlug", "string", {}), ("Estado", "string", {}),
        ("EN", "double", {}), ("DensidadeGcm3", "double", {}), ("FusaoC", "double", {}), ("Ano", "int64", {}),
        ("NEn", "double", {}), ("NDens", "double", {}), ("NFus", "double", {}), ("NAno", "double", {}),
        ("Marcador", "string", {})],
}
ORDEM_TABELAS = ["Categorias", "Colorir", "Elementos", "Grade"]

# nome do arquivo css -> sufixo da medida <CSS>
CSS_VISUAIS = {"fundo": "Fundo", "marca": "Marca", "grade": "Grade", "legenda": "Legenda", "escala": "Escala",
               "ficha": "Ficha", "atomo": "Átomo", "dados": "Dados", "fato": "Fato", "tendencia": "Tendência"}
PAGINAS_JS = {"Átomo": ["atomo"], "Ligações": ["ligacoes"], "Reações": ["quimica", "reacoes"], "Tendências": ["tendencias"],
              "Descobertas": ["descobertas"], "Quiz": ["quimica", "quiz"]}


def q(nome):
    return f"'{nome}'" if re.search(r"[^A-Za-z0-9_]", nome) else nome


def bloco(codigo, nivel):
    pre = T * nivel
    return "\n".join((pre + l) if l.strip() else "" for l in codigo.strip("\n").splitlines())


def literal_dax(texto, tamanho=4000):
    texto = texto.replace('"', '""')
    partes = [texto[i:i + tamanho] for i in range(0, len(texto), tamanho)] or [""]
    return "\n& ".join(f'"{p}"' for p in partes)


def ler_m(nome):
    m = (SRC / "m" / f"{nome}.m").read_text(encoding="utf-8")
    if nome == "Elementos":
        linhas = (SRC / "dados" / "elementos.psv").read_text(encoding="utf-8").strip().splitlines()
        cab = ",".join(f'"{c}"' for c in linhas[0].split(";"))
        dados = ",\n".join(f'        "{l}"' for l in linhas[1:])
        m = m.replace("{{CABECALHO}}", cab).replace("{{LINHAS}}", dados)
    return m


def tabela_tmdl(nome):
    out = [f"table {q(nome)}", ""]
    for col, tipo, extra in COLUNAS[nome]:
        out += [f"{T}column {q(col)}", f"{T*2}dataType: {tipo}"]
        if tipo == "int64":
            out.append(f"{T*2}formatString: 0")
        for k, v in extra.items():
            out.append(f"{T*2}{k}: {v}")
        out += [f"{T*2}summarizeBy: none", f"{T*2}sourceColumn: {col}", ""]
    out += [f"{T}partition {q(nome)} = m", f"{T*2}mode: import", f"{T*2}source =", bloco(ler_m(nome), 4), ""]
    return "\n".join(out) + "\n"


def css_categorias():
    m = (SRC / "m" / "Categorias.m").read_text(encoding="utf-8")
    regras = []
    for slug, cor in re.findall(r'\{"(\w+)",\s*"[^"]+",\s*"(#[0-9A-Fa-f]{6})"', m):
        r, g, b = (int(cor[i:i + 2], 16) for i in (1, 3, 5))
        regras.append(f".k-{slug} {{ --k: {cor}; --kf: rgba({r},{g},{b},.20); }}")
    for cod, cor in {"s": "#7A8B99", "l": "#2D9CDB", "g": "#E8833A", "u": "#C9C3B3"}.items():
        r, g, b = (int(cor[i:i + 2], 16) for i in (1, 3, 5))
        regras.append(f".st-{cod} {{ --k: {cor}; --kf: rgba({r},{g},{b},.22); }}")
    return "\n".join(regras)


def ler_js(nome):
    texto = (SRC / "js" / nome).read_text(encoding="utf-8")
    if nome.endswith(".js"):
        if '"' in texto or "`" in texto:
            raise SystemExit(f"{nome}: sem aspas duplas nem crases (o código vira texto DAX/TMDL).")
    return texto


JS_DADOS = '''VAR _el = CONCATENATEX(ALL(Elementos),
    VAR _en  = IF(ISBLANK(Elementos[EN]), "null", FORMAT(Elementos[EN], "0.00", "en-US"))
    VAR _fu  = IF(ISBLANK(Elementos[FusaoK]), "null", FORMAT(Elementos[FusaoK], "0.00", "en-US"))
    VAR _eb  = IF(ISBLANK(Elementos[EbulicaoK]), "null", FORMAT(Elementos[EbulicaoK], "0.00", "en-US"))
    VAR _de  = IF(ISBLANK(Elementos[DensidadeGcm3]), "null", FORMAT(Elementos[DensidadeGcm3], "0.0000000", "en-US"))
    VAR _an  = IF(ISBLANK(Elementos[Ano]), "null", FORMAT(Elementos[Ano], "0"))
    RETURN
        "[" & Elementos[Z] & ",'" & Elementos[Simbolo] & "','" & Elementos[Nome] & "'," & FORMAT(Elementos[Massa], "0.0000", "en-US")
      & "," & COALESCE(Elementos[Grupo], 0) & "," & Elementos[Periodo] & ",'" & Elementos[CatSlug] & "','" & Elementos[Bloco] & "',"
      & _en & "," & _fu & "," & _eb & "," & _de & ",'" & Elementos[Estado] & "'," & _an
      & ",'" & SUBSTITUTE(Elementos[Descobridor], "'", "\\'") & "','" & Elementos[Camadas] & "','" & Elementos[Oxidacoes]
      & "','" & Elementos[ConfigNobre] & "','" & SUBSTITUTE(Elementos[Fato], "'", "\\'") & "'," & Elementos[Linha] & ","
      & Elementos[Coluna] & "," & Elementos[Valencia] & "]",
    ",", Elementos[Z], ASC)
VAR _ct = CONCATENATEX(ALL(Categorias), Categorias[Slug] & ":['" & Categorias[Categoria] & "','" & Categorias[Cor] & "']", ",", Categorias[Ordem], ASC)
VAR _versao = COUNTROWS(ALL(Elementos)) * 1000 + COUNTROWS(ALL(Categorias))
RETURN
    "window.EL_DADOS={v:" & _versao & ",el:[" & _el & "],ct:{" & _ct & "}};"'''


def medidas():
    texto = (SRC / "dax" / "medidas.dax").read_text(encoding="utf-8")
    partes = re.split(r"^-- @medida (.+?) \| (.+?)\s*$", texto, flags=re.M)
    out = [(partes[i].strip(), partes[i + 1].strip(), partes[i + 2].strip()) for i in range(1, len(partes), 3)]
    base, cats = ler_js("../css/base.css"), css_categorias()
    # tendências (a partir do modelo)
    tpl = (SRC / "dax" / "tendencia.tpl").read_text(encoding="utf-8")
    out.append(("<HTML> Tendência Grupo", "<HTML>", tpl
        .replace("{{CONJUNTO}}", "FILTER(ALL(Elementos), IF(NOT ISBLANK(_g), Elementos[Grupo] = _g, Elementos[CatSlug] = _cat))")
        .replace("{{TITULO}}", 'IF(NOT ISBLANK(_g), "MESMO GRUPO · " & _g, "MESMA SÉRIE")')))
    out.append(("<HTML> Tendência Período", "<HTML>", tpl
        .replace("{{CONJUNTO}}", 'FILTER(ALL(Elementos), Elementos[Periodo] = _per && Elementos[Bloco] <> "f")')
        .replace("{{TITULO}}", '"MESMO PERÍODO · " & _per')))
    # CSS das medidas HTML
    for arq, nome in CSS_VISUAIS.items():
        css = base + "\n" + cats + "\n" + (SRC / "css" / f"{arq}.css").read_text(encoding="utf-8")
        out.append((f"<CSS> {nome}", "<HTML>\\CSS", literal_dax(css)))
    # páginas em JavaScript
    comum_js, comum_css = ler_js("comum.js"), (SRC / "js" / "comum.css").read_text(encoding="utf-8")
    out.append(("JS Dados", "Base", JS_DADOS))
    for nome, arqs in PAGINAS_JS.items():
        arq = arqs[-1]
        js = comum_js + "\n" + "\n".join(ler_js(a + ".js") for a in arqs)
        html = ("VAR _dados = [JS Dados]\nVAR _motor =\n" + literal_dax(js) + "\nRETURN\n"
                "    \"<div id='app-raiz'></div><script>\" & _dados & \"</script><script>\" & _motor & \"</script>\"")
        out.append((f"<HTML> JS {nome}", "<HTML>", html))
        css = base + "\n" + cats + "\n" + comum_css + "\n" + (SRC / "js" / f"{arq}.css").read_text(encoding="utf-8")
        out.append((f"<CSS> JS {nome}", "<HTML>\\CSS", literal_dax(css)))
    return out


def medidas_tmdl():
    out = ["table _Medidas", ""]
    for nome, pasta, corpo in medidas():
        out += [f"{T}measure {q(nome)} = ```", "", bloco(corpo, 3), f"{T*3}```"]
        if not nome.startswith("<"):
            out.append(f"{T*2}formatString: 0")
        out += [f"{T*2}displayFolder: {pasta}", ""]
    out += [f"{T}column Coluna", f"{T*2}dataType: string", f"{T*2}isHidden", f"{T*2}summarizeBy: none",
            f"{T*2}sourceColumn: Coluna", "",
            f"{T}partition _Medidas = m", f"{T*2}mode: import", f"{T*2}source =",
            bloco("let\n\tFonte = #table(type table [Coluna = text], {})\nin\n\tFonte", 4), ""]
    return "\n".join(out) + "\n"


def gravar(caminho, texto):
    caminho.parent.mkdir(parents=True, exist_ok=True)
    caminho.write_text(texto, encoding="utf-8", newline="\n")
    print("gravado:", caminho.relative_to(RAIZ))


def main():
    defn = MODELO / "definition"
    if defn.exists():
        shutil.rmtree(defn)
    gravar(MODELO / "definition.pbism", json.dumps({
        "$schema": "https://developer.microsoft.com/json-schemas/fabric/item/semanticModel/definitionProperties/1.0.0/schema.json",
        "version": "4.2", "settings": {}}, indent=2))
    gravar(MODELO / ".platform", json.dumps({
        "$schema": "https://developer.microsoft.com/json-schemas/fabric/gitIntegration/platformProperties/2.0.0/schema.json",
        "metadata": {"type": "SemanticModel", "displayName": "Elementa"},
        "config": {"version": "2.0", "logicalId": "7b1c6e2a-4d3f-4a58-9c0e-3e1f5a8d2b10"}}, indent=2))
    gravar(MODELO / ".pbi" / "editorSettings.json", json.dumps({
        "$schema": "https://developer.microsoft.com/json-schemas/fabric/item/semanticModel/editorSettings/1.0.0/schema.json",
        "autodetectRelationships": False, "parallelQueryLoading": True, "typeDetectionEnabled": True,
        "relationshipImportEnabled": False, "shouldNotifyUserOfNameConflictResolution": True}, indent=2))
    gravar(defn / "database.tmdl", "database\n\tcompatibilityLevel: 1606\n\n")
    gravar(defn / "cultures" / "pt-BR.tmdl", "cultureInfo pt-BR\n\n")
    for t in ORDEM_TABELAS:
        gravar(defn / "tables" / f"{t}.tmdl", tabela_tmdl(t))
    gravar(defn / "tables" / "_Medidas.tmdl", medidas_tmdl())
    ordem = json.dumps(ORDEM_TABELAS + ["_Medidas"], separators=(",", ":"))
    refs = "\n".join(f"ref table {q(t)}" for t in ORDEM_TABELAS + ["_Medidas"])
    gravar(defn / "model.tmdl",
           "model Model\n\tculture: pt-BR\n\tdefaultPowerBIDataSourceVersion: powerBI_V3\n\tsourceQueryCulture: pt-BR\n"
           "\tvalueFilterBehavior: independent\n\tdataAccessOptions\n\t\tlegacyRedirects\n\t\treturnErrorValuesAsNull\n\n"
           f"annotation __PBI_TimeIntelligenceEnabled = 0\n\nannotation PBI_ProTooling = [\"DevMode\"]\n\n"
           f"annotation PBI_QueryOrder = {ordem}\n\n{refs}\n\nref cultureInfo pt-BR\n")
    gravar(defn / "relationships.tmdl", "")
    (defn / "relationships.tmdl").unlink()  # sem relacionamentos: todas as tabelas são desconectadas


if __name__ == "__main__":
    main()
