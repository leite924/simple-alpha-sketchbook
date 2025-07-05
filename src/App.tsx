
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Classes from "./pages/Classes";
import ClassDetail from "./pages/ClassDetail";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Quiz from "./pages/Quiz";
import StudentArea from "./pages/StudentArea";
import Finance from "./pages/Finance";
import Admin from "./pages/Admin";
import SuperAdminLogin from "./pages/SuperAdminLogin";
import Login from "./pages/Login";
import Auth from "./pages/Auth";
import Checkout from "./pages/Checkout";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import NotFound from "./pages/NotFound";
import NFSeTest from "./pages/NFSeTest";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/sobre" element={<About />} />
              <Route path="/contato" element={<Contact />} />
              <Route path="/cursos" element={<Courses />} />
              <Route path="/curso/:slug" element={<CourseDetail />} />
              <Route path="/turmas" element={<Classes />} />
              <Route path="/turma/:id" element={<ClassDetail />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/area-do-aluno" element={<StudentArea />} />
              <Route path="/financeiro" element={<Finance />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/super-admin" element={<SuperAdminLogin />} />
              <Route path="/login" element={<Login />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/checkout/success" element={<CheckoutSuccess />} />
              <Route path="/nfse-test" element={<NFSeTest />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
