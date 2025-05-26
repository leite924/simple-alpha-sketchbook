
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { UserFormValues } from "../types";

interface UseUserFormSubmissionProps {
  onSubmit: (values: UserFormValues & { _changePassword?: boolean }) => Promise<boolean>;
  isEditing: boolean;
  form: UseFormReturn<UserFormValues>;
}

export const useUserFormSubmission = ({ onSubmit, isEditing, form }: UseUserFormSubmissionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: UserFormValues, changePassword: boolean, setChangePassword: (value: boolean) => void) => {
    console.log("=== INÍCIO DA SUBMISSÃO DO FORM ===");
    console.log("Valores do form:", values);
    console.log("Checkbox alterar senha:", changePassword);
    console.log("Modo edição:", isEditing);
    
    if (isSubmitting) {
      console.log("Já está processando, ignorando submissão duplicada");
      return;
    }
    
    setIsSubmitting(true);
    console.log("Estado isSubmitting definido para true");
    
    try {
      const submitValues = { 
        ...values,
        _changePassword: isEditing ? changePassword : false
      };
      
      console.log("Valores finais para submissão:", submitValues);
      
      const success = await onSubmit(submitValues);
      console.log("Resultado do onSubmit:", success);
      
      if (success) {
        console.log("Sucesso! Resetando form...");
        form.reset();
        setChangePassword(false);
        console.log("Form resetado com sucesso");
      }
    } catch (error) {
      console.error("Erro durante submissão:", error);
    } finally {
      console.log("Finalizando submissão - definindo isSubmitting para false");
      setIsSubmitting(false);
      console.log("=== FIM DA SUBMISSÃO DO FORM ===");
    }
  };

  return { isSubmitting, handleSubmit };
};
