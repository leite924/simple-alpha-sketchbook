
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useCoursesList() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("id, name, slug")
        .eq("is_active", true)
        .order("name", { ascending: true });
      
      if (error) throw new Error(error.message);
      return data || [];
    }
  });
}
