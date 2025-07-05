
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useClassDetail = (classSlug: string | undefined) => {
  const [classData, setClassData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassData = async () => {
      setLoading(true);
      
      if (!classSlug) {
        setClassData(null);
        setLoading(false);
        return;
      }

      try {
        // Parse the slug to extract course slug and class info
        // Format: fotografia-basica-agosto-2023-noturno
        const slugParts = classSlug.split('-');
        if (slugParts.length < 4) {
          console.error('Invalid class slug format:', classSlug);
          setClassData(null);
          setLoading(false);
          return;
        }

        // Extract course slug (first part)
        const courseSlug = slugParts[0] + '-' + slugParts[1]; // e.g., "fotografia-basica"
        const period = slugParts[slugParts.length - 1]; // last part, e.g., "noturno"

        // Fetch class data from Supabase
        const { data: classes, error } = await supabase
          .from('classes')
          .select(`
            *,
            courses!inner(*)
          `)
          .eq('courses.slug', courseSlug)
          .eq('is_active', true);

        if (error) {
          console.error('Error fetching class data:', error);
          setClassData(null);
          setLoading(false);
          return;
        }

        // Find the matching class by period
        const matchingClass = classes?.find(cls => 
          cls.period.toLowerCase() === period.toLowerCase()
        );

        if (matchingClass) {
          // Transform to expected format
          const transformedClass = {
            id: matchingClass.id,
            courseName: matchingClass.course_name,
            courseSlug: matchingClass.courses.slug,
            image: "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?ixlib=rb-4.0.3",
            month: "Agosto", // You might want to add this to the database
            year: "2023",
            period: matchingClass.period,
            startDate: "07/08/2023", // You might want to add these fields to the database
            endDate: "01/09/2023",
            days: matchingClass.days,
            time: "19:00 - 22:00", // You might want to add this to the database
            location: "Centro, São Paulo", // You might want to add this to the database
            spotsAvailable: matchingClass.spots_available,
            totalSpots: matchingClass.total_spots,
            price: `R$ ${matchingClass.price.toFixed(2).replace('.', ',')}`,
            instructor: "Carlos Mendes", // You might want to add this to the database
            description: matchingClass.courses.description,
            classId: matchingClass.id // Add the UUID for checkout
          };

          setClassData(transformedClass);
          console.log('Class data loaded successfully:', transformedClass);
        } else {
          console.log('No matching class found for slug:', classSlug);
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
  }, [classSlug]);

  return { classData, loading };
};
