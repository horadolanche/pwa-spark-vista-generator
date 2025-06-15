
import { supabase } from '@/integrations/supabase/client';

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
  private storageKey = 'generated-pwas';

  generatePWAId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  async generatePWA(config: any): Promise<GeneratedPWA> {
    const pwaId = this.generatePWAId();
    
    // Salvar no Supabase
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      throw new Error('Usuário não autenticado');
    }

    const { data, error } = await supabase
      .from('pwas')
      .insert({
        id: pwaId,
        name: config.name,
        short_name: config.shortName,
        description: config.description,
        theme_color: config.themeColor,
        background_color: config.backgroundColor,
        display: config.display,
        orientation: config.orientation,
        icons: config.icons || [],
        user_id: user.user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao salvar PWA:', error);
      throw new Error('Falha ao salvar PWA no banco de dados');
    }

    const generatedPWA: GeneratedPWA = {
      id: pwaId,
      name: config.name,
      shortName: config.shortName,
      description: config.description,
      createdAt: new Date(data.created_at),
      url: `${window.location.origin}/pwas/${pwaId}`,
      config: {
        ...config,
        themeColor: data.theme_color,
        backgroundColor: data.background_color,
        display: data.display,
        orientation: data.orientation,
        icons: data.icons
      }
    };
    
    return generatedPWA;
  }

  // Buscar PWAs do usuário atual no Supabase
  async getGeneratedPWAs(): Promise<GeneratedPWA[]> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      return [];
    }

    const { data, error } = await supabase
      .from('pwas')
      .select('*')
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao carregar PWAs:', error);
      return [];
    }

    return data.map(pwa => ({
      id: pwa.id,
      name: pwa.name,
      shortName: pwa.short_name,
      description: pwa.description || '',
      createdAt: new Date(pwa.created_at),
      url: `${window.location.origin}/pwas/${pwa.id}`,
      config: {
        name: pwa.name,
        shortName: pwa.short_name,
        description: pwa.description,
        themeColor: pwa.theme_color,
        backgroundColor: pwa.background_color,
        display: pwa.display,
        orientation: pwa.orientation,
        icons: pwa.icons || []
      }
    }));
  }

  // Buscar PWA específico por ID (público para qualquer usuário acessar)
  async getPWAById(id: string): Promise<GeneratedPWA | undefined> {
    const { data, error } = await supabase
      .from('pwas')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error('PWA não encontrado:', error);
      return undefined;
    }

    return {
      id: data.id,
      name: data.name,
      shortName: data.short_name,
      description: data.description || '',
      createdAt: new Date(data.created_at),
      url: `${window.location.origin}/pwas/${data.id}`,
      config: {
        name: data.name,
        shortName: data.short_name,
        description: data.description,
        themeColor: data.theme_color,
        backgroundColor: data.background_color,
        display: data.display,
        orientation: data.orientation,
        icons: data.icons || []
      }
    };
  }

  async deletePWA(id: string): Promise<boolean> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      return false;
    }

    const { error } = await supabase
      .from('pwas')
      .delete()
      .eq('id', id)
      .eq('user_id', user.user.id);

    if (error) {
      console.error('Erro ao deletar PWA:', error);
      return false;
    }

    return true;
  }
}

export const pwaGenerationService = new PWAGenerationService();
