
import React from "react";

const StudentHero = () => {
  return (
    <section className="bg-photo-dark text-white">
      <div className="relative h-48 md:h-64">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url(https://images.unsplash.com/photo-1516321165247-4aa89a48be28?ixlib=rb-4.0.3)` }}
        ></div>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Área do Aluno
          </h1>
          <p className="text-gray-200">
            Acesse materiais exclusivos, certificados e acompanhe seu progresso
          </p>
        </div>
      </div>
    </section>
  );
};

export default StudentHero;
