from pathlib import Path

BRUTO = """
1|H|Hidrogênio|1.008|ame|2.20|13.99|20.27|0.00008988|G|1766|Henry Cavendish|+1,-1|O elemento mais abundante do universo: as estrelas funcionam fundindo hidrogênio.
2|He|Hélio|4.0026|nob||0.95|4.22|0.0001785|G|1868|Janssen e Lockyer|0|Foi detectado no Sol antes de ser achado na Terra, não congela à pressão normal.
3|Li|Lítio|6.94|alc|0.98|453.65|1603|0.534|S|1817|Johan Arfwedson|+1|O metal mais leve, está nas baterias de celulares e carros elétricos.
4|Be|Berílio|9.0122|alt|1.57|1560|2742|1.85|S|1798|Louis Vauquelin|+2|Leve e muito rígido, usado em satélites e em janelas de raios X.
5|B|Boro|10.81|semi|2.04|2349|4200|2.34|S|1808|Gay-Lussac e Thénard|+3|Está no bórax e no vidro borossilicato, que aguenta choques térmicos.
6|C|Carbono|12.011|ame|2.55|3823|4098|2.267|S||Antiguidade|+4,-4,+2|Base da química orgânica: diamante e grafite são feitos só de carbono.
7|N|Nitrogênio|14.007|ame|3.04|63.15|77.36|0.0012506|G|1772|Daniel Rutherford|-3,+5,+3,+4|Cerca de 78% do ar, essencial em proteínas, DNA e fertilizantes.
8|O|Oxigênio|15.999|ame|3.44|54.36|90.20|0.001429|G|1774|Priestley e Scheele|-2|Cerca de 21% da atmosfera e quase metade da massa da crosta terrestre.
9|F|Flúor|18.998|hal|3.98|53.53|85.03|0.001696|G|1886|Henri Moissan|-1|O elemento mais eletronegativo, protege o esmalte dos dentes.
10|Ne|Neônio|20.180|nob||24.56|27.07|0.0008999|G|1898|Ramsay e Travers|0|Brilha em laranja-avermelhado nos letreiros luminosos.
11|Na|Sódio|22.990|alc|0.93|370.87|1156|0.971|S|1807|Humphry Davy|+1|Reage com violência na água, metade do sal de cozinha.
12|Mg|Magnésio|24.305|alt|1.31|923|1363|1.738|S|1755|Joseph Black|+2|Queima com luz branca intensa e está no centro da clorofila.
13|Al|Alumínio|26.982|pos|1.61|933.47|2792|2.698|S|1825|Hans Ørsted|+3|Leve e abundante, reciclar poupa cerca de 95% da energia de produzi-lo.
14|Si|Silício|28.085|semi|1.90|1687|3538|2.329|S|1824|Jöns Berzelius|+4,-4|Base dos chips e das placas solares, o segundo mais abundante na crosta.
15|P|Fósforo|30.974|ame|2.19|317.3|550|1.823|S|1669|Hennig Brand|+5,+3,-3|Essencial ao DNA e ao ATP, o fósforo branco brilha no escuro.
16|S|Enxofre|32.06|ame|2.58|388.36|717.87|2.067|S||Antiguidade|-2,+4,+6|Conhecido desde a Antiguidade, dá o cheiro característico do gás H₂S.
17|Cl|Cloro|35.45|hal|3.16|171.6|239.11|0.003214|G|1774|Carl Scheele|-1,+1,+3,+5,+7|Desinfeta a água das piscinas e das cidades, é um gás amarelo-esverdeado e tóxico.
18|Ar|Argônio|39.948|nob||83.80|87.30|0.0017837|G|1894|Rayleigh e Ramsay|0|Terceiro gás mais abundante do ar, inerte, protege soldas e lâmpadas.
19|K|Potássio|39.098|alc|0.82|336.53|1032|0.862|S|1807|Humphry Davy|+1|Essencial aos nervos e músculos, a banana é a fonte mais famosa.
20|Ca|Cálcio|40.078|alt|1.00|1115|1757|1.55|S|1808|Humphry Davy|+2|Forma ossos, dentes, conchas e o calcário.
21|Sc|Escândio|44.956|trans|1.36|1814|3109|2.985|S|1879|Lars Nilson|+3|Ligas com alumínio deixam bicicletas e equipamentos esportivos mais leves.
22|Ti|Titânio|47.867|trans|1.54|1941|3560|4.506|S|1791|William Gregor|+4,+3|Resistente e biocompatível, usado em próteses, aviões e relógios.
23|V|Vanádio|50.942|trans|1.63|2183|3680|6.11|S|1801|Andrés del Río|+5,+4,+3,+2|Torna o aço muito resistente, o nome vem de Vanadis, deusa nórdica.
24|Cr|Cromo|51.996|trans|1.66|2180|2944|7.15|S|1797|Louis Vauquelin|+3,+6,+2|Dá brilho aos cromados e torna o aço inoxidável.
25|Mn|Manganês|54.938|trans|1.55|1519|2334|7.21|S|1774|Johan Gahn|+2,+4,+7|Indispensável na produção de aço, está nas pilhas comuns.
26|Fe|Ferro|55.845|trans|1.83|1811|3134|7.874|S||Antiguidade|+2,+3|O metal mais usado do mundo, está no sangue e no núcleo da Terra.
27|Co|Cobalto|58.933|trans|1.88|1768|3200|8.90|S|1735|Georg Brandt|+2,+3|Dá o azul de vidros e pigmentos, está em baterias e na vitamina B12.
28|Ni|Níquel|58.693|trans|1.91|1728|3186|8.908|S|1751|Axel Cronstedt|+2|Presente em moedas, aço inox e baterias.
29|Cu|Cobre|63.546|trans|1.90|1357.77|2835|8.96|S||Antiguidade|+2,+1|Ótimo condutor elétrico: fios, moedas e panelas.
30|Zn|Zinco|65.38|trans|1.65|692.68|1180|7.14|S|1746|Andreas Marggraf|+2|Galvaniza o aço contra a ferrugem e é essencial ao sistema imune.
31|Ga|Gálio|69.723|pos|1.81|302.91|2673|5.91|S|1875|Lecoq de Boisbaudran|+3|Derrete na palma da mão (cerca de 30 °C), usado em LEDs e chips rápidos.
32|Ge|Germânio|72.630|semi|2.01|1211.4|3106|5.323|S|1886|Clemens Winkler|+4,+2|Mendeleev previu sua existência com o nome de eka-silício.
33|As|Arsênio|74.922|semi|2.18|1090|887|5.727|S|1250|Alberto Magno|+3,+5,-3|Famoso como veneno, também está em semicondutores como o arseneto de gálio.
34|Se|Selênio|78.971|ame|2.55|494|958|4.81|S|1817|Jöns Berzelius|-2,+4,+6|Sensível à luz, foi usado em fotocopiadoras, essencial em pequenas doses.
35|Br|Bromo|79.904|hal|2.96|265.8|332|3.122|L|1826|Antoine Balard|-1,+1,+5|Um dos dois elementos líquidos à temperatura ambiente, vapor avermelhado.
36|Kr|Criptônio|83.798|nob|3.00|115.78|119.93|0.003733|G|1898|Ramsay e Travers|0,+2|Entre 1960 e 1983 o metro foi definido por uma linha de luz do criptônio.
37|Rb|Rubídio|85.468|alc|0.82|312.46|961|1.532|S|1861|Bunsen e Kirchhoff|+1|Metal macio que reage com a água, usado em relógios atômicos.
38|Sr|Estrôncio|87.62|alt|0.95|1050|1655|2.64|S|1790|Adair Crawford|+2|Dá a cor vermelha aos fogos de artifício.
39|Y|Ítrio|88.906|trans|1.22|1799|3609|4.472|S|1794|Johan Gadolin|+3|Está nos lasers YAG e nos fósforos vermelhos de telas antigas.
40|Zr|Zircônio|91.224|trans|1.33|2128|4682|6.52|S|1789|Martin Klaproth|+4|Resiste à corrosão e à radiação, reveste o combustível nuclear.
41|Nb|Nióbio|92.906|trans|1.60|2750|5017|8.57|S|1801|Charles Hatchett|+5,+3|Ligas de nióbio formam ímãs supercondutores, o Brasil lidera a produção.
42|Mo|Molibdênio|95.95|trans|2.16|2896|4912|10.28|S|1778|Carl Scheele|+6,+4|Endurece o aço e é essencial a enzimas que fixam nitrogênio.
43|Tc|Tecnécio|98|trans|1.90|2430|4538|11.5|S|1937|Perrier e Segrè|+7,+4|Primeiro elemento produzido artificialmente, usado em diagnósticos médicos.
44|Ru|Rutênio|101.07|trans|2.20|2607|4423|12.37|S|1844|Karl Claus|+3,+4|Raro e duro, usado em contatos elétricos e catalisadores.
45|Rh|Ródio|102.91|trans|2.28|2237|3968|12.45|S|1803|William Wollaston|+3|Um dos metais mais caros, está nos catalisadores de automóveis.
46|Pd|Paládio|106.42|trans|2.20|1828.05|3236|12.02|S|1803|William Wollaston|+2,+4|Absorve grande volume de hidrogênio, usado em catalisadores e joias.
47|Ag|Prata|107.87|trans|1.93|1234.93|2435|10.49|S||Antiguidade|+1|Melhor condutor elétrico e térmico entre os metais.
48|Cd|Cádmio|112.41|trans|1.69|594.22|1040|8.65|S|1817|Friedrich Stromeyer|+2|Usado em baterias de níquel-cádmio, é tóxico e está em desuso.
49|In|Índio|114.82|pos|1.78|429.75|2345|7.31|S|1863|Reich e Richter|+3|O óxido de índio-estanho forma as camadas transparentes de telas sensíveis ao toque.
50|Sn|Estanho|118.71|pos|1.96|505.08|2875|7.287|S||Antiguidade|+4,+2|Usado em soldas e latas de conserva, com cobre forma o bronze.
51|Sb|Antimônio|121.76|semi|2.05|903.78|1860|6.685|S||Antiguidade|+3,+5,-3|Retardante de chama, usado em cosméticos desde a Antiguidade.
52|Te|Telúrio|127.60|semi|2.10|722.66|1261|6.24|S|1782|Franz Müller von Reichenstein|-2,+4,+6|Usado em células solares de telureto de cádmio, o nome vem de Tellus, a Terra.
53|I|Iodo|126.90|hal|2.66|386.85|457.4|4.93|S|1811|Bernard Courtois|-1,+1,+5,+7|Essencial à tireoide, por isso o sal de cozinha é iodado.
54|Xe|Xenônio|131.29|nob|2.60|161.4|165.05|0.005887|G|1898|Ramsay e Travers|0,+2,+4,+6|Usado em faróis de xenônio e na propulsão iônica de sondas.
55|Cs|Césio|132.91|alc|0.79|301.59|944|1.93|S|1860|Bunsen e Kirchhoff|+1|O segundo é definido por 9.192.631.770 oscilações de um átomo de césio-133.
56|Ba|Bário|137.33|alt|0.89|1000|2170|3.51|S|1808|Humphry Davy|+2|O sulfato de bário é o contraste das radiografias do aparelho digestivo.
57|La|Lantânio|138.91|lan|1.10|1193|3737|6.146|S|1839|Carl Mosander|+3|Dá nome à série dos lantanídeos, usado em lentes e baterias de híbridos.
58|Ce|Cério|140.12|lan|1.12|1068|3716|6.689|S|1803|Berzelius, Hisinger e Klaproth|+3,+4|O lantanídeo mais abundante, está nas pedras de isqueiro.
59|Pr|Praseodímio|140.91|lan|1.13|1208|3793|6.64|S|1885|Auer von Welsbach|+3|Dá tom verde-amarelado a vidros e cerâmicas.
60|Nd|Neodímio|144.24|lan|1.14|1297|3347|7.01|S|1885|Auer von Welsbach|+3|Ímãs de neodímio estão em fones de ouvido e turbinas eólicas.
61|Pm|Promécio|145|lan|1.13|1315|3273|7.26|S|1945|Marinsky, Glendenin e Coryell|+3|Radioativo, já foi usado em tintas luminosas e baterias nucleares.
62|Sm|Samário|150.36|lan|1.17|1345|2067|7.353|S|1879|Lecoq de Boisbaudran|+3,+2|Ímãs de samário-cobalto aguentam temperaturas altas.
63|Eu|Európio|151.96|lan|1.20|1099|1802|5.244|S|1901|Eugène Demarçay|+3,+2|Seu fósforo luminoso protege as cédulas de euro contra falsificação.
64|Gd|Gadolínio|157.25|lan|1.20|1585|3546|7.901|S|1880|Jean de Marignac|+3|Funciona como agente de contraste em ressonância magnética.
65|Tb|Térbio|158.93|lan|1.10|1629|3503|8.219|S|1843|Carl Mosander|+3|Seu fósforo emite luz verde em telas e lâmpadas.
66|Dy|Disprósio|162.50|lan|1.22|1680|2840|8.551|S|1886|Lecoq de Boisbaudran|+3|Mantém ímãs eficientes no calor de motores de carros elétricos.
67|Ho|Hólmio|164.93|lan|1.23|1734|2993|8.795|S|1878|Delafontaine e Soret|+3|Tem o maior momento magnético entre os elementos.
68|Er|Érbio|167.26|lan|1.24|1802|3141|9.066|S|1843|Carl Mosander|+3|Dá cor rosa ao vidro e amplifica sinais em fibras ópticas.
69|Tm|Túlio|168.93|lan|1.25|1818|2223|9.321|S|1879|Per Cleve|+3|O lantanídeo estável menos abundante.
70|Yb|Itérbio|173.05|lan|1.10|1097|1469|6.57|S|1878|Jean de Marignac|+3,+2|Usado em relógios atômicos ópticos de altíssima precisão.
71|Lu|Lutécio|174.97|lan|1.27|1925|3675|9.84|S|1907|Georges Urbain|+3|Raro e denso, usado em detectores de tomografia PET.
72|Hf|Háfnio|178.49|trans|1.30|2506|4876|13.31|S|1923|Coster e Hevesy|+4|Compõe barras de controle de reatores e chips avançados.
73|Ta|Tântalo|180.95|trans|1.50|3290|5731|16.69|S|1802|Anders Ekeberg|+5|Muito resistente à corrosão, está nos capacitores de celulares.
74|W|Tungstênio|183.84|trans|2.36|3695|5828|19.25|S|1783|Irmãos Elhuyar|+6,+4|Tem o maior ponto de fusão entre os metais, usado em filamentos.
75|Re|Rênio|186.21|trans|1.90|3459|5869|21.02|S|1925|Noddack, Tacke e Berg|+7,+4|Um dos últimos elementos estáveis a serem descobertos, vai em turbinas de jatos.
76|Os|Ósmio|190.23|trans|2.20|3306|5285|22.59|S|1803|Smithson Tennant|+4,+8|O elemento estável mais denso.
77|Ir|Irídio|192.22|trans|2.20|2719|4701|22.56|S|1803|Smithson Tennant|+3,+4|Extremamente resistente à corrosão, foi usado no antigo metro-padrão.
78|Pt|Platina|195.08|trans|2.28|2041.4|4098|21.45|S|1735|Antonio de Ulloa|+2,+4|Resiste à oxidação, usada em catalisadores, joias e quimioterápicos.
79|Au|Ouro|196.97|trans|2.54|1337.33|3129|19.30|S||Antiguidade|+3,+1|Não enferruja e é maleável, reserva de valor desde a Antiguidade.
80|Hg|Mercúrio|200.59|trans|2.00|234.32|629.88|13.534|L||Antiguidade|+2,+1|Único metal líquido à temperatura ambiente, foi o líquido dos termômetros antigos.
81|Tl|Tálio|204.38|pos|1.62|577|1746|11.85|S|1861|William Crookes|+1,+3|Muito tóxico, já foi usado como veneno de ratos.
82|Pb|Chumbo|207.2|pos|2.33|600.61|2022|11.34|S||Antiguidade|+2,+4|Denso e maleável, usado em baterias de carro e blindagem contra radiação.
83|Bi|Bismuto|208.98|pos|2.02|544.7|1837|9.78|S|1753|Claude Geoffroy|+3,+5|Forma cristais iridescentes e está em remédios estomacais.
84|Po|Polônio|209|pos|2.00|527|1235|9.196|S|1898|Marie e Pierre Curie|+4,+2|Descoberto por Marie Curie e batizado em homenagem à Polônia.
85|At|Astato|210|hal|2.20|575|||S|1940|Corson, MacKenzie e Segrè|-1,+1|Um dos elementos naturais mais raros da crosta terrestre.
86|Rn|Radônio|222|nob|2.20|202|211.3|0.00973|G|1900|Friedrich Dorn|0,+2|Gás radioativo que pode se acumular em porões e casas.
87|Fr|Frâncio|223|alc|0.79|300|950||S|1939|Marguerite Perey|+1|Altamente instável e raro, vive poucos minutos.
88|Ra|Rádio|226|alt|0.90|973|2010|5.5|S|1898|Marie e Pierre Curie|+2|Brilhava no escuro e foi usado em tintas luminosas de relógios antigos.
89|Ac|Actínio|227|act|1.10|1323|3471|10.07|S|1899|André Debierne|+3|Brilha com luz azulada no escuro e dá nome à série dos actinídeos.
90|Th|Tório|232.04|act|1.30|2115|5061|11.72|S|1829|Jöns Berzelius|+4|Mais abundante que o urânio, estudado como combustível nuclear.
91|Pa|Protactínio|231.04|act|1.50|1841|4300|15.37|S|1913|Fajans e Göhring|+5,+4|Raro e radioativo, surge no decaimento do urânio.
92|U|Urânio|238.03|act|1.38|1405.3|4404|19.1|S|1789|Martin Klaproth|+6,+4|Combustível dos reatores nucleares, uma pastilha rende a energia de uma tonelada de carvão.
93|Np|Netúnio|237|act|1.36|917|4273|20.45|S|1940|McMillan e Abelson|+5|Primeiro elemento transurânico, produzido em 1940.
94|Pu|Plutônio|244|act|1.28|912.5|3501|19.85|S|1940|Seaborg e colaboradores|+4,+3|Usado em armas nucleares e em baterias de sondas espaciais.
95|Am|Amerício|243|act|1.30|1449|2880|13.69|S|1944|Seaborg e colaboradores|+3|Está dentro de detectores de fumaça domésticos.
96|Cm|Cúrio|247|act|1.30|1613|3383|13.51|S|1944|Seaborg, James e Ghiorso|+3|Batizado em homenagem a Marie e Pierre Curie.
97|Bk|Berquélio|247|act|1.30|1259|2900|14.78|S|1949|Thompson, Ghiorso e Seaborg|+3,+4|Leva o nome de Berkeley, a cidade onde foi produzido.
98|Cf|Califórnio|251|act|1.30|1173|1743|15.1|S|1950|Thompson e colaboradores|+3|Fonte de nêutrons usada para detectar metais e minerais.
99|Es|Einstênio|252|act|1.30|1133||8.84|S|1952|Ghiorso e colaboradores|+3|Foi encontrado nos destroços do teste nuclear Ivy Mike.
100|Fm|Férmio|257|act|1.30|1800|||?|1952|Ghiorso e colaboradores|+3|Também descoberto nos destroços do teste Ivy Mike.
101|Md|Mendelévio|258|act|1.30|1100|||?|1955|Ghiorso e colaboradores|+3|Homenageia Dmitri Mendeleev, é produzido átomo por átomo.
102|No|Nobélio|259|act|1.30|1100|||?|1958|Ghiorso e colaboradores|+2|Batizado em homenagem a Alfred Nobel.
103|Lr|Laurêncio|266|act|1.30|1900|||?|1961|Ghiorso e colaboradores|+3|Último dos actinídeos, sintetizado em quantidades mínimas.
104|Rf|Rutherfórdio|267|trans|||||?|1964|Flerov (Dubna)||Sintético e de vida curta, homenageia Ernest Rutherford.
105|Db|Dúbnio|268|trans|||||?|1968|Dubna (JINR)||Sintético, leva o nome da cidade russa de Dubna.
106|Sg|Seabórgio|269|trans|||||?|1974|Ghiorso (Berkeley)||Homenageia Glenn Seaborg, ainda vivo quando recebeu o nome.
107|Bh|Bóhrio|270|trans|||||?|1981|Armbruster e Münzenberg||Sintético, homenageia o físico Niels Bohr.
108|Hs|Hássio|277|trans|||||?|1984|Armbruster e Münzenberg||O nome vem do estado alemão de Hesse, muito denso e instável.
109|Mt|Meitnério|278|desc|||||?|1982|Armbruster e Münzenberg||Homenageia a física Lise Meitner.
110|Ds|Darmstádtio|281|desc|||||?|1994|Hofmann (GSI)||Leva o nome da cidade alemã de Darmstadt.
111|Rg|Roentgênio|282|desc|||||?|1994|Hofmann (GSI)||Homenageia Wilhelm Röntgen, descobridor dos raios X.
112|Cn|Copernício|285|desc|||||?|1996|Hofmann (GSI)||Homenageia o astrônomo Nicolau Copérnico.
113|Nh|Nihônio|286|desc|||||?|2004|Morita (RIKEN)||Primeiro elemento descoberto na Ásia, o nome vem de Nihon, o Japão.
114|Fl|Fleróvio|289|desc|||||?|1998|Oganessian (Dubna)||Homenageia o Laboratório Flerov de reações nucleares, em Dubna.
115|Mc|Moscóvio|290|desc|||||?|2003|Dubna e Livermore||O nome faz referência a Moscou.
116|Lv|Livermório|293|desc|||||?|2000|Dubna e Livermore||Homenageia o Laboratório Nacional Lawrence Livermore.
117|Ts|Tennessino|294|desc|||||?|2010|Dubna, Oak Ridge e Livermore||O nome faz referência ao estado americano do Tennessee.
118|Og|Oganessônio|294|desc|||||?|2002|Dubna e Livermore||O elemento mais pesado conhecido, homenageia Yuri Oganessian.
"""

