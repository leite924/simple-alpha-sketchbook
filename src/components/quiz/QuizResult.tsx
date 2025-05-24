
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSaveQuizScore } from '@/hooks/quiz';
import { Award, ThumbsUp, ThumbsDown, Zap } from 'lucide-react';

type QuizResultProps = {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
};

const QuizResult: React.FC<QuizResultProps> = ({ score, totalQuestions, onRestart }) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  const { mutate: saveScore, isPending } = useSaveQuizScore();
  
  const handleSaveScore = () => {
    saveScore({ score, totalQuestions });
  };
  
  const getResultMessage = () => {
    if (percentage >= 90) return "Excelente! Você é especialista!";
    if (percentage >= 70) return "Muito bom! Você conhece bem fotografia!";
    if (percentage >= 50) return "Bom trabalho! Continue estudando!";
    return "Continue praticando para melhorar seu conhecimento!";
  };
  
  const getResultIcon = () => {
    if (percentage >= 90) return <Award className="h-12 w-12 text-yellow-500" />;
    if (percentage >= 70) return <ThumbsUp className="h-12 w-12 text-green-500" />;
    if (percentage >= 50) return <Zap className="h-12 w-12 text-blue-500" />;
    return <ThumbsDown className="h-12 w-12 text-red-500" />;
  };
  
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Resultado do Quiz</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="flex justify-center mb-4">
          {getResultIcon()}
        </div>
        
        <h3 className="text-xl font-bold">
          {getResultMessage()}
        </h3>
        
        <div className="text-4xl font-bold">
          {score} <span className="text-muted-foreground text-lg">/ {totalQuestions}</span>
        </div>
        
        <div className="w-full bg-slate-200 rounded-full h-4 mb-4">
          <div 
            className={`h-4 rounded-full ${
              percentage >= 70 ? 'bg-green-500' : 
              percentage >= 50 ? 'bg-yellow-500' : 
              'bg-red-500'
            }`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        
        <p className="text-lg">
          Você acertou <span className="font-medium">{percentage}%</span> das perguntas!
        </p>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button onClick={handleSaveScore} disabled={isPending} className="w-full">
          {isPending ? "Salvando..." : "Salvar Pontuação"}
        </Button>
        <Button onClick={onRestart} variant="outline" className="w-full">
          Tentar Novamente
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuizResult;
