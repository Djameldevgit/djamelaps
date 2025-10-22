// Service Worker Djamel APS - V3 MEJORADO
const CACHE_NAME = 'djamel-aps-v3.2';
const API_CACHE_NAME = 'djamel-aps-api-v1';

// URLs para cachear
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icon-web-01.png',
  '/logo192.png',
  '/logo512.png'
];

// Estrategias de cache
const STRATEGIES = {
  NETWORK_FIRST: 'network-first',
  CACHE_FIRST: 'cache-first',
  CACHE_ONLY: 'cache-only'
};

// INSTALACIÓN MEJORADA
self.addEventListener('install', (event) => {
  console.log('🔄 Service Worker: Instalando v3.2...');
  
  self.skipWaiting(); // Activar inmediatamente
  
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME)
        .then(cache => {
          console.log('📦 Cacheando recursos críticos');
          return cache.addAll(urlsToCache).catch(error => {
            console.log('⚠️ Error cacheando algunos recursos:', error);
          });
        }),
      
      caches.open(API_CACHE_NAME)
        .then(cache => {
          console.log('📡 Cache API listo');
          return cache;
        })
    ]).then(() => {
      console.log('✅ Service Worker: Instalación completada');
    })
  );
});

// ACTIVACIÓN MEJORADA
self.addEventListener('activate', (event) => {
  console.log('🔥 Service Worker: Activando v3.2...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME && cache !== API_CACHE_NAME) {
            console.log('🗑️ Eliminando cache viejo:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker: Activado y controlando clientes');
      return self.clients.claim();
    })
  );
});

// ESTRATEGIAS DE CACHE MEJORADAS
const getStrategy = (request) => {
  const url = new URL(request.url);
  
  // Recursos estáticos - Cache First
  if (url.pathname.includes('/static/') || 
      url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|ico|json)$/)) {
    return STRATEGIES.CACHE_FIRST;
  }
  
  // APIs - Network First
  if (url.pathname.includes('/api/')) {
    return STRATEGIES.NETWORK_FIRST;
  }
  
  // Páginas HTML - Network First
  if (request.headers.get('Accept')?.includes('text/html')) {
    return STRATEGIES.NETWORK_FIRST;
  }
  
  return STRATEGIES.NETWORK_FIRST;
};

// FETCH MEJORADO
self.addEventListener('fetch', (event) => {
  // Excluir requests no GET
  if (event.request.method !== 'GET') return;
  
  // Excluir extensiones y otros
  if (event.request.url.startsWith('chrome-extension://') ||
      event.request.url.includes('extension') ||
      !event.request.url.startsWith('http')) {
    return;
  }

  const strategy = getStrategy(event.request);
  
  event.respondWith(
    (async () => {
      try {
        switch (strategy) {
          case STRATEGIES.CACHE_FIRST:
            return await handleCacheFirst(event.request);
            
          case STRATEGIES.NETWORK_FIRST:
            return await handleNetworkFirst(event.request);
            
          default:
            return await handleNetworkFirst(event.request);
        }
      } catch (error) {
        console.log('❌ Error en fetch strategy:', error);
        return await handleOfflineFallback(event.request);
      }
    })()
  );
});

// HANDLERS DE ESTRATEGIAS
async function handleCacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    throw new Error('Network failed');
  }
}

async function handleNetworkFirst(request) {
  try {
    const response = await fetch(request);
    
    // Cachear respuestas exitosas
    if (response.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // Fallback a cache
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    
    // Página offline para rutas de la app
    if (request.headers.get('Accept')?.includes('text/html')) {
      return caches.match('/');
    }
    
    throw error;
  }
}

async function handleOfflineFallback(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }
  
  // Página offline genérica
  if (request.headers.get('Accept')?.includes('text/html')) {
    return new Response(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Djamel APS - Offline</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .offline { color: #666; }
          </style>
        </head>
        <body>
          <div class="offline">
            <h1>🔌 Estás offline</h1>
            <p>La aplicación Djamel APS no está disponible sin conexión.</p>
            <p>Por favor, verifica tu conexión a internet.</p>
          </div>
        </body>
      </html>
      `,
      { headers: { 'Content-Type': 'text/html' } }
    );
  }
  
  throw new Error('Offline and no cache available');
}

// MANEJO DE MENSAJES
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: 'v3.2' });
  }
});

// MANEJO DE SYNC EN FONDO
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('🔄 Background Sync ejecutándose');
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Aquí puedes agregar sincronización en background
  console.log('🔄 Realizando sincronización en background');
}