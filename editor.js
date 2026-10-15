/* Editor local de Conecta Pana: no usa Firebase ni autenticación.
   Los cambios se publican reemplazando noticias.json y contenido-sitio.json en GitHub. */
(() => {
  const $ = id => document.getElementById(id);
  const list = $('publication-list');
  const formPanel = $('edit-panel');
  const form = $('publication-form');
  const status = $('status');
  if (!list || !form || !formPanel) return;
  let posts = [];
  const names = {noticias:'Noticias', eventos:'Eventos', actividades:'Actividades', comunicados:'Comunicados'};
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  function say(message, error=false) { status.textContent=message; status.className='status text-sm font-semibold mt-3 '+(error?'text-red-600':'text-brand-green'); }
  function download(name, data) {
    const blob = new Blob([JSON.stringify(data, null, 2) + '\n'], {type:'application/json;charset=utf-8'});
    const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=name; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  }
  async function loadPosts() {
    try {
      const response = await fetch('noticias.json', {cache:'no-store'});
      if (!response.ok) throw new Error('No se pudo leer noticias.json');
      const data = await response.json(); posts = Array.isArray(data) ? data : (data.publicaciones || []);
      posts = posts.map((p,i)=>({id:String(p.id || `publicacion-${i+1}`),category:names[p.category]?p.category:'noticias',label:String(p.label||names[p.category]||'Noticias'),date:String(p.date||p.fecha||''),title:String(p.title||p.titulo||''),summary:String(p.summary||p.contenido||p.content||''),content:String(p.content||p.contenido||p.summary||''),image:String(p.image||p.imagen||'')}));
      renderList(); say(`Se cargaron ${posts.length} publicación(es) desde noticias.json. Recuerda descargar el archivo después de editar.`);
    } catch(e) { console.error(e); posts=[]; renderList(); say('No se pudo cargar noticias.json. Abre el editor desde la página publicada en GitHub Pages.',true); }
  }
  function renderList() {
    if (!posts.length) { list.innerHTML='<div class="md:col-span-2 p-8 rounded-2xl border-2 border-dashed border-slate-300 text-center text-slate-500">Todavía no hay publicaciones. Pulsa «Nueva publicación» para crear la primera.</div>'; return; }
    list.innerHTML=posts.map((p,i)=>`<article class="rounded-2xl border-2 border-slate-200 p-4 flex flex-col gap-3"><div class="flex items-start justify-between gap-3"><div class="min-w-0"><span class="inline-block rounded-lg px-2.5 py-1 bg-blue-50 text-brand-blue text-[11px] font-extrabold mb-2">${esc(names[p.category]||'Noticias')} · ${esc(p.label)}</span><h3 class="font-fredoka text-lg font-bold break-words">${esc(p.title||'Sin título')}</h3><p class="text-xs text-slate-500 mt-1">${esc(p.date||'Sin fecha')}</p></div><span class="shrink-0 rounded-full bg-slate-100 text-slate-500 text-xs font-bold w-8 h-8 flex items-center justify-center">${i+1}</span></div><p class="text-sm text-slate-600 leading-5">${esc(p.summary)}</p><p class="text-xs text-slate-400 truncate">${esc(p.image||'Sin imagen')}</p><div class="flex flex-wrap gap-2 mt-auto pt-2"><button type="button" data-edit="${esc(p.id)}" class="px-3 py-2 rounded-lg bg-brand-lightsky text-brand-blue text-xs font-extrabold">Editar</button><button type="button" data-delete="${esc(p.id)}" class="px-3 py-2 rounded-lg bg-red-50 text-red-700 text-xs font-extrabold">Eliminar</button></div></article>`).join('');
    list.querySelectorAll('[data-edit]').forEach(b=>b.addEventListener('click',()=>editPost(b.dataset.edit)));
    list.querySelectorAll('[data-delete]').forEach(b=>b.addEventListener('click',()=>{const p=posts.find(x=>x.id===b.dataset.delete); if(p&&confirm(`¿Eliminar «${p.title}»?`)){posts=posts.filter(x=>x.id!==p.id);renderList();say('Publicación eliminada del borrador. Descarga noticias.json para publicar el cambio.');}}));
  }
  function updatePreview() {
    const url=$('post-image').value.trim(), preview=$('image-preview'), error=$('image-preview-error'); error.classList.add('hidden');
    if(!url){preview.removeAttribute('src');preview.classList.add('hidden');return;}
    try { const u=new URL(url); if(!['http:','https:'].includes(u.protocol)) throw Error(); preview.onload=()=>{preview.classList.remove('hidden');error.classList.add('hidden');}; preview.onerror=()=>{preview.classList.add('hidden');error.classList.remove('hidden');}; preview.src=u.href; }
    catch(_){preview.removeAttribute('src');preview.classList.add('hidden');error.textContent='Escribe una URL pública válida que comience por https://';error.classList.remove('hidden');}
  }
  function editPost(id){const p=posts.find(x=>x.id===id);if(!p)return;$('form-kicker').textContent='Editar publicación';$('form-title').textContent='Modificar contenido';$('post-id').value=p.id;$('post-title').value=p.title;$('post-category').value=p.category;$('post-label').value=p.label;$('post-date').value=p.date;$('post-summary').value=p.summary;$('post-content').value=p.content;$('post-image').value=p.image;updatePreview();formPanel.classList.remove('hidden');formPanel.scrollIntoView({behavior:'smooth',block:'start'});}
  function newPost(){form.reset();$('image-preview').removeAttribute('src');$('image-preview').classList.add('hidden');$('image-preview-error').classList.add('hidden');$('post-id').value='';$('form-kicker').textContent='Nueva publicación';$('form-title').textContent='Crear contenido';$('post-category').value='noticias';formPanel.classList.remove('hidden');formPanel.scrollIntoView({behavior:'smooth',block:'start'});$('post-title').focus();}
  function closeForm(){formPanel.classList.add('hidden');form.reset();$('image-preview').removeAttribute('src');$('image-preview').classList.add('hidden');$('image-preview-error').classList.add('hidden');}
  $('post-image').addEventListener('input',updatePreview); $('add-btn').addEventListener('click',newPost); $('cancel-btn').addEventListener('click',closeForm); $('cancel-bottom-btn').addEventListener('click',closeForm);
  form.addEventListener('submit',e=>{e.preventDefault();const title=$('post-title').value.trim(),summary=$('post-summary').value.trim(),content=$('post-content').value.trim();if(!title||!summary||!content){say('Completa el título, el resumen y el contenido completo.',true);return;}const image=$('post-image').value.trim();if(image){try{const u=new URL(image);if(!['http:','https:'].includes(u.protocol))throw Error();}catch(_){say('El enlace de imagen debe ser una URL pública que comience por https://',true);return;}}
    const id=$('post-id').value || `${title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}-${Date.now().toString().slice(-5)}`;
    const p={id,category:$('post-category').value,label:$('post-label').value.trim()||names[$('post-category').value],date:$('post-date').value.trim(),title,summary,content,image};const index=posts.findIndex(x=>x.id===id);if(index>=0)posts[index]=p;else posts.unshift(p);posts.sort((a,b)=>String(b.date).localeCompare(String(a.date)));renderList();closeForm();say('Borrador guardado en esta pantalla. Pulsa «Descargar noticias.json» y reemplaza el archivo del repositorio para publicarlo.');});
  $('download-news').addEventListener('click',()=>{download('noticias.json',{publicaciones:posts});say('Se descargó noticias.json. Súbelo a la raíz del repositorio, reemplazando el archivo existente, para publicar los cambios.');});
  $('reload-news').addEventListener('click',()=>{if(confirm('¿Descartar los cambios que aún no descargaste y volver a cargar noticias.json?'))loadPosts();});
  loadPosts();
})();
