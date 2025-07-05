
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import { Menu, X, User } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, signOut, userRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const canAccessAdmin = userRole === 'admin' || userRole === 'super_admin';
  const canRegisterStudents = canAccessAdmin;

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-purple-600">
            EscolaIdiomas
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/courses" className="text-gray-700 hover:text-purple-600 transition-colors">
              Cursos
            </Link>
            <Link to="/classes" className="text-gray-700 hover:text-purple-600 transition-colors">
              Turmas
            </Link>
            <Link to="/blog" className="text-gray-700 hover:text-purple-600 transition-colors">
              Blog
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-purple-600 transition-colors">
              Contato
            </Link>
            
            {/* Links para usuários autenticados */}
            {isAuthenticated && (
              <>
                {canAccessAdmin && (
                  <Link to="/admin" className="text-gray-700 hover:text-purple-600 transition-colors">
                    Admin
                  </Link>
                )}
                {canRegisterStudents && (
                  <Link to="/cadastro-aluno" className="text-gray-700 hover:text-purple-600 transition-colors">
                    Cadastrar Aluno
                  </Link>
                )}
                <Link to="/student" className="text-gray-700 hover:text-purple-600 transition-colors">
                  Área do Aluno
                </Link>
              </>
            )}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span className="capitalize">{userRole}</span>
                </div>
                <Button variant="outline" onClick={handleLogout}>
                  Sair
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Entrar</Button>
                </Link>
                <Link to="/auth">
                  <Button>Cadastrar</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/courses" 
                className="text-gray-700 hover:text-purple-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Cursos
              </Link>
              <Link 
                to="/classes" 
                className="text-gray-700 hover:text-purple-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Turmas
              </Link>
              <Link 
                to="/blog" 
                className="text-gray-700 hover:text-purple-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link 
                to="/contact" 
                className="text-gray-700 hover:text-purple-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contato
              </Link>
              
              {/* Mobile Links para usuários autenticados */}
              {isAuthenticated && (
                <>
                  {canAccessAdmin && (
                    <Link 
                      to="/admin" 
                      className="text-gray-700 hover:text-purple-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
                  {canRegisterStudents && (
                    <Link 
                      to="/cadastro-aluno" 
                      className="text-gray-700 hover:text-purple-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Cadastrar Aluno
                    </Link>
                  )}
                  <Link 
                    to="/student" 
                    className="text-gray-700 hover:text-purple-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Área do Aluno
                  </Link>
                </>
              )}
              
              {/* Mobile Auth Buttons */}
              <div className="flex flex-col space-y-2 pt-4 border-t">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <User className="h-4 w-4" />
                      <span className="capitalize">{userRole}</span>
                    </div>
                    <Button variant="outline" onClick={handleLogout} className="w-full">
                      Sair
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="w-full">Entrar</Button>
                    </Link>
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full">Cadastrar</Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
