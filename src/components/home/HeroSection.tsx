
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="hero-gradient text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500375592092-40eb2168fd21?ixlib=rb-4.0.3')] bg-cover bg-center opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-transparent"></div>
      
      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10 flex flex-col items-center text-center">
        <h1 className="heading-xl mb-6 max-w-4xl">
          Transforme sua <span className="hero-text-gradient">paixão por fotografia</span> em habilidade profissional
        </h1>
        
        <p className="text-lg md:text-xl text-gray-200 max-w-2xl mb-8">
          Aprenda com os melhores fotógrafos do mercado em cursos práticos e imersivos que vão elevar suas habilidades ao próximo nível.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button className="button-primary text-lg" size="lg" asChild>
            <Link to="/cursos">Ver Cursos</Link>
          </Button>
          <Button className="button-outline border-white text-white hover:bg-white/20 hover:text-white text-lg" size="lg" variant="outline" asChild>
            <Link to="/sobre">Conheça-nos</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
