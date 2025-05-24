
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import Index from "./pages/Index";
import About from "./pages/About";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Classes from "./pages/Classes";
import ClassDetail from "./pages/ClassDetail";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Auth from "./pages/Auth";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import StudentArea from "./pages/StudentArea";
import Quiz from "./pages/Quiz";
import Checkout from "./pages/Checkout";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import Finance from "./pages/Finance";
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
              <Route path="/about" element={<About />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/course/:slug" element={<CourseDetail />} />
              <Route path="/classes" element={<Classes />} />
              <Route path="/class/:id" element={<ClassDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/student-area" element={<StudentArea />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/checkout/:classId" element={<Checkout />} />
              <Route path="/checkout-success" element={<CheckoutSuccess />} />
              <Route path="/finance" element={<Finance />} />
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
