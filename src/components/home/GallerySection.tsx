
import { useEffect, useState } from "react";

const defaultGalleryImages = [
  {
    url: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=70",
    alt: "Aula de fotografia de paisagem",
    title: "Fotografia de Paisagem",
  },
  {
    url: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=70",
    alt: "Workshop de fotografia florestal",
    title: "Fotografia de Natureza",
  },
  {
    url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=70",
    alt: "Alunos em campo",
    title: "Aula de Campo",
  },
  {
    url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=70",
    alt: "Expedição fotográfica",
    title: "Expedições",
  },
  {
    url: "https://images.unsplash.com/photo-1458668383970-8ddd3927deed?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=70",
    alt: "Aula de fotografia alpina",
    title: "Workshops Avançados",
  },
  {
    url: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=70",
    alt: "Alunos em prática",
    title: "Prática em Grupo",
  },
];

// Check for saved gallery images in localStorage, or use defaults
const getSavedGalleryImages = () => {
  if (typeof window !== 'undefined') {
    const savedImages = localStorage.getItem('galleryImages');
    return savedImages ? JSON.parse(savedImages) : defaultGalleryImages;
  }
  return defaultGalleryImages;
};

const GallerySection = () => {
  const [galleryImages, setGalleryImages] = useState(getSavedGalleryImages());
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ url: "", title: "", alt: "" });

  // Check if user is admin (in a real app, this would use authentication)
  useEffect(() => {
    const checkAdmin = () => {
      // For demo purposes, we're checking if we're on the admin page
      // In a real app, this would be based on authentication
      const isAdminPage = window.location.pathname.includes('/admin');
      setIsAdmin(isAdminPage);
    };
    
    checkAdmin();
    window.addEventListener('popstate', checkAdmin);
    
    return () => {
      window.removeEventListener('popstate', checkAdmin);
    };
  }, []);

  useEffect(() => {
    // Preload images in background
    const imagePromises = galleryImages.map((image) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = image.url;
        img.onload = resolve;
      });
    });

    // Mark all images as loaded when complete
    Promise.all(imagePromises).then(() => {
      setImagesLoaded(true);
    });
  }, [galleryImages]);

  // Save changes to localStorage whenever gallery images change
  useEffect(() => {
    localStorage.setItem('galleryImages', JSON.stringify(galleryImages));
  }, [galleryImages]);

  const handleEditImage = (index: number) => {
    setEditingIndex(index);
    setEditForm({
      url: galleryImages[index].url,
      title: galleryImages[index].title,
      alt: galleryImages[index].alt,
    });
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null) {
      const updatedImages = [...galleryImages];
      updatedImages[editingIndex] = {
        url: editForm.url,
        title: editForm.title,
        alt: editForm.alt,
      };
      
      setGalleryImages(updatedImages);
      setEditingIndex(null);
      setEditForm({ url: "", title: "", alt: "" });
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditForm({ url: "", title: "", alt: "" });
  };

  const handleResetToDefaults = () => {
    if (confirm("Reset todas as imagens da galeria para o padrão?")) {
      setGalleryImages(defaultGalleryImages);
      localStorage.removeItem('galleryImages');
    }
  };

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="section-title">Nossa escola em ação</h2>
          <p className="text-lg text-gray-600 mt-6">
            Confira momentos marcantes das nossas aulas, workshops e expedições fotográficas
          </p>
          
          {isAdmin && (
            <button
              onClick={handleResetToDefaults}
              className="mt-4 text-sm text-amber-600 hover:text-amber-800"
            >
              Restaurar imagens padrão
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <div key={index} className="photo-card group h-72 md:h-80 relative">
              {editingIndex === index ? (
                <div className="absolute inset-0 bg-white p-4 z-10 border rounded-lg shadow-lg">
                  <h4 className="font-bold mb-3">Editar Imagem {index + 1}</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">URL da Imagem</label>
                      <input
                        type="text"
                        value={editForm.url}
                        onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Título</label>
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Descrição (alt)</label>
                      <input
                        type="text"
                        value={editForm.alt}
                        onChange={(e) => setEditForm({ ...editForm, alt: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1 bg-gray-200 rounded text-sm"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="px-3 py-1 bg-amber-600 text-white rounded text-sm"
                      >
                        Salvar
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <img
                    src={image.url}
                    alt={image.alt}
                    loading="lazy"
                    width="800"
                    height="600"
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                      imagesLoaded ? "opacity-100" : "opacity-0"
                    }`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Imagem+não+encontrada';
                    }}
                  />
                  <div className="photo-card-overlay">
                    <h3 className="text-white text-xl font-bold">{image.title}</h3>
                    <p className="text-gray-200 text-sm">{image.alt}</p>
                    
                    {isAdmin && (
                      <button
                        onClick={() => handleEditImage(index)}
                        className="mt-2 px-2 py-1 bg-white text-amber-600 text-xs rounded hover:bg-amber-50"
                      >
                        Editar
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
