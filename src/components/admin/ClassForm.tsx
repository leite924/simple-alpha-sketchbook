
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

import { formSchema } from "./classFormSchema";
import { ClassItem, FormValues } from "./types";
import { DEFAULT_FORM_VALUES } from "./classes/formConstants";

// Import form section components
import FormSectionCourseSelector from "./classes/FormSectionCourseSelector";
import FormSectionSchedule from "./classes/FormSectionSchedule";
import FormSectionDetails from "./classes/FormSectionDetails";
import FormSectionCapacity from "./classes/FormSectionCapacity";
import FormSectionDescription from "./classes/FormSectionDescription";
import FormSectionBasicInfo from "./classes/FormSectionBasicInfo";

interface ClassFormProps {
  isEditing: boolean;
  currentClass: ClassItem | null;
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
}

const ClassForm = ({ isEditing, currentClass, onSubmit, onCancel }: ClassFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: isEditing && currentClass
      ? {
          ...currentClass,
          spotsAvailable: Number(currentClass.spotsAvailable),
          totalSpots: Number(currentClass.totalSpots),
        }
      : DEFAULT_FORM_VALUES,
  });

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Course Selector Section */}
            <div className="space-y-4">
              <FormSectionCourseSelector />
            </div>
            
            {/* Basic Info Section */}
            <div className="space-y-4">
              <FormSectionBasicInfo />
            </div>
            
            {/* Schedule Section */}
            <FormSectionSchedule />
          
            {/* Details Section */}
            <FormSectionDetails />
            
            {/* Capacity Section */}
            <FormSectionCapacity />
          </div>
          
          {/* Description Section */}
          <FormSectionDescription />
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? "Atualizar" : "Criar"} Turma
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </FormProvider>
  );
};

export default ClassForm;
