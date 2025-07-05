
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  classId?: string; // Add classId prop for checkout
}

const EnrollmentFormContainer = ({
  spotsAvailable,
  totalSpots,
  classTitle,
  classPeriod,
  classId
}: EnrollmentFormContainerProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWaitlist, setIsWaitlist] = useState(false);
  const navigate = useNavigate();
  
  const handleFormSubmit = async (data: EnrollmentFormData) => {
    setIsSubmitting(true);
    
    try {
      // If there are spots available, redirect to checkout
      if (spotsAvailable > 0 && classId) {
        console.log("Redirecting to checkout with classId:", classId);
        navigate(`/checkout/${classId}`);
        return true;
      }
      
      // If no spots, handle waitlist
      if (isWaitlist) {
        // Simulate waitlist API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        console.log("Waitlist data:", {
          ...data,
          classTitle,
          classPeriod,
          isWaitlist: true
        });
        
        toast({
          title: "Você está na lista de espera!",
          description: "Entraremos em contato caso surja uma vaga.",
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      toast({
        title: "Erro ao processar inscrição",
        description: "Ocorreu um erro ao processar sua inscrição. Por favor, tente novamente.",
        variant: "destructive",
      });
      return false;
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
          {spotsAvailable > 0 
            ? "Preencha seus dados para prosseguir com a matrícula." 
            : "Esta turma está lotada, mas você pode entrar na lista de espera."}
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
