
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface NFSeSettings {
  autoGenerate: boolean;
  autoGenerateStatus: 'completed' | 'all';
  cnpj: string;
  razaoSocial: string;
  codigoServico: string;
}

export const useNFSeSettings = () => {
  const [settings, setSettings] = useState<NFSeSettings>({
    autoGenerate: false,
    autoGenerateStatus: 'completed',
    cnpj: '',
    razaoSocial: '',
    codigoServico: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);

  // Carregar configurações do localStorage na inicialização
  useEffect(() => {
    const savedSettings = localStorage.getItem('nfse-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        console.log('Configurações carregadas:', parsed);
        setSettings(parsed);
      } catch (error) {
        console.error('Erro ao carregar configurações de NFS-e:', error);
      }
    }
  }, []);

  const saveSettings = async (newSettings?: Partial<NFSeSettings>) => {
    setIsLoading(true);
    try {
      const settingsToSave = newSettings ? { ...settings, ...newSettings } : settings;
      console.log('Salvando configurações:', settingsToSave);
      
      // Salvar no localStorage
      localStorage.setItem('nfse-settings', JSON.stringify(settingsToSave));
      
      // Atualizar estado local
      setSettings(settingsToSave);
      
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
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    // Salvar automaticamente no localStorage quando um campo é alterado
    localStorage.setItem('nfse-settings', JSON.stringify(newSettings));
  };

  return {
    settings,
    isLoading,
    saveSettings,
    updateSetting
  };
};
