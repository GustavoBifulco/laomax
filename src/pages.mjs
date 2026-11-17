import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

function versionedAsset(file) {
  const bytes = readFileSync(new URL('../assets/' + file, import.meta.url));
  const version = createHash('sha256').update(bytes).digest('hex').slice(0, 12);
  return `assets/${file}?v=${version}`;
}
const stylesheet = versionedAsset('styles.css');
const siteScript = versionedAsset('site.js');

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));

const arrow = direction => `<span class="arrow" aria-hidden="true">${direction}</span>`;
const link = (href, label, cls = 'inline-link') =>
  `<a class="${cls}" href="${esc(href)}">${esc(label)} ${arrow('→')}</a>`;
const external = (href, label, cls = 'inline-link') =>
  `<a class="${cls}" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${esc(label)} ${arrow('↗')}<span class="sr-only"> (abre em nova aba)</span></a>`;
const allSections = [['a-liga.html', 'A liga'], ['atividades.html', 'Atividades'], ['caderno.html', 'Caderno acadêmico'], ['diretoria.html', 'Diretoria']];
const bread = label => `<nav class="breadcrumb" aria-label="Caminho da página"><a href="index.html">Início</a><span aria-hidden="true">/</span><span>${esc(label)}</span></nav>`;
const intro = (label, title, description) => `<section class="page-banner"><div class="container page-intro">${bread(label)}<h1>${esc(title)}</h1><p class="lead">${esc(description)}</p></div><img class="banner-seal" src="assets/identidade/selo-mono.webp" width="1000" height="1000" alt="" aria-hidden="true"></section>`;
const wordmark = `<img src="assets/identidade/marca.webp" width="52" height="52" alt=""><span class="brand-type">LAOMAX<small>UNICID</small></span>`;
function articleList(items) {
  return items.map(a => `<article class="reading" data-category="${esc(a.category)}" data-terms="${esc(a.sections.map(section => section.title + ' ' + section.text).join(' '))}">
    <div class="reading-meta"><span>${esc(a.category)}</span><small>${esc(a.minutes)} min de leitura</small></div>
    <div><h3><a href="artigo-${esc(a.slug)}.html">${esc(a.title)} ${arrow('→')}</a></h3><p>${esc(a.description)}</p></div>
  </article>`).join('');
}

const formatDate = (date, options) => new Date(date).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', ...options });
function eventCard(e) {
  const past = new Date(e.end) < new Date();
  return `<article class="event" data-category="${esc(e.category)}">
    <div class="event-date"><strong>${formatDate(e.start, { day:'2-digit' })}</strong>${formatDate(e.start, { month:'short', year:'numeric' })}</div>
    <div><span class="kicker">${esc(e.category)} · ${past ? 'Encerrado' : 'Programado'}</span><h3>${esc(e.title)}</h3>
    <p>${esc(e.description)}</p><p>${esc(e.location)} · ${formatDate(e.start, { hour:'2-digit', minute:'2-digit' })} (Brasília)</p>
    ${!past && e.url ? external(e.url, 'Ver inscrição', 'button') : ''} ${!past ? `<button class="inline-link" data-calendar="${esc(JSON.stringify(e))}">Adicionar ao calendário ↓</button>` : ''}</div></article>`;
}

