
import { useState } from "react";
import { useBlogAuthentication } from "./useBlogAuthentication";
import { useAdminBlogPosts } from "./useBlogPosts";
import { useBlogMutations } from "./useBlogMutations";
import { BlogPost, CreatePostPayload } from "@/types/blog";
import { toast } from "sonner";

export const useBlogManagement = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  
  // Authentication state
  const { isAuthenticated, userProfile, userId } = useBlogAuthentication();

  // Blog post data
  const { data: posts = [], isLoading, error } = useAdminBlogPosts();
  
  // Mutations
  const { 
    createPostMutation, 
    updatePostMutation, 
    deletePostMutation 
  } = useBlogMutations();

  // Filter posts based on search term
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (post.author?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  // Reset form and close dialog
  const resetAndCloseDialog = () => {
    setIsEditing(false);
    setCurrentPost(null);
    setCurrentImage("");
    setIsDialogOpen(false);
  };

  // Handler for editing a post
  const handleEdit = (post: BlogPost) => {
    setCurrentPost(post);
    setIsEditing(true);
    setCurrentImage(post.image_url || "");
    setIsDialogOpen(true);
  };

  // Handler for opening the dialog for a new post
  const handleNewPost = () => {
    // Check authentication before allowing new post creation
    if (!isAuthenticated) {
      toast.error("Você precisa estar logado para criar um post");
      return;
    }
    
    setCurrentPost(null);
    setIsEditing(false);
    setCurrentImage("");
    setIsDialogOpen(true);
  };

  // Handler for deleting a post
  const handleDelete = (id: string) => {
    if (!isAuthenticated) {
      toast.error("Você precisa estar logado para excluir um post");
      return;
    }
    
    if (confirm("Tem certeza que deseja excluir este artigo?")) {
      deletePostMutation.mutate(id);
    }
  };

  return {
    posts,
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
    userProfile,
    userId
  };
};
