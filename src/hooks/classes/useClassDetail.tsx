
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
        console.log('Fetching class data for ID/slug:', classId);
        
        let query = supabase
          .from('classes')
          .select(`
            *,
            courses!inner(*)
          `)
          .eq('is_active', true);

        // Check if classId is a UUID or a slug
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(classId);
        
        if (isUUID) {
          query = query.eq('id', classId);
        } else {
          // For slug-like identifiers, search by course_name or create a mapping
          // Since we don't have a direct slug field, we'll try to match by course_name pattern
          const courseName = classId
            .replace(/-/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          
          query = query.ilike('course_name', `%${courseName.split(' ')[0]}%`);
        }

        const { data: classInfo, error } = await query.single();

        if (error) {
          console.error('Error fetching class data:', error);
          
          // If single fails, try getting the first match for non-UUID searches
          if (!isUUID) {
            const { data: classList, error: listError } = await supabase
              .from('classes')
              .select(`
                *,
                courses!inner(*)
              `)
              .eq('is_active', true)
              .limit(1);

            if (listError || !classList || classList.length === 0) {
              setClassData(null);
              setLoading(false);
              return;
            }

            const firstClass = classList[0];
            const transformedClass = {
              id: firstClass.id,
              courseName: firstClass.course_name,
              courseSlug: firstClass.courses.slug,
              image: "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?ixlib=rb-4.0.3",
              month: "Janeiro",
              year: "2024",
              period: firstClass.period,
              startDate: "15/01/2024",
              endDate: "15/03/2024",
              days: firstClass.days,
              time: "19:00 - 22:00",
              location: "Centro, São Paulo",
              spotsAvailable: firstClass.spots_available,
              totalSpots: firstClass.total_spots,
              price: "10,00",
              instructor: "Instrutor Especializado",
              description: firstClass.courses.description,
              classId: firstClass.id
            };

            setClassData(transformedClass);
            console.log('Class data loaded successfully with fallback:', transformedClass);
            setLoading(false);
            return;
          }
          
          setClassData(null);
          setLoading(false);
          return;
        }

        if (classInfo) {
          // Transform to expected format com preço SEMPRE de R$ 10,00
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
            price: "10,00", // Preço SEMPRE R$ 10,00 (string formatada)
            instructor: "Instrutor Especializado",
            description: classInfo.courses.description,
            classId: classInfo.id
          };

          setClassData(transformedClass);
          console.log('Class data loaded successfully with price R$ 10,00:', transformedClass);
        } else {
          console.log('No class found for ID/slug:', classId);
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
