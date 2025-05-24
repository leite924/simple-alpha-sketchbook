
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import ImageUpload from "./ImageUpload";

// Define course interface
interface Course {
  id: number;
  title: string;
  slug: string;
  category: string;
  duration: string;
  level: string;
  description: string;
  image: string;
}

// Mock courses data
const initialCourses: Course[] = [
  {
    id: 1,
    title: "Fotografia Básica",
    slug: "fotografia-basica",
    category: "Fotografia",
    duration: "20 horas",
    level: "Iniciante",
    description: "Curso introdutório para quem deseja aprender fotografia do zero.",
    image: "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?ixlib=rb-4.0.3",
  },
  {
    id: 2,
    title: "Fotografia de Retrato",
    slug: "fotografia-retrato",
    category: "Fotografia",
    duration: "25 horas",
    level: "Intermediário",
    description: "Técnicas avançadas para fotografar pessoas e criar retratos impactantes.",
    image: "https://images.unsplash.com/photo-1441057206919-63d19fac2369?ixlib=rb-4.0.3",
  },
  {
    id: 3,
    title: "Pós-produção e Edição",
    slug: "pos-producao-edicao",
    category: "Edição",
    duration: "30 horas",
    level: "Avançado",
    description: "Aprenda a editar suas fotos com técnicas profissionais.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3",
  },
];

// Form schema for validation
const formSchema = z.object({
  title: z.string().min(3, "Título é obrigatório"),
  slug: z.string().min(3, "Slug é obrigatório"),
  category: z.string().min(1, "Categoria é obrigatória"),
  duration: z.string().min(1, "Duração é obrigatória"),
  level: z.string().min(1, "Nível é obrigatório"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CourseManagement = () => {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentImage, setCurrentImage] = useState("");

  // Filter courses based on search term
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.level.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Form setup with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      category: "",
      duration: "",
      level: "",
      description: "",
    },
  });

  // Handle form submission (add or edit)
  const handleSubmit = (values: FormValues) => {
    if (isEditing && currentCourse) {
      // Update existing course
      setCourses(
        courses.map((c) => (c.id === currentCourse.id ? { 
          ...c, 
          title: values.title,
          slug: values.slug,
          category: values.category,
          duration: values.duration,
          level: values.level,
          description: values.description || "",
          image: currentImage || c.image
        } : c))
      );
      toast.success("Curso atualizado com sucesso!");
    } else {
      // Add new course - explicitly include all required fields
      const newCourse: Course = {
        id: courses.length > 0 ? Math.max(...courses.map((c) => c.id)) + 1 : 1,
        title: values.title,
        slug: values.slug,
        category: values.category,
        duration: values.duration,
        level: values.level,
        description: values.description || "",
        image: currentImage || "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?ixlib=rb-4.0.3"
      };
      setCourses([...courses, newCourse]);
      toast.success("Novo curso criado com sucesso!");
    }
    
    resetAndCloseDialog();
  };

  // Handler for deleting a course
  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este curso?")) {
      setCourses(courses.filter((c) => c.id !== id));
      toast.success("Curso excluído com sucesso!");
    }
  };

  // Handler for editing a course
  const handleEdit = (course: Course) => {
    setCurrentCourse(course);
    setIsEditing(true);
    setCurrentImage(course.image);
    
    form.reset({
      title: course.title,
      slug: course.slug,
      category: course.category,
      duration: course.duration,
      level: course.level,
      description: course.description || "",
    });
    
    setIsDialogOpen(true);
  };

  // Handler for opening the dialog for a new course
  const handleNewCourse = () => {
    setCurrentCourse(null);
    setIsEditing(false);
    setCurrentImage("");
    form.reset({
      title: "",
      slug: "",
      category: "",
      duration: "",
      level: "",
      description: "",
    });
    setIsDialogOpen(true);
  };

  // Reset form and close dialog
  const resetAndCloseDialog = () => {
    setIsEditing(false);
    setCurrentCourse(null);
    setCurrentImage("");
    form.reset();
    setIsDialogOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Input
          placeholder="Buscar cursos..."
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewCourse} className="gap-2">
              <Plus className="h-4 w-4" /> Novo Curso
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Editar Curso" : "Novo Curso"}</DialogTitle>
              <DialogDescription>
                Preencha os campos abaixo para {isEditing ? "atualizar o" : "criar um novo"} curso.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Identificador único para URL (ex: fotografia-basica)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {["Fotografia", "Edição", "Iluminação", "Composição", "Vídeo", "Técnicas Avançadas"].map((category) => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duração</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ex: 20 horas" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nível</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um nível" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {["Iniciante", "Intermediário", "Avançado"].map((level) => (
                              <SelectItem key={level} value={level}>{level}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Image Upload Component */}
                <ImageUpload
                  currentImage={currentImage}
                  onImageChange={setCurrentImage}
                  label="Imagem do Curso"
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={resetAndCloseDialog}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {isEditing ? "Atualizar" : "Criar"} Curso
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Courses Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Imagem</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Duração</TableHead>
              <TableHead>Nível</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.id}</TableCell>
                  <TableCell>
                    <div className="h-12 w-16 overflow-hidden rounded-md">
                      <img 
                        src={course.image} 
                        alt={course.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{course.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{course.category}</Badge>
                  </TableCell>
                  <TableCell>{course.duration}</TableCell>
                  <TableCell>{course.level}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEdit(course)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(course.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  Nenhum curso encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CourseManagement;
