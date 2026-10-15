import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import { getFirestore, collection, getDocs, setDoc, deleteDoc, doc, getDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
import firebaseConfig from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const $ = id => document.getElementById(id);
const names = { noticias: 'Noticias', eventos: 'Eventos', actividades: 'Actividades', comunicados: 'Comunicados' };
let posts = [];
let settings = { boletines: 'Por confirmar', escuelaPadres: 'Por confirmar', reunionPadres: 'Por publicar' };

const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
function setStatus(id, text, isError = false) {
  const element = $(id);
  if (!element) return;
  element.textContent = text;
  element.className = 'text-sm mt-3 ' + (isError ? 'text-red-600' : 'text-emerald-700');
}
function normalize(post, index) {
  return {
    id: String(post.id || post.docId || `post-${index}`),
    category: names[post.category] ? post.category : 'noticias',
    label: String(post.label || names[post.category] || 'Noticias'),
    date: String(post.date || ''),
    title: String(post.title || ''),
    summary: String(post.summary || ''),
    content: String(post.content || post.summary || ''),
    image: String(post.image || post.imagen || '')
  };
}
function renderPosts() {
  const list = $('publication-list');
  if (!posts.length) {
    list.innerHTML = '<div class="md:col-span-2 p-8 text-center text-slate-500">Todavía no hay publicaciones. Pulsa «Nueva publicación».</div>';
    return;
  }
  list.innerHTML = posts.map(post => `<article class="rounded-2xl border-2 border-slate-200 p-4 flex flex-col gap-3"><div><span class="inline-block rounded-lg px-2.5 py-1 bg-blue-50 text-brand-blue text-[11px] font-extrabold mb-2">${esc(names[post.category])} · ${esc(post.label)}</span><h3 class="font-fredoka text-lg font-bold">${esc(post.title)}</h3><p class="text-xs text-slate-500 mt-1">${esc(post.date)}</p></div><p class="text-sm text-slate-600">${esc(post.summary)}</p><div class="flex gap-2 mt-auto"><button type="button" data-edit="${esc(post.id)}" class="px-3 py-2 rounded-lg bg-brand-lightsky text-brand-blue text-xs font-extrabold">Editar</button><button type="button" data-delete="${esc(post.id)}" class="px-3 py-2 rounded-lg bg-red-50 text-red-700 text-xs font-extrabold">Eliminar</button></div></article>`).join('');
  list.querySelectorAll('[data-edit]').forEach(button => button.addEventListener('click', () => editPost(button.dataset.edit)));
  list.querySelectorAll('[data-delete]').forEach(button => button.addEventListener('click', () => removePost(button.dataset.delete)));
}
function editPost(id) {
  const post = posts.find(item => item.id === id);
  if (!post) return;
  $('post-id').value = post.id;
  $('post-title').value = post.title;
  $('post-category').value = post.category;
  $('post-label').value = post.label;
  $('post-date').value = post.date;
  $('post-summary').value = post.summary;
  $('post-content').value = post.content;
  $('post-image').value = post.image;
  $('form-kicker').textContent = 'Editar publicación';
  $('form-title').textContent = 'Modificar contenido';
  $('edit-panel').classList.remove('hidden');
  showImagePreview(post.image);
  $('edit-panel').scrollIntoView({ behavior: 'smooth' });
}
function resetPostForm() {
  $('publication-form').reset();
  $('post-id').value = '';
  $('post-category').value = 'noticias';
  $('edit-panel').classList.add('hidden');
  $('image-preview').classList.add('hidden');
  $('image-preview-error').classList.add('hidden');
}
function showImagePreview(url) {
  const preview = $('image-preview');
  const error = $('image-preview-error');
  preview.classList.add('hidden');
  error.classList.add('hidden');
  if (!url) return;
  preview.onload = () => { preview.classList.remove('hidden'); error.classList.add('hidden'); };
  preview.onerror = () => { preview.classList.add('hidden'); error.classList.remove('hidden'); };
  preview.src = url;
}
$('add-btn').addEventListener('click', () => {
  resetPostForm();
  $('form-kicker').textContent = 'Nueva publicación';
  $('form-title').textContent = 'Crear contenido';
  $('edit-panel').classList.remove('hidden');
  $('edit-panel').scrollIntoView({ behavior: 'smooth' });
});
$('cancel-btn').addEventListener('click', resetPostForm);
$('cancel-bottom-btn').addEventListener('click', resetPostForm);
$('post-image').addEventListener('input', () => showImagePreview($('post-image').value.trim()));

$('publication-form').addEventListener('submit', async event => {
  event.preventDefault();
  const id = $('post-id').value || `post-${Date.now()}`;
  const post = {
    id,
    category: $('post-category').value,
    label: $('post-label').value.trim() || names[$('post-category').value],
    date: $('post-date').value.trim(),
    title: $('post-title').value.trim(),
    summary: $('post-summary').value.trim(),
    content: $('post-content').value.trim(),
    image: $('post-image').value.trim(),
    updatedAt: serverTimestamp()
  };
  const button = $('save-btn');
  button.disabled = true;
  try {
    await setDoc(doc(db, 'posts', id), post);
    await loadPosts();
    resetPostForm();
    setStatus('status', 'Publicación guardada. La página principal mostrará el cambio.');
  } catch (error) {
    console.error(error);
    setStatus('status', `No se pudo guardar la publicación: ${error.code || error.message}`, true);
  } finally {
    button.disabled = false;
  }
});

async function removePost(id) {
  const post = posts.find(item => item.id === id);
  if (!post || !confirm(`¿Eliminar «${post.title}»?`)) return;
  try {
    await deleteDoc(doc(db, 'posts', id));
    await loadPosts();
    setStatus('status', 'Publicación eliminada.');
  } catch (error) {
    console.error(error);
    setStatus('status', `No se pudo eliminar: ${error.code || error.message}`, true);
  }
}

async function loadPosts() {
  try {
    const snapshot = await getDocs(collection(db, 'posts'));
    posts = snapshot.docs.map((document, index) => normalize({ ...document.data(), id: document.id }, index));
    if (!posts.length) {
      const response = await fetch('noticias.json', { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        const starterPosts = (Array.isArray(data) ? data : (data.publicaciones || [])).map(normalize);
        for (const post of starterPosts) {
          await setDoc(doc(db, 'posts', post.id), { ...post, updatedAt: serverTimestamp() });
        }
        posts = starterPosts;
      }
    }
    posts.sort((a, b) => b.date.localeCompare(a.date, 'es'));
    renderPosts();
    setStatus('status', `Publicaciones cargadas: ${posts.length}.`);
  } catch (error) {
    console.error(error);
    setStatus('status', `No se pudieron cargar las publicaciones: ${error.code || error.message}. Revisa la conexión con Firestore y sus reglas.`, true);
  }
}
$('reload-news').addEventListener('click', loadPosts);

function readDateSettings() {
  return {
    boletines: $('setting-boletines').value.trim(),
    escuelaPadres: $('setting-escuelaPadres').value.trim(),
    reunionPadres: $('setting-reunionPadres').value.trim(),
    updatedAt: serverTimestamp()
  };
}
async function loadSettings() {
  try {
    const snapshot = await getDoc(doc(db, 'siteContent', 'main'));
    if (snapshot.exists()) {
      const saved = snapshot.data();
      settings = {
        boletines: typeof saved.boletines === 'string' ? saved.boletines : settings.boletines,
        escuelaPadres: typeof saved.escuelaPadres === 'string' ? saved.escuelaPadres : settings.escuelaPadres,
        reunionPadres: typeof saved.reunionPadres === 'string' ? saved.reunionPadres : settings.reunionPadres
      };
    } else {
      const response = await fetch('contenido-sitio.json', { cache: 'no-store' });
      if (response.ok) settings = { ...settings, ...await response.json() };
    }
    for (const key of ['boletines', 'escuelaPadres', 'reunionPadres']) $(`setting-${key}`).value = settings[key] || '';
    setStatus('settings-status', 'Fechas cargadas. Puedes modificarlas y guardar.');
  } catch (error) {
    console.error(error);
    for (const key of ['boletines', 'escuelaPadres', 'reunionPadres']) $(`setting-${key}`).value = settings[key] || '';
    setStatus('settings-status', `No se pudieron cargar las fechas desde Firestore: ${error.code || error.message}`, true);
  }
}
$('save-settings').addEventListener('click', async () => {
  const button = $('save-settings');
  button.disabled = true;
  try {
    const dates = readDateSettings();
    await setDoc(doc(db, 'siteContent', 'main'), dates);
    settings = { boletines: dates.boletines, escuelaPadres: dates.escuelaPadres, reunionPadres: dates.reunionPadres };
    setStatus('settings-status', 'Fechas guardadas. La página Comunidad mostrará los cambios.');
  } catch (error) {
    console.error(error);
    setStatus('settings-status', `No se pudieron guardar las fechas: ${error.code || error.message}`, true);
  } finally {
    button.disabled = false;
  }
});
$('site-settings-form').addEventListener('submit', event => event.preventDefault());
$('reset-settings').addEventListener('click', loadSettings);

loadPosts();
loadSettings();
