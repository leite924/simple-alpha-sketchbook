
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import AlertMessages from "@/components/auth/AlertMessages";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const [email, setEmail] = useState("midiaputz@gmail.com");
  const [password, setPassword] = useState("*Putz123");
  const [showConfirmationAlert, setShowConfirmationAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [defaultTab, setDefaultTab] = useState("login");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        console.log("Checking authentication status on login page...");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log("User already authenticated, redirecting to admin");
          navigate("/admin", { replace: true });
          return;
        }
        
        console.log("User not authenticated, staying on login page");
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    
    checkAuth();

    // Check if coming from a redirect that specifies registration
    const params = new URLSearchParams(location.search);
    if (params.get("register") === "true") {
      setDefaultTab("register");
    }
    
    // Reset confirmation alert when component mounts
    setShowConfirmationAlert(false);

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed on login page:", event, !!session);
      
      if (session && !isCheckingAuth) {
        console.log("Session detected, redirecting to admin");
        navigate("/admin", { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [location, navigate, isCheckingAuth]);

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <MainLayout>
        <div className="container mx-auto flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p>Verificando autenticação...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto flex items-center justify-center py-16">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Área Administrativa</CardTitle>
            <CardDescription className="text-center">
              Entre com suas credenciais para acessar o painel administrativo.
            </CardDescription>
          </CardHeader>
          
          <AlertMessages 
            errorMessage={errorMessage}
            showConfirmationAlert={showConfirmationAlert}
            email={email}
          />
          
          <Tabs defaultValue={defaultTab} value={defaultTab} onValueChange={setDefaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Cadastro</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm 
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                setShowConfirmationAlert={setShowConfirmationAlert}
                setErrorMessage={setErrorMessage}
              />
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm 
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                setShowConfirmationAlert={setShowConfirmationAlert}
                setErrorMessage={setErrorMessage}
              />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Login;
