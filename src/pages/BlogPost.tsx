
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useBlogPost, useBlogPosts, type BlogPost } from "@/hooks/useBlogPosts";

// Components
import LoadingState from "@/components/blog/LoadingState";
import ErrorState from "@/components/blog/ErrorState";
import HeroSection from "@/components/blog/HeroSection";
import SocialShare from "@/components/blog/SocialShare";
import FAQSection from "@/components/blog/FAQSection";
import AuthorBio from "@/components/blog/AuthorBio";
import CommentSection from "@/components/blog/CommentSection";
import Sidebar from "@/components/blog/Sidebar";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const { 
    data: post, 
    isLoading,
    error 
  } = useBlogPost(slug);
  
  // Para posts relacionados, pegamos todos os posts e filtramos
  const { data: allPosts = [] } = useBlogPosts();
  
  // Calcula posts relacionados baseado nas categorias
  const relatedPosts = post ? 
    allPosts
      .filter(p => 
        p.id !== post.id && 
        p.categories?.some(cat => post.categories?.includes(cat))
      )
      .slice(0, 3) : 
    [];

  // Format the date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // FAQ mock data - would come from post.content in a real implementation
  const faq = [
    {
      question: "Qual o melhor horário para fotografar com celular?",
      answer: "O início da manhã e o final da tarde oferecem a melhor luz natural, com tons quentes e sombras suaves. Evite o meio-dia, quando a luz é mais dura e cria sombras pronunciadas."
    },
    {
      question: "Devo usar o flash do celular?",
      answer: "Em geral, o flash do celular deve ser evitado sempre que possível, pois produz uma luz dura e pouco natural. Prefira usar fontes de luz alternativas ou aproveitar os modos noturnos dos smartphones modernos."
    },
    {
      question: "Como posso melhorar a nitidez das minhas fotos?",
      answer: "Mantenha o celular estável (use um tripé se possível), limpe a lente regularmente, use o modo HDR para cenas com grande contraste e evite usar o zoom digital que reduz a qualidade da imagem."
    }
  ];

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !post) {
    return <ErrorState />;
  }

  return (
    <MainLayout>
      <article className="bg-white">
        {/* Hero Section */}
        <HeroSection post={post} formatDate={formatDate} />

        {/* Post Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="max-w-3xl">
                {/* Rich Content */}
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content || "" }}
                ></div>

                {/* Social Share */}
                <SocialShare />

                {/* FAQ Section */}
                <FAQSection faqs={faq} />

                {/* Author Bio */}
                <AuthorBio author={post.author} />

                {/* Comments Section */}
                <CommentSection />
              </div>
            </div>
            
            {/* Sidebar */}
            <Sidebar post={post} relatedPosts={relatedPosts} />
          </div>
        </div>
      </article>
    </MainLayout>
  );
};

export default BlogPost;
