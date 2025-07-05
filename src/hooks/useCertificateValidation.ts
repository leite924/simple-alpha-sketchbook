
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { 
  CertificateValidationService, 
  CertificateValidationResult 
} from '@/services/certificateValidationService';

export const useCertificateValidation = () => {
  const [validationResult, setValidationResult] = useState<CertificateValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const validateCertificate = useCallback(async (
    file: File, 
    password: string,
    testConnectivity: boolean = true
  ) => {
    if (!file || !password) {
      toast.error('Arquivo e senha do certificado são obrigatórios');
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
          toast.success('Certificado validado com sucesso!');
        }

        // Notificar sobre conectividade
        if (result.connectivityTest) {
          if (result.connectivityTest.success) {
            toast.success('Conectividade com webservice verificada!');
          } else {
            toast.warning('Problema na conectividade: ' + result.connectivityTest.message);
          }
        }

      } else {
        toast.error(result.error || 'Certificado inválido');
      }

    } catch (error) {
      console.error('❌ Erro na validação:', error);
      toast.error('Erro inesperado na validação do certificado');
      setValidationResult({
        isValid: false,
        error: 'Erro inesperado na validação'
      });
    } finally {
      setIsValidating(false);
    }
  }, []);

  const clearValidation = useCallback(() => {
    setValidationResult(null);
  }, []);

  return {
    validationResult,
    isValidating,
    validateCertificate,
    clearValidation
  };
};
