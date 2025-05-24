
// Mock class data - in a real application this would be fetched from a database or API
export const classesData = [
  {
    id: 1,
    courseName: "Fotografia Básica",
    courseSlug: "fotografia-basica",
    image: "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?ixlib=rb-4.0.3",
    month: "Agosto",
    year: "2023",
    period: "Noturno",
    startDate: "07/08/2023",
    endDate: "01/09/2023",
    days: "Segundas e Quartas",
    time: "19:00 - 22:00",
    location: "Centro, São Paulo",
    spotsAvailable: 5,
    totalSpots: 15,
    price: "R$ 1.200",
    instructor: "Carlos Mendes",
    description: "Um curso completo para iniciantes que desejam dominar os fundamentos da fotografia, desde a operação básica da câmera até técnicas de composição e iluminação.",
    benefits: [
      "Equipamentos disponíveis durante as aulas",
      "Certificado de conclusão",
      "Material didático digital",
      "Saída fotográfica em grupo",
      "Acesso à comunidade de alunos"
    ],
    paymentMethods: ["À vista com 10% de desconto", "Parcelamento em até 6x sem juros", "Boleto bancário"]
  },
  {
    id: 2,
    courseName: "Fotografia Básica",
    courseSlug: "fotografia-basica",
    image: "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?ixlib=rb-4.0.3",
    month: "Setembro",
    year: "2023",
    period: "Matutino",
    startDate: "11/09/2023",
    endDate: "06/10/2023",
    days: "Terças e Quintas",
    time: "09:00 - 12:00",
    location: "Centro, São Paulo",
    spotsAvailable: 10,
    totalSpots: 15,
    price: "R$ 1.200",
    instructor: "Ana Silva",
    description: "Um curso completo para iniciantes que desejam dominar os fundamentos da fotografia, desde a operação básica da câmera até técnicas de composição e iluminação.",
    benefits: [
      "Equipamentos disponíveis durante as aulas",
      "Certificado de conclusão",
      "Material didático digital",
      "Saída fotográfica em grupo",
      "Acesso à comunidade de alunos"
    ],
    paymentMethods: ["À vista com 10% de desconto", "Parcelamento em até 6x sem juros", "Boleto bancário"]
  },
  {
    id: 3,
    courseName: "Fotografia de Retrato",
    courseSlug: "fotografia-retrato",
    image: "https://images.unsplash.com/photo-1441057206919-63d19fac2369?ixlib=rb-4.0.3",
    month: "Setembro",
    year: "2023",
    period: "Noturno",
    startDate: "04/09/2023",
    endDate: "13/10/2023",
    days: "Segundas e Quartas",
    time: "19:00 - 22:00",
    location: "Centro, São Paulo",
    spotsAvailable: 8,
    totalSpots: 12,
    price: "R$ 1.500",
    instructor: "Carlos Mendes",
    description: "Aprenda a capturar a essência e a personalidade de seus modelos através de técnicas de iluminação e direção de pose.",
    benefits: [
      "Estúdio profissional à disposição",
      "Modelos para prática em sala de aula",
      "Análise de portfólio individual",
      "Técnicas de edição de retrato",
      "Networking com outros fotógrafos"
    ],
    paymentMethods: ["À vista com 10% de desconto", "Parcelamento em até 6x sem juros", "Boleto bancário"]
  },
  {
    id: 4,
    courseName: "Fotografia de Paisagem",
    courseSlug: "fotografia-paisagem",
    image: "https://images.unsplash.com/photo-1439886183900-e79ec0057170?ixlib=rb-4.0.3",
    month: "Outubro",
    year: "2023",
    period: "Final de Semana",
    startDate: "07/10/2023",
    endDate: "28/10/2023",
    days: "Sábados",
    time: "09:00 - 16:00",
    location: "Centro, São Paulo",
    spotsAvailable: 15,
    totalSpots: 15,
    price: "R$ 1.400",
    instructor: "Ana Silva",
    description: "Explore a beleza natural e aprenda a fotografar paisagens deslumbrantes com técnicas de composição e exposição.",
    benefits: [
      "Saídas fotográficas em locações externas",
      "Equipamentos de apoio para fotografia de paisagem",
      "Técnicas de longa exposição",
      "Edição de paisagens no Lightroom",
      "Dicas para fotografar o nascer e o pôr do sol"
    ],
    paymentMethods: ["À vista com 10% de desconto", "Parcelamento em até 6x sem juros", "Boleto bancário"]
  },
  {
    id: 5,
    courseName: "Pós-produção e Edição",
    courseSlug: "pos-producao-edicao",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3",
    month: "Setembro",
    year: "2023",
    period: "Noturno",
    startDate: "12/09/2023",
    endDate: "19/10/2023",
    days: "Terças e Quintas",
    time: "19:00 - 22:00",
    location: "Centro, São Paulo",
    spotsAvailable: 0,
    totalSpots: 15,
    price: "R$ 1.600",
    instructor: "Ricardo Oliveira",
    description: "Aprimore suas habilidades de edição e tratamento de imagem com o Adobe Photoshop e Lightroom.",
    benefits: [
      "Licença de software educacional",
      "Plugins e presets exclusivos",
      "Técnicas de retoque de pele",
      "Correção de cor avançada",
      "Criação de efeitos especiais"
    ],
    paymentMethods: ["À vista com 10% de desconto", "Parcelamento em até 6x sem juros", "Boleto bancário"]
  },
];

// Sample related classes data
export const relatedClassesData = [
  {
    slug: "fotografia-basica-outubro-2023-final-de-semana",
    title: "Fotografia Básica",
    image: "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?ixlib=rb-4.0.3",
    period: "Final de Semana",
    schedule: "Sábados, 09:00 - 16:00",
    date: "Outubro/2023"
  },
  {
    slug: "fotografia-retrato-setembro-2023-noturno",
    title: "Fotografia de Retrato",
    image: "https://images.unsplash.com/photo-1441057206919-63d19fac2369?ixlib=rb-4.0.3",
    period: "Noturno",
    schedule: "Segundas e Quartas, 19:00 - 22:00",
    date: "Setembro/2023"
  },
  {
    slug: "pos-producao-edicao-setembro-2023-noturno",
    title: "Pós-produção e Edição",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3",
    period: "Noturno",
    schedule: "Terças e Quintas, 19:00 - 22:00",
    date: "Setembro/2023"
  }
];
