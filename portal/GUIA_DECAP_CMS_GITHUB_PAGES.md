# Conecta Pana: editor privado en la nube con Decap CMS + GitHub Pages

## Qué consigue esta configuración
- El editor está en `/admin/` y no aparece en el menú de la página pública.
- El docente administra publicaciones con campos visuales: título, categoría, etiqueta, fecha, resumen, contenido e imagen.
- Al guardar/publicar, Decap crea un commit en el repositorio de GitHub; GitHub Pages vuelve a servir los archivos actualizados. Puede tardar unos minutos.
- Las noticias siguen almacenadas en `noticias.json`, que consume la página principal. La ventana «Leer más» usa el contenido completo.

## Importante: qué significa iniciar sesión
Con GitHub Pages y el backend `github`, Decap CMS autentica mediante GitHub. El docente usa su propia cuenta de GitHub (su correo y contraseña de GitHub), no una contraseña inventada para Conecta Pana. El propietario del repositorio debe invitar esa cuenta como colaboradora con permiso **Write**. No compartas la contraseña del propietario.

Si el docente no quiere usar una cuenta de GitHub y necesita un usuario/contraseña independiente del sitio, esta combinación no ofrece eso por sí sola: habría que cambiar la arquitectura/proveedor de alojamiento y autenticación.

## Paso 1. Identificar el repositorio de GitHub
1. La dirección compartida es `https://conectapana26.github.io/`, que normalmente corresponde al repositorio `conectapana26/conectapana26.github.io`. La configuración ya está rellenada con ese nombre.
2. En GitHub, confirma que el repositorio se llame exactamente `conectapana26.github.io` y que la rama de publicación sea `main`. Si el repositorio tiene otro nombre o publica desde otra rama, ajusta `repo` o `branch` en `admin/config.yml`.
3. `site_url` y `display_url` ya están configurados como `https://conectapana26.github.io`.

## Paso 2. Dar acceso solo al docente
En GitHub, abre **Settings → Collaborators** (o la sección de acceso de la organización) e invita la cuenta de GitHub del docente con permiso **Write**. Solo invita a personas autorizadas; este permiso permite cambiar archivos del sitio. El docente debe aceptar la invitación.

## Paso 3. Crear el servicio de autenticación OAuth gratuito en la nube
GitHub requiere un servidor/proxy OAuth para que Decap pueda iniciar sesión. No se guarda un servidor físico; se puede usar un Cloudflare Worker.

1. Crea una cuenta en Cloudflare y abre Workers & Pages.
2. Usa como base la plantilla comunitaria: https://github.com/ottmartens/decap-cms-github-oauth-provider-cloudflare
3. Sigue el README de esa plantilla para desplegar el Worker y configurar sus secretos `CLIENT_ID` y `CLIENT_SECRET`. Nunca pegues esos secretos en `admin/config.yml`, HTML, mensajes o repositorios.
4. Registra la aplicación de GitHub siguiendo las instrucciones de la plantilla. La URL de callback debe coincidir exactamente con la que el Worker espera, normalmente `https://TU-WORKER.workers.dev/callback`. Usa la URL real que indique el Worker/README.
5. Cuando el Worker esté publicado, copia su URL base (por ejemplo, `https://nombre-del-worker.usuario.workers.dev`) en `base_url` de `admin/config.yml`, sin añadir `/auth`. La configuración ya usa `auth_endpoint: auth`.
6. Despliega el Worker y confirma que el endpoint de autenticación responde antes de probar Decap.

Documentación oficial: https://decapcms.org/docs/github-backend/ y https://decapcms.org/docs/backends-overview/

## Paso 4. Subir los archivos del proyecto a GitHub
1. Añade la carpeta `admin/` con `index.html` y `config.yml`, el archivo `GUIA_DECAP_CMS_GITHUB_PAGES.md` y el `noticias.json` actualizado.
2. Sube también los cambios de `app.js` y `editor.js` incluidos en este paquete. `noticias.json` ahora tiene la forma `{ "publicaciones": [ ... ] }` para que Decap pueda editar la lista.
3. Espera a que GitHub Pages publique los cambios.

## Paso 5. Publicar noticias
1. Abre `https://conectapana26.github.io/admin/`.
2. Pulsa iniciar sesión con GitHub y autoriza la aplicación.
3. En «Noticias y novedades», abre «Publicaciones de la página principal».
4. Añade, modifica, ordena o elimina publicaciones. Sube imágenes desde el campo Imagen.
5. Guarda/publica. En modo `simple`, los cambios se guardan directamente en la rama configurada; luego GitHub Pages actualiza el sitio.
6. Abre la página principal y comprueba la tarjeta y el botón «Leer más».

## Seguridad
- `/admin/` no aparece en el menú, pero eso no es lo que lo protege: la autenticación de GitHub y los permisos del repositorio son la barrera de acceso.
- `noindex` solo pide a los buscadores que no indexen el editor; no es seguridad.
- Nunca pongas contraseñas, tokens, Client Secrets ni claves privadas en archivos del sitio. Los secretos del OAuth van en la configuración segura del Worker.
- GitHub Pages publica el sitio como estático. Los commits se despliegan automáticamente si Pages está configurado para publicar desde la rama correcta.

## Comprobación previa a producción
Esta carpeta incluye los archivos CMS preparados, pero la autenticación todavía no funcionará hasta que se reemplacen los marcadores de posición, se despliegue el Worker y se otorgue acceso a la cuenta del docente.
