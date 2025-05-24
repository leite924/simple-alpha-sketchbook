
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-purple">
            Escola de Fotografia
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-purple transition-colors">
              Início
            </Link>
            <Link to="/courses" className="text-gray-700 hover:text-purple transition-colors">
              Cursos
            </Link>
            <Link to="/classes" className="text-gray-700 hover:text-purple transition-colors">
              Turmas
            </Link>
            <Link to="/blog" className="text-gray-700 hover:text-purple transition-colors">
              Blog
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-purple transition-colors">
              Sobre
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-purple transition-colors">
              Contato
            </Link>
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/student-area" className="text-gray-700 hover:text-purple transition-colors">
                  Área do Estudante
                </Link>
                <Link to="/admin" className="text-gray-700 hover:text-purple transition-colors">
                  Administração
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{user.email}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate("/student-area")}>
                      <User className="h-4 w-4 mr-2" />
                      Meu Perfil
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="outline">Entrar</Button>
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
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              <Link
                to="/"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple"
                onClick={toggleMenu}
              >
                Início
              </Link>
              <Link
                to="/courses"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple"
                onClick={toggleMenu}
              >
                Cursos
              </Link>
              <Link
                to="/classes"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple"
                onClick={toggleMenu}
              >
                Turmas
              </Link>
              <Link
                to="/blog"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple"
                onClick={toggleMenu}
              >
                Blog
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple"
                onClick={toggleMenu}
              >
                Sobre
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple"
                onClick={toggleMenu}
              >
                Contato
              </Link>

              {/* Mobile Auth Section */}
              <div className="pt-4 border-t">
                {user ? (
                  <>
                    <Link
                      to="/student-area"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple"
                      onClick={toggleMenu}
                    >
                      Área do Estudante
                    </Link>
                    <Link
                      to="/admin"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple"
                      onClick={toggleMenu}
                    >
                      Administração
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        toggleMenu();
                      }}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-purple"
                    >
                      Sair ({user.email})
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/auth"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple"
                      onClick={toggleMenu}
                    >
                      Entrar
                    </Link>
                    <Link
                      to="/auth"
                      className="block px-3 py-2 text-base font-medium text-purple hover:text-purple-dark"
                      onClick={toggleMenu}
                    >
                      Cadastrar
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
