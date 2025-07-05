
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useClassDetail = (classId: string | undefined) => {
  const [classData, setClassData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassData = async () => {
      setLoading(true);
      
      if (!classId) {
        setClassData(null);
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching class data for ID:', classId);
        
        // Buscar turma pelo ID diretamente
        const { data: classInfo, error } = await supabase
          .from('classes')
          .select(`
            *,
            courses!inner(*)
          `)
          .eq('id', classId)
          .eq('is_active', true)
          .single();

        if (error) {
          console.error('Error fetching class data:', error);
          setClassData(null);
          setLoading(false);
          return;
        }

        if (classInfo) {
          // Transform to expected format com preço fixo de R$ 10,00
          const transformedClass = {
            id: classInfo.id,
            courseName: classInfo.course_name,
            courseSlug: classInfo.courses.slug,
            image: "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?ixlib=rb-4.0.3",
            month: "Janeiro",
            year: "2024",
            period: classInfo.period,
            startDate: "15/01/2024",
            endDate: "15/03/2024",
            days: classInfo.days,
            time: "19:00 - 22:00",
            location: "Centro, São Paulo",
            spotsAvailable: classInfo.spots_available,
            totalSpots: classInfo.total_spots,
            price: "R$ 10,00", // Preço fixo de R$ 10,00
            instructor: "Instrutor Especializado",
            description: classInfo.courses.description,
            classId: classInfo.id
          };

          setClassData(transformedClass);
          console.log('Class data loaded successfully:', transformedClass);
        } else {
          console.log('No class found for ID:', classId);
          setClassData(null);
        }
      } catch (error) {
        console.error('Error in fetchClassData:', error);
        setClassData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchClassData();

    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [classId]);

  return { classData, loading };
};
