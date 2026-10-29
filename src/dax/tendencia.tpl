VAR _z    = [Z Selecionado]
VAR _e    = FILTER(ALL(Elementos), Elementos[Z] = _z)
VAR _g    = MAXX(_e, Elementos[Grupo])
VAR _per  = MAXX(_e, Elementos[Periodo])
VAR _cat  = MAXX(_e, Elementos[CatSlug])
VAR _modo = [Modo Colorir]
VAR _conj = {{CONJUNTO}}
VAR _tab  = ADDCOLUMNS(_conj,
                "@h", SWITCH(_modo, 3, Elementos[EN], 4, Elementos[DensidadeGcm3], 5, Elementos[FusaoK], 6, Elementos[Ano], Elementos[Massa]),
                "@r", SWITCH(_modo, 3, Elementos[EN], 4, Elementos[DensidadeGcm3], 5, Elementos[FusaoC], 6, Elementos[Ano], Elementos[Massa]))
VAR _max  = MAXX(_tab, [@h])
VAR _n    = COUNTROWS(_tab)
VAR _larg = MIN(34, DIVIDE(440, _n))
VAR _svg  = CONCATENATEX(_tab,
                VAR _i  = RANKX(_tab, Elementos[Z], , ASC, Dense)
                VAR _x  = 8 + (_i - 1) * _larg
                VAR _h  = IF(ISBLANK([@h]) || _max <= 0, 0, MAX(2, DIVIDE([@h], _max) * 50))
                VAR _sel = IF(Elementos[Z] = _z, " sel", "")
                VAR _rot = IF(ISBLANK([@r]), "–", FORMAT([@r], IF(_modo = 3, "0.0#", IF(_modo = 4, "0.0#", "0.#")), "pt-BR"))
                RETURN
                    IF(_h > 0, "<rect class='br k-" & Elementos[CatSlug] & _sel & "' x='" & FORMAT(_x, "0.0", "en-US") & "' y='" & FORMAT(58 - _h, "0.0", "en-US")
                        & "' width='" & FORMAT(_larg - 4, "0.0", "en-US") & "' height='" & FORMAT(_h, "0.0", "en-US") & "' rx='2'/>", "")
                    & IF(_larg >= 20, "<text class='vs' x='" & FORMAT(_x + (_larg - 4) / 2, "0.0", "en-US") & "' y='" & FORMAT(54 - _h, "0.0", "en-US") & "'>" & _rot & "</text>", "")
                    & "<text class='sm" & _sel & "' x='" & FORMAT(_x + (_larg - 4) / 2, "0.0", "en-US") & "' y='72'>" & Elementos[Simbolo] & "</text>", "")
VAR _titulo = {{TITULO}}
RETURN
    "<div class='pn td'><div class='pn-h'><span class='pn-t'>" & _titulo & "</span><span class='pn-s'>" & [Rótulo Métrica] & "</span></div>"
        & "<svg viewBox='0 0 460 80' preserveAspectRatio='xMinYMid meet'><line class='base' x1='4' x2='456' y1='58' y2='58'/>" & _svg & "</svg></div>"
