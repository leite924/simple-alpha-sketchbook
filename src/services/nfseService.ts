
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface NFSeSettings {
  id?: string;
  autoGenerate: boolean;
  autoGenerateStatus: 'completed' | 'all';
  cnpj: string;
  razaoSocial: string;
  inscricaoMunicipal?: string;
  codigoServico: string;
  certificado: {
    arquivo: string;
    senha: string;
    validade: string;
  };
  webserviceEnvironment: 'homologacao' | 'producao';
  webserviceUrlHomologacao?: string;
  webserviceUrlProducao?: string;
}

export class NFSeService {
  // Buscar configurações do usuário atual
  static async getUserSettings(): Promise<NFSeSettings | null> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase
        .rpc('get_user_nfse_settings', { p_user_id: user.user.id });

      if (error) {
        console.error('Erro ao buscar configurações:', error);
        return null;
      }

      if (!data || data.length === 0) {
        return null;
      }

      const settings = data[0];
      return {
        id: settings.id,
        autoGenerate: settings.auto_generate,
        autoGenerateStatus: settings.auto_generate_status as 'completed' | 'all',
        cnpj: settings.company_cnpj,
        razaoSocial: settings.company_name,
        inscricaoMunicipal: settings.municipal_inscription || '',
        codigoServico: settings.service_code,
        certificado: {
          arquivo: settings.certificate_file_name || '',
          senha: '', // Por segurança, não retornamos a senha
          validade: settings.certificate_validity || '',
        },
        webserviceEnvironment: settings.webservice_environment as 'homologacao' | 'producao',
        webserviceUrlHomologacao: settings.webservice_url_homologacao || '',
        webserviceUrlProducao: settings.webservice_url_producao || '',
      };
    } catch (error) {
      console.error('Erro no NFSeService.getUserSettings:', error);
      return null;
    }
  }

  // Salvar configurações
  static async saveSettings(settings: NFSeSettings): Promise<boolean> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        throw new Error('Usuário não autenticado');
      }

      // Criptografar senha do certificado se fornecida
      let encryptedPassword = null;
      if (settings.certificado.senha) {
        const { data: encryptedData, error: encryptError } = await supabase
          .rpc('encrypt_password', { password: settings.certificado.senha });
        
        if (encryptError) {
          throw encryptError;
        }
        encryptedPassword = encryptedData;
      }

      const settingsData = {
        user_id: user.user.id,
        company_cnpj: settings.cnpj,
        company_name: settings.razaoSocial,
        municipal_inscription: settings.inscricaoMunicipal || null,
        service_code: settings.codigoServico,
        auto_generate: settings.autoGenerate,
        auto_generate_status: settings.autoGenerateStatus,
        certificate_file_name: settings.certificado.arquivo || null,
        certificate_password_encrypted: encryptedPassword,
        certificate_validity: settings.certificado.validade || null,
        webservice_environment: settings.webserviceEnvironment,
        webservice_url_homologacao: settings.webserviceUrlHomologacao || null,
        webservice_url_producao: settings.webserviceUrlProducao || null,
      };

      let result;
      
      if (settings.id) {
        // Atualizar configuração existente
        result = await supabase
          .from('nfse_settings')
          .update(settingsData)
          .eq('id', settings.id)
          .eq('user_id', user.user.id);
      } else {
        // Criar nova configuração
        result = await supabase
          .from('nfse_settings')
          .insert([settingsData]);
      }

      if (result.error) {
        throw result.error;
      }

      return true;
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      throw error;
    }
  }

  // Migrar dados do localStorage para o banco
  static async migrateFromLocalStorage(): Promise<void> {
    try {
      const localData = localStorage.getItem('nfse-settings');
      if (!localData) {
        return;
      }

      const parsedData = JSON.parse(localData);
      console.log('Migrando dados do localStorage para o banco:', parsedData);

      // Verificar se já existem configurações no banco
      const existingSettings = await this.getUserSettings();
      if (existingSettings) {
        console.log('Configurações já existem no banco, ignorando migração');
        return;
      }

      // Migrar dados
      await this.saveSettings(parsedData);
      
      // Remover do localStorage após migração bem-sucedida
      localStorage.removeItem('nfse-settings');
      
      toast.success('Configurações migradas para o banco de dados com sucesso!');
    } catch (error) {
      console.error('Erro na migração:', error);
      toast.error('Erro ao migrar configurações para o banco de dados');
    }
  }
}
