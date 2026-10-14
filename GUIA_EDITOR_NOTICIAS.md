# Guía del editor de Noticias y Novedades — Conecta Pana

## Archivos nuevos o relacionados

- `editor-contenidos.html`: editor separado, no aparece enlazado en el menú público.
- `editor.js`: funciones para crear, editar, importar y eliminar publicaciones.
- `noticias.json`: archivo de datos que utiliza la página principal.
- `index.html` y `app.js`: muestran las tarjetas, filtros, buscador y ventana «Leer más» a partir de `noticias.json`.

## Cómo abrir el editor en VS Code

1. Abre la carpeta completa del proyecto en VS Code.
2. Inicia **Live Server** desde `index.html` (o desde `editor-contenidos.html`).
3. Para administrar contenido, abre `editor-contenidos.html` en el navegador desde ese servidor. No está enlazado en el menú de la página pública.
4. Pulsa **Editar** para cambiar una publicación o **Nueva publicación** para crear una.
5. Completa título, categoría, etiqueta, fecha, resumen, contenido completo y ruta de imagen.
6. Pulsa **Guardar publicación**. Este botón guarda los cambios en el borrador de la página del editor.
7. Cuando termines, pulsa **Descargar noticias.json**.
8. Copia el archivo descargado a la carpeta principal del proyecto y reemplaza el `noticias.json` anterior.
9. Si agregaste una imagen, copia también el archivo de imagen dentro de `img/` y verifica que el nombre y la ruta coincidan.
10. Prueba `index.html` con Live Server. Después vuelve a subir/publicar el proyecto para que los cambios lleguen a los visitantes.

## Imágenes

En el campo de imagen puedes escribir, por ejemplo, `img/semana-cultural.jpg`, o una URL pública que apunte directamente a una imagen. Para una ruta local, la fotografía debe existir en la carpeta `img/`. Se recomienda JPG o WEBP horizontal de aproximadamente 1600 × 1000 px.

## Seguridad y publicación

Que `editor-contenidos.html` no aparezca en la navegación solo lo hace menos visible; no es una barrera de seguridad. Si el proyecto se publica en internet, cualquier persona que conozca la dirección del archivo podría abrirlo. La etiqueta `noindex` pide a los buscadores que no lo indexen, pero no impide el acceso. Para restringirlo realmente se necesita autenticación y autorización en el servidor, o mantener el editor únicamente en el equipo del editor.

El editor está diseñado para trabajar con archivos JSON, no para escribir directamente en los archivos alojados en el servidor. Por eso el flujo de exportar y reemplazar `noticias.json` es necesario con la versión estática actual.