ESTADOS = {"G": "Gasoso", "L": "Líquido", "S": "Sólido", "?": "Desconhecido"}
SUP = str.maketrans("0123456789", "⁰¹²³⁴⁵⁶⁷⁸⁹")
ORDEM = ["1s", "2s", "2p", "3s", "3p", "4s", "3d", "4p", "5s", "4d", "5p", "6s", "4f", "5d", "6p",
         "7s", "5f", "6d", "7p"]
CAP = {"s": 2, "p": 6, "d": 10, "f": 14}
EXC = {24: {"3d": 5, "4s": 1}, 29: {"3d": 10, "4s": 1}, 41: {"4d": 4, "5s": 1}, 42: {"4d": 5, "5s": 1},
       44: {"4d": 7, "5s": 1}, 45: {"4d": 8, "5s": 1}, 46: {"4d": 10, "5s": 0}, 47: {"4d": 10, "5s": 1},
       57: {"4f": 0, "5d": 1}, 58: {"4f": 1, "5d": 1}, 64: {"4f": 7, "5d": 1}, 78: {"5d": 9, "6s": 1},
       79: {"5d": 10, "6s": 1}, 89: {"5f": 0, "6d": 1}, 90: {"5f": 0, "6d": 2}, 91: {"5f": 2, "6d": 1},
       92: {"5f": 3, "6d": 1}, 93: {"5f": 4, "6d": 1}, 96: {"5f": 7, "6d": 1}, 103: {"5f": 14, "6d": 0, "7p": 1}}
