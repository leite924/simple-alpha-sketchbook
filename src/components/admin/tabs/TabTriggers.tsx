
import { TabsTrigger } from "@/components/ui/tabs";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CalendarDays,
  FileText,
  Sparkles,
  DollarSign,
  GraduationCap
} from "lucide-react";
import React from "react";

interface TabTriggersProps {
  userRole: string;
}

export const TabTriggers: React.FC<TabTriggersProps> = ({ userRole }) => {
  return (
    <>
      <TabsTrigger value="dashboard" className="gap-2">
        <LayoutDashboard className="h-4 w-4" />
        <span className="hidden sm:inline-block">Dashboard</span>
      </TabsTrigger>
      
      <TabsTrigger value="users" className="gap-2">
        <Users className="h-4 w-4" />
        <span className="hidden sm:inline-block">Usuários</span>
      </TabsTrigger>
      
      <TabsTrigger value="courses" className="gap-2">
        <BookOpen className="h-4 w-4" />
        <span className="hidden sm:inline-block">Cursos</span>
      </TabsTrigger>
      
      <TabsTrigger value="classes" className="gap-2">
        <CalendarDays className="h-4 w-4" />
        <span className="hidden sm:inline-block">Turmas</span>
      </TabsTrigger>
      
      <TabsTrigger value="enrollments" className="gap-2">
        <GraduationCap className="h-4 w-4" />
        <span className="hidden sm:inline-block">Matrículas</span>
      </TabsTrigger>
      
      <TabsTrigger value="blog" className="gap-2">
        <FileText className="h-4 w-4" />
        <span className="hidden sm:inline-block">Blog</span>
      </TabsTrigger>
      
      <TabsTrigger value="finance" className="gap-2">
        <DollarSign className="h-4 w-4" />
        <span className="hidden sm:inline-block">Financeiro</span>
      </TabsTrigger>
      
      <TabsTrigger value="ai" className="gap-2">
        <Sparkles className="h-4 w-4" />
        <span className="hidden sm:inline-block">AI</span>
      </TabsTrigger>
    </>
  );
};

export default TabTriggers;
