
import React from "react";
import { Link } from "react-router-dom";
import { Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { type BlogPost } from "@/hooks/useBlogPosts";

interface PostGridProps {
  isLoading: boolean;
  posts: BlogPost[];
  filteredPosts: BlogPost[];
  postsError: unknown;
  resetFilters: () => void;
}

const PostGrid = ({ isLoading, posts, filteredPosts, postsError, resetFilters }: PostGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md">
            <Skeleton className="h-48 w-full" />
            <div className="p-6">
              <div className="flex gap-2 mb-3">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-8 w-full mb-2" />
              <Skeleton className="h-20 w-full mb-4" />
              <div className="pt-4 border-t border-gray-100 flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  } 
  
  if (postsError) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-xl">
        <h3 className="text-xl font-medium mb-2">Erro ao carregar os posts</h3>
        <p className="text-gray-500 mb-6">
          Ocorreu um erro ao tentar buscar os posts do blog
        </p>
        <Button onClick={() => window.location.reload()}>
          Tentar novamente
        </Button>
      </div>
    );
  }
  
  if (filteredPosts.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-xl">
        <h3 className="text-xl font-medium mb-2">Nenhum artigo encontrado</h3>
        <p className="text-gray-500 mb-6">
          Tente ajustar seus termos de busca ou categoria
        </p>
        <Button onClick={resetFilters}>
          Limpar filtros
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {filteredPosts.map((post) => (
        <Link
          key={post.id}
          to={`/blog/${post.slug}`}
          className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
        >
          <div className="h-48 overflow-hidden">
            <img
              src={post.image_url || "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3"}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            />
          </div>
          <div className="p-6 flex flex-col flex-grow">
            <div className="flex flex-wrap gap-2 mb-3">
              {post.categories?.map((category, idx) => (
                <Badge key={idx} variant="outline">
                  {category}
                </Badge>
              ))}
            </div>
            <h3 className="text-xl font-bold mb-2 hover:text-amber-600 transition-colors">
              {post.title}
            </h3>
            <p className="text-gray-600 mb-4 flex-grow">
              {post.excerpt}
            </p>
            <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{post.read_time}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default PostGrid;
