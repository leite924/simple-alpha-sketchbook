
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/components/auth/AuthProvider';

// Páginas principais
import Index from '@/pages/Index';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import NotFound from '@/pages/NotFound';

// Páginas de curso/turma
import Courses from '@/pages/Courses';
import Classes from '@/pages/Classes';
import CourseDetail from '@/pages/CourseDetail';
import ClassDetail from '@/pages/ClassDetail';

// Páginas de blog
import Blog from '@/pages/Blog';
import BlogPost from '@/pages/BlogPost';

// Páginas de autenticação
import Login from '@/pages/Login';
import Auth from '@/pages/Auth';

// Páginas de administração
import Admin from '@/pages/Admin';
import Finance from '@/pages/Finance';
import SuperAdminLogin from '@/pages/SuperAdminLogin';

// Páginas de estudante
import StudentArea from '@/pages/StudentArea';
import StudentDashboard from '@/pages/StudentDashboard';
import StudentRegistration from '@/pages/StudentRegistration';

// Páginas de checkout
import Checkout from '@/pages/Checkout';
import CheckoutSuccess from '@/pages/CheckoutSuccess';

// Páginas especiais
import NFSeTest from '@/pages/NFSeTest';
import NFSeHomologation from '@/pages/NFSeHomologation';
import Quiz from '@/pages/Quiz';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Página inicial */}
            <Route path="/" element={<Index />} />
            
            {/* Páginas principais */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Páginas de cursos e turmas */}
            <Route path="/courses" element={<Courses />} />
            <Route path="/cursos" element={<Courses />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/curso/:slug" element={<CourseDetail />} />
            <Route path="/cursos/:slug" element={<CourseDetail />} />
            <Route path="/turma/:classSlug" element={<ClassDetail />} />
            <Route path="/turmas/:classSlug" element={<ClassDetail />} />
            
            {/* Páginas de blog */}
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            
            {/* Páginas de autenticação */}
            <Route path="/login" element={<Login />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Páginas de estudante */}
            <Route path="/student-area" element={<StudentArea />} />
            <Route path="/student" element={<StudentArea />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/cadastro-aluno" element={<StudentRegistration />} />
            
            {/* Páginas de administração */}
            <Route path="/admin" element={<Admin />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/finance/:tab" element={<Finance />} />
            <Route path="/super-admin-login" element={<SuperAdminLogin />} />
            
            {/* Páginas de checkout */}
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout/:classId" element={<Checkout />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            
            {/* Páginas especiais */}
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/nfse-test" element={<NFSeTest />} />
            <Route path="/nfse-homologacao" element={<NFSeHomologation />} />
            
            {/* Rota 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
