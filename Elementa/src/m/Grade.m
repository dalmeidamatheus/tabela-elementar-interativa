// Grade 10 x 18 da tabela periódica: uma linha por posição (180), com ou sem elemento.
// Tabela desconectada: o clique numa posição filtra só esta tabela e as medidas leem a seleção.
// Linha 8 é um espaçador; as linhas 9 e 10 são lantanídeos e actinídeos.
let
    Linhas = List.Combine(List.Transform({1..10}, each List.Repeat({_}, 18))),
    Colunas = List.Combine(List.Repeat({{1..18}}, 10)),
    Posicoes = Table.FromColumns({Linhas, Colunas}, type table [Linha = Int64.Type, Coluna = Int64.Type]),
    Slot = Table.AddColumn(Posicoes, "Slot", each [Linha] * 100 + [Coluna], Int64.Type),
    Juncao = Table.NestedJoin(Slot, {"Linha", "Coluna"}, Elementos, {"Linha", "Coluna"}, "E", JoinKind.LeftOuter),
    Expandida = Table.ExpandTableColumn(
        Juncao, "E",
        {"Z", "Simbolo", "Nome", "CatSlug", "Estado", "EN", "DensidadeGcm3", "FusaoC", "Ano", "NEn", "NDens", "NFus", "NAno"}
    ),
    Marcador = Table.AddColumn(Expandida, "Marcador", each
        if [Linha] = 6 and [Coluna] = 3 then "57–71"
        else if [Linha] = 7 and [Coluna] = 3 then "89–103"
        else null, type text),
    Ordenada = Table.Sort(Marcador, {{"Slot", Order.Ascending}})
in
    Ordenada
