/* Editor de información institucional para GitHub Pages.
   Guarda borradores en este navegador y permite exportar el JSON que se publica en el repositorio. */
(() => {
  const keys = ['homeMessage','contactTitle','contactDescription','boletines','escuelaPadres','reunionPadres'];
  const defaults = {
    homeMessage: '“Más conectados con nuestro colegio.”',
    contactTitle: 'Envíanos un Mensaje',
    contactDescription: 'Mensaje directo para la secretaría académica e institucional.',
    boletines: 'Por confirmar',
    escuelaPadres: 'Por confirmar',
    reunionPadres: 'Por publicar'
  };
  const $ = id => document.getElementById(id);
  const form = $('site-settings-form');
  if (!form) return;
  let loaded = {...defaults};
  const status = $('settings-status');

  function putValues(values) {
    keys.forEach(key => {
      const field = $('setting-' + key);
      if (field) field.value = typeof values[key] === 'string' ? values[key] : defaults[key];
    });
  }
  function readValues() {
    const result = {};
    keys.forEach(key => result[key] = $('setting-' + key).value.trim());
    return result;
  }
  async function loadSettings() {
    try {
      const response = await fetch('contenido-sitio.json', {cache:'no-store'});
      if (!response.ok) throw new Error('No se encontró contenido-sitio.json');
      loaded = {...defaults, ...(await response.json())};
      putValues(loaded);
      status.textContent = 'Configuración actual cargada. Edita los campos y descarga el archivo cuando termines.';
    } catch (error) {
      loaded = {...defaults};
      putValues(loaded);
      status.textContent = 'Se cargaron los valores iniciales. Si abres el editor como archivo local, publícalo mediante GitHub Pages para cargar el JSON.';
    }
  }
  $('download-settings').addEventListener('click', () => {
    const values = readValues();
    const blob = new Blob([JSON.stringify(values, null, 2) + '\\n'], {type:'application/json;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'contenido-sitio.json';
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    status.textContent = 'Archivo descargado. Súbelo al repositorio de GitHub reemplazando contenido-sitio.json para que los cambios se vean a todos los visitantes.';
  });
  $('reset-settings').addEventListener('click', () => {
    putValues(loaded);
    status.textContent = 'Se restauraron los valores que se cargaron al abrir el editor.';
  });
  loadSettings();
})();