NOBRES = [2, 10, 18, 36, 54, 86]
GASES = {2: "He", 10: "Ne", 18: "Ar", 36: "Kr", 54: "Xe", 86: "Rn"}


def configuracao(z: int) -> dict:
    occ, resto = {}, z
    for sub in ORDEM:
        n = min(CAP[sub[1]], resto)
        occ[sub] = n
        resto -= n
        if resto == 0:
            break
    occ.update(EXC.get(z, {}))
    assert sum(occ.values()) == z, (z, occ, sum(occ.values()))
    return {k: v for k, v in occ.items() if v > 0}


def ordenar(occ: dict):
    return sorted(occ.items(), key=lambda kv: (int(kv[0][0]), "spdf".index(kv[0][1])))


def texto_config(itens) -> str:
    return " ".join(f"{sub}{str(n).translate(SUP)}" for sub, n in itens)


def posicao(z: int):
    if z == 1:
        return 1, 1, "s", 1, 1
    if z == 2:
        return 18, 1, "s", 1, 18
    if 57 <= z <= 71:
        return 0, 6, "f", 9, 3 + (z - 57)
    if 89 <= z <= 103:
        return 0, 7, "f", 10, 3 + (z - 89)
    if z <= 10:
        per, ini = 2, 3
    elif z <= 18:
        per, ini = 3, 11
    elif z <= 36:
        per, ini = 4, 19
    elif z <= 54:
        per, ini = 5, 37
    elif z <= 86:
        per, ini = 6, 55
    else:
        per, ini = 7, 87
    if per <= 3:
        idx = z - ini
        g = idx + 1 if idx < 2 else idx + 11
    elif per in (4, 5):
        g = z - ini + 1
    elif z - ini < 2:
        g = z - ini + 1
    else:
        g = 4 + (z - 72) if per == 6 else 4 + (z - 104)
    bloco = "s" if g in (1, 2) else "p" if g >= 13 else "d"
    return g, per, bloco, per, g


