# Publicação

## Pacote de hospedagem

A pasta `dist/` contém a versão para produção: 12 páginas HTML, imagens, fontes, estilos, interações, sitemap e configurações opcionais de hospedagem. O site não exige PHP, banco de dados ou Node.js no servidor de produção.

## Antes do envio

1. Confirme contatos, textos institucionais e conteúdos com a diretoria.
2. Preencha o domínio em `content/site.json`.
3. Complete a página de privacidade com o responsável e as informações da hospedagem.
4. Execute `npm run build` e `npm run check`.
5. Teste navegação, inscrição, e-mail e redes sociais com os dados reais.

## Hostinger ou hospedagem compartilhada

1. Identifique o domínio correto no painel da hospedagem.
2. Faça uma cópia dos arquivos atualmente publicados, se houver.
3. Envie o **conteúdo** de `dist/` para a raiz pública desse domínio, normalmente `public_html/`. Não envie a pasta `dist` como um nível extra.
4. Preserve os nomes e a estrutura de `assets/`.
5. Inclua `.htaccess` se o servidor utilizar Apache ou LiteSpeed. Ele configura a página 404 e cabeçalhos; não altera o domínio ou HTTPS.
6. Habilite e confira HTTPS no painel da hospedagem.
7. Abra a página inicial, uma publicação e um endereço inexistente pelo domínio público.

Não envie `content/`, `src/`, `scripts/`, `docs/` ou `output/` para o diretório público. Essas pastas são de manutenção.

## Hospedagens estáticas

Para Netlify ou Cloudflare Pages, use `npm run build` como comando de geração e `dist` como pasta de publicação. O arquivo `_headers` atende provedores compatíveis. Para GitHub Pages, revise a publicação na raiz ou em subpasta e as regras de domínio antes de configurar as URLs canônicas. Não foi realizada implantação em nenhum desses serviços.

## Conferência após publicar

- Todas as páginas abrem com HTTPS.
- Os arquivos de imagem e fontes retornam com sucesso.
- O menu para celular abre e fecha corretamente.
- Filtros e busca do caderno funcionam.
- Não há nomes, contatos, datas ou links desatualizados.
- O título e a descrição da página inicial aparecem corretamente no compartilhamento; a atualização pode depender do cache da rede social.
- O responsável e a política da hospedagem estão identificados na página de privacidade.
- O domínio correto está em canonical e sitemap.

## Atualização e recuperação

Antes de substituir a versão pública, guarde uma cópia do pacote anterior. Gere e confira uma nova `dist/`, envie os arquivos e teste novamente. Caso haja falha, restaure o pacote anterior. Mantenha uma cópia completa da pasta de projeto sob responsabilidade da gestão.
