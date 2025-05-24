
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Camera, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-md"
          : "bg-background" // Changed from bg-transparent to bg-background
      }`}
    >
      <div className="container mx-auto px-4 w-full">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Camera className="h-8 w-8 text-primary" />
              <span className="logo-text text-xl font-bold">FotoCursos</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-foreground/90 hover:text-foreground font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              to="/cursos"
              className="text-foreground/90 hover:text-foreground font-medium transition-colors"
            >
              Cursos
            </Link>
            <Link
              to="/turmas"
              className="text-foreground/90 hover:text-foreground font-medium transition-colors"
            >
              Turmas
            </Link>
            <Link
              to="/blog"
              className="text-foreground/90 hover:text-foreground font-medium transition-colors"
            >
              Blog
            </Link>
            <Link
              to="/sobre"
              className="text-foreground/90 hover:text-foreground font-medium transition-colors"
            >
              Sobre
            </Link>
            <Link
              to="/area-do-aluno"
              className="text-foreground/90 hover:text-foreground font-medium transition-colors"
            >
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <User size={16} />
                Área do Aluno
              </Button>
            </Link>
            <Link
              to="/admin"
              className="text-foreground/90 hover:text-foreground font-medium transition-colors"
            >
              <Button variant="default" size="sm" className="flex items-center gap-1">
                <Settings size={16} />
                Admin
              </Button>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={toggleMenu}
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background w-full animate-fade-in border-t">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link
              to="/"
              onClick={closeMenu}
              className="px-4 py-2 text-foreground/90 hover:text-foreground hover:bg-muted rounded-md transition-colors"
            >
              Home
            </Link>
            <Link
              to="/cursos"
              onClick={closeMenu}
              className="px-4 py-2 text-foreground/90 hover:text-foreground hover:bg-muted rounded-md transition-colors"
            >
              Cursos
            </Link>
            <Link
              to="/turmas"
              onClick={closeMenu}
              className="px-4 py-2 text-foreground/90 hover:text-foreground hover:bg-muted rounded-md transition-colors"
            >
              Turmas
            </Link>
            <Link
              to="/blog"
              onClick={closeMenu}
              className="px-4 py-2 text-foreground/90 hover:text-foreground hover:bg-muted rounded-md transition-colors"
            >
              Blog
            </Link>
            <Link
              to="/sobre"
              onClick={closeMenu}
              className="px-4 py-2 text-foreground/90 hover:text-foreground hover:bg-muted rounded-md transition-colors"
            >
              Sobre
            </Link>
            <Link
              to="/area-do-aluno"
              onClick={closeMenu}
              className="px-4 py-2 flex items-center space-x-2 bg-muted text-foreground rounded-md"
            >
              <User size={16} />
              <span>Área do Aluno</span>
            </Link>
            <Link
              to="/admin"
              onClick={closeMenu}
              className="px-4 py-2 flex items-center space-x-2 bg-primary text-primary-foreground rounded-md"
            >
              <Settings size={16} />
              <span>Admin</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
