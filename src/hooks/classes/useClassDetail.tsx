
import { useState, useEffect } from "react";

// Mock data that matches the structure from Classes.tsx
const mockClassesData = [
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
    description: "Curso completo de fotografia básica com foco em fundamentos técnicos e composição."
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
    description: "Curso completo de fotografia básica com foco em fundamentos técnicos e composição."
  },
  // Add more classes as needed
];

export const useClassDetail = (classSlug: string | undefined) => {
  const [classData, setClassData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    setTimeout(() => {
      if (classSlug) {
        // Try to find a matching class based on the slug pattern
        const foundClass = mockClassesData.find(cls => {
          const generatedSlug = `${cls.courseSlug}-${cls.month.toLowerCase()}-${cls.year}-${cls.period.toLowerCase()}`;
          return generatedSlug === classSlug;
        });
        
        setClassData(foundClass || null);
        console.log(`Loading class data for slug: ${classSlug}`, foundClass ? 'found' : 'not found');
      } else {
        setClassData(null);
      }
      
      setLoading(false);
    }, 300);

    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [classSlug]);

  return { classData, loading };
};
