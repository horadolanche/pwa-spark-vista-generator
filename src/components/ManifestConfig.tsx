
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PWAConfig } from './PWAGenerator';

interface ManifestConfigProps {
  config: PWAConfig;
  updateConfig: (updates: Partial<PWAConfig>) => void;
}

export const ManifestConfig = ({ config, updateConfig }: ManifestConfigProps) => {
  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">App Name</Label>
            <Input
              id="name"
              value={config.name}
              onChange={(e) => updateConfig({ name: e.target.value })}
              placeholder="My Awesome PWA"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="shortName">Short Name</Label>
            <Input
              id="shortName"
              value={config.shortName}
              onChange={(e) => updateConfig({ shortName: e.target.value })}
              placeholder="MyPWA"
              maxLength={12}
            />
            <p className="text-xs text-gray-500">Max 12 characters for home screen</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={config.description}
            onChange={(e) => updateConfig({ description: e.target.value })}
            placeholder="Describe what your PWA does..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startUrl">Start URL</Label>
            <Input
              id="startUrl"
              value={config.startUrl}
              onChange={(e) => updateConfig({ startUrl: e.target.value })}
              placeholder="/"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="scope">Scope</Label>
            <Input
              id="scope"
              value={config.scope}
              onChange={(e) => updateConfig({ scope: e.target.value })}
              placeholder="/"
            />
          </div>
        </div>
      </div>

      {/* Display Configuration */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Display Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="display">Display Mode</Label>
            <Select value={config.display} onValueChange={(value) => updateConfig({ display: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standalone">Standalone (App-like)</SelectItem>
                <SelectItem value="fullscreen">Fullscreen</SelectItem>
                <SelectItem value="minimal-ui">Minimal UI</SelectItem>
                <SelectItem value="browser">Browser</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="orientation">Orientation</Label>
            <Select value={config.orientation} onValueChange={(value) => updateConfig({ orientation: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="portrait">Portrait</SelectItem>
                <SelectItem value="landscape">Landscape</SelectItem>
                <SelectItem value="any">Any</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Colors */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Colors</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="themeColor">Theme Color</Label>
            <div className="flex gap-2">
              <Input
                id="themeColor"
                type="color"
                value={config.themeColor}
                onChange={(e) => updateConfig({ themeColor: e.target.value })}
                className="w-16 h-10 p-1 border rounded"
              />
              <Input
                value={config.themeColor}
                onChange={(e) => updateConfig({ themeColor: e.target.value })}
                placeholder="#6366f1"
                className="flex-1"
              />
            </div>
            <p className="text-xs text-gray-500">Status bar and browser UI color</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="backgroundColor">Background Color</Label>
            <div className="flex gap-2">
              <Input
                id="backgroundColor"
                type="color"
                value={config.backgroundColor}
                onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
                className="w-16 h-10 p-1 border rounded"
              />
              <Input
                value={config.backgroundColor}
                onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
                placeholder="#ffffff"
                className="flex-1"
              />
            </div>
            <p className="text-xs text-gray-500">App background while loading</p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Categories</h3>
        <Select 
          value={config.categories[0] || ''} 
          onValueChange={(value) => updateConfig({ categories: [value] })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="education">Education</SelectItem>
            <SelectItem value="entertainment">Entertainment</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="fitness">Fitness</SelectItem>
            <SelectItem value="food">Food</SelectItem>
            <SelectItem value="games">Games</SelectItem>
            <SelectItem value="government">Government</SelectItem>
            <SelectItem value="health">Health</SelectItem>
            <SelectItem value="kids">Kids</SelectItem>
            <SelectItem value="lifestyle">Lifestyle</SelectItem>
            <SelectItem value="magazines">Magazines</SelectItem>
            <SelectItem value="medical">Medical</SelectItem>
            <SelectItem value="music">Music</SelectItem>
            <SelectItem value="navigation">Navigation</SelectItem>
            <SelectItem value="news">News</SelectItem>
            <SelectItem value="personalization">Personalization</SelectItem>
            <SelectItem value="photo">Photo</SelectItem>
            <SelectItem value="politics">Politics</SelectItem>
            <SelectItem value="productivity">Productivity</SelectItem>
            <SelectItem value="security">Security</SelectItem>
            <SelectItem value="shopping">Shopping</SelectItem>
            <SelectItem value="social">Social</SelectItem>
            <SelectItem value="sports">Sports</SelectItem>
            <SelectItem value="travel">Travel</SelectItem>
            <SelectItem value="utilities">Utilities</SelectItem>
            <SelectItem value="weather">Weather</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500">Help users discover your app in app stores</p>
      </div>
    </div>
  );
};
