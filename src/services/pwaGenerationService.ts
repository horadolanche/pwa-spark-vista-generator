
export interface GeneratedPWA {
  id: string;
  name: string;
  shortName: string;
  description: string;
  createdAt: Date;
  url: string;
  config: any;
}

class PWAGenerationService {
  private generatedPWAs: GeneratedPWA[] = [];

  generatePWAId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  async generatePWA(config: any): Promise<GeneratedPWA> {
    const pwaId = this.generatePWAId();
    
    // Simula a criação da estrutura de arquivos
    const pwaStructure = this.createPWAStructure(config, pwaId);
    
    // Simula o salvamento dos arquivos (em uma implementação real, 
    // isso seria feito no servidor)
    await this.savePWAFiles(pwaId, pwaStructure);
    
    const generatedPWA: GeneratedPWA = {
      id: pwaId,
      name: config.name,
      shortName: config.shortName,
      description: config.description,
      createdAt: new Date(),
      url: `${window.location.origin}/pwas/${pwaId}`,
      config: config
    };
    
    this.generatedPWAs.push(generatedPWA);
    
    return generatedPWA;
  }

  private createPWAStructure(config: any, pwaId: string) {
    const manifest = {
      name: config.name,
      short_name: config.shortName,
      description: config.description,
      start_url: "./",
      display: config.display,
      theme_color: config.themeColor,
      background_color: config.backgroundColor,
      orientation: config.orientation,
      scope: "./",
      icons: config.icons,
      categories: config.categories
    };

    const serviceWorker = this.generateServiceWorkerCode(config.name);
    const indexHtml = this.generateIndexHtml(config);

    return {
      'manifest.json': JSON.stringify(manifest, null, 2),
      'sw.js': serviceWorker,
      'index.html': indexHtml,
      'assets/': {} // Pasta para ícones e outros assets
    };
  }

  private generateServiceWorkerCode(appName: string): string {
    return `// Service Worker para ${appName}
const CACHE_NAME = '${appName.toLowerCase().replace(/\s+/g, '-')}-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// Install event
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

// Activate event
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

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
      .catch(() => {
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      })
  );
});`;
  }

  private generateIndexHtml(config: any): string {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.name}</title>
    <meta name="description" content="${config.description}">
    
    <!-- PWA Manifest -->
    <link rel="manifest" href="./manifest.json">
    
    <!-- Theme color -->
    <meta name="theme-color" content="${config.themeColor}">
    
    <!-- Favicon -->
    <link rel="icon" href="./assets/icon-192x192.png" type="image/png">
    
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: ${config.backgroundColor};
            color: #333;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
        }
        
        .container {
            max-width: 600px;
            padding: 40px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        
        h1 {
            color: ${config.themeColor};
            margin-bottom: 20px;
        }
        
        .install-button {
            background: ${config.themeColor};
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            margin-top: 20px;
        }
        
        .install-button:hover {
            opacity: 0.9;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>${config.name}</h1>
        <p>${config.description}</p>
        <p>Este é seu PWA gerado automaticamente! 🚀</p>
        <button class="install-button" id="installBtn" style="display: none;">
            Instalar App
        </button>
    </div>

    <!-- Service Worker Registration -->
    <script>
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./sw.js')
                    .then((registration) => {
                        console.log('SW registrado:', registration);
                    })
                    .catch((error) => {
                        console.log('Erro no SW:', error);
                    });
            });
        }

        // PWA Install Prompt
        let deferredPrompt;
        const installBtn = document.getElementById('installBtn');

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            installBtn.style.display = 'block';
        });

        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log('User choice:', outcome);
                deferredPrompt = null;
                installBtn.style.display = 'none';
            }
        });
    </script>
</body>
</html>`;
  }

  private async savePWAFiles(pwaId: string, structure: any): Promise<void> {
    // Em uma implementação real, isso salvaria os arquivos no servidor
    // Por agora, vamos simular o processo
    console.log(`Salvando PWA ${pwaId} com estrutura:`, structure);
    
    // Simula delay de salvamento
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  getGeneratedPWAs(): GeneratedPWA[] {
    return this.generatedPWAs;
  }

  getPWAById(id: string): GeneratedPWA | undefined {
    return this.generatedPWAs.find(pwa => pwa.id === id);
  }

  deletePWA(id: string): boolean {
    const index = this.generatedPWAs.findIndex(pwa => pwa.id === id);
    if (index !== -1) {
      this.generatedPWAs.splice(index, 1);
      return true;
    }
    return false;
  }
}

export const pwaGenerationService = new PWAGenerationService();
