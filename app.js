/* =====================================================================
   CONECTA PANA — JAVASCRIPT COMPARTIDO (app.js)
   ---------------------------------------------------------------------
   PROPÓSITO: reúne las interacciones de las tres páginas en un solo archivo.
   CÓMO SE CONECTA: cada HTML incluye <script src="app.js"></script>.
   El código identifica qué página está abierta buscando elementos propios
   (por ejemplo #news-search, #info-modal o #grade-tabs) y ejecuta únicamente
   las funciones que corresponden a esa página.
   CONFIGURACIÓN: tailwind.config se declara antes de cargar Tailwind CDN para
   que las páginas puedan usar los colores, fuentes y sombras personalizados.
   IMÁGENES: aquí no se guardan fotografías. Las rutas están en las etiquetas
   <img> de cada HTML y los archivos se almacenan en la carpeta img/.
   PARA EXPONER: explicar cada bloque desde arriba hacia abajo; los comentarios
   describen el objetivo, los elementos HTML que utiliza y el resultado esperado.
   ===================================================================== */
window.tailwind = window.tailwind || {};
tailwind.config = {
  theme: { extend: {
    colors: { brand: {
      blue:'#1E56A0', sky:'#0284C7', lightsky:'#E0F2FE', green:'#16A34A',
      lightgreen:'#DCFCE7', orange:'#F97316', lightorange:'#FFEDD5', yellow:'#FACC15',
      lightyellow:'#FEF08A', purple:'#8B5CF6', cream:'#FAF8F0', paper:'#FFFDF7', dark:'#1E293B'
    }},
    fontFamily: { fredoka:['Fredoka','sans-serif'], sans:['Plus Jakarta Sans','sans-serif'] },
    boxShadow: {
      'fun':'4px 4px 0px 0px rgba(30, 41, 59, 1)',
      'fun-lg':'6px 6px 0px 0px rgba(30, 41, 59, 1)',
      'fun-blue':'5px 5px 0px 0px #1E56A0',
      'fun-orange':'5px 5px 0px 0px #F97316',
      'fun-green':'5px 5px 0px 0px #16A34A',
      'fun-yellow':'5px 5px 0px 0px #EAB308',
      'soft':'0 10px 30px -5px rgba(2, 132, 199, 0.12)'
    }
  }}
};

window.ConectaPana = window.ConectaPana || {};
window.ConectaPana.handleImageError = function (img) {
  if (!img) return;
  img.style.display = 'none';
  const box = img.closest('.img-container');
  const fallback = box && box.querySelector('.fallback-placeholder');
  if (fallback) fallback.classList.remove('hidden');
};

