
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image, UploadCloud } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  currentImage: string;
  onImageChange: (newImageUrl: string) => void;
  label?: string;
}

const ImageUpload = ({ currentImage, onImageChange, label = "Imagem" }: ImageUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string>(currentImage);
  const [imageUrl, setImageUrl] = useState<string>(currentImage);

  // Mock function to simulate image upload to server
  // In a real app, you would upload to a storage service
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.includes('image/')) {
      toast.error("Por favor, selecione um arquivo de imagem válido");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter menos de 5MB");
      return;
    }

    // Create local preview URL
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    // Simulate server upload delay and success
    setTimeout(() => {
      // In a real app, this would be the URL returned from your storage service
      // For this demo, we'll just use the same local URL
      toast.success("Imagem carregada com sucesso!");
      setImageUrl(localUrl);
      onImageChange(localUrl);
    }, 1000);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    setPreviewUrl(url);
    onImageChange(url);
  };

  return (
    <div className="space-y-4">
      <div className="font-medium">{label}</div>
      
      <div className="flex flex-col md:flex-row gap-4">
        {/* Image preview */}
        <div className="border rounded-md overflow-hidden w-full md:w-48 h-48 flex items-center justify-center bg-gray-50">
          {previewUrl ? (
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="object-cover w-full h-full"
              onError={() => {
                setPreviewUrl("");
                toast.error("Erro ao carregar a imagem");
              }}
            />
          ) : (
            <Image className="h-12 w-12 text-gray-400" />
          )}
        </div>
        
        <div className="space-y-4 flex-1">
          {/* URL input */}
          <div>
            <label className="text-sm text-gray-500 mb-1 block">URL da imagem</label>
            <Input 
              type="url" 
              placeholder="https://exemplo.com/imagem.jpg" 
              value={imageUrl}
              onChange={handleUrlChange}
            />
          </div>
          
          {/* File upload */}
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Ou faça upload</label>
            <div className="relative">
              <Input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
                id="image-upload"
              />
              <Button 
                variant="outline" 
                className="w-full flex gap-2"
                asChild
              >
                <label htmlFor="image-upload" className="cursor-pointer">
                  <UploadCloud className="h-4 w-4" />
                  Selecionar imagem
                </label>
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Suporta PNG, JPG ou GIF até 5MB</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
