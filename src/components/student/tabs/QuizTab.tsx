
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { preferencesService } from "@/utils/preferencesService";
import { toast } from "sonner";

const QuizTab = () => {
  const navigate = useNavigate();
  const userPrefs = preferencesService.getPreferences();
  
  const [difficulty, setDifficulty] = useState(userPrefs.quizPreferences.difficulty);
  const [category, setCategory] = useState(userPrefs.quizPreferences.category);
  const [questionCount, setQuestionCount] = useState(userPrefs.quizPreferences.questionCount.toString());

  const handleSavePreferences = () => {
    preferencesService.saveQuizPreferences({
      difficulty,
      category,
      questionCount: parseInt(questionCount, 10)
    });
    toast.success("Preferências de quiz salvas com sucesso!");
  };

  const handleStartQuiz = () => {
    // Save preferences before navigating
    handleSavePreferences();
    navigate("/quiz");
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Quiz de Fotografia</h3>
        <Button onClick={handleStartQuiz}>Iniciar Quiz Completo</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Minhas Preferências de Quiz</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Dificuldade Preferida</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger id="difficulty">
                  <SelectValue placeholder="Selecione a dificuldade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="easy">Fácil</SelectItem>
                  <SelectItem value="medium">Médio</SelectItem>
                  <SelectItem value="hard">Difícil</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Categoria Preferida</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="composition">Composição</SelectItem>
                  <SelectItem value="lighting">Iluminação</SelectItem>
                  <SelectItem value="equipment">Equipamento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="questionCount">Número de Questões</Label>
              <Select value={questionCount} onValueChange={setQuestionCount}>
                <SelectTrigger id="questionCount">
                  <SelectValue placeholder="Número de questões" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 questões</SelectItem>
                  <SelectItem value="10">10 questões</SelectItem>
                  <SelectItem value="15">15 questões</SelectItem>
                  <SelectItem value="20">20 questões</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSavePreferences} className="w-full">Salvar Preferências</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Meu Histórico</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="font-medium">Quiz de Composição</p>
                <p className="text-sm text-gray-600">8/10 pontos</p>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '80%' }}></div>
              </div>
              <p className="text-xs text-gray-500">Realizado em 10/05/2023</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="font-medium">Quiz de Iluminação</p>
                <p className="text-sm text-gray-600">6/10 pontos</p>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div className="h-full bg-yellow-500 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <p className="text-xs text-gray-500">Realizado em 05/05/2023</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Minhas Conquistas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center p-3 border rounded-md">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-purple-600 text-xl">🏆</span>
              </div>
              <p className="text-center text-sm font-medium">Quiz Master</p>
              <p className="text-xs text-center text-gray-500">Completou 10 quizzes</p>
            </div>
            
            <div className="flex flex-col items-center p-3 border rounded-md">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-blue-600 text-xl">🎯</span>
              </div>
              <p className="text-center text-sm font-medium">Nota Perfeita</p>
              <p className="text-xs text-center text-gray-500">100% em um quiz</p>
            </div>
            
            <div className="flex flex-col items-center p-3 border rounded-md opacity-50">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-gray-400 text-xl">🔒</span>
              </div>
              <p className="text-center text-sm font-medium">Especialista</p>
              <p className="text-xs text-center text-gray-500">Bloqueado</p>
            </div>
            
            <div className="flex flex-col items-center p-3 border rounded-md opacity-50">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-gray-400 text-xl">🔒</span>
              </div>
              <p className="text-center text-sm font-medium">Maratonista</p>
              <p className="text-xs text-center text-gray-500">Bloqueado</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default QuizTab;
