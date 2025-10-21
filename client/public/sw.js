// public/sw.js - VERSIÓN MEJORADA
const CACHE_NAME = 'djamel-aps-v2';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// INSTALACIÓN
self.addEventListener('install', (event) => {
  console.log('🔄 Service Worker: Instalando...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Service Worker: Cacheando recursos');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ Service Worker: Instalación completada');
        return self.skipWaiting();
      })
      .catch(error => {
        console.log('❌ Service Worker: Error en instalación', error);
      })
  );
});

// ACTIVACIÓN
self.addEventListener('activate', (event) => {
  console.log('🔥 Service Worker: Activando...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('🗑️ Service Worker: Eliminando cache viejo', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker: Activado y listo!');
      return self.clients.claim();
    })
  );
});

// FETCH - Estrategia mejorada
self.addEventListener('fetch', (event) => {
  // No manejar requests que no sean GET
  if (event.request.method !== 'GET') return;
  
  // Excluir chrome-extension y otros
  if (event.request.url.indexOf('chrome-extension') !== -1) return;

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Devolver del cache si existe
        if (response) {
          return response;
        }

        // Hacer fetch y cachear
        return fetch(event.request)
          .then(fetchResponse => {
            // Solo cachear respuestas válidas
            if (!fetchResponse || fetchResponse.status !== 200 || !fetchResponse.type === 'basic') {
              return fetchResponse;
            }

            // Clonar para cachear
            const responseToCache = fetchResponse.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return fetchResponse;
          })
          .catch(error => {
            console.log('🌐 Fetch failed:', error);
            // Podrías devolver una página offline aquí
          });
      })
  );
});