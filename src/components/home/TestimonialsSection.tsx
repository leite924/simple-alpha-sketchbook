
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    name: "Roberta Silva",
    role: "Fotógrafa de Casamentos",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3",
    text: "Os cursos transformaram minha carreira. Aprendi técnicas que elevaram minhas fotos a outro nível e hoje tenho uma agenda lotada de clientes.",
    rating: 5,
  },
  {
    name: "Carlos Mendes",
    role: "Fotógrafo de Natureza",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3",
    text: "As expedições fotográficas são incríveis! Aprendi a capturar paisagens de uma forma que nunca imaginei e hoje vendo minhas fotos para bancos de imagens.",
    rating: 5,
  },
  {
    name: "Juliana Costa",
    role: "Estudante de Artes",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3",
    text: "Como iniciante, estava insegura, mas os professores são pacientes e dedicados. Em poucos meses já consegui montar um portfólio incrível.",
    rating: 5,
  },
  {
    name: "Marcos Oliveira",
    role: "Fotojornalista",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3",
    text: "O curso avançado de fotojornalismo abriu portas para minha carreira. Hoje trabalho para grandes veículos e tudo começou aqui.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const next = () => {
    setActive((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prev = () => {
    setActive((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      next();
    }, 5000);

    return () => clearInterval(interval);
  }, [autoplay]);

  return (
    <section className="py-16 md:py-24 bg-photo-dark text-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="section-title text-white">O que dizem nossos alunos</h2>
          <p className="text-lg text-gray-300 mt-6">
            Histórias de sucesso de quem transformou a paixão pela fotografia em profissão
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`transition-opacity duration-500 ${
                  index === active ? "opacity-100" : "opacity-0 absolute top-0 left-0 right-0"
                }`}
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 md:p-8">
                  <div className="flex flex-col md:flex-row gap-6 items-center mb-6">
                    <div className="w-24 h-24 rounded-full overflow-hidden">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center md:text-left">
                      <h3 className="text-xl font-bold">{testimonial.name}</h3>
                      <p className="text-amber-400">{testimonial.role}</p>
                      <div className="flex justify-center md:justify-start mt-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-5 h-5 fill-amber-400 text-amber-400"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <blockquote className="text-gray-200 text-lg italic">
                    "{testimonial.text}"
                  </blockquote>
                </div>
              </div>
            ))}

            <div className="flex justify-center mt-8 gap-4">
              <button
                onClick={() => {
                  prev();
                  setAutoplay(false);
                }}
                className="bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="flex gap-2 items-center">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setActive(index);
                      setAutoplay(false);
                    }}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === active
                        ? "bg-amber-400 w-6"
                        : "bg-white/30 hover:bg-white/50"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={() => {
                  next();
                  setAutoplay(false);
                }}
                className="bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
