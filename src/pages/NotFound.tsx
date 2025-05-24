
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-photo-dark text-white p-4">
      <div className="text-center max-w-md">
        <Camera className="h-24 w-24 mx-auto mb-6 text-amber-400" />
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-300 mb-6">Oops! Esta página não foi encontrada</p>
        <p className="text-gray-400 mb-8">
          A página que você está procurando pode ter sido removida, renomeada ou está temporariamente indisponível.
        </p>
        <Button size="lg" asChild className="button-primary">
          <Link to="/">Voltar à página inicial</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
