
import React, { useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { useCoursesList } from "@/hooks/courses/useCoursesList";
import { FormValues } from "../types";

interface Course {
  id: string;
  name: string;
  slug: string;
}

const FormSectionCourseSelector: React.FC = () => {
  const { control, setValue, watch } = useFormContext<FormValues>();
  const { data: coursesData, isLoading } = useCoursesList();
  const selectedCourseName = watch("courseName");
  
  // Garantir que courses seja um array tipado
  const courses = Array.isArray(coursesData) ? coursesData as Course[] : [];
  
  // When course name changes, update course slug
  useEffect(() => {
    if (courses && selectedCourseName) {
      const selectedCourse = courses.find(course => course.name === selectedCourseName);
      if (selectedCourse) {
        setValue("courseSlug", selectedCourse.slug);
      }
    }
  }, [selectedCourseName, courses, setValue]);

  return (
    <>
      <FormField
        control={control}
        name="courseName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Curso*</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={isLoading}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um curso" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {courses?.map((course: Course) => (
                  <SelectItem key={course.id} value={course.name}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="courseSlug"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Slug do Curso</FormLabel>
            <FormControl>
              <div className="relative">
                <input 
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...field}
                  readOnly
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default FormSectionCourseSelector;
