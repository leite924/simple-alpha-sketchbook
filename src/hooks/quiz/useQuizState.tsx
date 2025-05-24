
import { useState, useEffect } from 'react';
import { QuestionWithAnswers } from '@/types/quiz';

// Hook for managing quiz state
export const useQuizState = (questions: QuestionWithAnswers[] = []) => {
  const [state, setState] = useState({
    currentQuestionIndex: 0,
    questions: [] as QuestionWithAnswers[],
    selectedAnswers: {} as Record<string, string>,
    score: 0,
    isFinished: false,
    loading: true
  });
  
  // Update state when questions are loaded
  useEffect(() => {
    if (questions.length > 0) {
      setState(prev => ({
        ...prev,
        questions,
        loading: false
      }));
    }
  }, [questions]);
  
  // Select answer for current question
  const selectAnswer = (questionId: string, answerId: string) => {
    setState(prev => ({
      ...prev,
      selectedAnswers: {
        ...prev.selectedAnswers,
        [questionId]: answerId
      }
    }));
  };
  
  // Go to next question
  const nextQuestion = () => {
    if (state.currentQuestionIndex < state.questions.length - 1) {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
    }
  };
  
  // Go to previous question
  const previousQuestion = () => {
    if (state.currentQuestionIndex > 0) {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1
      }));
    }
  };
  
  // Finish quiz and calculate score
  const finishQuiz = () => {
    let score = 0;
    
    // Calculate score
    state.questions.forEach(question => {
      const selectedAnswerId = state.selectedAnswers[question.id];
      if (selectedAnswerId) {
        const correctAnswer = question.answers.find(answer => answer.is_correct);
        if (correctAnswer && correctAnswer.id === selectedAnswerId) {
          score++;
        }
      }
    });
    
    // Update state with final score
    setState(prev => ({
      ...prev,
      score,
      isFinished: true
    }));
    
    // Return result for use in other functions
    return {
      score,
      totalQuestions: state.questions.length,
      percentage: (score / state.questions.length) * 100,
      date: new Date()
    };
  };
  
  // Restart quiz
  const restartQuiz = () => {
    setState({
      currentQuestionIndex: 0,
      questions: state.questions,
      selectedAnswers: {},
      score: 0,
      isFinished: false,
      loading: false
    });
  };
  
  return {
    state,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    finishQuiz,
    restartQuiz
  };
};
