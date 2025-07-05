
import { toast } from 'sonner';

export interface CertificateInfo {
  isValid: boolean;
  subject: string;
  issuer: string;
  validFrom: string;
  validTo: string;
  serialNumber: string;
  isExpired: boolean;
  daysUntilExpiry: number;
  cnpj?: string;
  razaoSocial?: string;
}

export interface CertificateValidationResult {
  isValid: boolean;
  certificateInfo?: CertificateInfo;
  connectivityTest?: {
    success: boolean;
    message: string;
    responseTime?: number;
  };
  error?: string;
}

export class CertificateValidationService {
  // Simula a validação do certificado A1
  static async validateCertificate(
    file: File, 
    password: string,
    testConnectivity: boolean = true
  ): Promise<CertificateValidationResult> {
    console.log('🔐 Iniciando validação do certificado:', file.name);
    
    try {
      // Simula a leitura e validação do arquivo .p12/.pfx
      const certificateInfo = await this.extractCertificateInfo(file, password);
      
      if (!certificateInfo.isValid) {
        return {
          isValid: false,
          error: 'Certificado inválido ou senha incorreta'
        };
      }

      let connectivityResult;
      if (testConnectivity) {
        connectivityResult = await this.testWebserviceConnectivity(certificateInfo);
      }

      return {
        isValid: true,
        certificateInfo,
        connectivityTest: connectivityResult
      };

    } catch (error) {
      console.error('❌ Erro na validação do certificado:', error);
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido na validação'
      };
    }
  }

  // Simula a extração de informações do certificado
  private static async extractCertificateInfo(file: File, password: string): Promise<CertificateInfo> {
    // Simula delay de processamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simula validação da senha
    if (password.length < 4) {
      throw new Error('Senha do certificado muito curta ou incorreta');
    }

    // Simula extração de dados do certificado
    const now = new Date();
    const validTo = new Date(now.getTime() + (365 * 24 * 60 * 60 * 1000)); // 1 ano no futuro
    const validFrom = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000)); // 30 dias atrás
    
    const daysUntilExpiry = Math.ceil((validTo.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
    
    return {
      isValid: true,
      subject: 'CN=ESCOLA PERNAMBUCANA DE FOTOGRAFIA LTDA, OU=Certificado PJ A1, O=ICP-Brasil, C=BR',
      issuer: 'CN=AC SOLUTI Multipla v5, OU=Autoridade Certificadora, O=ICP-Brasil, C=BR',
      validFrom: validFrom.toISOString().split('T')[0],
      validTo: validTo.toISOString().split('T')[0],
      serialNumber: '1234567890ABCDEF',
      isExpired: false,
      daysUntilExpiry,
      cnpj: '12.345.678/0001-90',
      razaoSocial: 'ESCOLA PERNAMBUCANA DE FOTOGRAFIA LTDA'
    };
  }

  // Simula teste de conectividade com o webservice
  private static async testWebserviceConnectivity(certInfo: CertificateInfo): Promise<{
    success: boolean;
    message: string;
    responseTime?: number;
  }> {
    console.log('🌐 Testando conectividade com webservice da Prefeitura...');
    
    const startTime = Date.now();
    
    // Simula delay de conectividade
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const responseTime = Date.now() - startTime;
    
    // 90% de chance de sucesso para simular cenário real
    const success = Math.random() > 0.1;
    
    if (success) {
      return {
        success: true,
        message: 'Conectividade OK - Certificado aceito pelo webservice',
        responseTime
      };
    } else {
      return {
        success: false,
        message: 'Falha na conectividade - Verifique configurações do webservice'
      };
    }
  }

  // Verifica se o certificado está próximo do vencimento
  static checkExpiryWarning(certificateInfo: CertificateInfo): {
    shouldWarn: boolean;
    message: string;
    severity: 'info' | 'warning' | 'error';
  } {
    const { daysUntilExpiry, isExpired } = certificateInfo;
    
    if (isExpired) {
      return {
        shouldWarn: true,
        message: 'Certificado expirado! Renove imediatamente.',
        severity: 'error'
      };
    }
    
    if (daysUntilExpiry <= 30) {
      return {
        shouldWarn: true,
        message: `Certificado expira em ${daysUntilExpiry} dias. Renove em breve.`,
        severity: 'warning'
      };
    }
    
    if (daysUntilExpiry <= 60) {
      return {
        shouldWarn: true,
        message: `Certificado expira em ${daysUntilExpiry} dias.`,
        severity: 'info'
      };
    }
    
    return {
      shouldWarn: false,
      message: 'Certificado válido',
      severity: 'info'
    };
  }
}
