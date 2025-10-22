 
const CACHE_NAME = 'djamel-aps-v1';
 
  const urlsToCache = [
    '/',
    '/static/js/bundle.js',
    '/static/css/main.css',
    '/manifest.json',
    '/icon-web-01.png',
    '/logo192.png',
    '/offline.html',
    // ✅ Agregar rutas principales de tu app
    '/',
     
    '/profile'
    // Agrega aquí las rutas principales de tu React app
  ];
 
// INSTALACIÓN - Cachear recursos críticos
self.addEventListener('install', (event) => {
  console.log('Service Worker: Instalando...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Cacheando recursos');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Instalación completada');
        return self.skipWaiting(); // Activar inmediatamente
      })
  );
});

// ACTIVACIÓN - Limpiar caches viejos
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activando...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Eliminando cache viejo', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Ahora está activo!');
      return self.clients.claim(); // Tomar control inmediato
    })
  );
});

// FETCH - Estrategia Cache First
self.addEventListener('fetch', (event) => {
  // Solo manejar requests GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si está en cache, devolver del cache
        if (response) {
          return response;
        }

        // Si no está en cache, hacer fetch y cachear
        return fetch(event.request)
          .then(fetchResponse => {
            // Verificar que la respuesta es válida
            if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
              return fetchResponse;
            }

            // Clonar la respuesta para cachear
            const responseToCache = fetchResponse.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return fetchResponse;
          })
          .catch(error => {
            console.log('Fetch failed; returning offline page:', error);
            // Puedes devolver una página offline personalizada aquí
          });
      })
  );
});

// Manejar mensajes desde la app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});