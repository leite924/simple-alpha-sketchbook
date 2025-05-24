
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { type BlogPost } from "@/hooks/useBlogPosts";

interface HeroSectionProps {
  post: BlogPost;
  formatDate: (dateString: string | null) => string;
}

const HeroSection = ({ post, formatDate }: HeroSectionProps) => {
  return (
    <header className="bg-photo-dark text-white relative">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30" 
        style={{ backgroundImage: `url(${post.image_url || "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-4.0.3"})` }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/50"></div>
      <div className="container mx-auto px-4 py-20 md:py-28 relative">
        <div className="max-w-3xl mx-auto">
          <Link to="/blog" className="inline-flex items-center text-amber-300 hover:text-amber-200 mb-6 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o Blog
          </Link>
          <div className="space-y-2 mb-4">
            {post.categories?.map((category, idx) => (
              <Badge key={idx} variant="outline" className="border-amber-400 text-amber-200 mr-2">
                {category}
              </Badge>
            ))}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-6">{post.title}</h1>
          <p className="text-xl text-gray-300 mb-8">{post.excerpt}</p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
              <img 
                src={post.image_url || "https://via.placeholder.com/100"} 
                alt={post.author || "Author"} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).parentElement?.classList.add('flex', 'items-center', 'justify-center', 'bg-gray-700');
                }}
              />
            </div>
            <div>
              <div className="font-semibold">{post.author || "Autor"}</div>
              <div className="text-sm text-gray-300">Fotógrafo Profissional</div>
            </div>
            <Separator orientation="vertical" className="h-10 mx-4 bg-gray-500" />
            <div className="flex items-center gap-4">
              <div className="flex items-center text-sm text-gray-300">
                <span>{formatDate(post.published_at)}</span>
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <span>{post.read_time || "5 min leitura"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeroSection;
