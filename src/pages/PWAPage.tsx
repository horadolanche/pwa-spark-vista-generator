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

      // Registrar service worker com escopo correto
      if ('serviceWorker' in navigator) {
        const currentPath = window.location.pathname;
        const scopePath = currentPath.endsWith('/') ? currentPath : currentPath + '/';
        
        const swCode = `
// Service Worker para ${pwa.config.name}
const CACHE_NAME = '${pwa.config.name.toLowerCase().replace(/\s+/g, '-')}-v1';
const urlsToCache = [
  './',
  '/placeholder.svg'
];

self.addEventListener('install', (event) => {
  console.log('Service Worker: Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Cache aberto');
        return cache.addAll(urlsToCache).catch((error) => {
          console.log('Erro ao adicionar ao cache:', error);
          return Promise.resolve();
        });
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
  if (event.request.url.startsWith(self.location.origin)) {
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

        // Desregistrar service workers anteriores
        navigator.serviceWorker.getRegistrations().then(registrations => {
          registrations.forEach(registration => {
            if (registration.scope.includes('/pwas/')) {
              registration.unregister();
            }
          });
        });

        // Registrar novo service worker com escopo específico
        navigator.serviceWorker.register(swUrl, { 
          scope: scopePath
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-white to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-500 mx-auto shadow-lg"></div>
          <p className="mt-4 text-gray-600 text-lg font-medium tracking-wide">Carregando PWA...</p>
        </div>
      </div>
    );
  }

  if (!pwa) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-bl from-red-50 via-white to-blue-50">
        <div className="text-center bg-white p-10 rounded-2xl shadow-2xl max-w-md border border-red-100">
          <h1 className="text-3xl font-extrabold text-red-600 mb-4 drop-shadow">PWA Não Encontrado</h1>
          <p className="text-gray-600 mb-4 text-base">
            O PWA solicitado não foi encontrado ou pode ter sido removido.
          </p>
          <a href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow mt-2 transition-all duration-150 font-semibold">
            Voltar ao Gerador de PWA
          </a>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-blue-100 via-white to-indigo-50"
      style={{ backgroundColor: pwa.config.backgroundColor }}
    >
      <div className="max-w-2xl mx-auto bg-white/90 rounded-3xl shadow-2xl p-9 border border-blue-100">
        <h1 
          className="text-5xl font-extrabold mb-5 tracking-tight drop-shadow-md"
          style={{ color: pwa.config.themeColor }}
        >
          {pwa.config.name}
        </h1>
        
        <p className="text-xl text-gray-700 mb-7 font-medium">
          {pwa.config.description}
        </p>
        
        <div className="bg-gradient-to-tr from-blue-50 via-indigo-100 to-blue-100 p-7 rounded-2xl mb-8 shadow-md border">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
            🚀
            <span className="tracking-wide">Seu PWA está funcionando!</span>
          </h2>
          <p className="text-gray-700 mb-4 text-base">
            Este é um Progressive Web App totalmente funcional gerado automaticamente.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-base">
            <div className="bg-white/80 p-4 rounded-2xl shadow space-y-2 border">
              <strong className="block text-blue-700">📱 Instalável</strong>
              <p className="text-gray-700">Pode ser instalado como app nativo</p>
            </div>
            <div className="bg-white/80 p-4 rounded-2xl shadow space-y-2 border">
              <strong className="block text-green-700">⚡ Offline</strong>
              <p className="text-gray-700">Funciona mesmo sem internet</p>
            </div>
            <div className="bg-white/80 p-4 rounded-2xl shadow space-y-2 border">
              <strong className="block text-indigo-700">🔄 Atualizações</strong>
              <p className="text-gray-700">Atualiza automaticamente</p>
            </div>
          </div>
        </div>

        <div className="text-base text-gray-500 mb-4">
          <p>PWA ID: <span className="font-mono text-xs">{pwa.id}</span></p>
          <p>Criado em: <span className="font-semibold">
            {new Intl.DateTimeFormat('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }).format(pwa.createdAt)}
          </span></p>
        </div>

        <div className="mt-8">
          <button
            onClick={() => window.location.href = '/'}
            className="bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-700 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 rounded-2xl font-bold text-lg shadow-md transition-all duration-200 hover:scale-105"
          >
            Criar Novo PWA
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAPage;
