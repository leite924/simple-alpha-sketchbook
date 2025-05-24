
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BlogPost, CreatePostPayload, UpdatePostPayload } from "@/types/blog";

export const useBlogMutations = () => {
  const queryClient = useQueryClient();

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: async (post: CreatePostPayload) => {
      // Verify authentication first
      const { data: { session } } = await supabase.auth.getSession();
      const currentUserId = session?.user?.id;
      
      if (!currentUserId) {
        throw new Error("User must be logged in to create a post");
      }
      
      // Add author_id to the post if not already set
      const postToCreate = {
        ...post,
        author_id: post.author_id || currentUserId
      };
      
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([postToCreate])
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBlogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      toast.success("Post criado com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao criar post: ${error.message}`);
    }
  });

  // Update post mutation
  const updatePostMutation = useMutation({
    mutationFn: async ({ id, post }: UpdatePostPayload) => {
      // Verify authentication first
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error("User must be logged in to update a post");
      }
      
      const { data, error } = await supabase
        .from('blog_posts')
        .update(post)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBlogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['blogPost'] });
      toast.success("Post atualizado com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar post: ${error.message}`);
    }
  });

  // Delete post mutation
  const deletePostMutation = useMutation({
    mutationFn: async (id: string) => {
      // Verify authentication first
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error("User must be logged in to delete a post");
      }
      
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);
      
      if (error) throw new Error(error.message);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBlogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      toast.success("Post excluído com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao excluir post: ${error.message}`);
    }
  });

  return {
    createPostMutation,
    updatePostMutation,
    deletePostMutation
  };
};
