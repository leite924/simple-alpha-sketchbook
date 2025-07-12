
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import MainLayout from "@/components/layout/MainLayout";
import LoadingPage from "@/components/LoadingPage";

// Pages - using existing files and creating new ones as needed
const HomePage = lazy(() => import("@/pages/Index")); // Using existing Index.tsx
const CoursesPage = lazy(() => import("@/pages/CoursesPage"));
const CourseDetailsPage = lazy(() => import("@/pages/CourseDetailsPage"));
const ClassesPage = lazy(() => import("@/pages/ClassesPage"));
const ClassDetailsPage = lazy(() => import("@/pages/ClassDetailsPage"));
const BlogPage = lazy(() => import("@/pages/BlogPage"));
const BlogPostPage = lazy(() => import("@/pages/BlogPostPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const PricingPage = lazy(() => import("@/pages/PricingPage"));
const TermsPage = lazy(() => import("@/pages/TermsPage"));
const PrivacyPage = lazy(() => import("@/pages/PrivacyPage"));
const FaqPage = lazy(() => import("@/pages/FaqPage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/RegisterPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const AdminPage = lazy(() => import("@/pages/AdminPage"));
const PaymentsPage = lazy(() => import("@/pages/PaymentsPage"));
const NFSePage = lazy(() => import("@/pages/NFSePage"));
const CheckoutPage = lazy(() => import("@/pages/CheckoutPage"));
const ForgotPasswordPage = lazy(() => import("@/pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("@/pages/ResetPasswordPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFound")); // Using existing NotFound.tsx

// Database status page
const DatabaseStatus = lazy(() => import("@/pages/DatabaseStatus"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AuthProvider>
            <MainLayout>
              <Suspense fallback={<LoadingPage />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/cursos" element={<CoursesPage />} />
                  <Route path="/cursos/:slug" element={<CourseDetailsPage />} />
                  <Route path="/turmas" element={<ClassesPage />} />
                  <Route path="/turmas/:slug" element={<ClassDetailsPage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:slug" element={<BlogPostPage />} />
                  <Route path="/contato" element={<ContactPage />} />
                  <Route path="/sobre" element={<AboutPage />} />
                  <Route path="/precos" element={<PricingPage />} />
                  <Route path="/termos" element={<TermsPage />} />
                  <Route path="/privacidade" element={<PrivacyPage />} />
                  <Route path="/faq" element={<FaqPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/perfil" element={<ProfilePage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="/pagamentos" element={<PaymentsPage />} />
                  <Route path="/nfse" element={<NFSePage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/database-status" element={<DatabaseStatus />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </MainLayout>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
