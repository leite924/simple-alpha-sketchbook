
import { Facebook, Twitter, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const SocialShare = () => {
  return (
    <div className="mt-12 bg-gray-50 p-6 rounded-xl">
      <h3 className="font-bold text-lg mb-4">Compartilhar este artigo</h3>
      <div className="flex space-x-4">
        <Button variant="outline" size="icon" className="rounded-full hover:bg-blue-50 hover:text-blue-600">
          <Facebook className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="icon" className="rounded-full hover:bg-sky-50 hover:text-sky-500">
          <Twitter className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="icon" className="rounded-full hover:bg-blue-50 hover:text-blue-700">
          <Linkedin className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="icon" className="rounded-full hover:bg-amber-50 hover:text-amber-600">
          <Mail className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default SocialShare;
