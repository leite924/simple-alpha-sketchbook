
import { useState, useEffect } from "react";
import { classesData } from "@/data/mockClassesData";

export const useClassDetail = (classSlug: string | undefined) => {
  const [classData, setClassData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    // Simulating an API call with setTimeout
    setLoading(true);
    
    setTimeout(() => {
      // Parse the slug to extract course, month, year and period
      // Format is: courseSlug-month-year-period
      if (classSlug) {
        const slugParts = classSlug.split('-');
        if (slugParts.length >= 4) {
          const courseSlug = slugParts[0];
          const month = slugParts[1];
          const year = slugParts[2];
          const period = slugParts.slice(3).join('-');

          // Find the class that matches the slug components
          const foundClass = classesData.find(c => 
            c.courseSlug === courseSlug && 
            c.month.toLowerCase() === month.toLowerCase() && 
            c.year === year && 
            c.period.toLowerCase() === period.toLowerCase()
          );

          setClassData(foundClass || null);
        } else {
          setClassData(null);
        }
      }
      
      setLoading(false);
    }, 300);

    // Log for debugging
    console.log(`Loading class data for slug: ${classSlug}`);
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [classSlug]);

  return { classData, loading };
};
