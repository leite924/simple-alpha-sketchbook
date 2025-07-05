
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Clock,
  Building,
  Calendar,
  Hash,
  Wifi
} from 'lucide-react';
import { CertificateInfo, CertificateValidationResult } from '@/services/certificateValidationService';

interface CertificateStatusDisplayProps {
  validationResult: CertificateValidationResult | null;
  isValidating: boolean;
}

export const CertificateStatusDisplay = ({ 
  validationResult, 
  isValidating 
}: CertificateStatusDisplayProps) => {
  if (isValidating) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 animate-spin text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">Validando certificado...</p>
              <p className="text-sm text-blue-600">Verificando arquivo e conectividade</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!validationResult) {
    return null;
  }

  if (!validationResult.isValid) {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Certificado inválido:</strong> {validationResult.error}
        </AlertDescription>
      </Alert>
    );
  }

  const { certificateInfo, connectivityTest } = validationResult;
  
  if (!certificateInfo) return null;

  const getStatusBadge = () => {
    if (certificateInfo.isExpired) {
      return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" />Expirado</Badge>;
    }
    
    if (certificateInfo.daysUntilExpiry <= 30) {
      return <Badge variant="destructive" className="gap-1"><AlertTriangle className="h-3 w-3" />Expira em breve</Badge>;
    }
    
    if (certificateInfo.daysUntilExpiry <= 60) {
      return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" />Atenção</Badge>;
    }
    
    return <Badge variant="default" className="gap-1 bg-green-600"><CheckCircle className="h-3 w-3" />Válido</Badge>;
  };

  const getConnectivityBadge = () => {
    if (!connectivityTest) return null;
    
    if (connectivityTest.success) {
      return <Badge variant="default" className="gap-1 bg-green-600"><Wifi className="h-3 w-3" />Conectado</Badge>;
    } else {
      return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" />Falha</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              Certificado Digital A1
            </div>
            <div className="flex gap-2">
              {getStatusBadge()}
              {getConnectivityBadge()}
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Informações da Empresa */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Building className="h-4 w-4 text-gray-600" />
                <span className="font-medium">Razão Social:</span>
              </div>
              <p className="text-sm text-gray-700 ml-6">{certificateInfo.razaoSocial}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Hash className="h-4 w-4 text-gray-600" />
                <span className="font-medium">CNPJ:</span>
              </div>
              <p className="text-sm text-gray-700 ml-6">{certificateInfo.cnpj}</p>
            </div>
          </div>

          {/* Informações do Certificado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-600" />
                <span className="font-medium">Válido até:</span>
              </div>
              <p className="text-sm text-gray-700 ml-6">
                {new Date(certificateInfo.validTo).toLocaleDateString('pt-BR')}
                <span className="text-gray-500 ml-2">
                  ({certificateInfo.daysUntilExpiry} dias restantes)
                </span>
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Hash className="h-4 w-4 text-gray-600" />
                <span className="font-medium">Série:</span>
              </div>
              <p className="text-sm text-gray-700 ml-6 font-mono">
                {certificateInfo.serialNumber}
              </p>
            </div>
          </div>

          {/* Emissor */}
          <div className="pt-4 border-t">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-gray-600" />
                <span className="font-medium">Autoridade Certificadora:</span>
              </div>
              <p className="text-xs text-gray-600 ml-6">
                {certificateInfo.issuer}
              </p>
            </div>
          </div>

          {/* Conectividade */}
          {connectivityTest && (
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Teste de Conectividade:</span>
                <span className="text-xs text-gray-500">
                  {connectivityTest.responseTime}ms
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {connectivityTest.message}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alertas de Expiração */}
      {certificateInfo.daysUntilExpiry <= 60 && !certificateInfo.isExpired && (
        <Alert variant={certificateInfo.daysUntilExpiry <= 30 ? "destructive" : "default"}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Atenção:</strong> Seu certificado expira em {certificateInfo.daysUntilExpiry} dias. 
            Renove com antecedência para evitar interrupções no serviço.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
