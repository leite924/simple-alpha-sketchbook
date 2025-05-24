
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { generateInvoiceNumber, generateNFSe } from "./InvoiceUtils"; 
import { NFSeData } from "./types";
import { toast } from "sonner";

// Define the form schema using zod
const nfseFormSchema = z.object({
  cnpj: z.string().min(14, "CNPJ deve ter pelo menos 14 caracteres"),
  inscricaoMunicipal: z.string().min(1, "Inscrição Municipal é obrigatória"),
  valor: z.string().min(1, "Valor é obrigatório"),
  tomadorNome: z.string().min(1, "Nome do Tomador é obrigatório"),
  tomadorDocumento: z.string().min(1, "CPF/CNPJ do Tomador é obrigatório"),
  servicoDescricao: z.string().min(1, "Descrição do Serviço é obrigatória"),
  servicoCodigo: z.string().min(1, "Código do Serviço é obrigatório"),
  servicoAliquota: z.string().min(1, "Alíquota é obrigatória"),
});

type NFSeFormValues = z.infer<typeof nfseFormSchema>;

interface NFSeFormProps {
  onNFSeGenerated?: (data: NFSeData, response: any) => void;
}

export const NFSeForm: React.FC<NFSeFormProps> = ({ onNFSeGenerated }) => {
  // Define form with default values
  const form = useForm<NFSeFormValues>({
    resolver: zodResolver(nfseFormSchema),
    defaultValues: {
      cnpj: "12345678000123",
      inscricaoMunicipal: "123456",
      valor: "1000.00",
      tomadorNome: "Cliente Exemplo",
      tomadorDocumento: "12345678900",
      servicoDescricao: "Desenvolvimento de software",
      servicoCodigo: "1.07",
      servicoAliquota: "0.02", // 2%
    },
  });

  const onSubmit = async (data: NFSeFormValues) => {
    try {
      // Convert form values to NFSeData format
      const nfseData: NFSeData = {
        numeroLote: generateInvoiceNumber().replace('NFS-', ''),
        cnpj: data.cnpj,
        inscricaoMunicipal: data.inscricaoMunicipal,
        valor: parseFloat(data.valor),
        tomador: {
          nome: data.tomadorNome,
          // Determine if it's CPF or CNPJ based on length
          ...(data.tomadorDocumento.length <= 11 
            ? { cpf: data.tomadorDocumento } 
            : { cnpj: data.tomadorDocumento }
          ),
          // Could add address fields here if needed
        },
        servico: {
          descricao: data.servicoDescricao,
          codigoTributacaoMunicipio: data.servicoCodigo,
          aliquota: parseFloat(data.servicoAliquota),
        },
        status: 'processing'
      };
      
      // Call the mock NFS-e generation service
      const result = await generateNFSe(nfseData);
      
      // Update the status based on result
      nfseData.status = result.status as 'pending' | 'completed' | 'failed' | 'processing' | 'canceled';
      
      // Trigger callback if provided
      if (onNFSeGenerated) {
        onNFSeGenerated(nfseData, result);
      }
      
    } catch (error) {
      console.error("Erro ao gerar NFS-e:", error);
      toast.error("Erro ao processar a geração da NFS-e");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Emissão de NFS-e</CardTitle>
        <CardDescription>
          Preencha os dados para emitir uma Nota Fiscal de Serviço Eletrônica (padrão ABRASF 2.0)
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Prestador */}
              <div className="space-y-4">
                <h3 className="font-medium text-sm">Dados do Prestador</h3>
                
                <FormField
                  control={form.control}
                  name="cnpj"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CNPJ</FormLabel>
                      <FormControl>
                        <Input placeholder="12345678000199" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="inscricaoMunicipal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Inscrição Municipal</FormLabel>
                      <FormControl>
                        <Input placeholder="123456" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Tomador */}
              <div className="space-y-4">
                <h3 className="font-medium text-sm">Dados do Tomador</h3>
                
                <FormField
                  control={form.control}
                  name="tomadorNome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome/Razão Social</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do cliente" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tomadorDocumento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF/CNPJ</FormLabel>
                      <FormControl>
                        <Input placeholder="CPF ou CNPJ" {...field} />
                      </FormControl>
                      <FormDescription>
                        Informe apenas números
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {/* Serviço */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-medium text-sm">Dados do Serviço</h3>
              
              <FormField
                control={form.control}
                name="servicoDescricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input placeholder="Descreva o serviço prestado" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="servicoCodigo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código de Serviço</FormLabel>
                      <FormControl>
                        <Input placeholder="1.07" {...field} />
                      </FormControl>
                      <FormDescription>
                        Código da Lista de Serviços
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="valor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor (R$)</FormLabel>
                      <FormControl>
                        <Input placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="servicoAliquota"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alíquota ISS</FormLabel>
                      <FormControl>
                        <Input placeholder="0.02" {...field} />
                      </FormControl>
                      <FormDescription>
                        Ex: 0.02 para 2%
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="pt-4">
              <Button type="submit" className="w-full">
                Emitir NFS-e
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      
      <CardFooter className="flex justify-center border-t pt-4">
        <p className="text-xs text-muted-foreground text-center">
          Este formulário simula a emissão de uma NFS-e no padrão ABRASF 2.0 para Recife.
          <br />Em um ambiente real, o processo inclui autenticação com certificado digital.
        </p>
      </CardFooter>
    </Card>
  );
};
