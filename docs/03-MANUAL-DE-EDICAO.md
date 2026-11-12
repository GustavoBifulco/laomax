# Manual de edição

## Alterações mais comuns

Edite `content/site.json`, preserve as aspas e vírgulas do JSON e execute:

```sh
npm run build
npm run check
```

Abra a página correspondente e confira o resultado antes de enviar `dist/` à hospedagem. O comando de geração recria `dist/`; não use essa pasta para guardar arquivos pessoais.

## Contatos e domínio

| Campo | Formato |
| --- | --- |
| url | URL HTTPS do domínio definitivo, sem subpasta; por exemplo, o domínio aprovado pela liga |
| email | Endereço oficial, sem o prefixo mailto: |
| instagram | URL HTTPS completa do perfil correto |
| whatsapp | Número com código do país e DDD, apenas dígitos |
| statuteUrl | URL HTTPS do estatuto aprovado |

Campos vazios não geram links falsos. O domínio permite gerar canonical, metadados de imagem e URLs no sitemap. Esta versão pressupõe publicação na raiz do domínio. Ao definir o domínio, acrescente ao `robots.txt` a linha `Sitemap: https://DOMINIO-APROVADO/sitemap.xml`, substituindo o exemplo pelo endereço real.

## Diretoria

Acrescente objetos ao array `board`:

```json
{
  "name": "Nome aprovado para publicação",
  "role": "Função na gestão",
  "bio": "Apresentação breve, revisada pela pessoa.",
  "photo": "assets/images/diretoria/nome-da-pessoa.jpg"
}
```

Coloque a imagem na pasta indicada antes da geração. Use fotos com autorização e boa resolução. O enquadramento é vertical. Sem foto, o layout utiliza um símbolo gráfico. O campo `advisor` recebe o nome da orientação docente. Para informar o período da gestão, atualize o texto de apresentação da página em `src/pages.mjs`.

## Eventos

Cada item de `events` deve seguir este formato, com informações reais:

```json
{
  "id": "identificador-unico-do-evento",
  "category": "Ensino",
  "title": "Título oficial",
  "description": "Resumo aprovado.",
  "start": "2027-03-20T09:00:00-03:00",
  "end": "2027-03-20T12:00:00-03:00",
  "location": "Local confirmado",
  "url": "https://URL-OFICIAL-DA-INSCRICAO"
}
```

Este exemplo documenta o formato, não um evento agendado. Use somente as categorias `Ensino`, `Pesquisa` e `Extensão`. O início e término precisam indicar o fuso. As datas são exibidas no horário de Brasília. O comando de geração valida as datas. Eventos passados não mostram botão de inscrição. A situação é calculada na geração: gere novamente após o término de eventos. A ordem da lista no arquivo define a ordem de exibição; mantenha os próximos eventos primeiro. O botão de calendário gera um arquivo `.ics` local, sem enviar dados a serviços externos.

## Processo seletivo

Em `selection`, preencha `url` com o formulário oficial e `noticeUrl` com o edital. Altere `open` para `true` apenas durante o período real de inscrição. Sem URL ou com `open: false`, a página permanece no estado de espera. Feche a seleção e gere novamente no fim do prazo.

## Parceiros

O array `partners` aceita objetos com `name` e `url` HTTPS. As marcas aparecem na página de contato. Inclua somente parcerias confirmadas. O layout atual usa os nomes em texto; inclusão de logotipos requer preparar os arquivos e atualizar o modelo.

## Publicações

Edite `content/articles.json`. Campos:

- `slug`: identificador único, sem espaços ou acentos.
- `category`: Pesquisa ou Vida acadêmica, conforme os filtros atuais.
- `title`, `description`, `minutes`: título, resumo e leitura aproximada.
- `art`: `search`, `reading` ou `pubmed`, estilos de capa gráfica.
- `sections`: lista de objetos com `title` e `text`.
- `sources`: lista de objetos com `label` e `url` HTTPS.

Textos são tratados como texto simples, sem HTML. Cada novo item gera uma página `artigo-SLUG.html`. Ao remover uma publicação, remova manualmente o HTML antigo da raiz; `dist/` é recriada e já exclui arquivos removidos. As publicações iniciais indicam revisão editorial pendente: altere essa indicação no modelo somente após a revisão efetiva.

## Identidade e layout

Altere cores, espaçamento e estilos em `assets/styles.css`. As variáveis principais estão no início do arquivo. Edite textos fixos e estrutura em `src/pages.mjs`; interações em `assets/site.js`. Preserve o arquivo `assets/images/laomax-selo-original.png`.
