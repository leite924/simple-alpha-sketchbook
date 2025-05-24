
import MainLayout from "@/components/layout/MainLayout";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Clock, MapPin, Users, Calendar, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    category: "fundamentos",
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
    category: "especializacao",
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
    category: "especializacao",
  },
  {
    id: 4,
    title: "Pós-produção e Edição",
    slug: "pos-producao-edicao",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3",
    description: "Aprenda técnicas avançadas de edição usando Adobe Lightroom e Photoshop.",
    duration: "6 semanas",
    location: "Centro, São Paulo",
    students: "Máx. 15 alunos",
    nextClass: "Setembro/2023 - Noturno",
    tags: ["Intermediário", "Presencial"],
    price: "R$ 1.600",
    category: "pos-producao",
  },
  {
    id: 5,
    title: "Fotografia de Produto",
    slug: "fotografia-produto",
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-4.0.3",
    description: "Especialize-se em fotografias comerciais para e-commerce e catálogos.",
    duration: "5 semanas",
    location: "Centro, São Paulo",
    students: "Máx. 12 alunos",
    nextClass: "Novembro/2023 - Matutino",
    tags: ["Intermediário", "Presencial"],
    price: "R$ 1.700",
    category: "comercial",
  },
  {
    id: 6,
    title: "Fotojornalismo",
    slug: "fotojornalismo",
    image: "https://images.unsplash.com/photo-1498936178812-4b2e558d2937?ixlib=rb-4.0.3",
    description: "Desenvolva habilidades para contar histórias através de imagens impactantes.",
    duration: "8 semanas",
    location: "Centro, São Paulo",
    students: "Máx. 10 alunos",
    nextClass: "Janeiro/2024 - Integral",
    tags: ["Avançado", "Presencial"],
    price: "R$ 1.900",
    category: "jornalismo",
  },
];

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) || 
      course.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
      
    const matchesCategory = categoryFilter === "" || course.category === categoryFilter;
    
    const matchesLevel = levelFilter === "" || 
      course.tags.some(tag => 
        tag.toLowerCase() === levelFilter.toLowerCase()
      );
      
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-photo-dark py-16 md:py-24 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="heading-lg md:heading-xl mb-6">Nossos Cursos de Fotografia</h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Transforme sua paixão pela fotografia em habilidades profissionais através dos nossos cursos presenciais ministrados por especialistas.
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar cursos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas categorias</SelectItem>
                    <SelectItem value="fundamentos">Fundamentos</SelectItem>
                    <SelectItem value="especializacao">Especialização</SelectItem>
                    <SelectItem value="pos-producao">Pós-produção</SelectItem>
                    <SelectItem value="comercial">Comercial</SelectItem>
                    <SelectItem value="jornalismo">Jornalismo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full sm:w-auto">
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos níveis</SelectItem>
                    <SelectItem value="iniciante">Iniciante</SelectItem>
                    <SelectItem value="intermediário">Intermediário</SelectItem>
                    <SelectItem value="avançado">Avançado</SelectItem>
                    <SelectItem value="todos os níveis">Todos os níveis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Listing */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
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
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {course.description}
                    </p>
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
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium mb-2">Nenhum curso encontrado</h3>
              <p className="text-gray-500 mb-6">
                Tente ajustar seus filtros ou termos de busca
              </p>
              <Button onClick={() => {
                setSearchTerm("");
                setCategoryFilter("");
                setLevelFilter("");
              }}>
                Limpar filtros
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12 bg-amber-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="heading-md mb-4">Não encontrou o que procura?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Entre em contato conosco para saber mais sobre próximas turmas ou para solicitar um curso personalizado para sua necessidade.
          </p>
          <Button size="lg" asChild>
            <Link to="/#contato">Fale Conosco</Link>
          </Button>
        </div>
      </section>
    </MainLayout>
  );
};

export default Courses;
