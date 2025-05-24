
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { EnrollmentFormData } from "@/types/enrollment";
import AvailableSpotsForm from "./AvailableSpotsForm";
import WaitlistForm from "./WaitlistForm";
import FormPolicy from "./FormPolicy";

interface EnrollmentFormContainerProps {
  spotsAvailable: number;
  totalSpots: number;
  classTitle: string;
  classPeriod: string;
}

const EnrollmentFormContainer = ({
  spotsAvailable,
  totalSpots,
  classTitle,
  classPeriod
}: EnrollmentFormContainerProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWaitlist, setIsWaitlist] = useState(false);
  
  const handleFormSubmit = async (data: EnrollmentFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Enrollment data:", {
        ...data,
        classTitle,
        classPeriod,
        isWaitlist
      });
      
      toast({
        title: isWaitlist ? "Você está na lista de espera!" : "Inscrição realizada com sucesso!",
        description: isWaitlist 
          ? "Entraremos em contato caso surja uma vaga." 
          : "Em breve você receberá um e-mail com instruções para finalizar sua matrícula.",
      });
      
      return true; // Success
    } catch (error) {
      toast({
        title: "Erro ao processar inscrição",
        description: "Ocorreu um erro ao processar sua inscrição. Por favor, tente novamente.",
        variant: "destructive",
      });
      return false; // Failure
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWaitlist = () => {
    setIsWaitlist(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border overflow-hidden sticky top-24">
      <div className="p-6 border-b">
        <h3 className="text-xl font-bold mb-4">Inscreva-se nesta turma</h3>
        <p className="text-gray-600 mb-6">
          Preencha o formulário abaixo para garantir sua vaga nesta turma.
        </p>
        
        {spotsAvailable > 0 ? (
          <AvailableSpotsForm 
            onSubmit={handleFormSubmit} 
            isSubmitting={isSubmitting} 
          />
        ) : (
          <WaitlistForm 
            isWaitlist={isWaitlist}
            onSubmit={handleFormSubmit}
            onEnterWaitlist={handleWaitlist}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
      
      <FormPolicy />
    </div>
  );
};

export default EnrollmentFormContainer;
