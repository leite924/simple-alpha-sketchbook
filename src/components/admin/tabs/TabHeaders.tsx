
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const TabHeaders: React.FC = () => {
  return (
    <CardHeader>
      <TabsContent value="dashboard">
        <CardTitle>Dashboard</CardTitle>
        <CardDescription>Visão geral e estatísticas do sistema.</CardDescription>
      </TabsContent>
      <TabsContent value="classes">
        <CardTitle>Gerenciamento de Turmas</CardTitle>
        <CardDescription>Crie, edite e gerencie as turmas disponíveis.</CardDescription>
      </TabsContent>
      <TabsContent value="courses">
        <CardTitle>Gerenciamento de Cursos</CardTitle>
        <CardDescription>Gerencie os cursos oferecidos pela escola.</CardDescription>
      </TabsContent>
      <TabsContent value="blog">
        <CardTitle>Gerenciamento do Blog</CardTitle>
        <CardDescription>Crie e edite artigos do blog.</CardDescription>
      </TabsContent>
      <TabsContent value="users">
        <CardTitle>Gerenciamento de Usuários</CardTitle>
        <CardDescription>Controle de acesso e permissões dos usuários.</CardDescription>
      </TabsContent>
      <TabsContent value="payments">
        <CardTitle>Gateway de Pagamento</CardTitle>
        <CardDescription>Configure e monitore as transações de pagamento.</CardDescription>
      </TabsContent>
      <TabsContent value="ai">
        <CardTitle>Inteligência Artificial</CardTitle>
        <CardDescription>Geração de conteúdo e análises usando IA.</CardDescription>
      </TabsContent>
      <TabsContent value="finance">
        <CardTitle>Sistema Financeiro</CardTitle>
        <CardDescription>Gerenciamento de finanças, transações e notas fiscais.</CardDescription>
      </TabsContent>
    </CardHeader>
  );
};

export default TabHeaders;
