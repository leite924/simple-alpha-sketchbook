
import { useState, useEffect } from "react";

export const useClassDetail = (classSlug: string | undefined) => {
  const [classData, setClassData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dados mocados removidos - agora retorna null sempre
    setLoading(true);
    
    setTimeout(() => {
      // Sem dados mocados - sempre retorna null
      setClassData(null);
      setLoading(false);
    }, 300);

    console.log(`Loading class data for slug: ${classSlug} - No mock data available`);
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [classSlug]);

  return { classData, loading };
};