document.addEventListener('DOMContentLoaded', function () {

  // PÁGINA PRINCIPAL: se ejecuta este bloque solo si el HTML contiene el buscador de noticias y la ventana modal de la portada.
  if (document.getElementById('news-search') && document.getElementById('info-modal')) {
    (function () {
// ------------------------------------------------------------
        // IMÁGENES: FALLBACK
        // Si una imagen no existe o la ruta está mal escrita, se oculta
        // la imagen y se muestra el recuadro informativo preparado en HTML.
        // Esto te ayuda a detectar qué archivo falta.
        // ------------------------------------------------------------
        // FUNCIÓN DE RESPALDO DE IMAGEN: si la fotografía no carga, oculta la etiqueta img y muestra el recuadro alternativo que está junto a ella en el HTML.
        function handleImgError(img) {
            img.style.display = 'none';
            const fallback = img.nextElementSibling;
            if (fallback) {
                fallback.classList.remove('hidden');
                fallback.classList.add('flex');
            }
        }

        // ------------------------------------------------------------
        // MENÚ MÓVIL
        // Abre/cierra el menú de navegación en teléfonos y cambia el
        // icono de tres barras por una X.
        // ------------------------------------------------------------
        // CONTROL DEL MENÚ MÓVIL: al pulsar el botón, muestra u oculta el menú y cambia el icono de barras por una X.
        const menuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const menuIcon = document.getElementById('menu-icon');

        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            if (mobileMenu.classList.contains('hidden')) {
                menuIcon.className = 'fa-solid fa-bars text-xl';
            } else {
                menuIcon.className = 'fa-solid fa-xmark text-xl';
            }
        });

        // CIERRE DEL MENÚ: después de seleccionar una opción móvil, cierra el desplegable para dejar visible el contenido elegido.
        document.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                menuIcon.className = 'fa-solid fa-bars text-xl';
            });
        });

        // ------------------------------------------------------------
        // FILTRO DE NOTICIAS
        // Cambia entre Todos, Noticias, Eventos, Actividades y Comunicados.
        // Cada noticia tiene data-cat="..." para indicar su categoría.
        // ------------------------------------------------------------
        // FILTRADO DE NOTICIAS: compara la categoría de cada botón con el atributo data-cat de cada tarjeta y muestra solo las coincidencias.
        function filterNews(category) {
            const buttons = document.querySelectorAll('.news-filter-btn');
            buttons.forEach(btn => {
                if (btn.getAttribute('data-category') === category) {
                    btn.className = 'news-filter-btn active-filter px-4 py-2 rounded-xl font-fredoka text-sm font-bold bg-brand-blue text-white shadow-fun-blue transition-all';
                } else {
                    btn.className = 'news-filter-btn px-4 py-2 rounded-xl font-fredoka text-sm font-bold bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 transition-all';
                }
            });

            const newsItems = document.querySelectorAll('.news-item');
            newsItems.forEach(item => {
                if (category === 'todos' || item.getAttribute('data-cat') === category) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        }

        // ------------------------------------------------------------
        // DESPLAZAMIENTO SUAVE
        // Lleva al usuario a una sección específica sin recargar la página.
        // Ejemplo: scrollToSection("historia").
        // ------------------------------------------------------------
        // DESPLAZAMIENTO SUAVE: recibe el id de una sección y desplaza la pantalla hasta ella sin recargar el documento.
        function scrollToSection(id) {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }

        // ------------------------------------------------------------
        // MODALES
        // openModal(título, contenido) abre una ventana emergente.
        // closeModal() la cierra.
        // ------------------------------------------------------------
        // VENTANA MODAL: coloca el título y el contenido recibido dentro de la ventana emergente y permite ocultarla cuando se cierra.
        const modal = document.getElementById('info-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');

        function openModal(title, htmlContent) {
            modalTitle.innerText = title;
            modalBody.innerHTML = htmlContent;
            modal.classList.remove('hidden');
        }

        function closeModal() {
            modal.classList.add('hidden');
        }

        // CIERRE AL PULSAR EL FONDO: cierra el modal solo cuando el clic ocurre fuera de la tarjeta interior.
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // ------------------------------------------------------------
        // FORMULARIO DE CONTACTO
        // Actualmente NO envía el formulario a un correo o base de datos.
        // Solo muestra una confirmación visual y limpia los campos.
        // Para recibir mensajes reales habría que conectar un backend o
        // servicio externo de formularios.
        // ------------------------------------------------------------
        // ENVÍO VISUAL DEL FORMULARIO: evita que el navegador recargue la página, muestra una confirmación y limpia los campos. No envía datos a un servidor.
        function handleFormSubmit(event) {
            event.preventDefault();
            openModal(
                '¡Mensaje Enviado!', 
                'Gracias por comunicarte con <strong>Conecta Pana</strong>. Tu consulta ha sido registrada con éxito y será redireccionada al área administrativa de la I.E. Panamericano Puente de Boyacá.'
            );
            document.getElementById('contact-form').reset();
        }

        // ------------------------------------------------------------
        // ANIMACIONES AL HACER SCROLL
        // IntersectionObserver detecta cuándo un elemento entra en pantalla
        // y le agrega la clase "active" para revelar su contenido suavemente.
        // ------------------------------------------------------------
        // ANIMACIONES DE APARICIÓN: observa los elementos con .reveal y agrega .active cuando entran en pantalla para activar el CSS.
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

        // FUNCIONES COMPLEMENTARIAS: agrupa el progreso de lectura, navegación resaltada, búsqueda y pequeños apoyos de accesibilidad.

        // PROGRESO Y BOTÓN SUPERIOR: calcula qué porcentaje del documento se ha recorrido y muestra el botón para volver arriba al bajar.
        const progressBar = document.getElementById('scroll-progress');
        const backTop = document.getElementById('back-to-top');

        function updateScrollUI() {
            const doc = document.documentElement;
            const max = doc.scrollHeight - doc.clientHeight;
            const progress = max > 0 ? (window.scrollY / max) * 100 : 0;
            progressBar.style.width = progress + '%';
            backTop.classList.toggle('show', window.scrollY > 500);
        }
        window.addEventListener('scroll', updateScrollUI, {passive:true});
        updateScrollUI();

        backTop.addEventListener('click', () => {
            window.scrollTo({top: 0, behavior: 'smooth'});
        });

        // NAVEGACIÓN ACTIVA: identifica la sección visible y resalta en el menú el enlace que apunta a esa sección.
        const desktopNavLinks = [...document.querySelectorAll('header nav a[href^="#"]')];
        const sections = [...document.querySelectorAll('main section, section[id]')];

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const id = '#' + entry.target.id;
                desktopNavLinks.forEach(link => {
                    link.classList.toggle('nav-link-active', link.getAttribute('href') === id);
                });
            });
        }, {rootMargin: '-25% 0px -65% 0px', threshold: 0});

        sections.forEach(section => sectionObserver.observe(section));

        // ACCESIBILIDAD DEL MODAL: añade el comportamiento visual de entrada y permite cerrarlo con la tecla Escape.
        const originalOpenModal = openModal;
        openModal = function(title, htmlContent) {
            originalOpenModal(title, htmlContent);
            requestAnimationFrame(() => modal.classList.add('modal-visible'));
            document.body.classList.add('overflow-hidden');
        };

        const originalCloseModal = closeModal;
        closeModal = function() {
            modal.classList.remove('modal-visible');
            setTimeout(() => originalCloseModal(), 150);
            document.body.classList.remove('overflow-hidden');
        };

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
        });

        // PUBLICACIONES DINÁMICAS: las tarjetas proceden de noticias.json, de modo que se pueden editar sin tocar index.html.
        const newsSearch = document.getElementById('news-search');
        const clearNewsSearch = document.getElementById('clear-news-search');
        const resultCount = document.getElementById('news-result-count');
        const newsContainer = document.getElementById('news-container');
        let activeNewsCategory = 'todos';
        let newsData = [];

        function escapeNewsHtml(value) {
            return String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
        }

        function slugifyNewsTitle(value) {
            return String(value || 'publicacion').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'publicacion';
        }

        function renderNewsCards() {
            if (!newsData.length) {
                newsContainer.innerHTML = '<div class="md:col-span-3 bg-white rounded-3xl border-2 border-slate-200 p-8 text-center text-slate-600"><i class="fa-regular fa-newspaper text-3xl text-brand-blue mb-3"></i><p class="font-semibold">Aún no hay publicaciones. Vuelve pronto para conocer las novedades.</p></div>';
                return;
            }
            const colors = {
                noticias: {label:'Noticia', badge:'bg-brand-green text-white', button:'bg-brand-lightgreen text-brand-green hover:bg-brand-green'},
                eventos: {label:'Evento', badge:'bg-brand-yellow text-slate-900', button:'bg-brand-lightsky text-brand-blue hover:bg-brand-blue'},
                actividades: {label:'Actividad', badge:'bg-brand-lightsky text-brand-blue', button:'bg-brand-lightsky text-brand-blue hover:bg-brand-blue'},
                comunicados: {label:'Comunicado', badge:'bg-brand-lightorange text-brand-orange', button:'bg-brand-lightorange text-brand-orange hover:bg-brand-orange'}
            };
            newsContainer.innerHTML = newsData.map((item, index) => {
                const style = colors[item.category] || colors.noticias;
                const itemId = item.id || slugifyNewsTitle(item.title);
                const title = escapeNewsHtml(item.title);
                const date = escapeNewsHtml(item.date);
                const summary = escapeNewsHtml(item.summary);
                const image = escapeNewsHtml(item.image || '');
                const label = escapeNewsHtml(item.label || style.label);
                const icon = item.category === 'eventos' ? 'fa-calendar-day' : item.category === 'comunicados' ? 'fa-bullhorn' : item.category === 'actividades' ? 'fa-people-group' : 'fa-newspaper';
                return `<article class="news-item reveal interactive-card bg-white rounded-3xl overflow-hidden border-2 border-slate-800 shadow-fun hover:-translate-y-1 transition-all flex flex-col justify-between" data-cat="${escapeNewsHtml(item.category)}" data-id="${escapeNewsHtml(itemId)}">
                    <div><div class="img-container aspect-[16/10] border-b-2 border-slate-800 relative bg-gradient-to-br from-sky-100 to-emerald-100">
                        <img src="${image}" alt="${title}" class="w-full h-full object-cover" onerror="handleImgError(this)">
                        <div class="fallback-placeholder hidden w-full h-full flex-col items-center justify-center p-4 text-center"><i class="fa-solid ${icon} text-3xl text-brand-blue mb-2"></i><span class="font-fredoka font-bold text-slate-800 text-xs">${title}</span><span class="text-[10px] text-slate-500 mt-1">Añade una imagen desde el editor</span></div>
                        <span class="absolute top-3 left-3 px-3 py-1 ${style.badge} font-fredoka text-[11px] font-bold rounded-lg shadow border border-slate-900">${label}</span>
                    </div><div class="p-6 space-y-3"><div class="text-xs text-slate-500 font-semibold flex items-center gap-2"><i class="fa-regular fa-calendar text-brand-blue"></i> ${date || 'Fecha por confirmar'}</div><h3 class="font-fredoka text-xl font-bold text-slate-900">${title}</h3><p class="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">${summary}</p></div></div>
                    <div class="p-6 pt-0"><button type="button" class="news-read-more w-full py-2.5 ${style.button} hover:text-white font-fredoka text-xs font-bold rounded-xl transition-colors" data-news-id="${escapeNewsHtml(itemId)}">Leer Más <i class="fa-solid fa-arrow-right ml-1"></i></button></div>
                </article>`;
            }).join('');
            newsContainer.querySelectorAll('.news-read-more').forEach(button => button.addEventListener('click', () => {
                const item = newsData.find(entry => (entry.id || slugifyNewsTitle(entry.title)) === button.dataset.newsId);
                if (!item) return;
                const safeContent = escapeNewsHtml(item.content || item.summary).replace(/\n/g, '<br><br>');
                const safeDate = escapeNewsHtml(item.date);
                const safeLabel = escapeNewsHtml(item.label || item.category);
                openModal(item.title, `<div class="flex flex-wrap gap-2 mb-4"><span class="px-3 py-1 rounded-lg bg-brand-lightsky text-brand-blue text-xs font-bold">${safeLabel}</span><span class="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold">${safeDate}</span></div><div class="text-slate-600 text-sm sm:text-base leading-7 whitespace-normal">${safeContent}</div>`);
            }));
            newsContainer.querySelectorAll('.reveal').forEach(el => observer.observe(el));
            applyNewsFilters();
        }

        async function loadNews() {
            try {
                const response = await fetch('noticias.json', {cache:'no-store'});
                if (!response.ok) throw new Error('No se pudo leer noticias.json');
                const data = await response.json();
                const publications = Array.isArray(data) ? data : data.publicaciones;
                if (!Array.isArray(publications)) throw new Error('El archivo de noticias no tiene el formato esperado');
                newsData = publications;
                renderNewsCards();
            } catch (error) {
                newsContainer.innerHTML = '<div class="md:col-span-3 bg-white rounded-3xl border-2 border-amber-300 p-8 text-center text-slate-700"><i class="fa-solid fa-circle-exclamation text-2xl text-amber-600 mb-3"></i><p class="font-bold">No se pudieron cargar las publicaciones.</p><p class="text-sm mt-2">Abre el proyecto con Live Server en VS Code y verifica que noticias.json esté junto a index.html.</p></div>';
            }
        }

        function applyNewsFilters() {
            const query = newsSearch.value.trim().toLowerCase();
            let visible = 0;
            document.querySelectorAll('.news-item').forEach(item => {
                const categoryMatch = activeNewsCategory === 'todos' || item.dataset.cat === activeNewsCategory;
                const textMatch = !query || item.innerText.toLowerCase().includes(query);
                const show = categoryMatch && textMatch;
                item.classList.toggle('news-hidden', !show);
                item.classList.toggle('search-highlight', !!query && show);
                if (show) visible++;
            });
            clearNewsSearch.classList.toggle('hidden', !query);
            resultCount.textContent = query ? `${visible} resultado${visible === 1 ? '' : 's'} encontrado${visible === 1 ? '' : 's'}` : '';
        }
        loadNews();

        const originalFilterNews = filterNews;
        filterNews = function(category) {
            activeNewsCategory = category;
            originalFilterNews(category);
            applyNewsFilters();
        };

        newsSearch.addEventListener('input', applyNewsFilters);
        clearNewsSearch.addEventListener('click', () => {
            newsSearch.value = '';
            newsSearch.focus();
            applyNewsFilters();
        });

        // COPIAR DATOS DE CONTACTO: intenta copiar al portapapeles el correo o teléfono al pulsar sobre su dato; si el navegador no lo permite, no interrumpe la página.
        document.querySelectorAll('#contacto .space-y-3 > div').forEach(card => {
            card.classList.add('interactive-card', 'cursor-pointer');
            card.title = 'Haz clic para copiar este dato';
            card.addEventListener('click', async () => {
                const value = card.querySelector('p')?.innerText?.trim();
                if (!value || !navigator.clipboard) return;
                try {
                    await navigator.clipboard.writeText(value);
                    const old = card.querySelector('p').innerText;
                    card.querySelector('p').innerText = 'Copiado al portapapeles';
                    card.classList.add('copy-success');
                    setTimeout(() => {
                        card.querySelector('p').innerText = old;
                        card.classList.remove('copy-success');
                    }, 1200);
                } catch {}
            });
        });

        // ESTADO DE LOS CAMPOS: marca visualmente con el color verde los campos del formulario que ya contienen información.
        document.querySelectorAll('#contact-form input, #contact-form textarea, #contact-form select').forEach(field => {
            field.addEventListener('input', () => {
                field.classList.toggle('border-brand-green', field.value.trim() !== '');
            });
            field.addEventListener('change', () => {
                field.classList.toggle('border-brand-green', field.value.trim() !== '');
            });
        });

      // FUNCIONES PÚBLICAS: estas asignaciones permiten que botones del HTML que usan onclick puedan llamar a las funciones definidas dentro de este bloque.
      window.handleImgError = handleImgError;
      window.filterNews = filterNews;
      window.scrollToSection = scrollToSection;
      window.openModal = openModal;
      window.closeModal = closeModal;
      window.handleFormSubmit = handleFormSubmit;
    })();
  }

  // PÁGINA COMUNIDAD: se activa cuando existen los elementos del modal y de progreso, pero no el buscador exclusivo de la página principal.
  if (document.getElementById('info-modal') && document.getElementById('scroll-progress') && !document.getElementById('news-search')) {
    (function () {
// RESPALDO DE IMAGEN EN COMUNIDAD: si la imagen no carga, la oculta y revela el marcador alternativo del mismo contenedor.
function handleImgError(img){
  const box=img.closest('.img-container');
  img.style.display='none';
  const fallback=box?.querySelector('.fallback-placeholder');
  if(fallback) fallback.classList.remove('hidden');
}

// ABRIR INFORMACIÓN: coloca un título y texto en el modal de comunidad, lo hace visible y actualiza aria-hidden para accesibilidad.
function showInfo(title,text){
  const modal=document.getElementById('info-modal');
  document.getElementById('modal-title').textContent=title;
  document.getElementById('modal-text').textContent=text;
  modal.classList.add('modal-visible');
  modal.classList.remove('pointer-events-none');
  modal.setAttribute('aria-hidden','false');
}
// CERRAR MODAL: oculta la ventana de información y actualiza sus clases y atributo de accesibilidad.
function closeModal(){
  const modal=document.getElementById('info-modal');
  modal.classList.remove('modal-visible');
  modal.classList.add('pointer-events-none');
  modal.setAttribute('aria-hidden','true');
}

// TECLADO Y FONDO DEL MODAL: Escape o un clic en el fondo oscuro cierran la ventana emergente.
document.addEventListener('keydown',e=>{if(e.key==='Escape') closeModal();});
document.getElementById('info-modal').addEventListener('click',e=>{if(e.target.id==='info-modal') closeModal();});

// MENÚ MÓVIL DE COMUNIDAD: muestra u oculta el menú y lo cierra al seleccionar un enlace.
document.getElementById('mobile-menu-btn').addEventListener('click',()=>{
  document.getElementById('mobile-menu').classList.toggle('hidden');
});
document.querySelectorAll('#mobile-menu a').forEach(a=>a.addEventListener('click',()=>document.getElementById('mobile-menu').classList.add('hidden')));

// PROGRESO DE LECTURA: calcula la posición del usuario y actualiza la barra superior y el botón volver arriba.
const progress=document.getElementById('scroll-progress');
const topBtn=document.getElementById('back-to-top');
window.addEventListener('scroll',()=>{
  const h=document.documentElement.scrollHeight-window.innerHeight;
  progress.style.width=(h>0?(window.scrollY/h)*100:0)+'%';
  topBtn.classList.toggle('show',window.scrollY>450);
},{passive:true});

// ANIMACIONES DE COMUNIDAD: observa los bloques .reveal y añade .active al entrar en pantalla.
const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('active');observer.unobserve(entry.target);}});
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

      window.handleImgError = handleImgError;
      window.showInfo = showInfo;
      window.closeModal = closeModal;
    })();
  }

  // PÁGINA ESTUDIANTES: se activa cuando encuentra #grade-tabs; crea las pestañas de grado y muestra los recursos correspondientes.
  if (document.getElementById('grade-tabs')) {
    (function () {
// DATOS DE GRADOS: relaciona cada grado con su nivel educativo. Para añadir otro grado, agrégalo a este objeto y revisa los paneles correspondientes en el HTML.
const gradeData = {"6.º": {"nivel": "Básica secundaria"}, "7.º": {"nivel": "Básica secundaria"}, "8.º": {"nivel": "Básica secundaria"}, "9.º": {"nivel": "Básica secundaria"}, "10.º": {"nivel": "Educación media"}, "11.º": {"nivel": "Educación media"}};
const gradeOrder = Object.keys(gradeData);
// ELEMENTOS DE LA INTERFAZ: referencias a los contenedores que JavaScript actualizará en la página de estudiantes.
const tabs = document.getElementById('grade-tabs');
const title = document.getElementById('resources-title');
const subtitle = document.getElementById('resources-subtitle');

// NORMALIZAR IDENTIFICADOR: convierte el texto de un grado en una cadena sencilla para usarla como id HTML si hace falta.
function safeId(grade) { return 'grado-' + grade.replace('º','').replace('.','').toLowerCase(); }
// CAMBIAR DE GRADO: actualiza el botón activo, oculta los paneles de otros grados y cambia el título y subtítulo de los recursos.
function selectGrade(grade) {
  document.querySelectorAll('.grade-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.grade === grade));
  document.querySelectorAll('.grade-panel').forEach(panel => panel.classList.toggle('hidden', panel.dataset.grade !== grade));
  title.textContent = `Recursos de ${grade}`;
  subtitle.textContent = `Temas concretos por materia para ${gradeData[grade].nivel.toLowerCase()}.`;
  requestAnimationFrame(() => observeReveals());
}

// CREAR PESTAÑAS: recorre la lista de grados y crea un botón para cada uno. Al pulsarlo, llama a selectGrade().
gradeOrder.forEach((grade, index) => {
  const btn = document.createElement('button');
  btn.type = 'button'; btn.dataset.grade = grade;
  btn.className = 'grade-btn bg-white rounded-2xl p-4 border-2 border-slate-800 font-fredoka font-bold text-slate-800 shadow-fun hover:-translate-y-1 transition-all';
  btn.innerHTML = `<span class="block text-2xl">${grade}</span><span class="text-[10px] uppercase tracking-wider text-slate-400">${gradeData[grade].nivel}</span>`;
  btn.addEventListener('click', () => selectGrade(grade));
  tabs.appendChild(btn);
});

// REVELAR CONTENIDO: usa IntersectionObserver para mostrar cada elemento cuando entra en pantalla; si el navegador no lo admite, los muestra todos.
function observeReveals() {
  const nodes = document.querySelectorAll('.reveal:not(.visible)');
  if (!('IntersectionObserver' in window)) { nodes.forEach(n => n.classList.add('visible')); return; }
  const io = new IntersectionObserver((entries, obs) => { entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } }); }, {threshold:.08});
  nodes.forEach(n => io.observe(n));
}

selectGrade('6.º');
observeReveals();

/* PROGRESO DE LECTURA EN ESTUDIANTES: actualiza el ancho de la barra según la parte de la página que se ha recorrido. */
(function(){
 const bar=document.getElementById('scroll-progress');
 if(!bar) return;
 const update=()=>{const doc=document.documentElement;const max=doc.scrollHeight-doc.clientHeight;bar.style.width=(max>0?(window.scrollY/max)*100:0)+'%';};
 window.addEventListener('scroll',update,{passive:true}); window.addEventListener('resize',update); update();
})();

    })();
  }

});


