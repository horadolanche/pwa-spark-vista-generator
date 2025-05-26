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
      // Criar e inserir o manifest dinamicamente
      const manifestData = {
        name: pwa.config.name,
        short_name: pwa.config.shortName,
        description: pwa.config.description,
        start_url: window.location.pathname,
        display: pwa.config.display,
        theme_color: pwa.config.themeColor,
        background_color: pwa.config.backgroundColor,
        orientation: pwa.config.orientation,
        scope: window.location.pathname,
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

      // Criar link para o manifest
      const manifestLink = document.createElement('link');
      manifestLink.rel = 'manifest';
      manifestLink.href = manifestUrl;
      manifestLink.id = 'dynamic-manifest';
      document.head.appendChild(manifestLink);

      // Registrar service worker
      if ('serviceWorker' in navigator) {
        const swCode = `
// Service Worker para ${pwa.config.name}
const CACHE_NAME = '${pwa.config.name.toLowerCase().replace(/\s+/g, '-')}-v1';
const currentPath = '${window.location.pathname}';
const urlsToCache = [
  currentPath,
  currentPath + '/',
  '${window.location.origin}${window.location.pathname}',
  '/placeholder.svg'
];

self.addEventListener('install', (event) => {
  console.log('Service Worker: Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Cache aberto');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        self.skipWaiting();
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Ativando...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deletando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      self.clients.claim();
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Só interceptar requests para nossa aplicação
  if (event.request.url.includes('${window.location.pathname}')) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request);
        })
        .catch(() => {
          // Offline fallback
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
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                }
                h1 { color: ${pwa.config.themeColor}; }
                .container { 
                  max-width: 400px; 
                  padding: 30px; 
                  background: white; 
                  border-radius: 10px; 
                  box-shadow: 0 4px 20px rgba(0,0,0,0.1); 
                }
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

        // Desregistrar service workers anteriores primeiro
        navigator.serviceWorker.getRegistrations().then(registrations => {
          registrations.forEach(registration => {
            if (registration.scope.includes('/pwas/')) {
              registration.unregister();
            }
          });
        });

        navigator.serviceWorker.register(swUrl, { 
          scope: window.location.pathname + '/'
        })
          .then((registration) => {
            console.log('SW registrado com sucesso:', registration);
          })
          .catch((error) => {
            console.log('Falha no registro do SW:', error);
          });
      }

      // Cleanup
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando PWA...</p>
        </div>
      </div>
    );
  }

  if (!pwa) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">PWA Não Encontrado</h1>
          <p className="text-gray-600 mb-4">
            O PWA solicitado não foi encontrado ou pode ter sido removido.
          </p>
          <a href="/" className="text-blue-500 hover:text-blue-700 underline">
            Voltar ao Gerador de PWA
          </a>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center text-center p-6"
      style={{ backgroundColor: pwa.config.backgroundColor }}
    >
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <h1 
          className="text-4xl font-bold mb-4"
          style={{ color: pwa.config.themeColor }}
        >
          {pwa.config.name}
        </h1>
        
        <p className="text-lg text-gray-600 mb-6">
          {pwa.config.description}
        </p>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            🚀 Seu PWA está funcionando!
          </h2>
          <p className="text-gray-700 mb-4">
            Este é um Progressive Web App totalmente funcional gerado automaticamente.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white p-3 rounded">
              <strong>📱 Instalável</strong>
              <p>Pode ser instalado como app nativo</p>
            </div>
            <div className="bg-white p-3 rounded">
              <strong>⚡ Offline</strong>
              <p>Funciona mesmo sem internet</p>
            </div>
            <div className="bg-white p-3 rounded">
              <strong>🔄 Atualizações</strong>
              <p>Atualiza automaticamente</p>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          <p>PWA ID: {pwa.id}</p>
          <p>Criado em: {new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }).format(pwa.createdAt)}</p>
        </div>

        <div className="mt-6">
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Criar Novo PWA
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAPage;
