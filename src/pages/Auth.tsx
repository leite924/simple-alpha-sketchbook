
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import AlertMessages from "@/components/auth/AlertMessages";
import { useAuth } from "@/components/auth/AuthProvider";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showConfirmationAlert, setShowConfirmationAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [defaultTab, setDefaultTab] = useState("login");
  
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !loading) {
      console.log("User authenticated, redirecting to admin");
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

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
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Bem-vindo</CardTitle>
            <CardDescription className="text-center">
              Entre com suas credenciais ou crie uma nova conta.
            </CardDescription>
          </CardHeader>
          
          <AlertMessages 
            errorMessage={errorMessage}
            showConfirmationAlert={showConfirmationAlert}
            email={email}
          />
          
          <Tabs defaultValue={defaultTab} value={defaultTab} onValueChange={setDefaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mx-6">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Cadastrar</TabsTrigger>
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
          
          <div className="p-6 pt-0">
            <Link to="/" className="text-sm text-center block text-gray-600 hover:text-purple-600">
              ← Voltar para o início
            </Link>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Auth;
