
import { Camera, Clock, Users, Award, BookOpen, ThumbsUp } from "lucide-react";

const benefits = [
  {
    icon: <Camera className="h-10 w-10 text-amber-500" />,
    title: "Aulas práticas",
    description: "Mais de 70% do curso é dedicado à prática com equipamentos profissionais",
  },
  {
    icon: <Clock className="h-10 w-10 text-amber-500" />,
    title: "Horários flexíveis",
    description: "Turmas em diversos horários, incluindo noturno e finais de semana",
  },
  {
    icon: <Users className="h-10 w-10 text-amber-500" />,
    title: "Turmas reduzidas",
    description: "Máximo de 15 alunos por turma para atendimento personalizado",
  },
  {
    icon: <Award className="h-10 w-10 text-amber-500" />,
    title: "Professores premiados",
    description: "Aprenda com fotógrafos reconhecidos no mercado nacional e internacional",
  },
  {
    icon: <BookOpen className="h-10 w-10 text-amber-500" />,
    title: "Material exclusivo",
    description: "Acesso a apostilas, e-books e recursos digitais exclusivos",
  },
  {
    icon: <ThumbsUp className="h-10 w-10 text-amber-500" />,
    title: "Certificado reconhecido",
    description: "Certificação valorizada pelo mercado de trabalho fotográfico",
  },
];

const BenefitsSection = () => {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="section-title">Por que escolher nossos cursos?</h2>
          <p className="text-lg text-gray-600 mt-6">
            Oferecemos a melhor experiência de aprendizado em fotografia, com metodologia testada e aprovada por mais de 5.000 alunos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
