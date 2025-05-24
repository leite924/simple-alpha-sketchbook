
import { supabase } from '@/integrations/supabase/client';

export async function getClassDetails(classId: string): Promise<{ price: string } | undefined> {
  try {
    const { data, error } = await supabase
      .from('classes')
      .select('price')
      .eq('id', classId)
      .maybeSingle();
      
    if (error) throw new Error(`Error fetching class data: ${error.message}`);
    if (!data) throw new Error(`Class not found with ID: ${classId}`);
    
    return data;
  } catch (error) {
    console.error('Error in getClassDetails:', error);
    throw error;
  }
}
