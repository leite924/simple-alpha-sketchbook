
import React from "react";
import { Button } from "@/components/ui/button";

interface BlogPaginationProps {
  isVisible: boolean;
}

const BlogPagination = ({ isVisible }: BlogPaginationProps) => {
  if (!isVisible) return null;
  
  return (
    <div className="flex justify-center mt-12">
      <nav className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled>
          Anterior
        </Button>
        <Button variant="outline" size="sm" className="bg-amber-50 border-amber-200">
          1
        </Button>
        <Button variant="outline" size="sm">
          2
        </Button>
        <Button variant="outline" size="sm">
          3
        </Button>
        <Button variant="outline" size="sm">
          Próxima
        </Button>
      </nav>
    </div>
  );
};

export default BlogPagination;
