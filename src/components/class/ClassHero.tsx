
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface ClassHeroProps {
  image: string;
  month: string;
  year: string;
  period: string;
  courseName: string;
  description: string;
}

const ClassHero: React.FC<ClassHeroProps> = ({
  image,
  month,
  year,
  period,
  courseName,
  description
}) => {
  return (
    <section className="bg-photo-dark text-white">
      <div className="relative h-64 md:h-80 lg:h-96">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url(${image})` }}
        ></div>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-12 relative z-10">
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="outline" className="border-amber-400 text-amber-200">
              {month}/{year}
            </Badge>
            <Badge variant="outline" className="border-amber-400 text-amber-200">
              {period}
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {courseName}
          </h1>
          <p className="text-gray-300 max-w-3xl">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ClassHero;
