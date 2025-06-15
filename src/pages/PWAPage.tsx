
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { pwaGenerationService, GeneratedPWA } from '@/services/pwaGenerationService';

const PWAPage = () => {
  const { pwaId } = useParams<{ pwaId: string }>();
  const [pwa, setPwa] = useState<GeneratedPWA | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pwaId) {
      setLoading(false);
      return;
    }

    const foundPwa = pwaGenerationService.getPWAById(pwaId);
    setPwa(foundPwa || null);
    setLoading(false);
  }, [pwaId]);

  useEffect(() => {
    if (pwa) {
      // Atualizar o título da página
      document.title = pwa.config.name;
      
      // Criar e inserir o manifest dinamicamente
      const manifestData = {
        name: pwa.config.name,
        short_name: pwa.config.shortName,
        description: pwa.config.description,
        start_url: "./",
        display: pwa.config.display,
        theme_color: pwa.config.themeColor,
        background_color: pwa.config.backgroundColor,
        orientation: pwa.config.orientation,
        scope: "./",
        icons: pwa.config.icons.length > 0 ? pwa.config.icons : [
          {
            src: "/placeholder.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any"
          }
        ]
      };

      const manifestBlob = new Blob([JSON.stringify(manifestData, null, 2)], {
        type: 'application/json'
      });
      const manifestUrl = URL.createObjectURL(manifestBlob);

      // Remover manifest anterior se existir
      const existingManifest = document.getElementById('dynamic-manifest');
      if (existingManifest) {
        document.head.removeChild(existingManifest);
      }

      // Criar link para o manifest
      const manifestLink = document.createElement('link');
      manifestLink.rel = 'manifest';
      manifestLink.href = manifestUrl;
      manifestLink.id = 'dynamic-manifest';
      document.head.appendChild(manifestLink);

      // Registrar service worker
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          registrations.forEach(registration => {
            if (registration.scope.includes(window.location.pathname)) {
              registration.unregister();
            }
          });
          
          setTimeout(() => {
            const swCode = `
const CACHE_NAME = '${pwa.config.name.toLowerCase().replace(/\s+/g, '-')}-v1';
const urlsToCache = [
  './',
  '/placeholder.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache).catch(() => Promise.resolve());
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => response || fetch(event.request))
        .catch(() => {
          return new Response(\`
            <!DOCTYPE html>
            <html>
            <head>
              <title>${pwa.config.name}</title>
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { 
                  font-family: system-ui; 
                  padding: 20px; 
                  text-align: center; 
                  background: ${pwa.config.backgroundColor}; 
                  color: #333;
                  min-height: 100vh;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }
                .container { 
                  max-width: 400px; 
                  padding: 30px; 
                  background: white; 
                  border-radius: 10px; 
                  box-shadow: 0 4px 20px rgba(0,0,0,0.1); 
                }
                h1 { color: ${pwa.config.themeColor}; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>📱 ${pwa.config.name}</h1>
                <h2>Você está offline</h2>
                <p>Conecte-se à internet para acessar todas as funcionalidades.</p>
              </div>
            </body>
            </html>
          \`, {
            headers: { 'Content-Type': 'text/html' }
          });
        })
    );
  }
});
            `;

            const swBlob = new Blob([swCode], { type: 'application/javascript' });
            const swUrl = URL.createObjectURL(swBlob);

            navigator.serviceWorker.register(swUrl, { scope: './' })
              .then(() => setTimeout(() => URL.revokeObjectURL(swUrl), 1000))
              .catch(() => URL.revokeObjectURL(swUrl));
          }, 500);
        });
      }

      return () => {
        URL.revokeObjectURL(manifestUrl);
        const existingManifest = document.getElementById('dynamic-manifest');
        if (existingManifest && existingManifest.parentNode) {
          document.head.removeChild(existingManifest);
        }
      };
    }
  }, [pwa]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando PWA...</p>
        </div>
      </div>
    );
  }

  if (!pwa) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">PWA Não Encontrado</h1>
          <p className="text-gray-600 mb-4">O PWA solicitado não foi encontrado.</p>
          <a href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
            Voltar ao Gerador
          </a>
        </div>
      </div>
    );
  }

  // Renderizar o PWA real
  return (
    <div 
      className="min-h-screen"
      style={{ 
        backgroundColor: pwa.config.backgroundColor,
        color: pwa.config.themeColor 
      }}
    >
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="max-w-lg mx-auto bg-white/95 rounded-2xl shadow-xl p-8">
          <h1 
            className="text-4xl font-bold mb-4"
            style={{ color: pwa.config.themeColor }}
          >
            {pwa.config.name}
          </h1>
          
          <p className="text-lg text-gray-700 mb-6">
            {pwa.config.description}
          </p>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              🚀 PWA Ativo!
            </h2>
            <p className="text-gray-600 mb-4">
              Este é seu Progressive Web App funcionando perfeitamente.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="font-semibold text-blue-600">📱 Instalável</div>
                <div className="text-gray-600">Adicione à tela inicial</div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="font-semibold text-green-600">⚡ Offline</div>
                <div className="text-gray-600">Funciona sem internet</div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="font-semibold text-purple-600">🔄 Responsivo</div>
                <div className="text-gray-600">Adapta a qualquer tela</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => {
                if ('serviceWorker' in navigator && 'share' in navigator) {
                  navigator.share({
                    title: pwa.config.name,
                    text: pwa.config.description,
                    url: window.location.href
                  });
                }
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200"
            >
              📤 Compartilhar PWA
            </button>
            
            <a
              href="/"
              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              ← Voltar ao Gerador
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAPage;
