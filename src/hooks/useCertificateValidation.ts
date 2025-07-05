
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { 
  CertificateValidationService, 
  CertificateValidationResult 
} from '@/services/certificateValidationService';

export const useCertificateValidation = () => {
  const [validationResult, setValidationResult] = useState<CertificateValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [autoValidationEnabled, setAutoValidationEnabled] = useState(true);

  const validateCertificate = useCallback(async (
    file: File, 
    password: string,
    testConnectivity: boolean = true,
    showToasts: boolean = true
  ) => {
    console.log('🔐 useCertificateValidation.validateCertificate chamado');
    console.log('📁 Arquivo:', file?.name, 'Tamanho:', file?.size);
    console.log('🔑 Senha fornecida:', password ? 'sim' : 'não');
    console.log('🌐 Testar conectividade:', testConnectivity);
    console.log('🔔 Mostrar toasts:', showToasts);

    if (!file) {
      console.error('❌ Arquivo não fornecido');
      if (showToasts) {
        toast.error('Arquivo do certificado é obrigatório');
      }
      return null;
    }

    if (!password || password.length < 4) {
      console.error('❌ Senha não fornecida ou muito curta');
      if (showToasts) {
        toast.error('Senha do certificado é obrigatória e deve ter pelo menos 4 caracteres');
      }
      return null;
    }

    setIsValidating(true);
    setValidationResult(null);

    try {
      console.log('🔐 Iniciando validação do certificado...');
      
      const result = await CertificateValidationService.validateCertificate(
        file,
        password,
        testConnectivity
      );

      console.log('📊 Resultado da validação:', result);
      setValidationResult(result);

      if (showToasts && result) {
        if (result.isValid && result.certificateInfo) {
          const expiryCheck = CertificateValidationService.checkExpiryWarning(result.certificateInfo);
          
          if (expiryCheck.shouldWarn) {
            if (expiryCheck.severity === 'error') {
              toast.error(expiryCheck.message);
            } else if (expiryCheck.severity === 'warning') {
              toast.warning(expiryCheck.message);
            } else {
              toast.info(expiryCheck.message);
            }
          } else {
            toast.success('✅ Certificado validado com sucesso!');
          }

          // Notificar sobre conectividade
          if (result.connectivityTest) {
            if (result.connectivityTest.success) {
              toast.success('🌐 Conectividade com webservice verificada!');
            } else {
              toast.warning('⚠️ Problema na conectividade: ' + result.connectivityTest.message);
            }
          }

        } else {
          toast.error('❌ ' + (result.error || 'Certificado inválido'));
        }
      }

      return result;

    } catch (error) {
      console.error('❌ Erro na validação:', error);
      if (showToasts) {
        toast.error('Erro inesperado na validação do certificado');
      }
      const errorResult = {
        isValid: false,
        error: error instanceof Error ? error.message : 'Erro inesperado na validação'
      };
      setValidationResult(errorResult);
      return errorResult;
    } finally {
      setIsValidating(false);
      console.log('⏹️ Validação finalizada');
    }
  }, []);

  // Validação automática quando arquivo e senha estão disponíveis
  const autoValidate = useCallback(async (file: File | null, password: string) => {
    if (autoValidationEnabled && file && password && password.length >= 4) {
      console.log('🔄 Executando validação automática...');
      console.log('📁 Arquivo para auto-validação:', file.name);
      console.log('🔑 Senha para auto-validação:', password ? '***' : 'não fornecida');
      
      // Pequeno delay para evitar validações desnecessárias
      setTimeout(() => {
        validateCertificate(file, password, true, false);
      }, 1500);
    } else {
      console.log('🚫 Auto-validação não executada:');
      console.log('  - Auto-validação habilitada:', autoValidationEnabled);
      console.log('  - Arquivo presente:', !!file);
      console.log('  - Senha válida:', password && password.length >= 4);
    }
  }, [autoValidationEnabled, validateCertificate]);

  const clearValidation = useCallback(() => {
    console.log('🧹 Limpando resultado da validação');
    setValidationResult(null);
  }, []);

  const toggleAutoValidation = useCallback((enabled: boolean) => {
    console.log('⚙️ Auto-validação alterada para:', enabled);
    setAutoValidationEnabled(enabled);
  }, []);

  return {
    validationResult,
    isValidating,
    validateCertificate,
    autoValidate,
    clearValidation,
    autoValidationEnabled,
    toggleAutoValidation
  };
};
