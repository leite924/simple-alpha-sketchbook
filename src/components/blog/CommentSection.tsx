
import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const CommentSection = () => {
  const { toast } = useToast();
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      toast({
        title: "Comentário enviado",
        description: "Seu comentário foi enviado para moderação e será publicado em breve.",
      });
      setComment("");
      setName("");
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="mt-12">
      <h3 className="font-bold text-2xl mb-6 flex items-center">
        <MessageSquare className="mr-2 h-5 w-5" /> Comentários (3)
      </h3>
      
      {/* Sample Comments */}
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0"></div>
            <div className="flex-grow">
              <div className="flex justify-between">
                <h4 className="font-bold">Roberto Almeida</h4>
                <span className="text-sm text-gray-500">2 dias atrás</span>
              </div>
              <p className="mt-2 text-gray-600">
                Excelentes dicas! Comecei a aplicar a técnica de iluminação mencionada e já notei uma grande diferença nas minhas fotos.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0"></div>
            <div className="flex-grow">
              <div className="flex justify-between">
                <h4 className="font-bold">Carla Souza</h4>
                <span className="text-sm text-gray-500">1 semana atrás</span>
              </div>
              <p className="mt-2 text-gray-600">
                Quais aplicativos vocês recomendam para edição de fotos em iPhone? Tenho usado o Snapseed mas estou pensando em migrar para o Lightroom.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0"></div>
            <div className="flex-grow">
              <div className="flex justify-between">
                <h4 className="font-bold">Marcos Oliveira</h4>
                <span className="text-sm text-gray-500">2 semanas atrás</span>
              </div>
              <p className="mt-2 text-gray-600">
                Adorei o post! Vocês poderiam fazer um tutorial específico sobre fotografia de alimentos com smartphone? É um nicho que está crescendo muito.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Comment Form */}
      <form onSubmit={handleCommentSubmit} className="mt-8 bg-gray-50 p-6 rounded-xl">
        <h3 className="font-bold text-lg mb-4">Deixe seu comentário</h3>
        
        <div className="mb-4">
          <Textarea
            placeholder="Escreva seu comentário..."
            className="min-h-[100px]"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Input
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Publicar comentário"}
        </Button>
      </form>
    </div>
  );
};

export default CommentSection;
