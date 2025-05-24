
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Clock, MapPin, Users, Calendar, CheckCircle, Award, ChevronDown, ChevronUp, Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

// Mock course data
const course = {
  id: 1,
  title: "Fotografia Básica",
  slug: "fotografia-basica",
  heroImage: "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?ixlib=rb-4.0.3",
  gallery: [
    "https://images.unsplash.com/photo-1469041797191-50ace28483c3?ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1501286353178-1ec871a414838?ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1485833077593-4278bba3f11f?ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1441057206919-63d19fac2369?ixlib=rb-4.0.3"
  ],
  description: "Um curso completo para iniciantes que desejam dominar os fundamentos da fotografia, desde a operação básica da câmera até técnicas de composição e iluminação.",
  longDescription: `
    Este curso foi desenvolvido para pessoas que desejam iniciar na fotografia com o pé direito, adquirindo conhecimentos sólidos sobre os fundamentos que fazem a diferença em qualquer estilo fotográfico.
    
    Durante as aulas, os alunos terão contato com equipamentos profissionais e aprenderão na prática como configurar a câmera corretamente, entender a exposição, dominar a composição e trabalhar com diferentes tipos de luz.
    
    O curso tem um formato dinâmico, com 70% de aulas práticas e 30% de teoria, garantindo que você saia fotografando com confiança desde as primeiras aulas. Ao final, os participantes terão produzido um pequeno portfólio com fotos de diferentes estilos.
  `,
  duration: "4 semanas",
  location: "Centro, São Paulo",
  students: "Máx. 15 alunos",
  price: "R$ 1.200",
  nextClasses: [
    {
      id: 1,
      month: "Agosto",
      year: "2023",
      period: "Noturno",
      startDate: "07/08/2023",
      endDate: "01/09/2023",
      days: "Segundas e Quartas",
      time: "19:00 - 22:00",
      spots: 5,
      totalSpots: 15,
    },
    {
      id: 2,
      month: "Setembro",
      year: "2023",
      period: "Matutino",
      startDate: "11/09/2023",
      endDate: "06/10/2023",
      days: "Terças e Quintas",
      time: "09:00 - 12:00",
      spots: 10,
      totalSpots: 15,
    },
    {
      id: 3,
      month: "Outubro",
      year: "2023",
      period: "Final de Semana",
      startDate: "07/10/2023",
      endDate: "28/10/2023",
      days: "Sábados",
      time: "09:00 - 16:00",
      spots: 15,
      totalSpots: 15,
    }
  ],
  syllabus: [
    {
      title: "Módulo 1: Introdução à Fotografia",
      topics: [
        "História da fotografia",
        "Tipos de câmeras e equipamentos",
        "Funcionamento básico de uma câmera digital",
        "Segurando a câmera corretamente",
        "Acessórios essenciais"
      ]
    },
    {
      title: "Módulo 2: Exposição",
      topics: [
        "Triângulo da exposição (ISO, abertura, velocidade)",
        "Modos de exposição (P, A, S, M)",
        "Medição de luz",
        "Compensação de exposição",
        "Exercícios práticos de exposição"
      ]
    },
    {
      title: "Módulo 3: Composição",
      topics: [
        "Regra dos terços",
        "Linhas e formas",
        "Enquadramento",
        "Perspectiva",
        "Ponto de interesse",
        "Prática de composição em diferentes ambientes"
      ]
    },
    {
      title: "Módulo 4: Luz e Cor",
      topics: [
        "Qualidade da luz",
        "Temperatura de cor",
        "Balanço de branco",
        "Uso criativo de luz natural",
        "Introdução à iluminação artificial",
        "Fotografia em diferentes condições de luz"
      ]
    }
  ],
  requirements: [
    "Não é necessário possuir câmera própria (fornecemos equipamentos durante as aulas)",
    "Conhecimentos básicos de informática",
    "Disposição para exercícios práticos"
  ],
  targetAudience: [
    "Iniciantes sem conhecimento prévio",
    "Fotógrafos amadores que desejam melhorar suas técnicas",
    "Entusiastas que desejam entender melhor sua câmera"
  ],
  includes: [
    "Apostila digital completa",
    "Certificado de conclusão",
    "Acesso a equipamentos durante as aulas",
    "1 saída fotográfica em grupo",
    "Feedback personalizado"
  ],
  instructors: [
    {
      name: "Carlos Mendes",
      photo: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3",
      bio: "Fotógrafo profissional com 15 anos de experiência e especialização em fotografia de natureza. Professor desde 2010 e autor de dois livros sobre fotografia digital.",
      instagram: "@carlos.photo"
    },
    {
      name: "Ana Silva",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3",
      bio: "Especialista em retratos e fotografia comercial. Trabalha com grandes marcas e já teve seu trabalho publicado em revistas nacionais e internacionais.",
      instagram: "@anasilva.fotografia"
    }
  ],
  faq: [
    {
      question: "Preciso ter minha própria câmera?",
      answer: "Não é necessário. Disponibilizamos equipamentos durante as aulas para que todos possam praticar. No entanto, se você já possui uma câmera, é recomendado trazê-la para aprender suas funcionalidades específicas."
    },
    {
      question: "Posso usar meu smartphone para o curso?",
      answer: "Embora o foco do curso seja em câmeras DSLR e mirrorless, os conceitos podem ser aplicados à fotografia com smartphone. Temos uma aula específica sobre como aproveitar ao máximo a câmera do celular."
    },
    {
      question: "Há algum conhecimento prévio necessário?",
      answer: "Não, o curso foi desenvolvido pensando em iniciantes completos. Começamos desde o básico, sem assumir conhecimentos prévios de fotografia."
    },
    {
      question: "O que acontece se eu perder uma aula?",
      answer: "Disponibilizamos material de apoio para cada aula na área do aluno. Além disso, os instrutores estão disponíveis para tirar dúvidas e ajudar a recuperar o conteúdo perdido."
    },
    {
      question: "O certificado tem validade profissional?",
      answer: "Sim, nosso certificado é reconhecido pelo mercado de trabalho e pode ser incluído em seu currículo profissional. Nossa escola tem mais de 10 anos de reputação no mercado fotográfico."
    }
  ],
  testimonials: [
    {
      name: "Juliana Costa",
      photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3",
      role: "Estudante de Artes",
      text: "O curso mudou completamente minha percepção sobre fotografia. Em apenas 4 semanas, passei a entender minha câmera e a produzir fotos que antes achava impossíveis.",
      rating: 5
    },
    {
      name: "Ricardo Oliveira",
      photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3",
      role: "Profissional de Marketing",
      text: "Excelente curso para quem quer entrar no mundo da fotografia. Os professores são pacientes e o conteúdo é muito bem estruturado, com um equilíbrio perfeito entre teoria e prática.",
      rating: 5
    },
    {
      name: "Fernanda Santos",
      photo: "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?ixlib=rb-4.0.3",
      role: "Blogueira",
      text: "Comecei sem saber nada sobre fotografia e hoje consigo produzir conteúdo de qualidade para meu blog. Os professores são atenciosos e a metodologia facilita muito o aprendizado.",
      rating: 4
    }
  ]
};

