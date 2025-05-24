
import React from "react";
import { Link } from "react-router-dom";

const FeaturedPost = () => {
  return (
    <div className="bg-gray-50 rounded-xl p-6 mb-8">
      <h3 className="text-lg font-bold mb-4">Artigo em Destaque</h3>
      <div className="mb-4 rounded-lg overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?ixlib=rb-4.0.3"
          alt="Artigo em Destaque"
          className="w-full h-36 object-cover"
        />
      </div>
      <h4 className="font-bold mb-2">Os segredos da fotografia em preto e branco</h4>
      <p className="text-sm text-gray-600 mb-4">
        Descubra como transformar suas fotografias com técnicas de preto e branco...
      </p>
      <Link
        to="/blog/segredos-preto-e-branco"
        className="text-amber-600 hover:text-amber-700 text-sm font-medium"
      >
        Ler artigo completo →
      </Link>
    </div>
  );
};

export default FeaturedPost;
