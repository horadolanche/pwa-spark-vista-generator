
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Monitor, Wifi, Battery, Signal } from 'lucide-react';
import { PWAConfig } from './PWAGenerator';

interface PWAPreviewProps {
  config: PWAConfig;
  mode: 'mobile' | 'desktop';
}

export const PWAPreview = ({ config, mode }: PWAPreviewProps) => {
  const defaultIcon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%236366f1'/%3E%3Ctext x='50' y='55' text-anchor='middle' fill='white' font-size='40' font-family='Arial'%3E📱%3C/text%3E%3C/svg%3E";
  
  const iconSrc = config.icons.find(icon => icon.sizes === '192x192')?.src || defaultIcon;

  if (mode === 'mobile') {
    return (
      <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Mobile Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mx-auto max-w-sm">
            {/* Phone Frame */}
            <div className="relative bg-gray-900 rounded-3xl p-2 shadow-2xl">
              {/* Status Bar */}
              <div className="flex justify-between items-center text-white text-xs px-4 py-2">
                <span>9:41</span>
                <div className="flex items-center gap-1">
                  <Signal className="w-3 h-3" />
                  <Wifi className="w-3 h-3" />
                  <Battery className="w-3 h-3" />
                </div>
              </div>
              
              {/* Screen */}
              <div 
                className="aspect-[9/19.5] rounded-2xl overflow-hidden relative"
                style={{ backgroundColor: config.backgroundColor }}
              >
                {/* App Header */}
                <div 
                  className="h-16 flex items-center justify-between px-4 text-white shadow-lg"
                  style={{ backgroundColor: config.themeColor }}
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={iconSrc} 
                      alt="App Icon" 
                      className="w-8 h-8 rounded-lg"
                    />
                    <h3 className="font-semibold text-lg">{config.shortName}</h3>
                  </div>
                </div>

                {/* App Content */}
                <div className="p-6 space-y-4">
                  <div className="text-center space-y-2">
                    <img 
                      src={iconSrc} 
                      alt="App Icon" 
                      className="w-20 h-20 mx-auto rounded-2xl shadow-lg"
                    />
                    <h2 className="text-xl font-bold text-gray-800">{config.name}</h2>
                    <p className="text-sm text-gray-600">{config.description}</p>
                  </div>

                  {/* Sample Content */}
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    <div className="h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">Your PWA Content</span>
                    </div>
                  </div>
                </div>

                {/* Install Banner */}
                <div className="absolute bottom-0 left-0 right-0 bg-white border-t p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={iconSrc} alt="Icon" className="w-10 h-10 rounded-lg" />
                      <div>
                        <div className="font-medium text-sm">{config.name}</div>
                        <div className="text-xs text-gray-500">Install App</div>
                      </div>
                    </div>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
                      Install
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* PWA Features */}
            <div className="mt-6 space-y-3">
              <h4 className="font-semibold text-gray-800">PWA Features</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Offline Ready</Badge>
                <Badge variant="secondary">Installable</Badge>
                <Badge variant="secondary">Push Notifications</Badge>
                <Badge variant="secondary">App-like Experience</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="w-5 h-5" />
          Desktop Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-100 rounded-lg p-4">
          {/* Browser Window */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Browser Header */}
            <div className="bg-gray-200 px-4 py-2 flex items-center gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex-1 bg-white rounded px-3 py-1 text-sm text-gray-600 ml-4">
                {config.startUrl === '/' ? 'your-pwa.com' : `your-pwa.com${config.startUrl}`}
              </div>
            </div>

            {/* App Content */}
            <div 
              className="min-h-96"
              style={{ backgroundColor: config.backgroundColor }}
            >
              {/* App Bar */}
              <div 
                className="h-16 flex items-center px-6 text-white shadow-sm"
                style={{ backgroundColor: config.themeColor }}
              >
                <div className="flex items-center gap-3">
                  <img 
                    src={iconSrc} 
                    alt="App Icon" 
                    className="w-8 h-8 rounded-lg"
                  />
                  <h3 className="font-semibold text-lg">{config.name}</h3>
                </div>
              </div>

              {/* Main Content */}
              <div className="p-8">
                <div className="max-w-4xl mx-auto space-y-6">
                  <div className="text-center space-y-4">
                    <img 
                      src={iconSrc} 
                      alt="App Icon" 
                      className="w-24 h-24 mx-auto rounded-3xl shadow-lg"
                    />
                    <h1 className="text-3xl font-bold text-gray-800">{config.name}</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">{config.description}</p>
                  </div>

                  {/* Content Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                      <div className="h-4 bg-gray-200 rounded mb-3"></div>
                      <div className="h-20 bg-gray-100 rounded"></div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                      <div className="h-4 bg-gray-200 rounded mb-3"></div>
                      <div className="h-20 bg-gray-100 rounded"></div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                      <div className="h-4 bg-gray-200 rounded mb-3"></div>
                      <div className="h-20 bg-gray-100 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Install Prompt */}
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={iconSrc} alt="Icon" className="w-12 h-12 rounded-lg" />
                <div>
                  <div className="font-medium">{config.name}</div>
                  <div className="text-sm text-gray-600">Install this app for a better experience</div>
                </div>
              </div>
              <button className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium">
                Install
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
