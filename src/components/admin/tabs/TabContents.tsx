
import React, { useEffect } from "react";
import { TabsContent } from "@/components/ui/tabs";
import Dashboard from "@/components/admin/Dashboard";
import UserManagement from "@/components/admin/UserManagement";
import CourseManagement from "@/components/admin/CourseManagement";
import ClassManagement from "@/components/admin/ClassManagement";
import BlogManagement from "@/components/admin/BlogManagement";
import AIManagement from "@/components/admin/AIManagement";
import FinanceManagement from "@/components/admin/FinanceManagement";
import EnrollmentManagement from "@/components/admin/EnrollmentManagement";
import TabContentWrapper from "@/components/admin/tabs/TabContentWrapper";

interface TabContentsProps {
  userRole?: string;
  showDiagnostics?: boolean;
}

export const TabContents: React.FC<TabContentsProps> = ({ userRole = "", showDiagnostics = false }) => {
  // Debug logs para ajudar na identificação de problemas
  useEffect(() => {
    console.log("TabContents renderizando com props:", { userRole, showDiagnostics });
    console.log("URL atual:", window.location.href);
    
    // Verificar se todos os valores de abas estão corretos
    const tabValues = ["dashboard", "users", "courses", "classes", "enrollments", "blog", "ai", "finance"];
    console.log("Abas disponíveis para renderização:", tabValues);
    
    // Verificar se a aba finance está sendo renderizada corretamente
    setTimeout(() => {
      const financeTab = document.querySelector('[data-value="finance"]');
      console.log("Aba finance encontrada:", !!financeTab);
      console.log("Estado da aba finance:", financeTab?.getAttribute('data-state'));
    }, 200);
  }, [userRole, showDiagnostics]);
  
  return (
    <>
      <TabsContent value="dashboard" data-value="dashboard">
        <TabContentWrapper label="Dashboard">
          <Dashboard />
        </TabContentWrapper>
      </TabsContent>

      <TabsContent value="users" data-value="users">
        <TabContentWrapper label="Gerenciamento de Usuários">
          <UserManagement />
        </TabContentWrapper>
      </TabsContent>

      <TabsContent value="courses" data-value="courses">
        <TabContentWrapper label="Gerenciamento de Cursos">
          <CourseManagement />
        </TabContentWrapper>
      </TabsContent>

      <TabsContent value="classes" data-value="classes">
        <TabContentWrapper label="Gerenciamento de Turmas">
          <ClassManagement />
        </TabContentWrapper>
      </TabsContent>
      
      <TabsContent value="enrollments" data-value="enrollments">
        <TabContentWrapper label="Matrículas e Descontos">
          <EnrollmentManagement />
        </TabContentWrapper>
      </TabsContent>

      <TabsContent value="blog" data-value="blog">
        <TabContentWrapper label="Gerenciamento do Blog">
          <BlogManagement />
        </TabContentWrapper>
      </TabsContent>

      <TabsContent value="ai" data-value="ai">
        <TabContentWrapper label="Inteligência Artificial">
          <AIManagement />
        </TabContentWrapper>
      </TabsContent>
      
      <TabsContent value="finance" data-value="finance">
        <TabContentWrapper label="Sistema Financeiro">
          <FinanceManagement userRole={userRole} showDiagnostics={showDiagnostics} />
        </TabContentWrapper>
      </TabsContent>
    </>
  );
};

export default TabContents;
