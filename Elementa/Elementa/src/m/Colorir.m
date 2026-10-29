let
    Fonte = #table(
        type table [Modo = text, Ordem = Int64.Type],
        {{"Categoria", 1}, {"Estado", 2}, {"Eletroneg.", 3}, {"Densidade", 4}, {"Fusão", 5}, {"Descoberta", 6}}
    )
in
    Fonte
