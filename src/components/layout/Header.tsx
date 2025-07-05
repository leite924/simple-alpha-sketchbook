
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, userRole, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const navigation = [
    { name: 'Início', href: '/' },
    { name: 'Cursos', href: '/courses' },
    { name: 'Turmas', href: '/classes' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contato', href: '/contact' },
  ];

  return (
    <header className="bg-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link to="/" className="text-2xl font-bold text-purple-600">
              Escola de Fotografia
            </Link>
          </div>
          
          <div className="-mr-2 -my-2 md:hidden">
            <Button
              variant="ghost"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
          
          <nav className="hidden md:flex space-x-10">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-base font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0 space-x-4">
            {isAuthenticated ? (
              <>
                {(userRole === 'admin' || userRole === 'super_admin' || userRole === 'instructor') && (
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/admin')}
                    className="text-sm"
                  >
                    Admin
                  </Button>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2">
                      <User className="h-4 w-4" />
                      {user?.email?.split('@')[0] || 'Usuário'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate('/student')}>
                      Minha Área
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  Entrar
                </Button>
                <Button onClick={() => navigate('/login?register=true')}>
                  Cadastrar
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden">
          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
            <div className="pt-5 pb-6 px-5">
              <div className="flex items-center justify-between">
                <Link to="/" className="text-xl font-bold text-purple-600">
                  Escola de Fotografia
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  className="p-2"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <div className="mt-6">
                <nav className="grid gap-y-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="text-base font-medium text-gray-900 hover:text-gray-700"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
            <div className="py-6 px-5 space-y-6">
              {isAuthenticated ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Logado como: {user?.email}
                  </p>
                  {(userRole === 'admin' || userRole === 'super_admin' || userRole === 'instructor') && (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        navigate('/admin');
                        setIsOpen(false);
                      }}
                      className="w-full"
                    >
                      Painel Admin
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      navigate('/student');
                      setIsOpen(false);
                    }}
                    className="w-full"
                  >
                    Minha Área
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={handleSignOut}
                    className="w-full gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      navigate('/login');
                      setIsOpen(false);
                    }}
                    className="w-full"
                  >
                    Entrar
                  </Button>
                  <Button 
                    onClick={() => {
                      navigate('/login?register=true');
                      setIsOpen(false);
                    }}
                    className="w-full"
                  >
                    Cadastrar
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
