
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Smartphone, Zap, Globe, Download, Sparkles, Rocket } from "lucide-react";
import { PWAGenerator } from "@/components/PWAGenerator";
import { GeneratedPWAsList } from "@/components/GeneratedPWAsList";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"generator" | "list">("generator");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 text-white/90 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Gerador de PWA Profissional
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            PWA Spark Vista
            <span className="block text-3xl md:text-4xl bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent mt-2">
              Generator
            </span>
          </h1>
          
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Crie Progressive Web Apps profissionais em segundos. 
            Transforme suas ideias em aplicações modernas, instaláveis e funcionais.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <Smartphone className="w-8 h-8 text-yellow-300 mb-3 mx-auto" />
              <h3 className="text-white font-semibold mb-2">100% Responsivo</h3>
              <p className="text-blue-100 text-sm">Funciona perfeitamente em todos os dispositivos</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <Zap className="w-8 h-8 text-yellow-300 mb-3 mx-auto" />
              <h3 className="text-white font-semibold mb-2">Super Rápido</h3>
              <p className="text-blue-100 text-sm">Carregamento instantâneo e cache inteligente</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <Download className="w-8 h-8 text-yellow-300 mb-3 mx-auto" />
              <h3 className="text-white font-semibold mb-2">Instalável</h3>
              <p className="text-blue-100 text-sm">Instale como app nativo em qualquer dispositivo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-6 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab("generator")}
              className={`flex-1 px-8 py-6 text-center font-semibold text-lg transition-all duration-200 relative ${
                activeTab === "generator"
                  ? "text-blue-600 bg-blue-50 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Rocket className="w-5 h-5" />
                Criar PWA
              </div>
              {activeTab === "generator" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-purple-500"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("list")}
              className={`flex-1 px-8 py-6 text-center font-semibold text-lg transition-all duration-200 relative ${
                activeTab === "list"
                  ? "text-blue-600 bg-blue-50 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Globe className="w-5 h-5" />
                PWAs Criados
              </div>
              {activeTab === "list" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-purple-500"></div>
              )}
            </button>
          </div>

          {/* Content Area */}
          <div className="p-8">
            {activeTab === "generator" ? (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-3">
                    Configure seu PWA
                  </h2>
                  <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    Preencha as informações abaixo para gerar seu Progressive Web App personalizado
                  </p>
                </div>
                
                <div className="max-w-4xl mx-auto">
                  <PWAGenerator />
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-3">
                    Seus PWAs Gerados
                  </h2>
                  <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    Aqui estão todos os Progressive Web Apps que você criou
                  </p>
                </div>
                
                <div className="max-w-6xl mx-auto">
                  <GeneratedPWAsList />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              PWA Spark Vista Generator
            </h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              A ferramenta mais avançada para criar Progressive Web Apps profissionais. 
              Transforme suas ideias em realidade com tecnologia de ponta.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="outline" className="text-blue-400 border-blue-400">
                React + Vite
              </Badge>
              <Badge variant="outline" className="text-purple-400 border-purple-400">
                TypeScript
              </Badge>
              <Badge variant="outline" className="text-green-400 border-green-400">
                Service Worker
              </Badge>
              <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                Web App Manifest
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
