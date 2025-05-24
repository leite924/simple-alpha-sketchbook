
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import About from "./pages/About";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Classes from "./pages/Classes";
import ClassDetail from "./pages/ClassDetail";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Quiz from "./pages/Quiz";
import Finance from "./pages/Finance";
import NFSeTest from "./pages/NFSeTest";
import StudentArea from "./pages/StudentArea";
import Checkout from "./pages/Checkout";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import "./App.css";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="w-full h-full">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/sobre" element={<About />} /> {/* Portuguese route alias */}
            <Route path="/courses" element={<Courses />} />
            <Route path="/cursos" element={<Courses />} /> {/* Portuguese route alias */}
            <Route path="/courses/:slug" element={<CourseDetail />} />
            <Route path="/cursos/:slug" element={<CourseDetail />} /> {/* Portuguese route alias */}
            <Route path="/classes" element={<Classes />} />
            <Route path="/turmas" element={<Classes />} /> {/* Portuguese route alias */}
            <Route path="/classes/:id" element={<ClassDetail />} />
            <Route path="/turmas/:id" element={<ClassDetail />} /> {/* Portuguese route alias */}
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/contato" element={<Contact />} /> {/* Portuguese route alias */}
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/student-area" element={<StudentArea />} />
            <Route path="/area-do-aluno" element={<StudentArea />} />
            <Route path="/checkout/:classId" element={<Checkout />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            <Route path="/nfse-test" element={<NFSeTest />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
