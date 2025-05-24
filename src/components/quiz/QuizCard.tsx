
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { QuestionWithAnswers } from '@/types/quiz';

type QuizCardProps = {
  question: QuestionWithAnswers;
  selectedAnswerId: string | undefined;
  onSelectAnswer: (answerId: string) => void;
  showResult: boolean;
};

const QuizCard: React.FC<QuizCardProps> = ({
  question,
  selectedAnswerId,
  onSelectAnswer,
  showResult
}) => {
  // Embaralhar as respostas para não mostrar a correta sempre na mesma posição
  const shuffledAnswers = React.useMemo(() => {
    return [...question.answers].sort(() => Math.random() - 0.5);
  }, [question.answers]);
  
  const isCorrectAnswer = (answerId: string): boolean => {
    if (!showResult) return false;
    return question.answers.find(a => a.id === answerId)?.is_correct || false;
  };
  
  const isIncorrectSelection = (answerId: string): boolean => {
    if (!showResult || !selectedAnswerId) return false;
    return answerId === selectedAnswerId && !isCorrectAnswer(answerId);
  };
  
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-xl">
          {question.question}
        </CardTitle>
        <div className="flex space-x-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
            {question.category}
          </span>
          <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ring-gray-500/10">
            {question.difficulty === 'easy' ? 'Fácil' : 
             question.difficulty === 'medium' ? 'Médio' : 'Difícil'}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedAnswerId} onValueChange={onSelectAnswer}>
          <div className="space-y-3">
            {shuffledAnswers.map((answer) => {
              const isCorrect = isCorrectAnswer(answer.id);
              const isIncorrect = isIncorrectSelection(answer.id);
              
              return (
                <div 
                  key={answer.id} 
                  className={`
                    flex items-center space-x-2 rounded-lg border p-3
                    ${isCorrect ? 'bg-green-50 border-green-300' : ''} 
                    ${isIncorrect ? 'bg-red-50 border-red-300' : ''}
                  `}
                >
                  <RadioGroupItem 
                    value={answer.id} 
                    id={answer.id} 
                    disabled={showResult}
                  />
                  <Label 
                    htmlFor={answer.id} 
                    className={`
                      flex-grow cursor-pointer
                      ${isCorrect ? 'text-green-700 font-medium' : ''} 
                      ${isIncorrect ? 'text-red-700' : ''}
                    `}
                  >
                    {answer.answer_text}
                  </Label>
                  {showResult && isCorrect && (
                    <span className="text-green-500 text-sm font-medium">Correta</span>
                  )}
                  {showResult && isIncorrect && (
                    <span className="text-red-500 text-sm font-medium">Incorreta</span>
                  )}
                </div>
              );
            })}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default QuizCard;
