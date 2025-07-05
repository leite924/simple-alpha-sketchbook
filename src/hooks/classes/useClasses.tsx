
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useClasses() {
  return useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("classes")
        .select(`
          *,
          courses!inner(*)
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: true });
      
      if (error) throw new Error(error.message);
      
      // Transform data to match the expected format
      const transformedClasses = data?.map(cls => ({
        id: cls.id,
        courseName: cls.course_name,
        courseSlug: cls.courses.slug,
        image: "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?ixlib=rb-4.0.3",
        month: "Agosto", // You might want to add this field to the database
        year: "2023",
        period: cls.period,
        startDate: "07/08/2023", // You might want to add these fields to the database
        endDate: "01/09/2023",
        days: cls.days,
        time: "19:00 - 22:00", // You might want to add this field to the database
        location: "Centro, São Paulo", // You might want to add this field to the database
        spotsAvailable: cls.spots_available,
        totalSpots: cls.total_spots,
        price: `R$ ${cls.price.toFixed(2).replace('.', ',')}`,
        instructor: "Carlos Mendes", // You might want to add this field to the database
        classId: cls.id // UUID for checkout
      })) || [];
      
      return transformedClasses;
    }
  });
}
