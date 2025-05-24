
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Users, Calendar } from "lucide-react";

const courses = [
  {
    id: 1,
    title: "Fotografia Básica",
    slug: "fotografia-basica",
    image: "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?ixlib=rb-4.0.3",
    description: "Aprenda os fundamentos da fotografia, desde a operação da câmera até composição básica.",
    duration: "4 semanas",
    location: "Centro, São Paulo",
    students: "Máx. 15 alunos",
    nextClass: "Agosto/2023 - Noturno",
    tags: ["Iniciante", "Presencial"],
    price: "R$ 1.200",
  },
  {
    id: 2,
    title: "Fotografia de Retrato",
    slug: "fotografia-retrato",
    image: "https://images.unsplash.com/photo-1441057206919-63d19fac2369?ixlib=rb-4.0.3",
    description: "Domine as técnicas de iluminação e pose para criar retratos profissionais impressionantes.",
    duration: "6 semanas",
    location: "Centro, São Paulo",
    students: "Máx. 12 alunos",
    nextClass: "Setembro/2023 - Matutino",
    tags: ["Intermediário", "Presencial"],
    price: "R$ 1.500",
  },
  {
    id: 3,
    title: "Fotografia de Paisagem",
    slug: "fotografia-paisagem",
    image: "https://images.unsplash.com/photo-1439886183900-e79ec0057170?ixlib=rb-4.0.3",
    description: "Aprenda a capturar a beleza de paisagens naturais com técnicas avançadas de composição.",
    duration: "4 semanas",
    location: "Centro, São Paulo",
    students: "Máx. 10 alunos",
    nextClass: "Outubro/2023 - Final de Semana",
    tags: ["Todos os níveis", "Presencial"],
    price: "R$ 1.400",
  },
];

const CoursesSection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="section-title">Cursos em destaque</h2>
          <p className="text-lg text-gray-600 mt-6">
            Conheça nossos cursos mais populares com turmas abertas para matrícula
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {course.tags.map((tag, idx) => (
                    <Badge key={idx} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{course.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{course.students}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{course.nextClass}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-amber-600">
                    {course.price}
                  </span>
                  <Button asChild>
                    <Link to={`/cursos/${course.slug}`}>Ver Detalhes</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="text-lg" asChild>
            <Link to="/cursos">Ver todos os cursos</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
