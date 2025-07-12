
import React from "react";

const AdminPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Painel Administrativo
          </h1>
          <p className="text-gray-600">
            Gerencie cursos, alunos e pagamentos
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Cursos</h3>
            <p className="text-gray-600 mb-4">Gerenciar cursos e turmas</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Acessar
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Alunos</h3>
            <p className="text-gray-600 mb-4">Gerenciar perfis de alunos</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Acessar
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Pagamentos</h3>
            <p className="text-gray-600 mb-4">Visualizar transações</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Acessar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
