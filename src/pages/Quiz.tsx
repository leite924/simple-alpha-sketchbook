
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Camera, ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { 
  useQuizQuestions, 
  useQuizCategories, 
  useQuizState 
} from '@/hooks/quiz';
import { QuizDifficulty, QuizCategory } from '@/types/quiz';
import QuizCard from '@/components/quiz/QuizCard';
import QuizResult from '@/components/quiz/QuizResult';
import { preferencesService } from '@/utils/preferencesService';
import { toast } from 'sonner';

const Quiz: React.FC = () => {
  const userPreferences = preferencesService.getPreferences();
  const [difficulty, setDifficulty] = useState<QuizDifficulty>(userPreferences.quizPreferences.difficulty as QuizDifficulty);
  const [category, setCategory] = useState<QuizCategory>(userPreferences.quizPreferences.category);
  const [questionCount, setQuestionCount] = useState<number>(userPreferences.quizPreferences.questionCount);
  const [hasStarted, setHasStarted] = useState(false);
  
  const { data: categories = [], isLoading: isLoadingCategories } = useQuizCategories();
  const { data: questions = [], isLoading: isLoadingQuestions } = useQuizQuestions(
    difficulty, 
    category, 
    questionCount
  );
  
  const {
    state,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    finishQuiz,
    restartQuiz
  } = useQuizState(questions);
  
  const handleStartQuiz = () => {
    setHasStarted(true);
  };
  
  const handleRestartQuiz = () => {
    restartQuiz();
    setHasStarted(false);
  };
  
  const handleFinishQuiz = () => {
    finishQuiz();
  };

  const handleSavePreferences = () => {
    preferencesService.saveQuizPreferences({
      difficulty,
      category,
      questionCount
    });
    toast.success("Preferências de quiz salvas com sucesso!");
  };
  
  // Handle difficulty change
  const handleDifficultyChange = (value: string) => {
    setDifficulty(value as QuizDifficulty);
  };

  // Handle category change
  const handleCategoryChange = (value: string) => {
    setCategory(value);
  };

  // Handle question count change
  const handleQuestionCountChange = (value: string) => {
    setQuestionCount(parseInt(value, 10));
  };
  
  const renderConfiguration = () => (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-center text-2xl">
          <Camera className="mr-2 h-6 w-6" />
          Quiz de Fotografia
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="difficulty">Dificuldade</Label>
          <Select value={difficulty} onValueChange={handleDifficultyChange}>
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
          <Label htmlFor="category">Categoria</Label>
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="questionCount">Número de Questões</Label>
          <Select 
            value={questionCount.toString()} 
            onValueChange={handleQuestionCountChange}
          >
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
      <CardFooter className="flex flex-col gap-3">
        <Button 
          onClick={handleStartQuiz} 
          disabled={isLoadingQuestions || questions.length === 0} 
          className="w-full"
        >
          {isLoadingQuestions ? "Carregando Questões..." : "Iniciar Quiz"}
        </Button>
        
        <Button 
          onClick={handleSavePreferences}
          variant="outline"
          className="w-full flex gap-2 items-center"
        >
          <Save className="h-4 w-4" />
          Salvar Preferências
        </Button>
      </CardFooter>
    </Card>
  );
  
  const renderQuiz = () => {
    if (state.isFinished) {
      return (
        <QuizResult
          score={state.score}
          totalQuestions={state.questions.length}
          onRestart={handleRestartQuiz}
        />
      );
    }
    
    if (state.loading || state.questions.length === 0) {
      return (
        <div className="text-center">
          <p>Carregando perguntas...</p>
        </div>
      );
    }
    
    const currentQuestion = state.questions[state.currentQuestionIndex];
    
    return (
      <div className="space-y-4 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium">
            Questão {state.currentQuestionIndex + 1} de {state.questions.length}
          </span>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleFinishQuiz}
          >
            Finalizar Quiz
          </Button>
        </div>
        
        <QuizCard
          question={currentQuestion}
          selectedAnswerId={state.selectedAnswers[currentQuestion.id]}
          onSelectAnswer={(answerId) => selectAnswer(currentQuestion.id, answerId)}
          showResult={false}
        />
        
        <div className="flex justify-between mt-4">
          <Button
            onClick={previousQuestion}
            disabled={state.currentQuestionIndex === 0}
            variant="outline"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Anterior
          </Button>
          
          <Button
            onClick={nextQuestion}
            disabled={state.currentQuestionIndex === state.questions.length - 1}
          >
            Próxima
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto py-10 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        {!hasStarted ? renderConfiguration() : renderQuiz()}
      </div>
    </MainLayout>
  );
};

export default Quiz;
