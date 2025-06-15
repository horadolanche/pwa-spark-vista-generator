
import { supabase } from '@/integrations/supabase/client';

export interface PWAConfig {
  name: string;
  shortName: string;
  description: string;
  themeColor: string;
  backgroundColor: string;
  display: string;
  orientation: string;
  icons: Array<{
    src: string;
    sizes: string;
    type: string;
    purpose?: string;
  }>;
}

export interface PWARecord {
  id: string;
  user_id: string;
  name: string;
  short_name: string;
  description: string | null;
  theme_color: string;
  background_color: string;
  display: string;
  orientation: string;
  icons: any;
  created_at: string;
  updated_at: string;
}

class SupabasePWAService {
  async createPWA(config: PWAConfig): Promise<PWARecord> {
    const { data, error } = await supabase
      .from('pwas')
      .insert({
        name: config.name,
        short_name: config.shortName,
        description: config.description,
        theme_color: config.themeColor,
        background_color: config.backgroundColor,
        display: config.display,
        orientation: config.orientation,
        icons: config.icons,
        user_id: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar PWA:', error);
      throw new Error('Falha ao criar PWA');
    }

    return data;
  }

  async getUserPWAs(): Promise<PWARecord[]> {
    const { data, error } = await supabase
      .from('pwas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar PWAs:', error);
      throw new Error('Falha ao buscar PWAs');
    }

    return data || [];
  }

  async getPWAById(id: string): Promise<PWARecord | null> {
    const { data, error } = await supabase
      .from('pwas')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Erro ao buscar PWA:', error);
      return null;
    }

    return data;
  }

  async deletePWA(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('pwas')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar PWA:', error);
      return false;
    }

    return true;
  }

  async updatePWA(id: string, config: Partial<PWAConfig>): Promise<PWARecord | null> {
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (config.name) updateData.name = config.name;
    if (config.shortName) updateData.short_name = config.shortName;
    if (config.description) updateData.description = config.description;
    if (config.themeColor) updateData.theme_color = config.themeColor;
    if (config.backgroundColor) updateData.background_color = config.backgroundColor;
    if (config.display) updateData.display = config.display;
    if (config.orientation) updateData.orientation = config.orientation;
    if (config.icons) updateData.icons = config.icons;

    const { data, error } = await supabase
      .from('pwas')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar PWA:', error);
      return null;
    }

    return data;
  }
}

export const supabasePWAService = new SupabasePWAService();
