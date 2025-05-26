
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
  
  const { isAuthenticated, userProfile, userId } = useBlogAuthentication();

  const { data: posts = [], isLoading, error } = useAdminBlogPosts();
  
  const { 
    createPostMutation, 
    updatePostMutation, 
    deletePostMutation 
  } = useBlogMutations();

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (post.author?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  const resetAndCloseDialog = () => {
    setIsEditing(false);
    setCurrentPost(null);
    setCurrentImage("");
    setIsDialogOpen(false);
  };

  const handleEdit = (post: BlogPost) => {
    setCurrentPost(post);
    setIsEditing(true);
    setCurrentImage(post.image_url || "");
    setIsDialogOpen(true);
  };

  const handleNewPost = () => {
    if (!isAuthenticated) {
      toast.error("Você precisa estar logado para criar um post");
      return;
    }
    
    setCurrentPost(null);
    setIsEditing(false);
    setCurrentImage("");
    setIsDialogOpen(true);
  };

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
