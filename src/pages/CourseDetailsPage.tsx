
import React from "react";
import { useParams } from "react-router-dom";

const CourseDetailsPage = () => {
  const { slug } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Detalhes do Curso
          </h1>
          <p className="text-gray-600 mb-6">
            Curso: {slug}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Sobre o Curso</h2>
              <p className="text-gray-600 mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              
              <h3 className="text-xl font-semibold mb-2">O que você aprenderá:</h3>
              <ul className="list-disc pl-6 text-gray-600">
                <li>Fundamentos da fotografia</li>
                <li>Composição e enquadramento</li>
                <li>Técnicas de iluminação</li>
                <li>Edição básica</li>
              </ul>
            </div>
            
            <div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-2xl font-bold mb-4">R$ 299</h3>
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Inscrever-se
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
