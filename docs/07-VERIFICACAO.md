# Verificação da entrega

Registro atualizado em 12/11/2026.

## Resultados observados

- `npm run build`: 12 páginas geradas e pacote `dist/` preparado.
- `npm run check`: 12 páginas e 331 referências locais verificadas; âncoras, metadados, dados estruturados, igualdade do pacote e integridade do selo aprovados.
- Verificação de sintaxe de JavaScript: aprovada.
- HTTP local: página inicial com resposta 200 e endereço inexistente com resposta 404.
- Todas as 12 páginas visitadas em largura de 390 pixels, com um título principal por página, sem excesso de largura e sem imagens quebradas detectadas.
- Início, caderno, participação, publicação e contato conferidos também em larguras de 320, 768 e 1280 pixels, sem excesso de largura detectado.
- Menu móvel: abertura, fechamento por Escape e retorno do foco ao botão confirmados.
- Busca do caderno: resultados, ausência de resultados e consulta sem acento confirmados. `academica` encontra a publicação de Vida acadêmica.
- Filtros: Pesquisa retorna dois guias; Todos retorna três; a seleção combinada com busca funciona.
- Perguntas frequentes: abertura por clique e fechamento por teclado confirmados.
- Agenda: filtro e download `.ics` testados com um evento fictício isolado, fora do pacote público. Conversão de horário de Brasília para UTC confirmada no arquivo baixado. O evento não foi cadastrado no site e a página temporária foi removida.
- Instagram informado pelo usuário integrado em rodapé, contato e participação, com abertura em nova aba identificada. Não foi enviada nenhuma mensagem.
- Nenhum erro registrado no console nas páginas verificadas.
- Capturas em computador e celular salvas em `output/qa/`.
- Paleta conferida a partir dos tons do selo. Variações de laranja para títulos e textos preservam contraste nos fundos utilizados; a faixa laranja usa texto escuro.
- Nenhum texto, contato, evento ou marca da LANUC presente nos HTMLs públicos. A referência é registrada apenas na documentação.
- Original do logo idêntico ao arquivo fornecido no Desktop, comparado por SHA-256.

## Verificador de arquivos

Execute `npm run check` após qualquer alteração. Ele confere páginas regeneradas, igualdade com o pacote `dist/`, referências locais, âncoras, título principal, metadados, dados estruturados e integridade do original do selo.

## Limites

A verificação local não substitui a conferência na hospedagem definitiva, a revisão editorial ou os testes dos canais de inscrição e contato reais. Integrações externas não podem ser consideradas operacionais enquanto seus destinos não forem informados e testados. Uma avaliação automática de acessibilidade, quando executada, não constitui certificação de conformidade.

Não foi executada auditoria automática completa de acessibilidade nem teste de importação em todos os aplicativos de calendário. A opção de redução de movimento e os estilos de impressão estão implementados; sua presença não equivale a uma certificação de compatibilidade em todos os navegadores.
