
import React from "react";
import { Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryFilterProps {
  isLoading: boolean;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
}

const CategoryFilter = ({ isLoading, selectedCategory, setSelectedCategory, categories }: CategoryFilterProps) => {
  return (
    <div className="bg-gray-50 rounded-xl p-6 mb-8">
      <h3 className="text-lg font-bold mb-4 flex items-center">
        <Tag className="h-5 w-5 mr-2" /> Categorias
      </h3>
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={selectedCategory === "" ? "default" : "outline"}
            size="sm"
            className="mb-2"
            onClick={() => setSelectedCategory("")}
          >
            Todas
          </Button>
          {categories.map((category, idx) => (
            <Button
              key={idx}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              className="mb-2"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