const CourseDetail = () => {
  const { slug } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  
  // In a real app, we would fetch course data based on slug
  useEffect(() => {
    console.log(`Fetching course data for slug: ${slug}`);
    window.scrollTo(0, 0);
  }, [slug]);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-photo-dark text-white">
        <div className="relative h-80 md:h-96 lg:h-[500px]">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: `url(${course.heroImage})` }}
          ></div>
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-12 relative z-10">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline" className="border-amber-400 text-amber-200">
                Iniciante
              </Badge>
              <Badge variant="outline" className="border-amber-400 text-amber-200">
                Presencial
              </Badge>
              <Badge variant="outline" className="border-amber-400 text-amber-200">
                Certificado
              </Badge>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{course.title}</h1>
            <p className="text-lg text-gray-300 max-w-3xl">{course.description}</p>
          </div>
        </div>
      </section>

      {/* Course Info */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap items-center gap-6 md:gap-12 justify-between md:justify-start">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-600" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-amber-600" />
              <span>{course.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-amber-600" />
              <span>{course.students}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-amber-600" />
              <span>Turmas abertas</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Course Details */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="grid grid-cols-4 mb-8">
                  <TabsTrigger value="about">Sobre</TabsTrigger>
                  <TabsTrigger value="syllabus">Conteúdo</TabsTrigger>
                  <TabsTrigger value="instructors">Instrutores</TabsTrigger>
                  <TabsTrigger value="reviews">Avaliações</TabsTrigger>
                </TabsList>
                
                {/* About Tab */}
                <TabsContent value="about" className="space-y-8">
                  {/* Description */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Descrição do curso</h2>
                    <div className="prose max-w-none">
                      {course.longDescription.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className="mb-4">{paragraph}</p>
                      ))}
                    </div>
                  </div>
                  
                  {/* Course Gallery */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Galeria</h2>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="rounded-xl overflow-hidden h-80">
                        <img 
                          src={course.gallery[selectedImage]} 
                          alt={`Foto do curso ${course.title}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        {course.gallery.map((image, idx) => (
                          <div 
                            key={idx}
                            className={`rounded-lg overflow-hidden h-20 cursor-pointer border-2 ${
                              selectedImage === idx 
                                ? "border-amber-500" 
                                : "border-transparent"
                            }`}
                            onClick={() => setSelectedImage(idx)}
                          >
                            <img 
                              src={image} 
                              alt={`Miniatura ${idx+1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Requirements, Target Audience, Includes */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h3 className="font-bold text-lg mb-4">Pré-requisitos</h3>
                      <ul className="space-y-2">
                        {course.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h3 className="font-bold text-lg mb-4">Público-alvo</h3>
                      <ul className="space-y-2">
                        {course.targetAudience.map((audience, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                            <span>{audience}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h3 className="font-bold text-lg mb-4">O curso inclui</h3>
                      <ul className="space-y-2">
                        {course.includes.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {/* FAQ */}
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Perguntas Frequentes</h2>
                    <Accordion type="single" collapsible className="w-full">
                      {course.faq.map((item, idx) => (
                        <AccordionItem key={idx} value={`item-${idx}`}>
                          <AccordionTrigger className="text-left font-medium">
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent>
                            {item.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </TabsContent>
                
                {/* Syllabus Tab */}
                <TabsContent value="syllabus" className="space-y-8">
                  <h2 className="text-2xl font-bold mb-6">Conteúdo Programático</h2>
                  
                  <div className="space-y-6">
                    {course.syllabus.map((module, idx) => (
                      <div key={idx} className="border rounded-xl">
                        <div className="p-4 bg-gray-50 rounded-t-xl border-b font-bold">
                          {module.title}
                        </div>
                        <div className="p-4">
                          <ul className="space-y-2">
                            {module.topics.map((topic, topicIdx) => (
                              <li key={topicIdx} className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-amber-600" />
                                <span>{topic}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-amber-50 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <Award className="h-6 w-6 text-amber-600" />
                      <h3 className="font-bold text-lg">Certificado de Conclusão</h3>
                    </div>
                    <p>
                      Ao final do curso, após completar todas as atividades e avaliações, você receberá um certificado digital que pode ser compartilhado em seu portfólio ou redes sociais profissionais.
                    </p>
                  </div>
                </TabsContent>
                
                {/* Instructors Tab */}
                <TabsContent value="instructors" className="space-y-8">
                  <h2 className="text-2xl font-bold mb-6">Conheça seus instrutores</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {course.instructors.map((instructor, idx) => (
                      <div key={idx} className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-4">
                          <Avatar className="w-24 h-24">
                            <AvatarImage src={instructor.photo} alt={instructor.name} />
                            <AvatarFallback>{instructor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-bold text-xl">{instructor.name}</h3>
                            <p className="text-amber-600">{instructor.instagram}</p>
                          </div>
                        </div>
                        <p className="text-gray-600">{instructor.bio}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-6 bg-gray-50 rounded-xl">
                    <h3 className="font-bold text-lg mb-3">Nossa equipe</h3>
                    <p className="text-gray-600">
                      Todos os nossos instrutores são profissionais atuantes no mercado, com vasta experiência em suas áreas de especialização e formação pedagógica para ensinar. Estamos comprometidos em fornecer o melhor ambiente de aprendizado para nossos alunos.
                    </p>
                  </div>
                </TabsContent>
                
                {/* Reviews Tab */}
                <TabsContent value="reviews" className="space-y-8">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                    <h2 className="text-2xl font-bold">Avaliações dos alunos</h2>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className="w-5 h-5 text-yellow-500 fill-current" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                        </svg>
                      ))}
                      <span className="font-bold ml-2">4.9/5</span>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {course.testimonials.map((testimonial, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-xl p-6">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={testimonial.photo} alt={testimonial.name} />
                              <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-bold">{testimonial.name}</h4>
                              <p className="text-sm text-gray-500">{testimonial.role}</p>
                            </div>
                          </div>
                          <div className="flex">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <svg key={i} className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 24 24">
                                <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <blockquote className="text-gray-600 italic">"{testimonial.text}"</blockquote>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-amber-50 p-6 rounded-xl">
                    <h3 className="font-bold text-lg mb-3">Deixe sua avaliação</h3>
                    <p className="text-gray-600 mb-4">
                      É aluno ou ex-aluno deste curso? Compartilhe sua experiência e ajude outros estudantes.
                    </p>
                    <Button>Avaliar este curso</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-xl border overflow-hidden sticky top-24">
                {/* Price */}
                <div className="p-6 border-b">
                  <div className="text-3xl font-bold text-amber-600 mb-2">
                    {course.price}
                  </div>
                  <Button size="lg" className="w-full text-lg">Inscrever-se agora</Button>
                </div>
                
                {/* Next Classes */}
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-4">Próximas turmas</h3>
                  
                  <div className="space-y-4">
                    {course.nextClasses.map((turma) => (
                      <div key={turma.id} className="border rounded-lg">
                        <div className="bg-gray-50 p-3 flex justify-between items-center border-b">
                          <div className="font-semibold">{turma.month}/{turma.year} - {turma.period}</div>
                          <Badge variant={turma.spots > 0 ? "outline" : "destructive"}>
                            {turma.spots > 0 ? `${turma.spots} vagas` : "Esgotado"}
                          </Badge>
                        </div>
                        <div className="p-4 space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span>Início: {turma.startDate}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span>{turma.days}, {turma.time}</span>
                          </div>
                          <div className="mt-3">
                            <Progress value={(turma.totalSpots - turma.spots) / turma.totalSpots * 100} />
                            <div className="text-xs text-gray-500 mt-1">
                              {turma.totalSpots - turma.spots} de {turma.totalSpots} vagas preenchidas
                            </div>
                          </div>
                        </div>
                        <div className="p-3 border-t">
                          <Link to={`/turmas/${course.slug}-${turma.month.toLowerCase()}-${turma.year}-${turma.period.toLowerCase()}`}>
                            <Button variant="outline" className="w-full" disabled={turma.spots === 0}>
                              {turma.spots > 0 ? "Ver detalhes" : "Lista de espera"}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Call to Action */}
                <div className="bg-amber-50 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="h-6 w-6 text-amber-600" />
                    <div className="font-bold">Garantia de satisfação</div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Se após a primeira aula você não estiver satisfeito, devolvemos 100% do seu dinheiro.
                  </p>
                  <Link to="#" className="text-amber-600 hover:text-amber-700 text-sm font-medium inline-flex items-center">
                    Saiba mais sobre nossas políticas <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Related Courses */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Cursos relacionados</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl overflow-hidden shadow-md">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3" 
                  alt="Fotografia de Retrato"
                  className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">Fotografia de Retrato</h3>
                <p className="text-gray-600 text-sm mb-4">Domine as técnicas de iluminação e pose para criar retratos profissionais...</p>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link to="/cursos/fotografia-retrato">Ver curso</Link>
                </Button>
              </div>
            </div>
            <div className="bg-white rounded-xl overflow-hidden shadow-md">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?ixlib=rb-4.0.3" 
                  alt="Fotografia Noturna"
                  className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">Fotografia Noturna</h3>
                <p className="text-gray-600 text-sm mb-4">Técnicas especializadas para fotografar com pouca luz e criar imagens...</p>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link to="/cursos/fotografia-noturna">Ver curso</Link>
                </Button>
              </div>
            </div>
            <div className="bg-white rounded-xl overflow-hidden shadow-md">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixlib=rb-4.0.3" 
                  alt="Edição Fotográfica"
                  className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">Edição Fotográfica</h3>
                <p className="text-gray-600 text-sm mb-4">Aprenda a usar o Adobe Lightroom e Photoshop para elevar a qualidade...</p>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link to="/cursos/edicao-fotografica">Ver curso</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-amber-500 to-amber-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para transformar sua fotografia?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Inscreva-se agora e comece sua jornada para se tornar um fotógrafo melhor com nossos cursos renomados.
          </p>
          <Button size="lg" className="bg-white text-amber-600 hover:bg-white/90">
            Ver todas as turmas disponíveis
          </Button>
        </div>
      </section>
    </MainLayout>
  );
};

export default CourseDetail;
