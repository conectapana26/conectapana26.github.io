import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';

import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';

import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';

// ========================================
// CONFIGURACIÓN DE FIREBASE
// ========================================

const firebaseConfig = {
  apiKey: 'AIzaSyB4wXOr7r7phdZ5TVh-AVq7xGr_0mYdYQc',
  authDomain: 'conectapana-19383.firebaseapp.com',
  projectId: 'conectapana-19383',
  storageBucket: 'conectapana-19383.firebasestorage.app',
  messagingSenderId: '1027814339341',
  appId: '1:1027814339341:web:f13b8008d6ce55eed83644',
  measurementId: 'G-3BDQLBFK4S'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ========================================
// ELEMENTOS Y VARIABLES
// ========================================

const $ = id => document.getElementById(id);

const list = $('publication-list');
const formPanel = $('edit-panel');
const form = $('publication-form');
const status = $('status');

let posts = [];

const categoryNames = {
  noticias: 'Noticias',
  eventos: 'Eventos',
  actividades: 'Actividades',
  comunicados: 'Comunicados'
};

// ========================================
// FUNCIONES AUXILIARES
// ========================================

const esc = value =>
  String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[ch]));

function say(message, error = false) {
  if (!status) return;

  status.textContent = message;
  status.className =
    'status text-sm font-semibold mt-3 ' +
    (error ? 'text-red-600' : 'text-brand-green');
}

function normalize(id, data) {
  const category = categoryNames[data.category]
    ? data.category
    : 'noticias';

  const content = String(
    data.content ?? data.contenido ?? data.summary ?? ''
  );

  return {
    id,
    category,
    label: String(data.label || categoryNames[category]),
    date: String(data.date ?? data.fecha ?? ''),
    title: String(data.title ?? data.titulo ?? ''),
    summary: String(data.summary ?? data.contenido ?? content),
    content,
    image: String(data.image ?? data.imagen ?? '')
  };
}

// ========================================
// CARGAR PUBLICACIONES
// ========================================

async function loadPosts() {
  say('Cargando publicaciones desde Firebase…');

  try {
    const snapshot = await getDocs(collection(db, 'noticias'));

    posts = snapshot.docs.map(item =>
      normalize(item.id, item.data())
    );

    posts.sort((a, b) =>
      String(b.date).localeCompare(String(a.date))
    );

    renderList();

    say(`Conectado a Firebase: ${posts.length} publicación(es).`);
  } catch (error) {
    console.error('Error al cargar publicaciones:', error);

    say(
      `No se pudieron cargar las noticias: ${error.code || error.message}`,
      true
    );
  }
}

// ========================================
// MOSTRAR PUBLICACIONES
// ========================================

function renderList() {
  if (!list) return;

  if (!posts.length) {
    list.innerHTML = `
      <div class="md:col-span-2 p-8 rounded-2xl border-2
      border-dashed border-slate-300 text-center text-slate-500">
        Todavía no hay noticias. Pulsa «Nueva publicación»
        para crear la primera.
      </div>
    `;
    return;
  }

  list.innerHTML = posts.map((p, i) => `
    <article class="rounded-2xl border-2 border-slate-200
    p-4 flex flex-col gap-3">

      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">

          <span class="inline-block rounded-lg px-2.5 py-1
          bg-blue-50 text-brand-blue text-[11px] font-extrabold mb-2">
            ${esc(categoryNames[p.category] || 'Noticias')}
            · ${esc(p.label)}
          </span>

          <h3 class="font-fredoka text-lg font-bold break-words">
            ${esc(p.title || 'Sin título')}
          </h3>

          <p class="text-xs text-slate-500 mt-1">
            ${esc(p.date || 'Sin fecha')}
          </p>
        </div>

        <span class="shrink-0 rounded-full bg-slate-100
        text-slate-500 text-xs font-bold w-8 h-8
        flex items-center justify-center">
          ${i + 1}
        </span>
      </div>

      <p class="text-sm text-slate-600 leading-5">
        ${esc(p.summary)}
      </p>

      <p class="text-xs text-slate-400 truncate">
        <i class="fa-regular fa-image mr-1"></i>
        ${esc(p.image || 'Sin imagen')}
      </p>

      <div class="flex flex-wrap gap-2 mt-auto pt-2">
        <button type="button"
          data-edit="${esc(p.id)}"
          class="px-3 py-2 rounded-lg bg-brand-lightsky
          text-brand-blue text-xs font-extrabold">
          Editar
        </button>

        <button type="button"
          data-delete="${esc(p.id)}"
          class="px-3 py-2 rounded-lg bg-red-50
          text-red-700 text-xs font-extrabold">
          Eliminar
        </button>
      </div>
    </article>
  `).join('');

  list.querySelectorAll('[data-edit]').forEach(button => {
    button.addEventListener('click', () => {
      editPost(button.dataset.edit);
    });
  });

  list.querySelectorAll('[data-delete]').forEach(button => {
    button.addEventListener('click', () => {
      deletePost(button.dataset.delete);
    });
  });
}

