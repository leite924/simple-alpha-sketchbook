
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeToNewsletter } from "@/services/newsletterService";
import { toast } from "sonner";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error("Por favor, insira um e-mail válido");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await subscribeToNewsletter(email);
      
      if (success) {
        toast.success("Inscrição realizada com sucesso!");
        setEmail("");
      } else {
        toast.error("Ocorreu um erro ao realizar sua inscrição. Tente novamente.");
      }
    } catch (error) {
      console.error("Newsletter subscribe error:", error);
      toast.error("Ocorreu um erro ao realizar sua inscrição. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-amber-50 rounded-xl p-6">
      <h3 className="text-lg font-bold mb-4">Receba Novidades</h3>
      <p className="text-sm text-gray-600 mb-4">
        Inscreva-se para receber dicas, tutoriais e novidades do mundo da fotografia.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input 
          placeholder="Seu melhor e-mail" 
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button 
          className="w-full" 
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Inscrevendo..." : "Inscrever-se"}
        </Button>
      </form>
    </div>
  );
};

export default NewsletterSignup;
