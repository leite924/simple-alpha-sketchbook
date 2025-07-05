
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import Login from "./pages/Login";
import Courses from "./pages/Courses";
import Classes from "./pages/Classes";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import StudentDashboard from "./pages/StudentDashboard";
import StudentRegistration from "./pages/StudentRegistration";
import Checkout from "./pages/Checkout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <Admin />
                </ProtectedRoute>
              } 
            />
            <Route path="/courses" element={<Courses />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route 
              path="/student" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/cadastro-aluno" 
              element={
                <ProtectedRoute requireAuth={true} requiredRole="admin">
                  <StudentRegistration />
                </ProtectedRoute>
              } 
            />
            <Route path="/checkout/:classId" element={<Checkout />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
