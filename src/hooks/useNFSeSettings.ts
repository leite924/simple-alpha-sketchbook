
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
      setIsLoading(true);
      try {
        // Primeiro, tentar migrar dados do localStorage se existirem
        await NFSeService.migrateFromLocalStorage();
        
        // Depois, carregar configurações do banco
        const dbSettings = await NFSeService.getUserSettings();
        if (dbSettings) {
          console.log('Configurações carregadas do banco:', dbSettings);
          setSettings(dbSettings);
        } else {
          console.log('Nenhuma configuração encontrada no banco, usando padrões');
        }
      } catch (error) {
        console.error('Erro ao carregar configurações de NFS-e:', error);
        toast.error('Erro ao carregar configurações de NFS-e');
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    loadSettings();
  }, []);

  const saveSettings = async (newSettings?: Partial<NFSeSettings>) => {
    setIsLoading(true);
    try {
      const settingsToSave = newSettings ? { ...settings, ...newSettings } : settings;
      console.log('Salvando configurações no banco:', settingsToSave);
      
      await NFSeService.saveSettings(settingsToSave);
      
      // Recarregar configurações do banco para obter dados atualizados (como ID)
      const updatedSettings = await NFSeService.getUserSettings();
      if (updatedSettings) {
        setSettings(updatedSettings);
      }
      
      toast.success('Configurações de NFS-e salvas com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Erro ao salvar configurações de NFS-e');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = (key: keyof NFSeSettings, value: any) => {
    console.log(`Atualizando ${key}:`, value);
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateCertificadoSetting = (key: keyof NFSeSettings['certificado'], value: string) => {
    console.log(`Atualizando certificado.${key}:`, value);
    setSettings(prev => ({ 
      ...prev, 
      certificado: { ...prev.certificado, [key]: value }
    }));
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
