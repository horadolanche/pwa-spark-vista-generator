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

  async generatePWA(config: any): Promise<GeneratedPWA> {
    console.log('🔧 PWAGenerationService.generatePWA chamado com:', config);

    try {
      // Verificar autenticação
      console.log('🔐 Verificando autenticação...');
      const { data: user, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.error('❌ Erro ao verificar usuário:', userError);
        throw new Error('Erro de autenticação: ' + userError.message);
      }

      if (!user.user) {
        console.error('❌ Usuário não autenticado');
        throw new Error('Usuário não autenticado. Faça login para continuar.');
      }

      console.log('✅ Usuário autenticado:', user.user.id);

      // Preparar dados para inserção (sem ID)
      const pwaData = {
        name: config.name,
        short_name: config.shortName,
        description: config.description,
        theme_color: config.themeColor,
        background_color: config.backgroundColor,
        display: config.display,
        orientation: config.orientation,
        icons: config.icons || [],
        user_id: user.user.id,
      };

      console.log('💾 Inserindo PWA no Supabase:', pwaData);

      // Salvar no Supabase (ID UUID será gerado pelo banco)
      const { data, error } = await supabase
        .from('pwas')
        .insert(pwaData)
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao salvar PWA no Supabase:', error);
        throw new Error('Falha ao salvar PWA no banco de dados: ' + error.message);
      }

      console.log('✅ PWA salvo com sucesso no Supabase:', data);

      const generatedPWA: GeneratedPWA = {
        id: data.id, // O ID agora é UUID gerado pelo banco
        name: config.name,
        shortName: config.shortName,
        description: config.description,
        createdAt: new Date(data.created_at),
        url: `${window.location.origin}/pwas/${data.id}`,
        config: {
          ...config,
          themeColor: data.theme_color,
          backgroundColor: data.background_color,
          display: data.display,
          orientation: data.orientation,
          icons: data.icons
        }
      };

      console.log('🎉 PWA gerado com sucesso:', generatedPWA);
      return generatedPWA;

    } catch (error) {
      console.error('💥 Erro geral na geração do PWA:', error);
      throw error;
    }
  }

  // Buscar PWAs do usuário atual no Supabase
  async getGeneratedPWAs(): Promise<GeneratedPWA[]> {
    try {
      console.log('📋 Buscando PWAs do usuário...');
      
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        console.log('⚠️ Usuário não autenticado, retornando lista vazia');
        return [];
      }

      console.log('👤 Buscando PWAs para usuário:', user.user.id);

      const { data, error } = await supabase
        .from('pwas')
        .select('*')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erro ao carregar PWAs:', error);
        return [];
      }

      console.log('✅ PWAs encontrados:', data?.length || 0);

      return (data || []).map(pwa => ({
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
    } catch (error) {
      console.error('💥 Erro geral ao buscar PWAs:', error);
      return [];
    }
  }

  // Buscar PWA específico por ID (público para qualquer usuário acessar)
  async getPWAById(id: string): Promise<GeneratedPWA | undefined> {
    try {
      console.log('🔍 Buscando PWA por ID:', id);
      
      const { data, error } = await supabase
        .from('pwas')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        console.error('❌ PWA não encontrado:', error);
        return undefined;
      }

      console.log('✅ PWA encontrado:', data);

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
    } catch (error) {
      console.error('💥 Erro geral ao buscar PWA por ID:', error);
      return undefined;
    }
  }

  async deletePWA(id: string): Promise<boolean> {
    try {
      console.log('🗑️ Deletando PWA:', id);
      
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        console.error('❌ Usuário não autenticado para deletar');
        return false;
      }

      const { error } = await supabase
        .from('pwas')
        .delete()
        .eq('id', id)
        .eq('user_id', user.user.id);

      if (error) {
        console.error('❌ Erro ao deletar PWA:', error);
        return false;
      }

      console.log('✅ PWA deletado com sucesso');
      return true;
    } catch (error) {
      console.error('💥 Erro geral ao deletar PWA:', error);
      return false;
    }
  }
}

export const pwaGenerationService = new PWAGenerationService();
