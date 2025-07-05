
import { useAuth } from "@/components/auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import StudentDashboard from "@/components/student/StudentDashboard";
import MainLayout from "@/components/layout/MainLayout";

const StudentDashboardPage = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <StudentDashboard onLogout={handleLogout} />
      </div>
    </MainLayout>
  );
};

export default StudentDashboardPage;
