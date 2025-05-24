
import { Link } from "react-router-dom";
import { Camera, Mail, MapPin, Phone, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-photo-dark text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Camera className="h-8 w-8 text-purple" />
              <span className="logo-text text-xl font-bold">FotoCursos</span>
            </Link>
            <p className="text-gray-300 mb-6">
              Transforme sua paixão pela fotografia em habilidades profissionais com nossos cursos presenciais ministrados por especialistas do mercado.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-purple transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-purple transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-purple transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-purple transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Links Úteis */}
          <div>
            <h3 className="text-lg font-bold mb-4">Links Úteis</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/cursos" className="text-gray-300 hover:text-purple transition-colors">
                  Cursos
                </Link>
              </li>
              <li>
                <Link to="/turmas" className="text-gray-300 hover:text-purple transition-colors">
                  Turmas
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-purple transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/area-do-aluno" className="text-gray-300 hover:text-purple transition-colors">
                  Área do Aluno
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="text-gray-300 hover:text-purple transition-colors">
                  Sobre
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-gray-300 hover:text-purple transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 mt-0.5 text-purple" />
                <span className="text-gray-300">
                  Av. Paulista, 1000, São Paulo - SP
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-purple" />
                <span className="text-gray-300">(11) 99999-9999</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-purple" />
                <span className="text-gray-300">contato@fotocursos.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-4">Newsletter</h3>
            <p className="text-gray-300 mb-4">
              Receba novidades, dicas e ofertas exclusivas de fotografia.
            </p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Input
                type="email"
                placeholder="Seu e-mail"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
              <Button variant="default">Inscrever</Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-6 text-center text-gray-400 text-sm">
          <p>© {currentYear} FotoCursos. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
