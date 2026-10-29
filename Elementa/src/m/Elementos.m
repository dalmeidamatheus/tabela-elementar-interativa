// 118 elementos com dados embutidos (sem rede). Fonte editável: src/dados/gerar_dados.py
// Colunas derivadas aqui: categoria (nome), ponto de fusão em °C, descoberta (texto) e
// escalas 0-1 usadas para colorir a tabela (eletronegatividade, densidade em log, fusão, ano).
let
    Cabecalho = {{{CABECALHO}}},
    Linhas = {
{{LINHAS}}
    },
    Matriz = List.Transform(Linhas, each Text.Split(_, ";")),
    Bruto = Table.FromRows(Matriz, Cabecalho),
    SemVazios = Table.ReplaceValue(Bruto, "", null, Replacer.ReplaceValue, Cabecalho),
    Tipado = Table.TransformColumnTypes(
        SemVazios,
        {
            {"Z", Int64.Type}, {"Massa", type number}, {"Grupo", Int64.Type}, {"Periodo", Int64.Type},
            {"EN", type number}, {"FusaoK", type number}, {"EbulicaoK", type number},
            {"DensidadeGcm3", type number}, {"Ano", Int64.Type}, {"Valencia", Int64.Type},
            {"Linha", Int64.Type}, {"Coluna", Int64.Type}
        },
        "en-US"
    ),
    ComCategoria = Table.ExpandTableColumn(
        Table.NestedJoin(Tipado, {"CatSlug"}, Categorias, {"Slug"}, "C", JoinKind.LeftOuter),
        "C", {"Categoria"}
    ),
    FusaoC = Table.AddColumn(ComCategoria, "FusaoC", each if [FusaoK] = null then null else [FusaoK] - 273.15, type number),
    Descoberta = Table.AddColumn(FusaoC, "Descoberta", each
        if [Ano] = null then "Antiguidade" else Text.From([Ano]) & " · " & [Descobridor], type text),
    MinEN = List.Min(Descoberta[EN]), MaxEN = List.Max(Descoberta[EN]),
    MinD = List.Min(Descoberta[DensidadeGcm3]), MaxD = List.Max(Descoberta[DensidadeGcm3]),
    MinF = List.Min(Descoberta[FusaoK]), MaxF = List.Max(Descoberta[FusaoK]),
    NEn = Table.AddColumn(Descoberta, "NEn", each
        if [EN] = null then null else ([EN] - MinEN) / (MaxEN - MinEN), type number),
    NDens = Table.AddColumn(NEn, "NDens", each
        if [DensidadeGcm3] = null then null
        else (Number.Log10([DensidadeGcm3]) - Number.Log10(MinD)) / (Number.Log10(MaxD) - Number.Log10(MinD)), type number),
    NFus = Table.AddColumn(NDens, "NFus", each
        if [FusaoK] = null then null else ([FusaoK] - MinF) / (MaxF - MinF), type number),
    NAno = Table.AddColumn(NFus, "NAno", each
        if [Ano] = null then null else (List.Max({1700, [Ano]}) - 1700) / (2010 - 1700), type number),
    Ordenada = Table.Sort(NAno, {{"Z", Order.Ascending}})
in
    Ordenada
