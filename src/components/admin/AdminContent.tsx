
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Dashboard from "./Dashboard";
import UserManagement from "./UserManagement";
import CourseManagement from "./CourseManagement";
import ClassManagement from "./ClassManagement";
import EnrollmentManagement from "./EnrollmentManagement";
import BlogManagement from "./BlogManagement";
import PaymentGateway from "./PaymentGateway";
import FinanceManagement from "./FinanceManagement";
import AIManagement from "./AIManagement";
import AdminStudentRegistration from "./StudentRegistration";

interface AdminContentProps {
  userRole: string;
  showDiagnostics: boolean;
}

const AdminContent = ({ userRole, showDiagnostics }: AdminContentProps) => {
  const isSuperAdmin = userRole === 'super_admin';
  const isAdmin = userRole === 'admin' || isSuperAdmin;

  return (
    <Tabs defaultValue="dashboard" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3 lg:grid-cols-9 gap-1">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        
        {isAdmin && (
          <>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="students">Cadastro</TabsTrigger>
            <TabsTrigger value="courses">Cursos</TabsTrigger>
            <TabsTrigger value="classes">Turmas</TabsTrigger>
            <TabsTrigger value="enrollments">Matrículas</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="finance">Financeiro</TabsTrigger>
          </>
        )}
        
        {isSuperAdmin && (
          <>
            <TabsTrigger value="payments">Pagamentos</TabsTrigger>
            <TabsTrigger value="ai">IA</TabsTrigger>
          </>
        )}
      </TabsList>

      <TabsContent value="dashboard" className="space-y-6">
        <Dashboard />
      </TabsContent>

      {isAdmin && (
        <>
          <TabsContent value="users" className="space-y-6">
            <UserManagement />
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <AdminStudentRegistration />
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <CourseManagement />
          </TabsContent>

          <TabsContent value="classes" className="space-y-6">
            <ClassManagement />
          </TabsContent>

          <TabsContent value="enrollments" className="space-y-6">
            <EnrollmentManagement />
          </TabsContent>

          <TabsContent value="blog" className="space-y-6">
            <BlogManagement />
          </TabsContent>

          <TabsContent value="finance" className="space-y-6">
            <FinanceManagement />
          </TabsContent>
        </>
      )}

      {isSuperAdmin && (
        <>
          <TabsContent value="payments" className="space-y-6">
            <PaymentGateway />
          </TabsContent>

          <TabsContent value="ai" className="space-y-6">
            <AIManagement />
          </TabsContent>
        </>
      )}
    </Tabs>
  );
};

export default AdminContent;