/* PÁGINA DOCENTES: buscador de personal.
   Filtra tarjetas por nombre, cargo, sede o formación académica. Solo actúa
   cuando existe #docente-busqueda, por lo que no modifica las otras páginas. */
document.addEventListener('DOMContentLoaded', function () {
  const input = document.getElementById('docente-busqueda');
  if (!input) return;
  const cards = Array.from(document.querySelectorAll('.teacher-card'));
  const sections = Array.from(document.querySelectorAll('main section[id]')).filter(section => section.querySelector('.teacher-card'));
  const count = document.getElementById('docente-resultados');

  // MENÚ MÓVIL: en esta página no se usa el modal de Comunidad, por eso
  // se conecta aquí el botón del menú para que funcione de forma autónoma.
  const menuButton = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');
  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      if (menuIcon) menuIcon.className = mobileMenu.classList.contains('hidden') ? 'fa-solid fa-bars text-xl' : 'fa-solid fa-xmark text-xl';
    });
    mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      if (menuIcon) menuIcon.className = 'fa-solid fa-bars text-xl';
    }));
  }

  // ANIMACIONES: revela la portada y las tarjetas a medida que aparecen en pantalla.
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('active'); entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
    }), { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));
  } else {
    document.querySelectorAll('.reveal').forEach(element => { element.classList.add('active'); element.classList.add('visible'); });
  }

  // BARRA DE PROGRESO: actualiza su anchura conforme se recorre la página.
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (max > 0 ? window.scrollY / max * 100 : 0) + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();
  }
  const empty = document.getElementById('docente-sin-resultados');
  function filterTeachers() {
    const query = input.value.trim().toLocaleLowerCase('es');
    let visible = 0;
    cards.forEach(card => {
      const text = (card.dataset.search || card.textContent).toLocaleLowerCase('es');
      const match = !query || text.includes(query);
      card.classList.toggle('hidden', !match);
      if (match) visible++;
    });
    sections.forEach(section => {
      const sectionCards = Array.from(section.querySelectorAll('.teacher-card'));
      section.classList.toggle('hidden', sectionCards.length > 0 && !sectionCards.some(card => !card.classList.contains('hidden')));
    });
    if (count) count.textContent = query ? `${visible} perfil${visible === 1 ? '' : 'es'} encontrado${visible === 1 ? '' : 's'}.` : 'Consulta los perfiles organizados por equipo y sede.';
    if (empty) empty.classList.toggle('hidden', visible > 0);
  }
  input.addEventListener('input', filterTeachers);
  filterTeachers();
});
