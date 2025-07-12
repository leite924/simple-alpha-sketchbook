
import React from "react";

const CoursesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Nossos Cursos
          </h1>
          <p className="text-gray-600">
            Descubra nossos cursos de fotografia e desenvolva suas habilidades
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2">Fotografia Básica</h3>
            <p className="text-gray-600 mb-4">
              Aprenda os fundamentos da fotografia digital
            </p>
            <div className="text-2xl font-bold text-blue-600">R$ 299</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2">Fotografia Avançada</h3>
            <p className="text-gray-600 mb-4">
              Técnicas profissionais de fotografia
            </p>
            <div className="text-2xl font-bold text-blue-600">R$ 499</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2">Edição Digital</h3>
            <p className="text-gray-600 mb-4">
              Domine as ferramentas de edição
            </p>
            <div className="text-2xl font-bold text-blue-600">R$ 399</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