// ========================================
// EDITAR PUBLICACIÓN
// ========================================

function editPost(id) {
  const p = posts.find(item => item.id === id);

  if (!p) return;

  $('form-kicker').textContent = 'Editar publicación';
  $('form-title').textContent = 'Modificar contenido';

  $('post-id').value = p.id;
  $('post-title').value = p.title;
  $('post-category').value = p.category;
  $('post-label').value = p.label;
  $('post-date').value = p.date;
  $('post-summary').value = p.summary;
  $('post-content').value = p.content;
  $('post-image').value = p.image;

  formPanel.classList.remove('hidden');

  formPanel.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}

// ========================================
// CREAR NUEVA PUBLICACIÓN
// ========================================

function newPost() {
  form.reset();

  $('post-id').value = '';
  $('form-kicker').textContent = 'Nueva publicación';
  $('form-title').textContent = 'Crear contenido';
  $('post-category').value = 'noticias';

  formPanel.classList.remove('hidden');

  formPanel.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });

  $('post-title').focus();
}

// ========================================
// CERRAR FORMULARIO
// ========================================

function closeForm() {
  formPanel.classList.add('hidden');
  form.reset();
}

// ========================================
// ELIMINAR PUBLICACIÓN
// ========================================

async function deletePost(id) {
  const p = posts.find(item => item.id === id);

  if (!p) return;

  if (!confirm(`¿Seguro que quieres eliminar «${p.title}» de Firebase?`)) {
    return;
  }

  try {
    await deleteDoc(doc(db, 'noticias', id));

    posts = posts.filter(item => item.id !== id);

    renderList();
    say('Publicación eliminada de Firebase.');
  } catch (error) {
    console.error('Error al eliminar:', error);

    say(
      `No se pudo eliminar: ${error.code || error.message}`,
      true
    );
  }
}

// ========================================
// GUARDAR PUBLICACIÓN
// ========================================

if (form) {
  form.addEventListener('submit', async event => {
    event.preventDefault();

    const title = $('post-title').value.trim();
    const summary = $('post-summary').value.trim();
    const content = $('post-content').value.trim();

    if (!title || !summary || !content) {
      say(
        'Completa el título, el resumen y el contenido completo.',
        true
      );
      return;
    }

    const category = $('post-category').value;
    const date = $('post-date').value.trim();

    const payload = {
      title,
      titulo: title,
      category,
      label: $('post-label').value.trim()
        || categoryNames[category],
      date,
      fecha: date,
      summary,
      content,
      contenido: content,
      image: $('post-image').value.trim(),
      imagen: $('post-image').value.trim(),
      actualizado: serverTimestamp()
    };

    const id = $('post-id').value;
    const saveButton = $('save-btn');

    saveButton.disabled = true;
    saveButton.textContent = 'Guardando…';

    try {
      if (id) {
        await updateDoc(doc(db, 'noticias', id), payload);
      } else {
        await addDoc(collection(db, 'noticias'), {
          ...payload,
          creado: serverTimestamp()
        });
      }

      closeForm();
      await loadPosts();

      say('¡Publicación guardada directamente en Firebase!');
    } catch (error) {
      console.error('Error al guardar:', error);

      say(
        `No se pudo guardar: ${error.code || error.message}`,
        true
      );
    } finally {
      saveButton.disabled = false;
      saveButton.innerHTML =
        '<i class="fa-solid fa-floppy-disk mr-2"></i>Guardar publicación';
    }
  });
}

// ========================================
// BOTONES DEL EDITOR
// ========================================

$('add-btn')?.addEventListener('click', newPost);
$('cancel-btn')?.addEventListener('click', closeForm);
$('cancel-bottom-btn')?.addEventListener('click', closeForm);

$('logout-btn')?.addEventListener('click', async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error al cerrar sesión:', error);

    say(
      `No se pudo cerrar sesión: ${error.code || error.message}`,
      true
    );
  }
});

// ========================================
// INICIAR SESIÓN
// ========================================

$('login-form').addEventListener('submit', async event => {
  event.preventDefault();

  const button = $('login-btn');
  const errorMessage = $('login-error');

  button.disabled = true;
  errorMessage.textContent = 'Verificando acceso...';

  try {
    await signInWithEmailAndPassword(
      auth,
      $('login-email').value.trim(),
      $('login-password').value
    );

    errorMessage.textContent = '';
  } catch (error) {
    console.error(
      'Error de inicio de sesión:',
      error.code,
      error.message
    );

    errorMessage.textContent =
      `Error de Firebase: ${error.code || error.message}`;
  } finally {
    button.disabled = false;
  }
});

// ========================================
// COMPROBAR SESIÓN
// ========================================

onAuthStateChanged(auth, user => {
  $('login-panel').classList.toggle('hidden', !!user);
  $('editor-area').classList.toggle('hidden', !user);

  $('user-status').textContent = user
    ? `Sesión iniciada: ${user.email}`
    : '';

  if (user) {
    loadPosts();
  } else {
    posts = [];

    if (list) list.innerHTML = '';

    if (formPanel) closeForm();
  }
});
