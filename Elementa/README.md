# Elementa: atlas dos elementos em Power BI

Relatório Power BI (formato **PBIP**: PBIR + TMDL) que transforma a tabela periódica numa ferramenta de estudo interativa, usando o visual **HTML Content** com medidas DAX que geram HTML/SVG e páginas em JavaScript.

Os dados dos 118 elementos estão **embutidos na consulta M** (sem API e sem internet): abrir e atualizar funciona offline.

## Páginas

| Página | O que faz | Como é feito |
|--------|-----------|--------------|
| **Tabela** | Grade 18×10 clicável, colorida por categoria, estado, eletronegatividade, densidade, fusão ou ano de descoberta. Legenda que destaca categorias, ficha, átomo em SVG, propriedades, curiosidade e barras comparando grupo e período. | DAX → HTML/CSS/SVG; tabelas desconectadas |
| **Átomo** | Camadas animadas, núcleo, íons (remover/adicionar elétrons), aviso de configuração de gás nobre. | JavaScript + SVG |
| **Ligações** | Dois elementos → tipo de ligação, fórmula, nome, massa molar, medidor de ΔEN. | JavaScript + SVG |
| **Reações** | Digite uma equação ou só os reagentes: balanceia (álgebra linear com frações), prevê produtos por classe de reação, confere a conservação por elemento e calcula estequiometria em gramas. Inclui catálogo de bioquímica (fotossíntese, respiração, fermentação, ATP, ligação peptídica, esterificação). | JavaScript (`quimica.js`) |
| **Tendências** | Dispersão entre 10 propriedades, escala log, correlação de Pearson e destaque por categoria. | JavaScript + SVG |
| **Descobertas** | Linha do tempo que preenche a tabela, com histograma por década. | JavaScript |
| **Quiz** | Equações químicas: balancear, escolher produtos, classificar o tipo de reação e estequiometria. 10 rodadas, sequência e recorde. | JavaScript |

### O que o motor de química faz (e não faz)
Lê fórmulas com parênteses e hidratos, balanceia por eliminação de Gauss com frações exatas e prevê produtos pelas classes ensinadas: síntese, decomposição, simples troca (série de reatividade), dupla troca (regras de solubilidade), neutralização, combustão, condensação e hidrólise. **Não é um simulador geral**: não prevê mecanismos, rendimento, cinética nem reações orgânicas arbitrárias, e avisa quando não reconhece o par de reagentes.

## Estrutura

| Pasta | Conteúdo |
|-------|----------|
| `Elementa.SemanticModel/`, `Elementa.Report/` | Modelo (TMDL) e relatório (PBIR), **gerados** pelos scripts |
| `src/dados/` | `gerar_dados.py` (tabela bruta dos elementos e campos derivados) e `elementos.psv` |
| `src/m/` | Consultas Power Query (`Elementos`, `Grade`, `Categorias`, `Colorir`) |
| `src/dax/` | Medidas DAX (`medidas.dax`) e modelo das barras de tendência (`tendencia.tpl`) |
| `src/css/` | Estilos dos painéis em DAX |
| `src/js/` | Páginas em JavaScript e estilos |
| `src/testes/` | Testes do motor de química (Node), das páginas JS (Chrome headless) e pré-visualização estática da Tabela |
| `docs/` | Capturas das páginas em JavaScript (renderizadas fora do Power BI) e prévia estática do CSS da Tabela |

## Como abrir

1. Power BI Desktop com os recursos de visualização de **PBIP, TMDL e PBIR** habilitados.
2. Abra `Elementa.pbip` e clique em **Atualizar**.
3. O visual **HTML Content** (AppSource) é carregado automaticamente.

## Como alterar

Edite os arquivos em `src/`, feche o Desktop e rode:

```
python src/dados/gerar_dados.py     # só se mudar os dados dos elementos
python src/build_modelo.py
python src/build_relatorio.py
```

Regras do JavaScript: **sem aspas duplas e sem crases** (o código vira texto DAX dentro de uma medida; o build recusa o arquivo se encontrar). Nos HTMLs dentro do JS, use `~` no lugar de aspas simples (a função `h()` troca).

## Observações

- Valores de propriedades (massa, eletronegatividade, pontos de fusão/ebulição, densidade, anos e descobridores) são **valores de referência didáticos**, digitados a partir de fontes comuns. Confira antes de usar em contexto crítico. Elementos sintéticos recentes (104+) não têm propriedades medidas.
- Fórmulas da página Ligações seguem a regra do octeto e os estados de oxidação mais comuns: são uma previsão simplificada (por exemplo, não trata expansão do octeto).
- O JavaScript foi testado fora do Power BI (Chrome headless, sem erros). As **medidas DAX e os arquivos PBIR/TMDL não puderam ser abertos no Power BI Desktop** aqui: se o Desktop acusar erro ao carregar, anote a mensagem e ajuste o arquivo indicado em `src/`.
