
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";

const ErrorState = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Post não encontrado</h2>
          <p className="text-gray-600 mb-6">
            O post que você está tentando acessar não existe ou foi removido.
          </p>
          <Button asChild>
            <Link to="/blog">Voltar para o Blog</Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default ErrorState;
