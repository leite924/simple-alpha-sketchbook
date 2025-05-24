
import { Link } from "react-router-dom";
import { Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type BlogPost } from "@/hooks/useBlogPosts";

interface SidebarProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

const Sidebar = ({ post, relatedPosts }: SidebarProps) => {
  return (
    <div className="lg:col-span-1">
      {/* Categories */}
      <div className="bg-gray-50 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <Tag className="h-5 w-5 mr-2" /> Categorias
        </h3>
        <div className="flex flex-wrap gap-2">
          {post.categories?.map((category, idx) => (
            <Link key={idx} to={`/blog?category=${category}`}>
              <Button variant="outline" size="sm" className="mb-2">
                {category}
              </Button>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-bold mb-4">Posts Relacionados</h3>
          <div className="space-y-4">
            {relatedPosts.map((relatedPost) => (
              <Link 
                key={relatedPost.id} 
                to={`/blog/${relatedPost.slug}`}
                className="block group"
              >
                <div className="mb-2 rounded-lg overflow-hidden">
                  <img
                    src={relatedPost.image_url || "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?ixlib=rb-4.0.3"}
                    alt={relatedPost.title}
                    className="w-full h-28 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h4 className="font-bold text-sm group-hover:text-amber-600 transition-colors">
                  {relatedPost.title}
                </h4>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* Newsletter */}
      <div className="bg-amber-50 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4">Receba Novidades</h3>
        <p className="text-sm text-gray-600 mb-4">
          Inscreva-se para receber dicas, tutoriais e novidades do mundo da fotografia.
        </p>
        <div className="space-y-3">
          <Input placeholder="Seu melhor e-mail" />
          <Button className="w-full">Inscrever-se</Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
