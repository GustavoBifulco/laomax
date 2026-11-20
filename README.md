# LAOMAX — site institucional

Site completo, em português, criado em 12/11/2026 para a Liga Acadêmica de Ortodontia e Ortopedia Funcional dos Maxilares da UNICID. Usa o novo selo fornecido, preservado no arquivo original, e uma identidade própria inspirada na organização do site da LANUC.

## Ver o site

Abra **index.html** no navegador. As páginas, fontes e imagens são locais; a navegação principal não depende de internet.

Para visualizar com um servidor local, use Node.js 20 ou superior:

```sh
npm run dev
```

Acesse **http://127.0.0.1:4173**. Não é necessário instalar dependências. Para encerrar, use Ctrl+C.

## O que foi entregue

- Início com a nova identidade e os principais caminhos de navegação.
- A liga: apresentação e identidade visual.
- Atividades: agenda com filtros e suporte a inscrição e download de calendário quando houver eventos cadastrados.
- Caderno acadêmico: três guias introdutórios e busca. Os filtros por categoria aparecem a partir de seis guias.
- Três páginas individuais de leitura, com índice e referências.
- Diretoria: estrutura pronta para nomes, funções, biografias e fotos.
- Participação: processo seletivo configurável, caminhos de participação e perguntas frequentes.
- Contato e parcerias: canais configuráveis, sem destinos inventados.
- Privacidade e página de erro 404.
- Versões para celular, tablet e computador; navegação por teclado e redução de movimento.
- Fontes locais, favicon, metadados sociais, dados estruturados e suporte a sitemap após definir o domínio.
- Pasta **dist/** com os arquivos prontos para envio à hospedagem.

## Editar e gerar novamente

1. Altere os dados em `content/site.json` e as publicações em `content/articles.json`.
2. Execute `npm run build`.
3. Execute `npm run check`.
4. Atualize na hospedagem o conteúdo de `dist/`.

Os HTMLs da raiz e de `dist/` são gerados. Alterações permanentes no layout devem ser feitas em `src/pages.mjs`, `assets/styles.css` e `assets/site.js`.

## Documentação

- [Direção criativa e escopo](docs/01-DIRECAO-E-ESCOPO.md)
- [Mapa do site e conteúdo](docs/02-MAPA-E-CONTEUDO.md)
- [Manual de edição](docs/03-MANUAL-DE-EDICAO.md)
- [Como publicar](docs/04-PUBLICACAO.md)
- [Identidade, arquivos e fontes](docs/05-IDENTIDADE-E-CREDITOS.md)
- [Pendências para lançamento](docs/06-CHECKLIST-DE-LANCAMENTO.md)
- [Verificação da entrega](docs/07-VERIFICACAO.md)
- [Comparação da primeira versão com a LANUC](docs/08-COMPARACAO-COM-LANUC.md)

## Situação da entrega

O GitHub Pages publica a raiz da branch `main` em [laomax.com.br](https://laomax.com.br/). O Instagram oficial @laomax_unicid está integrado. E-mail, WhatsApp, diretoria, datas de eventos, estatuto, parceiros e edital não foram fornecidos e permanecem sem preenchimento. O site apresenta estados de espera claros nesses espaços.

O caderno contém textos introdutórios preparados nesta entrega, com fontes e indicação de revisão editorial pendente. O site não possui banco de dados, área de membros, checkout, envio de mensagens ou emissão de certificados. Inscrições podem ser conectadas a uma plataforma externa oficial. A página de privacidade deve receber a identificação do responsável da liga. O GitHub Pages está identificado.
