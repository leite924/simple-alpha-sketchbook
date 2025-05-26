
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Index from "./pages/Index";
import About from "./pages/About";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Classes from "./pages/Classes";
import ClassDetail from "./pages/ClassDetail";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Quiz from "./pages/Quiz";
import StudentArea from "./pages/StudentArea";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Auth from "./pages/Auth";
import Finance from "./pages/Finance";
import Checkout from "./pages/Checkout";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import NotFound from "./pages/NotFound";
import NFSeTest from "./pages/NFSeTest";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/about" element={<About />} />
        <Route path="/cursos" element={<Courses />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/curso/:slug" element={<CourseDetail />} />
        <Route path="/turmas" element={<Classes />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/turma/:id" element={<ClassDetail />} />
        <Route path="/contato" element={<Contact />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/estudante" element={<StudentArea />} />
        <Route path="/student-area" element={<StudentArea />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/financeiro/:tab" element={<Finance />} />
        <Route path="/checkout/:classId" element={<Checkout />} />
        <Route path="/checkout-sucesso" element={<CheckoutSuccess />} />
        <Route path="/nfse-test" element={<NFSeTest />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
