
import { useState, useCallback, useEffect } from 'react';
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
    if (!file || !password) {
      if (showToasts) {
        toast.error('Arquivo e senha do certificado são obrigatórios');
      }
      return;
    }

    setIsValidating(true);
    setValidationResult(null);

    try {
      console.log('🔐 Iniciando validação automática do certificado...');
      
      const result = await CertificateValidationService.validateCertificate(
        file,
        password,
        testConnectivity
      );

      setValidationResult(result);

      if (showToasts) {
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
        error: 'Erro inesperado na validação'
      };
      setValidationResult(errorResult);
      return errorResult;
    } finally {
      setIsValidating(false);
    }
  }, []);

  // Validação automática quando arquivo e senha estão disponíveis
  const autoValidate = useCallback(async (file: File | null, password: string) => {
    if (autoValidationEnabled && file && password && password.length >= 4) {
      console.log('🔄 Executando validação automática...');
      
      // Pequeno delay para evitar validações desnecessárias
      setTimeout(() => {
        validateCertificate(file, password, true, false);
      }, 1000);
    }
  }, [autoValidationEnabled, validateCertificate]);

  const clearValidation = useCallback(() => {
    setValidationResult(null);
  }, []);

  const toggleAutoValidation = useCallback((enabled: boolean) => {
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
