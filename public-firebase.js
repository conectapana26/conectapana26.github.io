import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import { getFirestore, collection, getDocs, addDoc, getDoc, doc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
import firebaseConfig from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function loadPublicContent() {
  try {
    const settingsSnapshot = await getDoc(doc(db, 'siteContent', 'main'));
    if (settingsSnapshot.exists()) {
      const settings = settingsSnapshot.data();
      document.querySelectorAll('[data-site-date]').forEach(element => {
        const key = element.dataset.siteDate;
        if (typeof settings[key] === 'string') element.textContent = settings[key];
      });
    }
    const postsSnapshot = await getDocs(collection(db, 'posts'));
    if (postsSnapshot.size) {
      const posts = postsSnapshot.docs.map(document => ({ ...document.data(), id: document.id }));
      if (typeof window.renderFirebaseNews === 'function') window.renderFirebaseNews(posts);
      else window.dispatchEvent(new CustomEvent('conectapana-news', { detail: posts }));
    }
  } catch (error) {
    console.warn('Se mantienen los contenidos estáticos de respaldo.', error);
  }
}

// El formulario público está únicamente en index.html. Los mensajes se guardan,
// pero este sitio no los presenta en el editor.
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    try {
      await addDoc(collection(db, 'messages'), {
        name: document.getElementById('contact-name').value.trim(),
        email: document.getElementById('contact-email').value.trim(),
        role: document.getElementById('contact-role').value,
        subject: document.getElementById('contact-subject').value.trim(),
        message: document.getElementById('contact-message').value.trim(),
        createdAt: serverTimestamp()
      });
      form.reset();
      const confirmation = 'Gracias por comunicarte con Conecta Pana. Tu mensaje fue recibido.';
      if (typeof window.openModal === 'function') window.openModal('¡Mensaje enviado!', confirmation);
      else alert(confirmation);
    } catch (error) {
      console.error(error);
      alert('No se pudo enviar el mensaje. Intenta de nuevo más tarde.');
    } finally {
      submitButton.disabled = false;
    }
  });
}

loadPublicContent();
