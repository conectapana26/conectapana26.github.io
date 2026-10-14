# Guía de imágenes — Conecta Pana

Guarda todas las imágenes dentro de la carpeta `img/`, al mismo nivel que los tres archivos HTML. Conserva exactamente los nombres de archivo. JPG/JPEG o WebP son adecuados para fotografías; PNG transparente es lo mejor para el logo.

## Logo y pestaña del navegador
- `logo-conecta-pana.png` — logo del encabezado en las tres páginas y favicon de la pestaña. **512 × 512 px**, cuadrado, PNG con fondo transparente. El sitio conserva un birrete provisional hasta que coloques el archivo.

## Página principal (`index.html`)
- `hero.jpg` — imagen principal/portada: **1200 × 900 px (4:3)**.
- `colegio.jpg` — tarjeta del colegio: **1200 × 900 px (4:3)**.
- `estudiantes.jpg` — tarjeta de estudiantes: **1600 × 900 px (16:9)**.
- `docentes.jpg` — tarjeta de docentes: **1600 × 900 px (16:9)**.
- `comunidad.jpg` — tarjeta de comunidad educativa: **1600 × 900 px (16:9)**.
- `noticia-1.jpg` — imagen de la noticia Feria de la Ciencia: **1600 × 1000 px (16:10)**.
- `noticia-2.jpg` — imagen del lanzamiento de Conecta Pana: **1600 × 1000 px (16:10)**.
- `noticia-3.jpg` — imagen de la Asamblea de Acudientes: **1600 × 1000 px (16:10)**.
- `historia.jpg` — fotografía histórica: **1600 × 1000 px (16:10)**.
- `sede-central.jpg` — tarjeta de sede central: **1200 × 900 px (4:3)**.
- `sede-puente-boyaca.jpg` — tarjeta de sede Puente de Boyacá: **1200 × 900 px (4:3)**.
- `sede-bolivariana.jpg` — tarjeta de sede Bolivariana: **1200 × 900 px (4:3)**.
- `sede-palo-blanco.jpg` — tarjeta de sede Palo Blanco: **1200 × 900 px (4:3)**.
- `contacto.jpg` — imagen de la sección de contacto: **1600 × 900 px (16:9)**.

## Página de estudiantes (`estdudiantes.html`)
- `estudiantes-hero.jpg` — fotografía de la portada estudiantil: **1200 × 900 px (4:3)**. Esta sección ya está conectada para mostrar la imagen y presenta un recuadro informativo si el archivo no carga.

## Página de comunidad (`comunidad.html`)
- `comunidad-portada.jpg` — imagen de presentación de la comunidad: **1600 × 1200 px (4:3)**.

## Consejos
1. Las medidas son recomendaciones para conservar nitidez; el diseño adapta las imágenes a la tarjeta mediante `object-fit: cover`, así que puede recortar un poco los bordes.
2. Deja los elementos importantes (personas, logo o letreros) cerca del centro de la fotografía.
3. Para sustituir una foto sin editar código, guarda la nueva imagen con el mismo nombre y reemplaza el archivo anterior.
4. Los archivos de noticias y sedes ya tienen sus rutas preparadas en `index.html`, pero debes agregar las imágenes que aún no están en `img/`.
