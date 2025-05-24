
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    courseInterest: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      courseInterest: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulando envio de formulário
    setTimeout(() => {
      toast({
        title: "Pré-inscrição recebida!",
        description: "Entraremos em contato em breve.",
      });
      setIsSubmitting(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        courseInterest: "",
        message: "",
      });
    }, 1000);
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="section-title">Entre em contato</h2>
          <p className="text-lg text-gray-600 mt-6">
            Tem interesse em nossos cursos? Preencha o formulário abaixo e entraremos em contato
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <form 
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-xl p-6 md:p-8 shadow-lg"
          >
            <div className="md:col-span-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Digite seu nome completo"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
                className="mt-1"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="courseInterest">Curso de interesse</Label>
              <Select
                value={formData.courseInterest}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione um curso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Cursos disponíveis</SelectLabel>
                    <SelectItem value="fotografia-basica">Fotografia Básica</SelectItem>
                    <SelectItem value="fotografia-retrato">Fotografia de Retrato</SelectItem>
                    <SelectItem value="fotografia-paisagem">Fotografia de Paisagem</SelectItem>
                    <SelectItem value="fotografia-produto">Fotografia de Produto</SelectItem>
                    <SelectItem value="pos-producao">Pós-produção e Edição</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="message">Mensagem (opcional)</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Diga-nos sobre seu interesse ou faça perguntas"
                rows={4}
                className="mt-1 resize-none"
              />
            </div>

            <div className="md:col-span-2">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full text-lg"
              >
                {isSubmitting ? "Enviando..." : "Enviar pré-inscrição"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
