
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Code, Zap, Shield, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ServiceWorkerConfig = () => {
  const { toast } = useToast();
  const [swConfig, setSWConfig] = useState({
    cacheStrategy: 'cacheFirst',
    offlineSupport: true,
    backgroundSync: true,
    pushNotifications: true,
    updateStrategy: 'skipWaiting',
    cacheName: 'pwa-cache-v1',
    filesToCache: [
      '/',
      '/index.html',
      '/manifest.json',
      '/styles.css',
      '/script.js'
    ]
  });

  const cacheStrategies = [
    { value: 'cacheFirst', label: 'Cache First', description: 'Serve from cache, fallback to network' },
    { value: 'networkFirst', label: 'Network First', description: 'Try network first, fallback to cache' },
    { value: 'staleWhileRevalidate', label: 'Stale While Revalidate', description: 'Serve from cache, update in background' },
    { value: 'networkOnly', label: 'Network Only', description: 'Always use network' },
    { value: 'cacheOnly', label: 'Cache Only', description: 'Always use cache' }
  ];

  const generateServiceWorker = () => {
    const sw = `
// Generated Service Worker for PWA
const CACHE_NAME = '${swConfig.cacheName}';
const urlsToCache = ${JSON.stringify(swConfig.filesToCache, null, 2)};

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        ${swConfig.updateStrategy === 'skipWaiting' ? 'self.skipWaiting();' : '// Skip waiting disabled'}
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      self.clients.claim();
    })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    ${generateFetchStrategy()}
  );
});

${swConfig.backgroundSync ? `
// Background Sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Background sync triggered');
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Implement your background sync logic here
  return Promise.resolve();
}
` : ''}

${swConfig.pushNotifications ? `
// Push Notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push received');
  
  const options = {
    body: event.data ? event.data.text() : 'Default notification body',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('PWA Notification', options)
  );
});

// Notification Click
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});
` : ''}
`;

    return sw.trim();
  };

  const generateFetchStrategy = () => {
    switch (swConfig.cacheStrategy) {
      case 'cacheFirst':
        return `
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
      .catch(() => {
        // Fallback for offline
        if (event.request.destination === 'document') {
          return caches.match('/offline.html');
        }
      })`;
      
      case 'networkFirst':
        return `
    fetch(event.request)
      .then((response) => {
        // Clone response before caching
        const responseClone = response.clone();
        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseClone);
          });
        return response;
      })
      .catch(() => {
        // Fallback to cache
        return caches.match(event.request);
      })`;
      
      case 'staleWhileRevalidate':
        return `
    caches.match(event.request)
      .then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
          });
          return networkResponse;
        });
        
        return cachedResponse || fetchPromise;
      })`;
      
      case 'networkOnly':
        return `fetch(event.request)`;
      
      case 'cacheOnly':
        return `caches.match(event.request)`;
      
      default:
        return `caches.match(event.request) || fetch(event.request)`;
    }
  };

  const downloadServiceWorker = () => {
    const swCode = generateServiceWorker();
    const blob = new Blob([swCode], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sw.js';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Service Worker Downloaded",
      description: "Your service worker file has been generated and downloaded!",
    });
  };

  return (
    <div className="space-y-6">
      {/* Service Worker Features */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Service Worker Features</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Offline Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <CardDescription className="text-xs">
                  Cache resources for offline access
                </CardDescription>
                <Switch
                  checked={swConfig.offlineSupport}
                  onCheckedChange={(checked) => 
                    setSWConfig(prev => ({ ...prev, offlineSupport: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Background Sync
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <CardDescription className="text-xs">
                  Sync data when connection returns
                </CardDescription>
                <Switch
                  checked={swConfig.backgroundSync}
                  onCheckedChange={(checked) => 
                    setSWConfig(prev => ({ ...prev, backgroundSync: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Push Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <CardDescription className="text-xs">
                  Send notifications to users
                </CardDescription>
                <Switch
                  checked={swConfig.pushNotifications}
                  onCheckedChange={(checked) => 
                    setSWConfig(prev => ({ ...prev, pushNotifications: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Update Strategy</CardTitle>
            </CardHeader>
            <CardContent>
              <Select 
                value={swConfig.updateStrategy} 
                onValueChange={(value) => setSWConfig(prev => ({ ...prev, updateStrategy: value }))}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="skipWaiting">Skip Waiting (Immediate)</SelectItem>
                  <SelectItem value="manual">Manual Update</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Cache Strategy */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Cache Strategy</h3>
        
        <div className="space-y-3">
          {cacheStrategies.map((strategy) => (
            <Card 
              key={strategy.value}
              className={`cursor-pointer transition-all ${
                swConfig.cacheStrategy === strategy.value 
                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => setSWConfig(prev => ({ ...prev, cacheStrategy: strategy.value }))}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{strategy.label}</h4>
                    <p className="text-sm text-gray-600">{strategy.description}</p>
                  </div>
                  {swConfig.cacheStrategy === strategy.value && (
                    <Badge variant="default">Selected</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Files to Cache */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Files to Cache</h3>
        
        <div className="space-y-2">
          <Label htmlFor="filesToCache">Specify files to cache for offline access</Label>
          <Textarea
            id="filesToCache"
            value={swConfig.filesToCache.join('\n')}
            onChange={(e) => setSWConfig(prev => ({ 
              ...prev, 
              filesToCache: e.target.value.split('\n').filter(line => line.trim()) 
            }))}
            placeholder="Enter one file path per line"
            rows={6}
            className="font-mono text-sm"
          />
          <p className="text-xs text-gray-500">
            One file path per line. These files will be cached for offline access.
          </p>
        </div>
      </div>

      {/* Generated Service Worker Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Generated Service Worker</h3>
          <Button onClick={downloadServiceWorker}>
            <Download className="w-4 h-4 mr-2" />
            Download sw.js
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <pre className="text-xs bg-gray-50 p-4 rounded-lg overflow-x-auto max-h-64">
              <code>{generateServiceWorker()}</code>
            </pre>
          </CardContent>
        </Card>
      </div>

      {/* Installation Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            Installation Instructions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm space-y-2">
            <p><strong>1.</strong> Add this to your HTML head:</p>
            <code className="block bg-gray-100 p-2 rounded text-xs">
              {`<link rel="manifest" href="/manifest.json">`}
            </code>
            
            <p><strong>2.</strong> Register the service worker:</p>
            <code className="block bg-gray-100 p-2 rounded text-xs">
              {`if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}`}
            </code>
            
            <p><strong>3.</strong> Place both files in your web root directory</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
