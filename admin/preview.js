/* Vista previa de noticias de Conecta Pana para Decap CMS.
   Muestra las publicaciones con imagen, título, fecha y resumen.
   La imagen seleccionada se previsualiza antes de guardar/publicar. */
(function () {
  var NewsPreview = createClass({
    render: function () {
      var entry = this.props.entry;
      var posts = entry.getIn(['data', 'publicaciones']);
      var getAsset = this.props.getAsset;
      var h = window.h || createElement;

      if (!posts || !posts.size) {
        return h('div', { style: { fontFamily: 'Arial', padding: '28px', color: '#1E56A0', background: '#f2f7fb' } },
          h('h1', null, 'Conecta Pana · Vista previa'),
          h('p', null, 'Añade una publicación para ver aquí la tarjeta de noticia.')
        );
      }

      return h('div', { style: { fontFamily: 'Arial, sans-serif', padding: '24px', background: '#f2f7fb', minHeight: '100vh' } },
        h('h1', { style: { color: '#1E56A0', textAlign: 'center' } }, 'Vista previa · Conecta Pana'),
        h('p', { style: { color: '#536477', textAlign: 'center' } }, 'Así se verán las publicaciones en la página principal.'),
        h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', maxWidth: '1100px', margin: '24px auto' } },
          posts.map(function (post, index) {
            var title = post.get('title') || 'Título de la noticia';
            var date = post.get('date') || '';
            var category = post.get('label') || post.get('category') || 'Noticia';
            var summary = post.get('summary') || 'Aquí aparecerá el resumen de la publicación.';
            var image = post.get('image');
            var imageUrl = '';
            if (image) {
              try { imageUrl = getAsset(image).toString(); } catch (e) { imageUrl = image.toString(); }
            }
            return h('article', { key: index, style: { background: '#fff', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 6px 18px rgba(30,86,160,.12)', border: '1px solid #e1eaf3' } },
              imageUrl
                ? h('img', { src: imageUrl, alt: title, style: { width: '100%', height: '190px', objectFit: 'cover', display: 'block' } })
                : h('div', { style: { height: '190px', background: '#e0f2fe', color: '#1E56A0', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px' } }, 'Selecciona o sube una imagen para verla aquí'),
              h('div', { style: { padding: '20px' } },
                h('span', { style: { display: 'inline-block', background: '#dcfce7', color: '#166534', borderRadius: '14px', padding: '5px 10px', fontSize: '12px', fontWeight: '700' } }, category),
                h('p', { style: { color: '#F97316', fontSize: '12px', margin: '12px 0 6px' } }, date),
                h('h2', { style: { color: '#1E56A0', fontSize: '21px', margin: '6px 0 10px', lineHeight: '1.25' } }, title),
                h('p', { style: { color: '#536477', lineHeight: '1.55', margin: '0 0 18px' } }, summary),
                h('span', { style: { display: 'inline-block', background: '#1E56A0', color: '#fff', borderRadius: '22px', padding: '10px 16px', fontWeight: '700', fontSize: '13px' } }, 'Leer más')
              )
            );
          }).toArray()
        )
      );
    }
  });
  CMS.registerPreviewTemplate('contenido-principal', NewsPreview);
})();
