
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ClassItem, FormValues, convertSupabaseToClassItem } from "../types";
import { toast } from "sonner";

interface ClassForSupabase {
  course_id?: string;
  course_name: string;
  days: string;
  period: string;
  total_spots: number;
  spots_available: number;
  price: number;
  is_active?: boolean;
  id?: string;
}

export const useClassManagement = () => {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<ClassItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentClass, setCurrentClass] = useState<ClassItem | null>(null);

  // Fetch classes from Supabase
  useEffect(() => {
    fetchClasses();
  }, []);

  // Filter classes when searchTerm changes
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredClasses(classes);
    } else {
      const filtered = classes.filter(
        (cls) =>
          cls.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cls.instructor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cls.period.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredClasses(filtered);
    }
  }, [searchTerm, classes]);

  const fetchClasses = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from("classes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        const formattedClasses = data.map(convertSupabaseToClassItem);
        setClasses(formattedClasses);
        setFilteredClasses(formattedClasses);
      }
      setIsLoading(false);
    } catch (error: any) {
      toast.error(`Erro ao buscar turmas: ${error.message}`);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const convertFormToSupabase = (values: FormValues): ClassForSupabase => {
    return {
      course_id: values.courseId,
      course_name: values.courseName,
      days: values.days,
      period: values.period,
      total_spots: parseInt(values.totalSpots.toString(), 10),
      spots_available: parseInt(values.availableSpots.toString(), 10),
      price: parseFloat(values.price.toString()),
      is_active: values.isActive
    };
  };

  const handleNewClass = () => {
    setCurrentClass(null);
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEdit = (classItem: ClassItem) => {
    setCurrentClass(classItem);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      const classData = convertFormToSupabase(values);
      
      if (isEditing && currentClass) {
        // Update existing class
        const { error } = await supabase
          .from("classes")
          .update(classData)
          .eq("id", currentClass.id);

        if (error) {
          throw error;
        }

        toast.success("Turma atualizada com sucesso!");
      } else {
        // Create new class
        const { error } = await supabase
          .from("classes")
          .insert([classData]);

        if (error) {
          throw error;
        }

        toast.success("Turma criada com sucesso!");
      }

      // Refresh classes and close dialog
      resetAndCloseDialog();
      fetchClasses();
    } catch (error: any) {
      toast.error(`Erro ao ${isEditing ? "atualizar" : "criar"} turma: ${error.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta turma?")) {
      try {
        const { error } = await supabase
          .from("classes")
          .delete()
          .eq("id", id);

        if (error) {
          throw error;
        }

        toast.success("Turma excluída com sucesso!");
        fetchClasses();
      } catch (error: any) {
        toast.error(`Erro ao excluir turma: ${error.message}`);
      }
    }
  };

  const resetAndCloseDialog = () => {
    setIsDialogOpen(false);
    setCurrentClass(null);
    setIsEditing(false);
  };

  return {
    classes,
    filteredClasses,
    isLoading,
    searchTerm,
    setSearchTerm,
    isDialogOpen,
    setIsDialogOpen,
    isEditing,
    currentClass,
    handleNewClass,
    handleEdit,
    handleSubmit,
    handleDelete,
    resetAndCloseDialog
  };
};
