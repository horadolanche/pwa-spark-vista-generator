
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink, Trash2, Calendar, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GeneratedPWA } from '@/services/pwaGenerationService';

interface GeneratedPWAsListProps {
  pwas: GeneratedPWA[];
  onDelete: (id: string) => void;
}

export const GeneratedPWAsList = ({ pwas, onDelete }: GeneratedPWAsListProps) => {
  const { toast } = useToast();

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link Copiado!",
        description: "O link do PWA foi copiado para a área de transferência.",
      });
    } catch (error) {
      toast({
        title: "Erro ao Copiar",
        description: "Não foi possível copiar o link.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (pwas.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Globe className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Nenhum PWA gerado ainda.</p>
          <p className="text-sm text-gray-500">Configure um PWA e clique em "Gerar PWA" para começar!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">PWAs Gerados ({pwas.length})</h2>
      
      <div className="space-y-3">
        {pwas.map((pwa) => (
          <Card key={pwa.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{pwa.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {pwa.description}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {pwa.shortName}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                {/* URL do PWA */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <Globe className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700 truncate">
                        {pwa.url}
                      </span>
                    </div>
                    <div className="flex gap-2 ml-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(pwa.url)}
                        className="px-2"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(pwa.url, '_blank')}
                        className="px-2"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Informações adicionais */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Criado em {formatDate(pwa.createdAt)}</span>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(pwa.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Excluir
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
