
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { enrollmentSchema, EnrollmentFormData } from "@/types/enrollment";
import FormField from "./FormField";

interface AvailableSpotsFormProps {
  onSubmit: (data: EnrollmentFormData) => Promise<boolean>;
  isSubmitting: boolean;
}

const AvailableSpotsForm = ({ 
  onSubmit, 
  isSubmitting 
}: AvailableSpotsFormProps) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<EnrollmentFormData>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    }
  });
  
  const handleFormSubmit = async (data: EnrollmentFormData) => {
    const success = await onSubmit(data);
    if (success) {
      reset();
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
      <FormField
        id="name"
        label="Nome completo"
        error={errors.name?.message}
        register={register("name")}
        placeholder="Seu nome completo"
      />
      
      <FormField
        id="email"
        label="E-mail"
        type="email"
        error={errors.email?.message}
        register={register("email")}
        placeholder="seu@email.com"
      />
      
      <FormField
        id="phone"
        label="Telefone"
        type="tel"
        error={errors.phone?.message}
        register={register("phone")}
        placeholder="(00) 00000-0000"
      />
      
      <Button className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Processando..." : "Reservar minha vaga"}
      </Button>
    </form>
  );
};

export default AvailableSpotsForm;
