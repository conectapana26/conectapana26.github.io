/* Carga las fechas públicas de las fichas de Comunidad desde el JSON de respaldo. */
(async function () {
  try {
    const response = await fetch('contenido-sitio.json', { cache: 'no-store' });
    if (!response.ok) return;
    const settings = await response.json();
    document.querySelectorAll('[data-site-date]').forEach(element => {
      const key = element.dataset.siteDate;
      if (typeof settings[key] === 'string') element.textContent = settings[key];
    });
  } catch (error) { console.warn('No se pudieron cargar las fechas de respaldo.', error); }
})();
