
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BlogPost } from "@/types/blog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ImageUpload from "../ImageUpload";
import { DialogFooter } from "@/components/ui/dialog";
import AIContentGenerator from "../ai/AIContentGenerator";
import { SparkleIcon } from "lucide-react";

// Form schema for validation
const formSchema = z.object({
  title: z.string().min(3, "Título é obrigatório"),
  slug: z.string().min(3, "Slug é obrigatório"),
  author: z.string().min(3, "Autor é obrigatório"),
  categories: z.string().min(3, "Categorias são obrigatórias"),
  status: z.string().min(1, "Status é obrigatório"),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  read_time: z.string().optional(),
});

export type BlogFormValues = z.infer<typeof formSchema>;

interface BlogFormProps {
  currentPost: BlogPost | null;
  isEditing: boolean;
  currentImage: string;
  setCurrentImage: (url: string) => void;
  onSubmit: (values: BlogFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  userProfile?: any;
}

const BlogForm = ({
  currentPost,
  isEditing,
  currentImage,
  setCurrentImage,
  onSubmit,
  onCancel,
  isSubmitting,
  userProfile
}: BlogFormProps) => {
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [activeField, setActiveField] = useState<"content" | "excerpt" | null>(null);
  
  const form = useForm<BlogFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      author: userProfile?.first_name && userProfile?.last_name 
        ? `${userProfile.first_name} ${userProfile.last_name}` 
        : userProfile?.first_name || "",
      categories: "",
      status: "draft",
      excerpt: "",
      content: "",
      read_time: "5 min",
    },
  });
  
  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/\s+/g, '-');
  };
  
  // Auto-generate slug when title changes (only when creating a new post)
  useEffect(() => {
    if (!isEditing) {
      const titleValue = form.watch('title');
      if (titleValue) {
        form.setValue('slug', generateSlug(titleValue));
      }
    }
  }, [form.watch('title'), isEditing, form]);

  // Reset form when currentPost changes
  useEffect(() => {
    if (currentPost) {
      form.reset({
        title: currentPost.title,
        slug: currentPost.slug,
        author: currentPost.author || "",
        categories: currentPost.categories?.join(", ") || "",
        status: currentPost.status || "draft",
        excerpt: currentPost.excerpt || "",
        content: currentPost.content || "",
        read_time: currentPost.read_time || "5 min",
      });
    } else {
      const authorName = userProfile?.first_name && userProfile?.last_name 
        ? `${userProfile.first_name} ${userProfile.last_name}` 
        : userProfile?.first_name || "";
        
      form.reset({
        title: "",
        slug: "",
        author: authorName,
        categories: "",
        status: "draft",
        excerpt: "",
        content: "",
        read_time: "5 min",
      });
    }
  }, [currentPost, userProfile, form]);
  
  const handleAIContentGenerated = (content: string) => {
    if (activeField === "content") {
      form.setValue("content", content);
    } else if (activeField === "excerpt") {
      form.setValue("excerpt", content);
    }
    
    setShowAIGenerator(false);
    setActiveField(null);
  };
  
  const openAIGenerator = (field: "content" | "excerpt") => {
    setActiveField(field);
    setShowAIGenerator(true);
  };

  return (
    <Form {...form}>
      {showAIGenerator ? (
        <div className="space-y-4">
          <h3 className="font-medium text-lg">
            {activeField === "content" ? "Gerar Conteúdo com IA" : "Gerar Resumo com IA"}
          </h3>
          <AIContentGenerator onSelectContent={handleAIContentGenerated} />
          <Button 
            variant="outline" 
            onClick={() => setShowAIGenerator(false)}
            className="mt-4"
          >
            Cancelar
          </Button>
        </div>
      ) : (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    <Input {...field} placeholder="titulo-do-artigo" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Autor</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="categories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categorias</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Dicas, Mobile, Equipamentos" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    >
                      <option value="draft">Rascunho</option>
                      <option value="published">Publicado</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="read_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tempo de Leitura</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="5 min" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between">
              <FormLabel>Resumo</FormLabel>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => openAIGenerator("excerpt")}
                className="h-8 flex items-center text-xs"
              >
                <SparkleIcon className="h-3.5 w-3.5 mr-1" />
                Gerar com IA
              </Button>
            </div>
            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea {...field} rows={2} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Image Upload Component */}
          <ImageUpload
            currentImage={currentImage}
            onImageChange={setCurrentImage}
            label="Imagem do Artigo"
          />
          
          <div>
            <div className="flex items-center justify-between">
              <FormLabel>Conteúdo</FormLabel>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => openAIGenerator("content")}
                className="h-8 flex items-center text-xs"
              >
                <SparkleIcon className="h-3.5 w-3.5 mr-1" />
                Gerar com IA
              </Button>
            </div>
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea {...field} rows={8} className="min-h-32" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 
                "Salvando..." : 
                (isEditing ? "Atualizar" : "Criar") + " Artigo"}
            </Button>
          </DialogFooter>
        </form>
      )}
    </Form>
  );
};

export default BlogForm;
