let
    Fonte = #table(
        type table [Slug = text, Categoria = text, Cor = text, Ordem = Int64.Type],
        {
            {"alc",   "Metais alcalinos",          "#F2553C", 1},
            {"alt",   "Alcalino-terrosos",         "#F7A823", 2},
            {"trans", "Metais de transição",       "#3F7CC4", 3},
            {"pos",   "Metais de pós-transição",   "#46A87F", 4},
            {"semi",  "Semimetais",                "#A9BC2F", 5},
            {"ame",   "Ametais",                   "#12A3A8", 6},
            {"hal",   "Halogênios",                "#E65C8A", 7},
            {"nob",   "Gases nobres",              "#6EC1E4", 8},
            {"lan",   "Lantanídeos",               "#C8743A", 9},
            {"act",   "Actinídeos",                "#9A5A4B", 10},
            {"desc",  "Propriedades desconhecidas","#A3A8AD", 11}
        }
    )
in
    Fonte
