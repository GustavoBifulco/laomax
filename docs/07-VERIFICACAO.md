# Verificação da versão publicada

A abertura, os estilos e os scripts são gerados em conjunto. O endereço dos estilos e do JavaScript inclui uma assinatura derivada de seu conteúdo para que uma atualização das páginas carregue os arquivos correspondentes.

Os registros da revisão atual estão em [output/portal](../output/portal). As verificações abrangem navegação, leitura, filtragem, imagens e larguras de tela. As capturas e observações abaixo pertencem à versão anterior.

# Histórico da revisão visual

Conferência feita em 12 de novembro de 2026. As capturas desta revisão estão em [output/revisao-visual](../output/revisao-visual/). As imagens em output/qa e output/auditoria-2026-11-12 registram a versão anterior.

## Navegação e leitura

- As 12 páginas foram abertas no Chrome com larguras de 320, 390, 768, 901 e 1280 pixels. Foram conferidas a largura do documento e a carga das imagens em 60 combinações.
- Em 390 e 1280 pixels, as 12 páginas passaram por verificações automáticas com axe para as regras WCAG 2 A, 2 AA e 2.1 AA disponíveis. Resultados brutos em [verificacao.json](../output/revisao-visual/verificacao.json).
- A inspeção visual incluiu a abertura nas duas orientações de layout, a busca do caderno, a página de participação e o menu móvel. O enquadramento da mandíbula foi ajustado para preservar a borda da gravura.
- A abertura usa texto corrido de 18 px em 390 pixels e 19,2 px em 1280 pixels. A navegação principal de computador usa 16 px. O menu móvel ocupa a tela e mantém o foco na navegação até o fechamento.
- Navegação com teclado, fechamento por Escape e retorno do foco ao botão foram exercitados. Com JavaScript desabilitado, os links de navegação e as leituras continuam disponíveis.
- Busca sem acentos, pesquisa sem resultados, filtros de categoria, índice de artigo e perguntas frequentes foram exercitados.
- O botão de participação leva ao Instagram informado pela liga.
- Uma simulação de evento e edital, fora dos arquivos públicos, verificou as categorias, o formulário externo, o edital e o download para calendário. Uma atividade às 9h de Brasília foi exportada para 12h UTC.
- O servidor local respondeu 404 para endereço inexistente em subpasta e o link de retorno levou à página inicial.

## Arquivos e publicação

O comando `npm run check` verifica se a geração das páginas está atualizada, a integridade do selo, as referências locais, as âncoras e a correspondência entre os arquivos de origem e o pacote. O domínio configurado no projeto e no sitemap é laomax.com.br.

A conferência por HTTPS encontrou a página anterior servida pelo GitHub Pages. A implantação desta revisão é uma etapa separada. As verificações de navegador foram feitas no Chrome em larguras simuladas. A revisão dos guias e a confirmação de membros, datas e inscrições cabem à liga.
