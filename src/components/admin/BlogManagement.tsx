
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { BlogFormValues } from "./blog/BlogForm";
import { useBlogManagement } from "@/hooks/useBlogManagement";
import BlogTable from "./blog/BlogTable";
import BlogForm from "./blog/BlogForm";
import { BlogPost } from "@/types/blog";

const BlogManagement = () => {
  const {
    filteredPosts,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    isDialogOpen,
    setIsDialogOpen,
    currentPost,
    isEditing,
    currentImage,
    setCurrentImage,
    createPostMutation,
    updatePostMutation,
    deletePostMutation,
    handleEdit,
    handleNewPost,
    handleDelete,
    resetAndCloseDialog,
    isAuthenticated,
    userProfile
  } = useBlogManagement();

  // Handle form submission (add or edit)
  const handleSubmit = (values: BlogFormValues) => {
    if (!isAuthenticated) {
      return; // Prevent submission if not authenticated
    }
    
    const categories = values.categories.split(',').map(cat => cat.trim());
    const now = new Date().toISOString();
    
    if (isEditing && currentPost) {
      // Update existing post
      const updatedPost = {
        title: values.title,
        slug: values.slug,
        author: values.author,
        categories: categories,
        status: values.status,
        content: values.content,
        excerpt: values.excerpt,
        image_url: currentImage || currentPost.image_url,
        read_time: values.read_time,
        updated_at: now,
        published_at: undefined as string | null | undefined,
      };
      
      // If status changed from draft to published, add published_at date
      if (currentPost.status === 'draft' && values.status === 'published') {
        updatedPost.published_at = now;
      }
      
      updatePostMutation.mutate({ id: currentPost.id, post: updatedPost });
    } else {
      // Add new post with author data
      const newPost = {
        title: values.title,
        slug: values.slug,
        author: values.author,
        author_id: userProfile?.id, // Link to the current user ID
        categories: categories,
        content: values.content,
        excerpt: values.excerpt,
        image_url: currentImage || "",
        status: values.status,
        created_at: now,
        updated_at: now,
        published_at: values.status === 'published' ? now : null,
        read_time: values.read_time,
      };
      
      createPostMutation.mutate(newPost);
    }
  };

  return (
    <div>
      {!isAuthenticated && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Autenticação necessária</AlertTitle>
          <AlertDescription>
            Você precisa estar logado para gerenciar posts no blog.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center mb-6">
        <Input
          placeholder="Buscar artigos..."
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewPost} className="gap-2">
              <Plus className="h-4 w-4" /> Novo Artigo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Editar Artigo" : "Novo Artigo"}</DialogTitle>
              <DialogDescription>
                Preencha os campos abaixo para {isEditing ? "atualizar o" : "criar um novo"} artigo.
              </DialogDescription>
            </DialogHeader>
            
            <BlogForm
              currentPost={currentPost as any}
              isEditing={isEditing}
              currentImage={currentImage}
              setCurrentImage={setCurrentImage}
              onSubmit={handleSubmit}
              onCancel={resetAndCloseDialog}
              isSubmitting={createPostMutation.isPending || updatePostMutation.isPending}
              userProfile={userProfile}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Blog Posts Table */}
      <BlogTable
        isLoading={isLoading}
        error={error}
        filteredPosts={filteredPosts as any[]}
        searchTerm={searchTerm}
        onEdit={handleEdit}
        onDelete={handleDelete}
        deleteIsLoading={deletePostMutation.isPending}
      />
    </div>
  );
};

export default BlogManagement;
