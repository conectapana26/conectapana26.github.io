CONECTA PANA — PAQUETE PARA GITHUB PAGES + DECAP CMS

IMPORTANTE: el proyecto incluye el panel Decap CMS, campos de imagen y vista previa visual. El inicio de sesión OAuth NO puede quedar activo hasta configurar y desplegar un proveedor OAuth propio y poner su URL real en admin/config.yml. No compartas secretos OAuth dentro del repositorio.

SUBIR A GITHUB
1. Descarga y descomprime este ZIP en tu computador.
2. Abre el repositorio https://github.com/conectapana26/conectapana26.github.io
3. Pulsa Add file > Upload files.
4. Sube el CONTENIDO de la carpeta Proyecto_Conecta_Pana, no la carpeta Proyecto_Conecta_Pana completa. index.html debe quedar directamente en la raíz del repositorio.
5. Confirma con Commit changes y espera a que GitHub Pages termine de publicar.
6. Prueba la web: https://conectapana26.github.io/

PANEL
El panel estará en https://conectapana26.github.io/admin/ cuando se haya publicado.

CONFIGURAR AUTENTICACIÓN (PASO OBLIGATORIO)
1. Abre admin/config.yml.
2. Comprueba repo: conectapana26/conectapana26.github.io y branch: main.
3. Reemplaza https://TU-WORKER.workers.dev por la URL real de tu proveedor OAuth compatible con Decap CMS.
4. Configura el Client ID, Client Secret y callback en el proveedor OAuth y en Cloudflare Workers siguiendo la documentación del proveedor elegido. Guarda el Client Secret únicamente como secreto del Worker, nunca en archivos públicos.
5. No des por funcionando el panel hasta probar el login de punta a punta.

IMÁGENES
En el panel, al editar una publicación, usa el campo Imagen para seleccionar o subir una imagen. Decap guardará las imágenes en img/uploads y el JSON guardará la ruta.
La vista previa personalizada está en admin/preview.js y se carga desde admin/index.html.

NOTICIAS
El archivo noticias.json utiliza la propiedad "publicaciones". El sitio ya debe tener su lector de noticias conectado a esa estructura. Conserva los nombres de campos existentes (title, category, label, date, summary, content, image) para evitar incompatibilidades.

PERMISOS
El backend GitHub de Decap requiere permisos de escritura sobre el repositorio para publicar. Un colaborador con escritura puede potencialmente modificar otros archivos, no solo las noticias. Si el docente debe tener permisos limitados exclusivamente a contenido, evalúa un backend con permisos separados.
