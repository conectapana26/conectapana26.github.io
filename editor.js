import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';

// Pega aquí la configuración web de Firebase (Configuración del proyecto > Tus apps > SDK).
const firebaseConfig = {
  apiKey: 'AIzaSyB4wXOr7r7phdZ5TVh-AVq7xGr_0mYdYQc',
  authDomain: 'conectapana-19383.firebaseapp.com',
  projectId: 'conectapana-19383',
  messagingSenderId: '1027814339341',
  appId: '1:1027814339341:web:f13b8008d6ce55eed83644',
  measurementId: 'G-3BDQLBFK4S'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const $ = id => document.getElementById(id);
const list = $('publication-list');
const formPanel = $('edit-panel');
const form = $('publication-form');
const status = $('status');
let posts = [];
const categoryNames = { noticias: 'Noticias', eventos: 'Eventos', actividades: 'Actividades', comunicados: 'Comunicados' };
const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
function say(message, error=false) { status.textContent=message; status.className='status text-sm font-semibold mt-3 '+(error?'text-red-600':'text-brand-green'); }
function normalize(id, data) {
  const category = categoryNames[data.category] ? data.category : 'noticias';
  const content = String(data.content ?? data.contenido ?? data.summary ?? '');
  return { id, category, label:String(data.label || categoryNames[category]), date:String(data.date ?? data.fecha ?? ''), title:String(data.title ?? data.titulo ?? ''), summary:String(data.summary ?? data.contenido ?? content), content, image:String(data.image ?? data.imagen ?? '') };
}
async function loadPosts() {
  say('Cargando publicaciones desde Firebase…');
  try {
    const snapshot = await getDocs(collection(db,'noticias'));
    posts = snapshot.docs.map(item=>normalize(item.id,item.data()));
    posts.sort((a,b)=>String(b.date).localeCompare(String(a.date)));
    renderList(); say(`Conectado a Firebase: ${posts.length} publicación(es).`);
  } catch (error) {
    console.error(error); say('No se pudieron cargar las noticias. Revisa la configuración de Firebase y las reglas de Firestore.',true);
  }
}
function renderList() {
  if (!posts.length) { list.innerHTML='<div class="md:col-span-2 p-8 rounded-2xl border-2 border-dashed border-slate-300 text-center text-slate-500">Todavía no hay noticias. Pulsa «Nueva publicación» para crear la primera.</div>'; return; }
  list.innerHTML=posts.map((p,i)=>`<article class="rounded-2xl border-2 border-slate-200 p-4 flex flex-col gap-3"><div class="flex items-start justify-between gap-3"><div class="min-w-0"><span class="inline-block rounded-lg px-2.5 py-1 bg-blue-50 text-brand-blue text-[11px] font-extrabold mb-2">${esc(categoryNames[p.category]||'Noticias')} · ${esc(p.label)}</span><h3 class="font-fredoka text-lg font-bold break-words">${esc(p.title||'Sin título')}</h3><p class="text-xs text-slate-500 mt-1">${esc(p.date||'Sin fecha')}</p></div><span class="shrink-0 rounded-full bg-slate-100 text-slate-500 text-xs font-bold w-8 h-8 flex items-center justify-center">${i+1}</span></div><p class="text-sm text-slate-600 leading-5">${esc(p.summary)}</p><p class="text-xs text-slate-400 truncate"><i class="fa-regular fa-image mr-1"></i>${esc(p.image||'Sin imagen')}</p><div class="flex flex-wrap gap-2 mt-auto pt-2"><button type="button" data-edit="${esc(p.id)}" class="px-3 py-2 rounded-lg bg-brand-lightsky text-brand-blue text-xs font-extrabold">Editar</button><button type="button" data-delete="${esc(p.id)}" class="px-3 py-2 rounded-lg bg-red-50 text-red-700 text-xs font-extrabold">Eliminar</button></div></article>`).join('');
  list.querySelectorAll('[data-edit]').forEach(btn=>btn.addEventListener('click',()=>editPost(btn.dataset.edit)));
  list.querySelectorAll('[data-delete]').forEach(btn=>btn.addEventListener('click',()=>deletePost(btn.dataset.delete)));
}
function editPost(id) { const p=posts.find(x=>x.id===id); if(!p)return; $('form-kicker').textContent='Editar publicación'; $('form-title').textContent='Modificar contenido'; $('post-id').value=p.id; $('post-title').value=p.title; $('post-category').value=p.category; $('post-label').value=p.label; $('post-date').value=p.date; $('post-summary').value=p.summary; $('post-content').value=p.content; $('post-image').value=p.image; updateImagePreview(); formPanel.classList.remove('hidden'); formPanel.scrollIntoView({behavior:'smooth',block:'start'}); }
function newPost() { form.reset(); $('image-preview').removeAttribute('src'); $('image-preview').classList.add('hidden'); $('image-preview-error').classList.add('hidden'); $('post-id').value=''; $('form-kicker').textContent='Nueva publicación'; $('form-title').textContent='Crear contenido'; $('post-category').value='noticias'; formPanel.classList.remove('hidden'); formPanel.scrollIntoView({behavior:'smooth',block:'start'}); $('post-title').focus(); }
function closeForm() { formPanel.classList.add('hidden'); form.reset(); $('image-preview').removeAttribute('src'); $('image-preview').classList.add('hidden'); $('image-preview-error').classList.add('hidden'); }
async function deletePost(id) { const p=posts.find(x=>x.id===id); if(!p||!confirm(`¿Seguro que quieres eliminar «${p.title}» de Firebase?`))return; try { await deleteDoc(doc(db,'noticias',id)); posts=posts.filter(x=>x.id!==id); renderList(); say('Publicación eliminada de Firebase.'); } catch(e) { console.error(e); say('No se pudo eliminar. Verifica tus permisos de Firebase.',true); } }
function updateImagePreview() {
  const url = $('post-image').value.trim();
  const preview = $('image-preview');
  const error = $('image-preview-error');
  error.classList.add('hidden');
  if (!url) { preview.removeAttribute('src'); preview.classList.add('hidden'); return; }
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('URL no permitida');
    preview.onload = () => { preview.classList.remove('hidden'); error.classList.add('hidden'); };
    preview.onerror = () => { preview.classList.add('hidden'); error.classList.remove('hidden'); };
    preview.src = parsed.href;
  } catch (_) {
    preview.removeAttribute('src'); preview.classList.add('hidden');
    error.textContent = 'Escribe una URL válida que comience por https://';
    error.classList.remove('hidden');
  }
}
$('post-image').addEventListener('input', updateImagePreview);
$('image-preview').addEventListener('error', () => { $('image-preview').classList.add('hidden'); $('image-preview-error').classList.remove('hidden'); });

