
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CoursesTab from "./tabs/CoursesTab";
import MaterialsTab from "./tabs/MaterialsTab";
import CertificatesTab from "./tabs/CertificatesTab";
import QuizTab from "./tabs/QuizTab";
import AccountTab from "./tabs/AccountTab";
import { preferencesService } from "@/utils/preferencesService";
import { toast } from "sonner";

interface StudentDashboardProps {
  onLogout: () => void;
}

const StudentDashboard = ({ onLogout }: StudentDashboardProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('courses');
  
  // Load user preferences when component mounts
  useEffect(() => {
    try {
      console.log("Loading user preferences");
      const userPrefs = preferencesService.getPreferences();
      setActiveTab(userPrefs.defaultTab || 'courses');
    } catch (error) {
      console.error("Error loading preferences:", error);
      // Fallback to default tab if there's an error
      setActiveTab('courses');
    }
  }, []);
  
  // Handle tab change and save preference
  const handleTabChange = (value: string) => {
    console.log("Tab changed to:", value);
    setActiveTab(value);
    preferencesService.saveDefaultTab(value);
  };

  // Save this tab as default
  const saveDefaultTab = () => {
    preferencesService.saveDefaultTab(activeTab);
    toast.success(`Tab "${activeTab}" saved as default view`);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Olá, Estudante!</h2>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => navigate('/admin')}>Área Admin</Button>
          <Button variant="outline" onClick={onLogout}>Sair</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Button 
          onClick={() => navigate('/quiz')} 
          variant="outline" 
          className="py-6 h-auto flex flex-col items-center"
        >
          <span className="text-xl mb-1">Quiz</span>
          <span className="text-sm text-gray-500">Teste seus conhecimentos</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="py-6 h-auto flex flex-col items-center"
        >
          <span className="text-xl mb-1">Certificados</span>
          <span className="text-sm text-gray-500">Seus certificados</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="py-6 h-auto flex flex-col items-center"
        >
          <span className="text-xl mb-1">Materiais</span>
          <span className="text-sm text-gray-500">Materiais de estudo</span>
        </Button>
      </div>

      <div className="flex justify-between items-center mb-2">
        <div></div>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-sm"
          onClick={saveDefaultTab}
        >
          Definir aba atual como padrão
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-6">
          <TabsTrigger value="courses">Meus Cursos</TabsTrigger>
          <TabsTrigger value="materials">Materiais</TabsTrigger>
          <TabsTrigger value="certificates">Certificados</TabsTrigger>
          <TabsTrigger value="account">Minha Conta</TabsTrigger>
          <TabsTrigger value="quiz">Quiz</TabsTrigger>
        </TabsList>
        
        <TabsContent value="courses">
          <CoursesTab />
        </TabsContent>
        
        <TabsContent value="materials">
          <MaterialsTab />
        </TabsContent>
        
        <TabsContent value="certificates">
          <CertificatesTab />
        </TabsContent>
        
        <TabsContent value="quiz">
          <QuizTab />
        </TabsContent>
        
        <TabsContent value="account">
          <AccountTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDashboard;
