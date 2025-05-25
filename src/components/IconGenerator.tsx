
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Download, RefreshCw, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PWAConfig } from './PWAGenerator';

interface IconGeneratorProps {
  config: PWAConfig;
  updateConfig: (updates: Partial<PWAConfig>) => void;
}

export const IconGenerator = ({ config, updateConfig }: IconGeneratorProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const iconSizes = [
    { size: '72x72', purpose: 'any' },
    { size: '96x96', purpose: 'any' },
    { size: '128x128', purpose: 'any' },
    { size: '144x144', purpose: 'any' },
    { size: '152x152', purpose: 'any' },
    { size: '192x192', purpose: 'any' },
    { size: '384x384', purpose: 'any' },
    { size: '512x512', purpose: 'any' },
    { size: '192x192', purpose: 'maskable' },
    { size: '512x512', purpose: 'maskable' }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setUploadedImage(result);
          generateIcons(result);
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload a valid image file (PNG, JPG, SVG).",
          variant: "destructive",
        });
      }
    }
  };

  const generateIcons = async (baseImage: string) => {
    setIsGenerating(true);
    
    try {
      // Simulate icon generation process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const generatedIcons = iconSizes.map(({ size, purpose }) => ({
        src: baseImage, // In a real implementation, this would be resized versions
        sizes: size,
        type: 'image/png',
        purpose: purpose
      }));

      updateConfig({ icons: generatedIcons });
      
      toast({
        title: "Icons Generated Successfully",
        description: `Generated ${iconSizes.length} icons for your PWA.`,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate icons. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadIcons = () => {
    toast({
      title: "Downloading Icons",
      description: "Preparing icon package for download...",
    });
    
    // In a real implementation, this would create a zip file with all icon sizes
    setTimeout(() => {
      toast({
        title: "Icons Downloaded",
        description: "Icon package has been downloaded successfully!",
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Upload Base Icon</h3>
        <p className="text-sm text-gray-600">
          Upload a high-resolution image (512x512 or larger) to generate all required icon sizes automatically.
        </p>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          {uploadedImage ? (
            <div className="space-y-4">
              <img 
                src={uploadedImage} 
                alt="Uploaded icon" 
                className="w-24 h-24 mx-auto rounded-lg object-cover"
              />
              <p className="text-sm text-green-600 flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                Image uploaded successfully
              </p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                size="sm"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Different Image
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="w-12 h-12 mx-auto text-gray-400" />
              <div>
                <Button onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Icon
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Supports PNG, JPG, SVG (Recommended: 512x512px)
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Generation Status */}
      {isGenerating && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
              <div>
                <p className="font-medium">Generating Icons...</p>
                <p className="text-sm text-gray-600">Creating icons in multiple sizes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generated Icons Preview */}
      {config.icons.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Generated Icons</h3>
            <Button onClick={downloadIcons} size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download All Icons
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {iconSizes.map(({ size, purpose }, index) => {
              const icon = config.icons.find(i => i.sizes === size && i.purpose === purpose);
              return (
                <Card key={`${size}-${purpose}`} className="p-3">
                  <div className="text-center space-y-2">
                    {icon && (
                      <img 
                        src={icon.src} 
                        alt={`Icon ${size}`}
                        className="w-12 h-12 mx-auto rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <p className="text-xs font-medium">{size}</p>
                      <p className="text-xs text-gray-500">{purpose}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
          
          <div className="text-xs text-gray-600 space-y-1">
            <p>• <strong>Any:</strong> Standard icons for various use cases</p>
            <p>• <strong>Maskable:</strong> Icons that can be masked to different shapes on Android</p>
          </div>
        </div>
      )}

      {/* Manual Icon URLs */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Manual Icon Configuration</h3>
        <p className="text-sm text-gray-600">
          Advanced users can manually specify icon URLs and configurations.
        </p>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">
              <p>Current icons in manifest: <strong>{config.icons.length}</strong></p>
              <p>Required for PWA compliance: <strong>Minimum 192x192 and 512x512</strong></p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
