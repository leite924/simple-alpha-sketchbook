
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import AlertMessages from "@/components/auth/AlertMessages";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("midiaputz@gmail.com");
  const [password, setPassword] = useState("*Putz123");
  const [showConfirmationAlert, setShowConfirmationAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [defaultTab, setDefaultTab] = useState("login");
  
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !loading) {
      console.log("User authenticated, redirecting to admin");
      const from = location.state?.from?.pathname || "/admin";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, location]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("register") === "true") {
      setDefaultTab("register");
    }
    
    setShowConfirmationAlert(false);
  }, [location]);

  if (loading) {
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

  if (isAuthenticated) {
    return null;
  }

  return (
    <MainLayout>
      <div className="container mx-auto flex items-center justify-center py-16">
        <div className="w-full max-w-md space-y-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao início
          </Button>
          
          <Card>
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
              <TabsList className="grid w-full grid-cols-2 mx-6">
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
      </div>
    </MainLayout>
  );
};

export default Login;
