
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { enrollmentSchema, EnrollmentFormData } from "@/types/enrollment";
import FormField from "./FormField";

interface WaitlistFormProps {
  isWaitlist: boolean;
  onSubmit: (data: EnrollmentFormData) => Promise<boolean>;
  onEnterWaitlist: () => void;
  isSubmitting: boolean;
}

const WaitlistForm = ({ 
  isWaitlist, 
  onSubmit, 
  onEnterWaitlist,
  isSubmitting
}: WaitlistFormProps) => {
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
    <div className="text-center py-4">
      <Badge variant="destructive" className="mb-4">Turma lotada</Badge>
      <p className="text-gray-600 mb-4">
        Esta turma já está com todas as vagas preenchidas, mas você pode entrar em nossa lista de espera.
      </p>
      {isWaitlist ? (
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
            {isSubmitting ? "Processando..." : "Entrar na lista de espera"}
          </Button>
        </form>
      ) : (
        <Button variant="outline" className="w-full" onClick={onEnterWaitlist}>
          Entrar na lista de espera
        </Button>
      )}
    </div>
  );
};

export default WaitlistForm;