form.addEventListener('submit',async event=>{
  event.preventDefault(); const title=$('post-title').value.trim(), summary=$('post-summary').value.trim(), content=$('post-content').value.trim();
  if(!title||!summary||!content){say('Completa el título, el resumen y el contenido completo.',true);return;}
  const category=$('post-category').value;
  const save=$('save-btn'); save.disabled=true; save.textContent='Guardando…';
  try {
  const imageUrl = $('post-image').value.trim();
  if (imageUrl) { const parsed = new URL(imageUrl); if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('El enlace de la imagen debe comenzar por https://'); }
  const payload={title,titulo:title,category,label:$('post-label').value.trim()||categoryNames[category],date:$('post-date').value.trim(),fecha:$('post-date').value.trim(),summary,content,contenido:content,image:imageUrl,imagen:imageUrl,actualizado:serverTimestamp()};
  const id=$('post-id').value;
  if(id) await updateDoc(doc(db,'noticias',id),payload); else await addDoc(collection(db,'noticias'),{...payload,creado:serverTimestamp()}); closeForm(); await loadPosts(); say('¡Publicación guardada directamente en Firebase!'); }
  catch(e){console.error(e);say(`No se pudo guardar (${e.code || e.message || 'error desconocido'}). Revisa el enlace de imagen y los permisos de Firestore.`,true);}
  finally {save.disabled=false;save.innerHTML='<i class="fa-solid fa-floppy-disk mr-2"></i>Guardar publicación';}
});
$('add-btn').addEventListener('click',newPost); $('cancel-btn').addEventListener('click',closeForm); $('cancel-bottom-btn').addEventListener('click',closeForm);
$('login-form').addEventListener('submit',async e=>{e.preventDefault();const button=$('login-btn');button.disabled=true;try{await signInWithEmailAndPassword(auth,$('login-email').value.trim(),$('login-password').value);$('login-error').textContent='';}catch(err){console.error(err);const messages={'auth/api-key-not-valid.-please-pass-a-valid-api-key':'Firebase rechaza la clave API usada por esta página. Comprueba que editor.js tenga la configuración exacta de la app web.','auth/invalid-credential':'El correo o la contraseña no coinciden con el usuario de Firebase.','auth/operation-not-allowed':'El método Email/contraseña no está habilitado.','auth/unauthorized-domain':'Este dominio no está autorizado en Firebase Authentication.','auth/network-request-failed':'No se pudo conectar con Firebase. Comprueba la conexión.'};$('login-error').textContent=messages[err.code] || `No se pudo iniciar sesión (${err.code || err.message || 'error desconocido'}).`;}finally{button.disabled=false;}});
$('logout-btn').addEventListener('click',()=>signOut(auth));
onAuthStateChanged(auth,user=>{ $('login-panel').classList.toggle('hidden',!!user); $('editor-area').classList.toggle('hidden',!user); $('user-status').textContent=user?`Sesión iniciada: ${user.email}`:''; if(user)loadPosts(); else {posts=[];list.innerHTML='';closeForm();} });
