/* Lee la configuración pública del sitio. Este archivo no contiene contraseñas ni secretos. */
(async function () {
  try {
    const response = await fetch('contenido-sitio.json', { cache: 'no-store' });
    if (!response.ok) return;
    const settings = await response.json();
    document.querySelectorAll('[data-site-setting]').forEach(el => {
      const key = el.dataset.siteSetting;
      if (typeof settings[key] === 'string') el.textContent = settings[key];
    });
    document.querySelectorAll('[data-site-date]').forEach(el => {
      const key = el.dataset.siteDate;
      if (typeof settings[key] === 'string') el.textContent = settings[key];
    });
  } catch (error) { console.warn('No se pudo cargar contenido-sitio.json', error); }
})();