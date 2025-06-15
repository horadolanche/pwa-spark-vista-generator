import React, { useState, useCallback, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Smartphone, Download, Eye, Settings, Image, Code, Zap, List } from 'lucide-react';
import { PWAPreview } from './PWAPreview';
import { IconGenerator } from './IconGenerator';
import { ManifestConfig } from './ManifestConfig';
import { ServiceWorkerConfig } from './ServiceWorkerConfig';
import { GeneratedPWAsList } from './GeneratedPWAsList';
import { useToast } from '@/hooks/use-toast';
import { pwaGenerationService, GeneratedPWA } from '@/services/pwaGenerationService';

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
  const [generatedPWAs, setGeneratedPWAs] = useState<GeneratedPWA[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Carregar PWAs quando o componente montar
  useEffect(() => {
    const loadPWAs = async () => {
      try {
        const pwas = await pwaGenerationService.getGeneratedPWAs();
        setGeneratedPWAs(pwas);
      } catch (error) {
        console.error('Erro ao carregar PWAs:', error);
      }
    };

    loadPWAs();
  }, []);

  const updateConfig = useCallback((updates: Partial<PWAConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const generatePWA = async () => {
    setIsGenerating(true);
    
    try {
      toast({
        title: "Gerando PWA...",
        description: "Criando estrutura de arquivos e configurações...",
      });

      const generatedPWA = await pwaGenerationService.generatePWA(config);
      
      setGeneratedPWAs(prev => [generatedPWA, ...prev]);
      
      toast({
        title: "PWA Gerado com Sucesso! 🚀",
        description: `${config.name} está pronto e acessível via link direto.`,
      });

      // Automaticamente muda para a aba de PWAs gerados
      setActiveTab('generated');
      
    } catch (error) {
      console.error('Erro na geração do PWA:', error);
      toast({
        title: "Erro na Geração",
        description: "Falha ao gerar o PWA. Verifique sua conexão e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeletePWA = async (id: string) => {
    const deleted = await pwaGenerationService.deletePWA(id);
    if (deleted) {
      setGeneratedPWAs(prev => prev.filter(pwa => pwa.id !== id));
      toast({
        title: "PWA Excluído",
        description: "O PWA foi removido com sucesso.",
      });
    } else {
      toast({
        title: "Erro ao Excluir",
        description: "Não foi possível excluir o PWA.",
        variant: "destructive",
      });
    }
  };

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
            Crie PWAs completos instantaneamente com links diretos para acesso imediato
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
                  Configure seu PWA e gere instantaneamente com link direto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
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
                      SW
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="text-xs">
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </TabsTrigger>
                    <TabsTrigger value="generated" className="text-xs">
                      <List className="w-4 h-4 mr-1" />
                      PWAs ({generatedPWAs.length})
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
                        Preview como seu PWA aparecerá em diferentes dispositivos
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="generated">
                    <GeneratedPWAsList 
                      pwas={generatedPWAs} 
                      onDelete={handleDeletePWA}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button 
                onClick={generatePWA}
                disabled={isGenerating}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Zap className="w-4 h-4 mr-2" />
                {isGenerating ? 'Gerando...' : 'Gerar PWA Instantâneo'}
              </Button>
            </div>

            {/* Info Card */}
            <Card className="border-blue-200 bg-blue-50/50">
              <CardContent className="p-4">
                <div className="text-sm space-y-2">
                  <h4 className="font-medium text-blue-900">✨ Novo Fluxo Instantâneo:</h4>
                  <ul className="space-y-1 text-blue-700">
                    <li>• PWA gerado automaticamente na estrutura do sistema</li>
                    <li>• Link direto criado para acesso imediato</li>
                    <li>• Copie e compartilhe o link instantaneamente</li>
                    <li>• Sem necessidade de download manual</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
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
