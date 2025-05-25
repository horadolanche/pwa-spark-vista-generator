
import React, { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Smartphone, Download, Eye, Settings, Image, Code } from 'lucide-react';
import { PWAPreview } from './PWAPreview';
import { IconGenerator } from './IconGenerator';
import { ManifestConfig } from './ManifestConfig';
import { ServiceWorkerConfig } from './ServiceWorkerConfig';
import { useToast } from '@/hooks/use-toast';

export interface PWAConfig {
  name: string;
  shortName: string;
  description: string;
  startUrl: string;
  display: string;
  themeColor: string;
  backgroundColor: string;
  orientation: string;
  scope: string;
  icons: Array<{
    src: string;
    sizes: string;
    type: string;
    purpose?: string;
  }>;
  categories: string[];
  screenshots: Array<{
    src: string;
    sizes: string;
    type: string;
    form_factor?: string;
  }>;
}

const PWAGenerator = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState<PWAConfig>({
    name: 'My Awesome PWA',
    shortName: 'MyPWA',
    description: 'An amazing Progressive Web App built with PWA Generator',
    startUrl: '/',
    display: 'standalone',
    themeColor: '#6366f1',
    backgroundColor: '#ffffff',
    orientation: 'portrait',
    scope: '/',
    icons: [],
    categories: ['productivity'],
    screenshots: []
  });

  const [activeTab, setActiveTab] = useState('manifest');
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');

  const updateConfig = useCallback((updates: Partial<PWAConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const generateManifest = () => {
    const manifest = {
      name: config.name,
      short_name: config.shortName,
      description: config.description,
      start_url: config.startUrl,
      display: config.display,
      theme_color: config.themeColor,
      background_color: config.backgroundColor,
      orientation: config.orientation,
      scope: config.scope,
      icons: config.icons,
      categories: config.categories,
      screenshots: config.screenshots
    };

    return JSON.stringify(manifest, null, 2);
  };

  const downloadManifest = () => {
    const manifest = generateManifest();
    const blob = new Blob([manifest], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'manifest.json';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Manifest Downloaded",
      description: "Your PWA manifest.json has been downloaded successfully!",
    });
  };

  const downloadAll = () => {
    toast({
      title: "Generating PWA Files",
      description: "Preparing all PWA files for download...",
    });
    
    // This would generate and download a complete PWA package
    setTimeout(() => {
      downloadManifest();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            PWA Generator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create complete Progressive Web Apps with manifest, icons, service worker, and real-time preview
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <div className="space-y-6">
            <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  PWA Configuration
                </CardTitle>
                <CardDescription>
                  Configure your Progressive Web App settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="manifest" className="text-xs">
                      <Code className="w-4 h-4 mr-1" />
                      Manifest
                    </TabsTrigger>
                    <TabsTrigger value="icons" className="text-xs">
                      <Image className="w-4 h-4 mr-1" />
                      Icons
                    </TabsTrigger>
                    <TabsTrigger value="sw" className="text-xs">
                      <Settings className="w-4 h-4 mr-1" />
                      Service Worker
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="text-xs">
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="manifest">
                    <ManifestConfig config={config} updateConfig={updateConfig} />
                  </TabsContent>

                  <TabsContent value="icons">
                    <IconGenerator config={config} updateConfig={updateConfig} />
                  </TabsContent>

                  <TabsContent value="sw">
                    <ServiceWorkerConfig />
                  </TabsContent>

                  <TabsContent value="preview">
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Button
                          variant={previewMode === 'mobile' ? 'default' : 'outline'}
                          onClick={() => setPreviewMode('mobile')}
                          size="sm"
                        >
                          <Smartphone className="w-4 h-4 mr-2" />
                          Mobile
                        </Button>
                        <Button
                          variant={previewMode === 'desktop' ? 'default' : 'outline'}
                          onClick={() => setPreviewMode('desktop')}
                          size="sm"
                        >
                          Desktop
                        </Button>
                      </div>
                      <div className="text-sm text-gray-600">
                        Preview how your PWA will look on different devices
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button 
                onClick={downloadManifest}
                variant="outline"
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Manifest
              </Button>
              <Button 
                onClick={downloadAll}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Download All Files
              </Button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <PWAPreview config={config} mode={previewMode} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAGenerator;
