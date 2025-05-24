
import { User } from "lucide-react";

interface AuthorBioProps {
  author: string | null;
}

const AuthorBio = ({ author }: AuthorBioProps) => {
  return (
    <div className="mt-12 bg-gray-50 p-6 rounded-xl">
      <div className="flex items-start gap-4">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
          <User className="w-10 h-10 text-gray-500" />
        </div>
        <div>
          <h3 className="font-bold text-lg">Sobre {author || "Autor"}</h3>
          <div className="text-amber-600 mb-2">Fotógrafo Profissional</div>
          <p className="text-gray-600">
            Fotógrafo profissional com mais de 10 anos de experiência em fotografia de retratos e eventos. 
            Especialista em edição de imagens e técnicas de iluminação criativa.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthorBio;
