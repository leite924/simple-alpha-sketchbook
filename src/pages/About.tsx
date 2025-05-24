
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Camera, Users, Award, Heart, CheckCircle } from "lucide-react";

const About = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-photo-dark text-white">
        <div className="relative h-64 md:h-80 lg:h-96">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: `url(https://images.unsplash.com/photo-1452830978618-d6feae7d0ffa?ixlib=rb-4.0.3)` }}
          ></div>
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Sobre a FotoCursos
            </h1>
            <p className="text-gray-200 max-w-3xl text-lg">
              Há mais de 10 anos transformando paixão por fotografia em carreira profissional
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title mb-6">Nossa História</h2>
              <p className="mb-4">
                Fundada em 2013 por um grupo de fotógrafos apaixonados, a FotoCursos nasceu com a missão de democratizar o ensino de fotografia de alta qualidade. O que começou como pequenas oficinas em um estúdio improvisado no centro de São Paulo, hoje se tornou uma das principais escolas de fotografia do Brasil.
              </p>
              <p className="mb-4">
                Nosso compromisso sempre foi aliar conhecimento técnico com experiência prática, formando não apenas fotógrafos tecnicamente competentes, mas artistas com olhar único e profissionais preparados para o mercado.
              </p>
              <p className="mb-6">
                Ao longo destes anos, mais de 5.000 alunos passaram por nossas salas de aula, muitos deles hoje são profissionais renomados e premiados no mercado fotográfico nacional e internacional.
              </p>
              <div className="flex space-x-4">
                <div className="text-center">
                  <p className="text-4xl font-bold text-purple">+10</p>
                  <p className="text-gray-600">Anos de experiência</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-purple">+5000</p>
                  <p className="text-gray-600">Alunos formados</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-purple">+30</p>
                  <p className="text-gray-600">Cursos diferentes</p>
                </div>
              </div>
            </div>
            <div>
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src="https://images.unsplash.com/photo-1554941829-202a0b2403b8?ixlib=rb-4.0.3" 
                  alt="Aula de fotografia" 
                  className="rounded-lg h-48 w-full object-cover"
                />
                <img 
                  src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixlib=rb-4.0.3" 
                  alt="Estúdio fotográfico" 
                  className="rounded-lg h-48 w-full object-cover"
                />
                <img 
                  src="https://images.unsplash.com/photo-1520390138845-fd2d229dd553?ixlib=rb-4.0.3" 
                  alt="Saída fotográfica" 
                  className="rounded-lg h-48 w-full object-cover"
                />
                <img 
                  src="https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3" 
                  alt="Workshop de fotografia" 
                  className="rounded-lg h-48 w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center mx-auto mb-12">Nossos Valores</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-14 h-14 bg-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="h-7 w-7 text-purple" />
              </div>
              <h3 className="text-xl font-bold mb-3">Excelência</h3>
              <p className="text-gray-600">
                Buscamos a excelência em tudo o que fazemos, desde o conteúdo dos cursos até a experiência do aluno.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-14 h-14 bg-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-7 w-7 text-purple" />
              </div>
              <h3 className="text-xl font-bold mb-3">Comunidade</h3>
              <p className="text-gray-600">
                Acreditamos no poder da comunidade e do networking para o crescimento profissional dos nossos alunos.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-14 h-14 bg-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-7 w-7 text-purple" />
              </div>
              <h3 className="text-xl font-bold mb-3">Qualidade</h3>
              <p className="text-gray-600">
                Comprometidos com a alta qualidade do ensino, equipamentos e estrutura para a melhor experiência.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-14 h-14 bg-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-7 w-7 text-purple" />
              </div>
              <h3 className="text-xl font-bold mb-3">Paixão</h3>
              <p className="text-gray-600">
                Acreditamos que a paixão pela fotografia é o que nos move e inspira nossos alunos todos os dias.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center mx-auto mb-12">Nossa Equipe</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="h-64 overflow-hidden rounded-lg mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3" 
                  alt="Carlos Mendes" 
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="font-bold text-lg">Carlos Mendes</h3>
              <p className="text-purple font-medium mb-2">Diretor & Professor de Retrato</p>
              <p className="text-gray-600 text-sm">
                Fotógrafo com mais de 15 anos de experiência e especializado em fotografia de retrato.
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-64 overflow-hidden rounded-lg mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3" 
                  alt="Ana Silva" 
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="font-bold text-lg">Ana Silva</h3>
              <p className="text-purple font-medium mb-2">Coordenadora & Professora</p>
              <p className="text-gray-600 text-sm">
                Especialista em fotografia de paisagem e natureza, com trabalhos publicados em revistas renomadas.
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-64 overflow-hidden rounded-lg mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3" 
                  alt="Ricardo Oliveira" 
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="font-bold text-lg">Ricardo Oliveira</h3>
              <p className="text-purple font-medium mb-2">Professor de Pós-Produção</p>
              <p className="text-gray-600 text-sm">
                Expert em Adobe Photoshop e Lightroom com mais de 10 anos de experiência em edição profissional.
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-64 overflow-hidden rounded-lg mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3" 
                  alt="Mariana Costa" 
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="font-bold text-lg">Mariana Costa</h3>
              <p className="text-purple font-medium mb-2">Professora de Moda</p>
              <p className="text-gray-600 text-sm">
                Fotógrafa de moda com experiência internacional e trabalhos para grandes marcas do setor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-purple text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Venha fazer parte da nossa história
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Conheça nossos cursos e transforme sua paixão pela fotografia em uma carreira de sucesso.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-purple hover:bg-white/90" size="lg" asChild>
              <Link to="/cursos">Ver Cursos</Link>
            </Button>
            <Button className="bg-purple-dark hover:bg-purple-dark/90" size="lg" asChild>
              <Link to="/contato">Fale Conosco</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center mx-auto mb-12">O Que Dizem Nossos Alunos</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-start mb-4">
                <div className="mr-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3" 
                      alt="João Silva" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold">João Silva</h4>
                  <p className="text-sm text-gray-500">Aluno do curso de Fotografia Básica</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "O curso superou todas as minhas expectativas. Os professores são muito atenciosos e o conteúdo é completo. Hoje trabalho como fotógrafo freelancer graças aos conhecimentos que adquiri."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-start mb-4">
                <div className="mr-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3" 
                      alt="Maria Santos" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold">Maria Santos</h4>
                  <p className="text-sm text-gray-500">Aluna do curso de Fotografia de Retrato</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "A metodologia prática do curso foi fundamental para o meu desenvolvimento como fotógrafa. As aulas em estúdio e as saídas fotográficas fizeram toda a diferença na minha formação."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-start mb-4">
                <div className="mr-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3" 
                      alt="Pedro Oliveira" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold">Pedro Oliveira</h4>
                  <p className="text-sm text-gray-500">Aluno do curso de Pós-produção</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "O curso de edição me abriu portas para um novo mercado. Hoje trabalho com grandes agências e tenho meu próprio estúdio. O networking que fiz durante o curso foi essencial."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center mx-auto mb-12">Perguntas Frequentes</h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg mb-2">Preciso ter uma câmera profissional para fazer os cursos?</h3>
              <p className="text-gray-600">
                Não é obrigatório. Temos equipamentos disponíveis para uso durante as aulas. No entanto, recomendamos que o aluno tenha sua própria câmera para praticar fora do ambiente de aula.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg mb-2">Os cursos são presenciais ou online?</h3>
              <p className="text-gray-600">
                Atualmente nossos cursos são primariamente presenciais, pois acreditamos na importância da prática supervisionada. No entanto, oferecemos alguns módulos teóricos em formato online.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg mb-2">Há pré-requisitos para os cursos avançados?</h3>
              <p className="text-gray-600">
                Sim, para os cursos de nível intermediário e avançado é necessário ter conhecimentos básicos de fotografia. Recomendamos iniciar pelo curso de Fotografia Básica caso não tenha experiência prévia.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg mb-2">Vocês emitem certificado?</h3>
              <p className="text-gray-600">
                Sim, todos os nossos cursos emitem certificados de conclusão, que são reconhecidos pelo mercado e podem compor seu portfólio profissional.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">
              Não encontrou o que procurava? Entre em contato conosco!
            </p>
            <Button asChild>
              <Link to="/contato">Fale Conosco</Link>
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default About;
