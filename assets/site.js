(() => {
  document.documentElement.classList.add('js');
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');
  const menuLabel = menu.querySelector('.menu-label');
  const background = document.querySelectorAll('main, footer, .skip-link');
  menu.hidden = false;
  if (document.querySelector('base')) document.querySelector('.skip-link').href = location.href.split('#')[0] + '#conteudo';
  function setMenu(open) {
    menu.setAttribute('aria-expanded', String(open));
    menuLabel.textContent = open ? 'Fechar' : 'Menu';
    document.body.classList.toggle('menu-open', open);
    background.forEach(element => { element.inert = open; });
  }
  menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', event => {
    if (menu.getAttribute('aria-expanded') !== 'true') return;
    if (event.key === 'Escape') {
      setMenu(false);
      menu.focus();
    }
    if (event.key === 'Tab') {
      const first = document.querySelector('.site-header .brand');
      const last = nav.lastElementChild;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
  nav.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
  window.matchMedia('(min-width: 901px)').addEventListener('change', () => setMenu(false));
  window.addEventListener('pageshow', () => setMenu(false));

  document.querySelectorAll('[data-filter-group]').forEach(group => {
    const target = document.querySelector(group.dataset.filterGroup);
    if (!target) return;
    const items = [...target.querySelectorAll('[data-category]')];
    const empty = target.querySelector('[data-empty]');
    const status = document.querySelector(group.dataset.status);
    const search = document.querySelector(group.dataset.search);
    const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    const searchable = items.map(item => normalize(item.textContent + ' ' + (item.dataset.terms || '')));
    let category = 'Todos';
    function update() {
      const terms = normalize(search?.value || '').split(/\s+/).filter(Boolean);
      let count = 0;
      items.forEach((item, index) => {
        const show = (category === 'Todos' || item.dataset.category === category) && terms.every(term => searchable[index].includes(term));
        item.hidden = !show;
        if (show) count++;
      });
      if (empty) empty.hidden = count > 0;
      if (status) status.textContent = `${count} ${count === 1 ? 'publicação encontrada' : 'publicações encontradas'}`;
    }
    group.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
      category = button.dataset.filter;
      group.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
      update();
    }));
    target.querySelector('.reset-search')?.addEventListener('click', () => {
      search.value = '';
      group.querySelector('[data-filter="Todos"]').click();
      search.focus();
    });
    search?.addEventListener('input', update);
    update();
  });

  document.querySelectorAll('[data-calendar]').forEach(button => button.addEventListener('click', () => {
    const event = JSON.parse(button.dataset.calendar);
    const escape = value => String(value).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
    const date = value => new Date(value).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//LAOMAX//Agenda//PT-BR', 'BEGIN:VEVENT', `UID:${event.id}@laomax.local`, `DTSTAMP:${date(new Date())}`, `DTSTART:${date(event.start)}`, `DTEND:${date(event.end)}`, `SUMMARY:${escape(event.title)}`, `LOCATION:${escape(event.location)}`, `DESCRIPTION:${escape(event.description)}`, 'END:VEVENT', 'END:VCALENDAR', ''].join('\r\n');
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = `laomax-${event.id}.ics`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }));
})();

// Reconcile time-sensitive actions even when the static pages were built earlier.
(() => {
  function updateAvailability() {
    const now = Date.now();
    document.querySelectorAll('[data-event-end]').forEach(event => {
      if (Date.parse(event.dataset.eventEnd) > now) return;
      event.querySelector('[data-event-status]').textContent = 'Encerrado';
      event.querySelector('[data-event-actions]').hidden = true;
      if (event.closest('[data-upcoming-home]')) event.hidden = true;
    });
    document.querySelectorAll('[data-upcoming-home]').forEach(section => {
      section.hidden = ![...section.querySelectorAll('[data-event-end]')].some(e => Date.parse(e.dataset.eventEnd) > now);
    });
    document.querySelectorAll('[data-selection-close]').forEach(selection => {
      if (!selection.dataset.selectionClose || Date.parse(selection.dataset.selectionClose) > now) return;
      selection.querySelector('[data-selection-action]')?.setAttribute('hidden', '');
      selection.querySelector('[data-selection-status]').hidden = true;
      const expired = selection.querySelector('[data-selection-expired]');
      if (expired) expired.hidden = false;
    });
  }
  updateAvailability();
  window.addEventListener('pageshow', updateAvailability);
  document.addEventListener('visibilitychange', updateAvailability);
  setInterval(updateAvailability, 30000);
})();
