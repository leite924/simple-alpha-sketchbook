
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BlogPost } from '@/types/blog';

// Re-export the BlogPost type for components that import it from here
export type { BlogPost } from '@/types/blog';

export const useBlogPosts = () => {
  const fetchPosts = async (): Promise<BlogPost[]> => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching blog posts:', error);
      toast.error('Erro ao carregar os posts do blog');
      throw error;
    }
    
    return data || [];
  };
  
  return useQuery({
    queryKey: ['blogPosts'],
    queryFn: fetchPosts,
  });
};

export const useBlogPost = (slug: string | undefined) => {
  return useQuery({
    queryKey: ['blogPost', slug],
    queryFn: async (): Promise<BlogPost | null> => {
      if (!slug) return null;
      
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No rows found
          return null;
        }
        console.error('Error fetching blog post:', error);
        toast.error('Erro ao carregar o post');
        throw error;
      }
      
      return data;
    },
    enabled: !!slug,
  });
};

export const useAllBlogCategories = () => {
  return useQuery({
    queryKey: ['blogCategories'],
    queryFn: async (): Promise<string[]> => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('categories')
        .eq('status', 'published');
        
      if (error) {
        console.error('Error fetching blog categories:', error);
        toast.error('Erro ao carregar categorias');
        throw error;
      }
      
      // Extract all categories and flatten the array
      const allCategories = data?.flatMap(post => post.categories || []) || [];
      // Remove duplicates
      return [...new Set(allCategories)];
    }
  });
};

export const useAdminBlogPosts = () => {
  return useQuery({
    queryKey: ['adminBlogPosts'],
    queryFn: async (): Promise<BlogPost[]> => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching posts:", error);
        throw new Error(error.message);
      }
      
      return data || [];
    },
  });
};