export function renderPages(site, articles) {
  const pages = {};
  const navItems = [...allSections];
  const handle = site.instagram && '@' + new URL(site.instagram).pathname.split('/').filter(Boolean)[0];
  const instagram = (label = handle, cls = 'inline-link') => site.instagram ? external(site.instagram, label, cls) : link('contato.html', 'Contato com a liga', cls);
  const join = () => `<section class="join"><div class="container join-inner"><div><p class="kicker">Faça parte</p><h2>Tem lugar para<br>a sua curiosidade.</h2><p>Conheça as formas de participar da LAOMAX.</p></div>${link('participar.html','Quero participar','button dark-button')}</div></section>`;
  const notice = (title, copy, action = '') => `<div class="notice"><h3>${esc(title)}</h3><p>${esc(copy)}</p>${action}</div>`;
  function page(file, title, description, body, article = false) {
    const is404 = file === '404.html';
    const current = article ? 'caderno.html' : file;
    const origin = site.url && new URL(site.url).origin;
    const canonical = origin && !is404 && origin + '/' + (file === 'index.html' ? '' : file);
    const schema = JSON.stringify({'@context':'https://schema.org','@type':'Organization',name:site.name,description:site.description,...(origin ? {url:origin}:{}),...(site.instagram ? {sameAs:[site.instagram]}:{})}).replace(/</g,'\\u003c');
    pages[file] = `<!doctype html>
<html lang="pt-BR"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
${is404 ? '<base href="/"><script>if (location.protocol === "file:") document.querySelector("base").href = location.href;</script>' : ''}
<title>${esc(title)}${file === 'index.html' ? '' : ' — LAOMAX'}</title>
<meta name="description" content="${esc(description)}"><meta name="theme-color" content="#efeae3">
<meta property="og:type" content="${article ? 'article' : 'website'}"><meta property="og:locale" content="pt_BR"><meta property="og:site_name" content="LAOMAX">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}">
${canonical ? `<link rel="canonical" href="${esc(canonical)}"><meta property="og:url" content="${esc(canonical)}"><meta property="og:image" content="${esc(origin)}/assets/images/laomax-selo-original.png">` : ''}
${is404 ? '<meta name="robots" content="noindex">' : ''}<link rel="icon" href="assets/images/favicon.png"><link rel="preload" as="font" type="font/ttf" crossorigin href="assets/fonts/archivo-black.ttf">
<link rel="stylesheet" href="${stylesheet}"><script src="${siteScript}" defer></script><script type="application/ld+json">${schema}</script>
</head><body><a href="#conteudo" class="skip-link">Pular para o conteúdo</a>
<header class="site-header"><div class="container header-inner"><a class="brand" href="index.html" aria-label="LAOMAX — início">${wordmark}</a>
<button class="menu-toggle" hidden aria-expanded="false" aria-controls="main-nav"><span class="menu-label">Menu</span><i aria-hidden="true"></i></button>
<nav id="main-nav" aria-label="Navegação principal">${[...navItems,['participar.html','Faça parte']].map(([url,label])=>`<a href="${url}"${url===current?' aria-current="page"':''}${url==='participar.html'?' class="nav-cta"':''}>${label}${url==='participar.html'?arrow('→'):''}</a>`).join('')}</nav></div></header>
<main id="conteudo">${body}</main>
<footer><div class="container footer-signature" aria-hidden="true">LAOMAX</div><div class="container footer-grid"><div><a class="brand" href="index.html">${wordmark}</a><p>${esc(site.fullName)} da UNICID.</p></div>
<div><h2>Navegação</h2>${allSections.map(([u,l])=>`<a href="${u}">${l}</a>`).join('')}</div><div><h2>Contato</h2>${link('participar.html','Faça parte')}${link('contato.html','Contato e parcerias')}${site.instagram ? instagram() : ''}</div></div>
<div class="container footer-end"><span>© ${new Date().getFullYear()} LAOMAX · UNICID</span><a href="privacidade.html">Privacidade</a></div></footer></body></html>\n`;
  }

  const upcoming = site.events.filter(e => new Date(e.end) >= new Date()).sort((a,b)=>Date.parse(a.start)-Date.parse(b.start));
  page('index.html','LAOMAX — Liga Acadêmica de Ortodontia e Ortopedia Funcional dos Maxilares',site.description,`
    <section class="hero" id="inicio"><div class="container hero-inner">
      <div class="hero-copy"><p class="hero-label">Bem-vindos à</p><h1>LAOMAX</h1>
      <p class="hero-name">Liga Acadêmica de Ortodontia e<br class="desktop-break"> Ortopedia Funcional dos Maxilares</p>
      <p class="hero-statement">Estética.<br>Forma. Função.</p>
      <p class="hero-description">Aprendendo que elas podem caminhar juntas.</p>
      <div class="actions">${link('participar.html','Faça parte da liga','button dark-button')}${link('#liga','Conheça a LAOMAX','hero-link')}</div></div>
      <div class="hero-emblem"><img src="assets/identidade/selo-cor.webp" width="1200" height="1200" fetchpriority="high" alt="Brasão da LAOMAX UNICID, com a mandíbula em gravura."></div>
    </div><div class="container hero-foot"><span>Odontologia · UNICID</span><a href="#liga">Explore a liga ↓</a></div></section>
    <section class="container section about-home" id="liga"><p class="kicker">A liga</p><div class="split"><h2>O estudo vai<br>mais longe<br><span class="orange-text">em conjunto.</span></h2><div class="about-copy"><p class="lead">A LAOMAX conecta o interesse pela Ortodontia e pela Ortopedia Funcional dos Maxilares à vida acadêmica na UNICID.</p><p>Um espaço para fazer perguntas, trocar leituras e ampliar o conhecimento em Odontologia.</p>${link('a-liga.html','Conheça a nossa proposta')}</div></div></section>
    <section class="agenda-band" id="atividades"><div class="container section"><div class="section-title"><div><p class="kicker">Atividades</p><h2>Nossos encontros</h2></div>${link('atividades.html','Consultar a agenda')}</div>
    ${upcoming.length ? upcoming.slice(0,2).map(eventCard).join('') : `<div class="agenda-notice"><h3>Acompanhe as próximas datas.</h3><p>Os encontros serão divulgados na agenda e no Instagram oficial da liga.</p>${instagram('Acompanhar a LAOMAX','button dark-button')}</div>`}</div></section>
    <section class="container section notebook-home"><div class="section-title"><div><p class="kicker">Caderno acadêmico</p><h2>Para ler.<br>Para questionar.</h2></div><div class="section-aside"><p>Guias de pesquisa e leitura científica para acompanhar a graduação.</p>${link('caderno.html','Explorar todas as leituras')}</div></div><div class="reading-list home-readings">${articleList(articles.slice(0,3))}</div></section>
    <section class="community"><div class="container community-inner"><figure><img src="assets/identidade/coffee-break.webp" width="960" height="1358" loading="lazy" alt="Arte Coffee Break da LAOMAX, com pessoas reunidas e brindando com copos."></figure><div class="community-copy"><p class="kicker">Vida acadêmica</p><h2>A troca também<br>faz parte.</h2><p>Entre uma leitura e outra, há espaço para conhecer pessoas, compartilhar dúvidas e construir ideias.</p><p>Encontre a LAOMAX no Instagram e acompanhe o que acontece na liga.</p>${instagram(handle,'button')}</div></div></section>${join()}`);

  page('a-liga.html','A liga','Conheça a LAOMAX e a proposta acadêmica da liga na UNICID.',`
    ${intro('A liga','Conhecimento que aproxima.',site.fullName + ' da UNICID.')}
    <section class="container section identity"><figure class="welcome-art"><img src="assets/identidade/boas-vindas.webp" width="960" height="1920" alt="Arte de boas-vindas da LAOMAX com mandíbula em gravura e as palavras estética, forma e função." loading="lazy"></figure>
    <div><p class="kicker">Nossa proposta</p><h2>Estética, forma<br>e função.</h2><p class="lead">Aprendendo que elas podem caminhar juntas.</p><p>A LAOMAX reúne o interesse pelo estudo da Ortodontia e da Ortopedia Funcional dos Maxilares na UNICID. A proposta da liga é criar espaço para o aprendizado em conjunto e para a troca de conhecimentos.</p>
    <p>Aqui você encontra a agenda, as oportunidades de participação e um caderno de apoio à leitura científica.</p>${link('participar.html','Conheça as formas de participar')}${site.statuteUrl ? external(site.statuteUrl,'Consultar o estatuto') : ''}</div></section>
    <section class="pillars-section"><div class="container section"><p class="kicker">Formação acadêmica</p><h2>Três caminhos para aprender.</h2><div class="pillars"><article><h3>Ensino</h3><p>Aprofundar o estudo e discutir as perguntas que surgem ao longo da graduação.</p></article><article><h3>Pesquisa</h3><p>Desenvolver a leitura científica e aprender a buscar, organizar e avaliar informações.</p></article><article><h3>Extensão</h3><p>Pensar a relação entre a formação universitária e a comunidade.</p></article></div></div></section>${join()}`);

  const filters = (items) => items.map((f,i)=>`<button type="button" data-filter="${esc(f)}" aria-pressed="${i===0}">${esc(f)}</button>`).join('');
  page('atividades.html','Atividades e agenda','Datas, locais e canais de inscrição para atividades da LAOMAX.',`
    ${intro('Atividades','Agenda de atividades','Consulte datas, locais e formas de participação nos encontros da LAOMAX.')}
    <section class="container content-section"><h2>Programação</h2>
    ${site.events.length ? `<div class="filters enhanced" data-filter-group="#events" role="group" aria-label="Filtrar atividades">${filters(['Todos','Ensino','Pesquisa','Extensão'])}</div>` : ''}
    <div id="events">${site.events.map(eventCard).join('')}<div data-empty ${site.events.length ? 'hidden' : ''}>${notice(site.events.length?'Nenhuma atividade nesta categoria':'Próximas datas',site.events.length?'Escolha outra categoria para consultar a programação.':'A liga ainda não publicou datas de encontros nesta agenda. Você pode acompanhar os avisos no Instagram oficial.',instagram())}</div></div></section>${join()}`);

  page('caderno.html','Caderno acadêmico','Guias de leitura científica e pesquisa bibliográfica para estudantes de Odontologia.',`
    ${intro('Caderno acadêmico','Caderno acadêmico','Guias para encontrar artigos, organizar suas leituras e pesquisar em bases científicas.')}
    <section class="container content-section"><div class="notebook-tools enhanced"><label class="search-field" for="search">Buscar no caderno<input type="search" id="search" placeholder="Ex. PubMed, fichamento"></label>
    <div class="filters" role="group" aria-label="Categoria da publicação" data-filter-group="#articles" data-search="#search" data-status="#search-status">${filters(['Todos',...new Set(articles.map(a=>a.category))])}</div></div>
    <p id="search-status" class="result-count" role="status">${articles.length} publicações</p><div class="reading-list" id="articles">${articleList(articles)}<div data-empty hidden>${notice('Nenhum guia encontrado','Tente outro termo ou volte à lista completa.')}<button type="button" class="reset-search inline-link">Mostrar todos os guias</button></div></div>
    <p class="editorial-note">Guias introdutórios de estudo. Revisão editorial da liga pendente.</p></section>`);

  for (const a of articles) page(`artigo-${a.slug}.html`,a.title,a.description,`
    <div class="article-banner"><div class="container page-intro article-intro"><nav class="breadcrumb" aria-label="Caminho da página"><a href="index.html">Início</a> / <a href="caderno.html">Caderno acadêmico</a></nav>
    <p class="kicker">${esc(a.category)} · ${esc(a.minutes)} min de leitura</p><h1>${esc(a.title)}</h1><p class="lead">${esc(a.description)}</p><p class="editorial-note">Guia introdutório · Revisão editorial da liga pendente</p></div></div>
    <div class="container article-layout"><aside><nav aria-label="Índice da publicação"><h2>Nesta leitura</h2>${a.sections.map((s,i)=>`<a href="#passo-${i+1}">${esc(s.title)}</a>`).join('')}</nav></aside><article class="prose">
    ${a.sections.map((s,i)=>`<section id="passo-${i+1}"><h2>${esc(s.title)}</h2><p>${esc(s.text)}</p></section>`).join('')}
${a.worksheet ? `<section class="study-resource"><h2>Ficha de leitura</h2><p>Use o modelo para registrar a referência, os resultados e suas dúvidas ao ler um artigo.</p><a class="button" download="ficha-de-leitura-laomax.txt" href="${esc(a.worksheet)}">Baixar ficha editável ↓</a></section>` : ''}
${a.exampleSearch ? `<section class="study-resource"><h2>Experimente a busca</h2><p>Abra o exemplo do guia e observe como os resultados mudam ao ajustar os termos.</p>${external(a.exampleSearch, 'Pesquisar no PubMed', 'button')}</section>` : ''}
    <section><h2>Fontes e recursos</h2><ul>${a.sources.map(s=>`<li>${external(s.url,s.label)}</li>`).join('')}</ul></section></article></div>
    <section class="container section related"><h2>Outras leituras</h2><div class="reading-list">${articleList(articles.filter(b=>b.slug!==a.slug))}</div></section>`,true);

  page('diretoria.html','Diretoria','Gestão da LAOMAX e canal de contato com a liga.',`
    ${intro('Diretoria','Quem faz a liga.','Composição da gestão e orientação docente da liga.')}<section class="container content-section">
    ${site.board.length ? `<div class="members">${site.board.map(m=>`<article>${m.photo ? `<img src="${esc(m.photo)}" alt="${esc(m.name)}" loading="lazy">` : ''}<p class="kicker">${esc(m.role)}</p><h2>${esc(m.name)}</h2>${m.bio ? `<p>${esc(m.bio)}</p>` : ''}</article>`).join('')}</div>` : notice('Gestão atual','Os nomes e as funções desta gestão ainda não foram publicados. Para falar com a liga, use o canal oficial.',instagram())}
    ${site.advisor ? `<h2>Orientação docente</h2><p>${esc(site.advisor)}</p>` : ''}</section>`);

  const open = site.selection.open && site.selection.url;
  const questions = [
    ['Como faço para entrar na liga?', 'As etapas, os critérios e o formulário de inscrição ficam disponíveis nesta página quando há um processo seletivo divulgado.'],
    ['Posso participar de uma atividade sem ser membro?', 'Consulte o público e as condições de participação na divulgação de cada encontro.'],
    ['As atividades têm certificado?', 'A divulgação de cada atividade informa se há certificado e quais são os critérios para recebê-lo.']
  ];
  page('participar.html','Como participar','Seleção de membros, parcerias e contatos da LAOMAX.',`
    ${intro('Faça parte','Vamos aprender juntos?','Veja como acompanhar a seleção de novos membros ou propor uma colaboração com a LAOMAX.')}
    <section class="container pathways"><article class="student"><p class="kicker">Para estudantes</p><h2>Seleção de membros</h2><p>${open?'As inscrições estão abertas. Consulte as etapas e os prazos da seleção.':'Ainda não há processo seletivo divulgado. Acompanhe o Instagram da liga para saber quando houver novidades.'}</p>
    ${open ? external(site.selection.url,'Acessar inscrição','button accent-button') : instagram('Acompanhar no Instagram','button accent-button')}
    ${site.selection.noticeUrl ? external(site.selection.noticeUrl,'Consultar edital') : ''}</article>
    <article class="partner"><p class="kicker">Para parceiros</p><h2>Proponha uma atividade</h2><p>Envie uma breve apresentação, o tema do encontro e o público que você quer alcançar.</p>${instagram('Falar com a liga')}</article></section>
    <section class="container section faq split"><h2>Perguntas frequentes</h2><div>${questions.map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div></section>`);

  const channels = [
    site.instagram && external(site.instagram,'Instagram · ' + handle,'channel'),
    site.email && `<a class="channel" href="mailto:${esc(site.email)}">${esc(site.email)} ${arrow('↗')}</a>`,
    site.whatsapp && external('https://wa.me/'+site.whatsapp.replace(/\D/g,''),'WhatsApp','channel')
  ].filter(Boolean);
  page('contato.html','Contato e parcerias','Canais oficiais para conversar com a LAOMAX ou propor uma atividade.',`
    ${intro('Contato','Uma conversa começa aqui.','Fale com a liga sobre atividades, participação ou propostas acadêmicas.')}
    <section class="container content-section split"><div><h2>Canais da liga</h2>${channels.join('') || '<p>Os canais serão publicados após confirmação pela liga.</p>'}</div><div class="notice"><h3>Propostas de colaboração</h3><p>Inclua seu nome, sua instituição, o tema da atividade e o público a que ela se destina.</p></div></section>
    ${site.partners.length ? `<section class="container section"><h2>Parceiros</h2>${site.partners.map(p=>external(p.url,p.name,'channel')).join('')}</section>` : ''}`);

  page('privacidade.html','Privacidade','Entenda o funcionamento do site e o uso de serviços externos.',`
    ${intro('Privacidade','Privacidade','Como funciona a navegação no site da LAOMAX.')}
    <article class="container content-section prose legal"><h2>Navegação</h2><p>As páginas, fontes e imagens são servidas pela hospedagem. A busca no caderno funciona no seu navegador. O site não pede cadastro e seu código não instala cookies nem ferramentas de análise de audiência.</p>
    <h2>Hospedagem</h2><p>O domínio usa o GitHub Pages. O provedor pode registrar informações técnicas de acesso, como o endereço IP. Consulte a ${external('https://docs.github.com/pt/site-policy/privacy-policies/github-general-privacy-statement','declaração de privacidade do GitHub')}.</p>
    <h2>Serviços externos</h2><p>Ao abrir um link para o Instagram, uma base de pesquisa ou uma plataforma de inscrições, você passa a navegar nesse serviço. Consulte a política de privacidade do destino.</p>
    <h2>Contato</h2><p>Para dúvidas sobre o site, entre em contato com a liga.</p>${link('contato.html','Contato com a LAOMAX')}</article>`);

  page('404.html','Página não encontrada','Volte à página inicial da LAOMAX.',`<div class="container section not-found"><p class="kicker">Erro 404</p><h1>Página não encontrada</h1><p>O endereço pode ter mudado ou estar incompleto.</p>${link('index.html','Voltar ao início','button dark-button')}</div>`);
  return pages;
}
