
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
      console.log('🔍 Buscando configurações do usuário...');
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        console.error('❌ Usuário não autenticado');
        throw new Error('Usuário não autenticado');
      }

      console.log('👤 Usuário autenticado:', user.user.id);

      const { data, error } = await supabase
        .rpc('get_user_nfse_settings', { p_user_id: user.user.id });

      if (error) {
        console.error('❌ Erro na consulta RPC:', error);
        return null;
      }

      console.log('📊 Dados retornados do banco:', data);

      if (!data || data.length === 0) {
        console.log('ℹ️ Nenhuma configuração encontrada');
        return null;
      }

      const settings = data[0];
      const result = {
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

      console.log('✅ Configurações convertidas:', result);
      return result;
    } catch (error) {
      console.error('❌ Erro no NFSeService.getUserSettings:', error);
      return null;
    }
  }

  // Salvar configurações
  static async saveSettings(settings: NFSeSettings): Promise<boolean> {
    try {
      console.log('💾 Iniciando salvamento no banco...');
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        console.error('❌ Usuário não autenticado para salvamento');
        throw new Error('Usuário não autenticado');
      }

      console.log('👤 Usuário para salvamento:', user.user.id);
      console.log('📝 Configurações recebidas para salvamento:', settings);

      // Criptografar senha do certificado se fornecida
      let encryptedPassword = null;
      if (settings.certificado.senha) {
        console.log('🔐 Criptografando senha do certificado...');
        const { data: encryptedData, error: encryptError } = await supabase
          .rpc('encrypt_password', { password: settings.certificado.senha });
        
        if (encryptError) {
          console.error('❌ Erro ao criptografar senha:', encryptError);
          throw encryptError;
        }
        encryptedPassword = encryptedData;
        console.log('✅ Senha criptografada com sucesso');
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

      console.log('📊 Dados preparados para inserção/atualização:', settingsData);

      let result;
      
      if (settings.id) {
        console.log('🔄 Atualizando configuração existente com ID:', settings.id);
        result = await supabase
          .from('nfse_settings')
          .update(settingsData)
          .eq('id', settings.id)
          .eq('user_id', user.user.id)
          .select()
          .single();
      } else {
        console.log('➕ Criando nova configuração...');
        result = await supabase
          .from('nfse_settings')
          .insert([settingsData])
          .select()
          .single();
      }

      console.log('📊 Resultado da operação no banco:', result);

      if (result.error) {
        console.error('❌ Erro na operação do banco:', result.error);
        throw result.error;
      }

      console.log('✅ Configurações salvas com sucesso no banco!');
      return true;
    } catch (error) {
      console.error('❌ Erro ao salvar configurações:', error);
      throw error;
    }
  }

  // Migrar dados do localStorage para o banco
  static async migrateFromLocalStorage(): Promise<void> {
    try {
      const localData = localStorage.getItem('nfse-settings');
      if (!localData) {
        console.log('ℹ️ Nenhum dado no localStorage para migrar');
        return;
      }

      const parsedData = JSON.parse(localData);
      console.log('🔄 Dados encontrados no localStorage:', parsedData);

      // Verificar se já existem configurações no banco
      const existingSettings = await this.getUserSettings();
      if (existingSettings) {
        console.log('ℹ️ Configurações já existem no banco, removendo localStorage');
        localStorage.removeItem('nfse-settings');
        return;
      }

      console.log('🔄 Migrando dados do localStorage para o banco...');
      const success = await this.saveSettings(parsedData);
      
      if (success) {
        // Remover do localStorage após migração bem-sucedida
        localStorage.removeItem('nfse-settings');
        console.log('✅ Migração concluída com sucesso');
        toast.success('Configurações migradas para o banco de dados com sucesso!');
      }
    } catch (error) {
      console.error('❌ Erro na migração:', error);
      toast.error('Erro ao migrar configurações para o banco de dados');
    }
  }
}
