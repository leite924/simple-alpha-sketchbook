
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { NFSeService, NFSeSettings } from '@/services/nfseService';

export const useNFSeSettings = () => {
  const [settings, setSettings] = useState<NFSeSettings>({
    autoGenerate: false,
    autoGenerateStatus: 'completed',
    cnpj: '',
    razaoSocial: '',
    inscricaoMunicipal: '',
    codigoServico: '',
    certificado: {
      arquivo: '',
      senha: '',
      validade: ''
    },
    webserviceEnvironment: 'homologacao',
    webserviceUrlHomologacao: 'https://nfse-hom.recife.pe.gov.br/nfse/services',
    webserviceUrlProducao: 'https://nfse.recife.pe.gov.br/nfse/services'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Carregar configurações do banco de dados na inicialização
  useEffect(() => {
    const loadSettings = async () => {
      console.log('🔄 Iniciando carregamento das configurações NFS-e...');
      setIsLoading(true);
      try {
        // Primeiro, tentar migrar dados do localStorage se existirem
        await NFSeService.migrateFromLocalStorage();
        
        // Depois, carregar configurações do banco
        const dbSettings = await NFSeService.getUserSettings();
        if (dbSettings) {
          console.log('✅ Configurações carregadas do banco:', dbSettings);
          setSettings(dbSettings);
        } else {
          console.log('⚠️ Nenhuma configuração encontrada no banco, usando padrões');
        }
      } catch (error) {
        console.error('❌ Erro ao carregar configurações de NFS-e:', error);
        toast.error('Erro ao carregar configurações de NFS-e');
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
        console.log('✅ Carregamento das configurações finalizado');
      }
    };

    loadSettings();
  }, []);

  const saveSettings = async (newSettings?: Partial<NFSeSettings>) => {
    console.log('💾 Iniciando salvamento das configurações...');
    setIsLoading(true);
    try {
      const settingsToSave = newSettings ? { ...settings, ...newSettings } : settings;
      console.log('📝 Dados a serem salvos:', settingsToSave);
      
      const success = await NFSeService.saveSettings(settingsToSave);
      
      if (success) {
        console.log('✅ Configurações salvas com sucesso no banco');
        
        // Recarregar configurações do banco para garantir sincronização
        const updatedSettings = await NFSeService.getUserSettings();
        if (updatedSettings) {
          console.log('🔄 Configurações recarregadas do banco:', updatedSettings);
          setSettings(updatedSettings);
        }
        
        toast.success('Configurações de NFS-e salvas com sucesso!');
        return true;
      } else {
        console.error('❌ Falha no salvamento - NFSeService retornou false');
        toast.error('Erro ao salvar configurações de NFS-e');
        return false;
      }
    } catch (error) {
      console.error('❌ Erro durante o salvamento:', error);
      toast.error('Erro ao salvar configurações de NFS-e');
      return false;
    } finally {
      setIsLoading(false);
      console.log('⏹️ Processo de salvamento finalizado');
    }
  };

  const updateSetting = (key: keyof NFSeSettings, value: any) => {
    console.log(`🔧 Atualizando ${key}:`, value);
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      console.log('📊 Novo estado das configurações:', newSettings);
      return newSettings;
    });
  };

  const updateCertificadoSetting = (key: keyof NFSeSettings['certificado'], value: string) => {
    console.log(`🔐 Atualizando certificado.${key}:`, value);
    setSettings(prev => {
      const newSettings = { 
        ...prev, 
        certificado: { ...prev.certificado, [key]: value }
      };
      console.log('📊 Novo estado do certificado:', newSettings.certificado);
      return newSettings;
    });
  };

  return {
    settings,
    isLoading,
    isInitialized,
    saveSettings,
    updateSetting,
    updateCertificadoSetting
  };
};
