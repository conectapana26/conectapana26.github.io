(function () {
  const $ = id => document.getElementById(id);
  const list = $('publication-list');
  const formPanel = $('edit-panel');
  const form = $('publication-form');
  const status = $('status');
  let posts = [];
  const categoryNames = { noticias: 'Noticias', eventos: 'Eventos', actividades: 'Actividades', comunicados: 'Comunicados' };
  const starterPosts = [
    {id:'feria-ciencia-2026',category:'eventos',label:'Evento',date:'18 de octubre de 2026',title:'Feria de la Ciencia y Tecnología 2026',summary:'Los estudiantes presentarán sus proyectos tecnológicos, ambientales y experimentos innovadores en la sede principal.',content:'La Feria de la Ciencia y Tecnología reunirá los mejores experimentos e iniciativas ambientales desarrollados por los estudiantes de la I.E. Panamericano Puente de Boyacá.\n\nPróximamente se publicarán más detalles sobre la programación y la participación de cada curso.',image:'img/noticia-1.jpg'},
    {id:'lanzamiento-conecta-pana',category:'noticias',label:'Institucional',date:'12 de octubre de 2026',title:'Lanzamiento del Portal Conecta Pana',summary:'Inauguramos nuestra plataforma web para mantener a todos los miembros del colegio en estrecha comunicación.',content:'Conecta Pana nace como una plataforma web para estrechar vínculos entre docentes, familias y estudiantes de la I.E. Panamericano Puente de Boyacá.\n\nEste espacio reúne información institucional, noticias, actividades y recursos educativos para facilitar el acceso a contenidos de interés para la comunidad.',image:'img/noticia-2.jpg'},
    {id:'asamblea-acudientes',category:'comunicados',label:'Circular',date:'05 de octubre de 2026',title:'Convocatoria a Asamblea de Acudientes',summary:'Invitación a la jornada de diálogo sobre convivencia escolar y avance académico institucional.',content:'Se cita a los padres de familia y acudientes a participar en una jornada de diálogo sobre convivencia escolar y avances académicos de la institución.\n\nPara confirmar horarios, lugar y demás indicaciones, consulta los comunicados oficiales del colegio.',image:'img/noticia-3.jpg'}
  ];
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  function say(message, error=false) { status.textContent = message; status.className = 'status text-sm font-semibold mt-3 ' + (error ? 'text-red-600' : 'text-brand-green'); }
  function makeId() { return 'pub-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,7); }
  function normalize(data) {
    const entries = Array.isArray(data) ? data : data?.publicaciones;
    if (!Array.isArray(entries)) throw new Error('El JSON debe contener una lista de publicaciones dentro de «publicaciones».');
    return entries.map((p, i) => ({id:String(p.id || makeId()),category:categoryNames[p.category] ? p.category : 'noticias',label:String(p.label || categoryNames[p.category] || 'Noticia'),date:String(p.date || ''),title:String(p.title || `Publicación ${i+1}`),summary:String(p.summary || ''),content:String(p.content || p.summary || ''),image:String(p.image || '')}));
  }
  function renderList() {
    if (!posts.length) { list.innerHTML='<div class="md:col-span-2 p-8 rounded-2xl border-2 border-dashed border-slate-300 text-center text-slate-500">No hay publicaciones. Pulsa «Nueva publicación» para crear una.</div>'; return; }
    list.innerHTML = posts.map((p,i)=>`<article class="rounded-2xl border-2 border-slate-200 p-4 flex flex-col gap-3">
      <div class="flex items-start justify-between gap-3"><div class="min-w-0"><span class="inline-block rounded-lg px-2.5 py-1 bg-blue-50 text-brand-blue text-[11px] font-extrabold mb-2">${esc(categoryNames[p.category]||'Noticias')} · ${esc(p.label)}</span><h3 class="font-fredoka text-lg font-bold break-words">${esc(p.title)}</h3><p class="text-xs text-slate-500 mt-1">${esc(p.date || 'Sin fecha')}</p></div><span class="shrink-0 rounded-full bg-slate-100 text-slate-500 text-xs font-bold w-8 h-8 flex items-center justify-center">${i+1}</span></div>
      <p class="text-sm text-slate-600 leading-5">${esc(p.summary)}</p><p class="text-xs text-slate-400 truncate"><i class="fa-regular fa-image mr-1"></i>${esc(p.image || 'Sin imagen')}</p>
      <div class="flex flex-wrap gap-2 mt-auto pt-2"><button type="button" data-edit="${esc(p.id)}" class="edit-btn px-3 py-2 rounded-lg bg-brand-lightsky text-brand-blue text-xs font-extrabold hover:bg-blue-100"><i class="fa-solid fa-pen mr-1"></i>Editar</button><button type="button" data-delete="${esc(p.id)}" class="delete-btn px-3 py-2 rounded-lg bg-red-50 text-red-700 text-xs font-extrabold hover:bg-red-100"><i class="fa-solid fa-trash mr-1"></i>Eliminar</button></div>
    </article>`).join('');
    list.querySelectorAll('[data-edit]').forEach(btn=>btn.addEventListener('click',()=>editPost(btn.dataset.edit)));
    list.querySelectorAll('[data-delete]').forEach(btn=>btn.addEventListener('click',()=>deletePost(btn.dataset.delete)));
  }
  function editPost(id) {
    const p = posts.find(x=>x.id===id);
    if (!p) return;
    $('form-kicker').textContent='Editar publicación'; $('form-title').textContent='Modificar contenido';
    $('post-id').value=p.id; $('post-title').value=p.title; $('post-category').value=p.category; $('post-label').value=p.label; $('post-date').value=p.date; $('post-summary').value=p.summary; $('post-content').value=p.content; $('post-image').value=p.image;
    formPanel.classList.remove('hidden'); formPanel.scrollIntoView({behavior:'smooth',block:'start'});
  }
  function newPost() {
    form.reset(); $('post-id').value=''; $('form-kicker').textContent='Nueva publicación'; $('form-title').textContent='Crear contenido'; $('post-category').value='noticias';
    formPanel.classList.remove('hidden'); formPanel.scrollIntoView({behavior:'smooth',block:'start'}); $('post-title').focus();
  }
  function closeForm() { formPanel.classList.add('hidden'); form.reset(); }
  function deletePost(id) {
    const post=posts.find(p=>p.id===id); if(!post) return;
    if(!window.confirm(`¿Seguro que quieres eliminar «${post.title}»? Esta acción se incluirá en el archivo al exportar.`)) return;
    posts=posts.filter(p=>p.id!==id); renderList(); say('Publicación eliminada del borrador. Descarga el JSON para aplicar el cambio al sitio.');
  }
  form.addEventListener('submit', event=>{
    event.preventDefault();
    const title=$('post-title').value.trim(), summary=$('post-summary').value.trim(), content=$('post-content').value.trim();
    if(!title||!summary||!content) { say('Completa el título, el resumen y el contenido completo.',true); return; }
    const id=$('post-id').value || makeId();
    const old=posts.find(p=>p.id===id);
    const post={id,category:$('post-category').value,label:$('post-label').value.trim()||categoryNames[$('post-category').value],date:$('post-date').value.trim(),title,summary,content,image:$('post-image').value.trim()};
    if(old) posts=posts.map(p=>p.id===id?post:p); else posts.unshift(post);
    closeForm(); renderList(); say('Guardado en este editor. Descarga noticias.json para llevar los cambios a la página pública.');
  });
  $('add-btn').addEventListener('click',newPost); $('cancel-btn').addEventListener('click',closeForm); $('cancel-bottom-btn').addEventListener('click',closeForm);
  $('export-btn').addEventListener('click',()=>{
    const blob=new Blob([JSON.stringify({publicaciones:posts},null,2)],{type:'application/json;charset=utf-8'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='noticias.json'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); say('Archivo descargado. Reemplaza noticias.json en la carpeta del proyecto y publica los cambios.');
  });
  $('import-btn').addEventListener('click',()=>$('import-file').click());
  $('import-file').addEventListener('change',async event=>{
    const file=event.target.files?.[0]; if(!file) return;
    try { posts=normalize(JSON.parse(await file.text())); renderList(); say(`Se importaron ${posts.length} publicaciones desde ${file.name}.`); }
    catch(err){say('No se pudo importar el archivo: '+err.message,true);} finally {event.target.value='';}
  });
  async function start() {
    try { const res=await fetch('noticias.json',{cache:'no-store'}); if(!res.ok) throw new Error('fetch'); posts=normalize(await res.json()); say(`Listo: ${posts.length} publicaciones cargadas desde noticias.json.`); }
    catch { posts=starterPosts.map(p=>({...p})); say('Se cargaron publicaciones iniciales. Si ya tienes un noticias.json actualizado, pulsa «Importar JSON» para editar esa versión.'); }
    renderList();
  }
  start();
})();