def main():
    cab = ["Z", "Simbolo", "Nome", "Massa", "Grupo", "Periodo", "Bloco", "CatSlug", "EN", "FusaoK", "EbulicaoK",
           "DensidadeGcm3", "Estado", "Ano", "Descobridor", "Oxidacoes", "Camadas", "ConfigCompleta",
           "ConfigNobre", "Valencia", "Fato", "Linha", "Coluna"]
    linhas = []
    for bruta in BRUTO.strip().splitlines():
        c = bruta.split("|")
        assert len(c) == 14, (len(c), bruta)
        z = int(c[0])
        grupo, per, bloco, lin, col = posicao(z)
        occ = configuracao(z)
        itens = ordenar(occ)
        camadas = {}
        for sub, n in itens:
            camadas[int(sub[0])] = camadas.get(int(sub[0]), 0) + n
        nobre = max([n for n in NOBRES if n < z], default=None)
        if nobre:
            base = configuracao(nobre)
            resto = {k: v - base.get(k, 0) for k, v in occ.items() if v - base.get(k, 0) > 0}
            cfg_n = f"[{GASES[nobre]}] " + texto_config(ordenar(resto))
        else:
            cfg_n = texto_config(itens)
        valencia = camadas[max(camadas)]
        (_, sim, nome, massa, cat, en, fus, ebu, dens, est, ano, desc, oxi, fato) = c
        linha = [str(z), sim, nome, massa, "" if grupo in (0, None) else str(grupo), str(per), bloco, cat, en, fus,
                 ebu, dens, ESTADOS[est], ano, desc, oxi, "|".join(str(camadas[k]) for k in sorted(camadas)),
                 texto_config(itens), cfg_n, str(valencia), fato, str(lin), str(col)]
        assert all(";" not in x and '"' not in x and "#" not in x for x in linha), linha
        linhas.append(";".join(linha))
    assert len(linhas) == 118
    pos = [(l.split(";")[-2], l.split(";")[-1]) for l in linhas]
    assert len(set(pos)) == 118, "posições duplicadas na grade"
    destino = Path(__file__).with_name("elementos.psv")
    destino.write_text(";".join(cab) + "\n" + "\n".join(linhas) + "\n", encoding="utf-8")
    print("gravado", destino.name, len(linhas), "elementos")


if __name__ == "__main__":
    main()
