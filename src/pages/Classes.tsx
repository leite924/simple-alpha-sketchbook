
import MainLayout from "@/components/layout/MainLayout";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, Clock, Filter, MapPin, Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useClasses } from "@/hooks/classes/useClasses";

const Classes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");
  
  const { data: classes = [], isLoading, error } = useClasses();

  const filteredClasses = classes.filter((classItem) => {
    const matchesSearch = classItem.courseName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
      
    const matchesPeriod = periodFilter === "all" || classItem.period.toLowerCase() === periodFilter.toLowerCase();
    
    const matchesMonth = monthFilter === "all" || classItem.month.toLowerCase() === monthFilter.toLowerCase();
      
    return matchesSearch && matchesPeriod && matchesMonth;
  });

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto py-10">
          <div className="bg-red-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-red-700 mb-4">Erro ao carregar turmas</h2>
            <p>{error instanceof Error ? error.message : 'Ocorreu um erro inesperado'}</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-photo-dark py-16 md:py-24 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="heading-lg md:heading-xl mb-6">Turmas Abertas</h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Confira todas as turmas disponíveis para matrícula e reserve sua vaga nos nossos cursos de fotografia.
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
                <Select value={monthFilter} onValueChange={setMonthFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Mês" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os meses</SelectItem>
                    <SelectItem value="agosto">Agosto</SelectItem>
                    <SelectItem value="setembro">Setembro</SelectItem>
                    <SelectItem value="outubro">Outubro</SelectItem>
                    <SelectItem value="novembro">Novembro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full sm:w-auto">
                <Select value={periodFilter} onValueChange={setPeriodFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Turno" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os turnos</SelectItem>
                    <SelectItem value="matutino">Matutino</SelectItem>
                    <SelectItem value="noturno">Noturno</SelectItem>
                    <SelectItem value="integral">Integral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Classes Listing */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredClasses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredClasses.map((classItem) => (
                <div
                  key={classItem.id}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={classItem.image}
                      alt={classItem.courseName}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute top-0 left-0 bg-amber-600 text-white px-4 py-2 rounded-br-lg font-bold">
                      {classItem.month}/{classItem.year}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h3 className="text-xl font-bold text-white">{classItem.courseName}</h3>
                      <p className="text-amber-200">{classItem.period}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-amber-600" />
                        <span>Início: {classItem.startDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span>{classItem.days}, {classItem.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-amber-600" />
                        <span>{classItem.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-amber-600" />
                        <span>
                          {classItem.spotsAvailable > 0 
                            ? `${classItem.spotsAvailable} vagas disponíveis` 
                            : "Turma lotada"}
                        </span>
                      </div>
                    </div>
                    <div className="mb-4">
                      <span className="text-sm text-gray-500">Professor(a):</span>
                      <span className="ml-2 font-medium">{classItem.instructor}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-amber-600">
                        {classItem.price}
                      </span>
                      <Button disabled={classItem.spotsAvailable === 0} asChild>
                        <Link to={`/turmas/${classItem.courseSlug}-${classItem.month.toLowerCase()}-${classItem.year}-${classItem.period.toLowerCase()}`}>
                          {classItem.spotsAvailable > 0 ? "Inscrever-se" : "Lista de espera"}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium mb-2">Nenhuma turma encontrada</h3>
              <p className="text-gray-500 mb-6">
                Tente ajustar seus filtros ou termos de busca
              </p>
              <Button onClick={() => {
                setSearchTerm("");
                setPeriodFilter("all");
                setMonthFilter("all");
              }}>
                Limpar filtros
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Next Courses */}
      <section className="py-12 bg-amber-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="heading-md mb-4">Não encontrou o horário ideal?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Cadastre-se em nossa lista de espera para ser notificado sobre novas turmas ou consulte todos os nossos cursos disponíveis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" asChild>
              <Link to="/courses">Ver todos os cursos</Link>
            </Button>
            <Button size="lg" asChild>
              <Link to="/#contato">Entrar na lista de espera</Link>
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Classes;
