
import { Link } from "react-router-dom";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { BlogPost } from "@/hooks/useBlogPosts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface BlogTableProps {
  isLoading: boolean;
  error: Error | null;
  filteredPosts: BlogPost[];
  searchTerm: string;
  onEdit: (post: BlogPost) => void;
  onDelete: (id: string) => void;
  deleteIsLoading: boolean;
}

const BlogTable = ({
  isLoading,
  error,
  filteredPosts,
  searchTerm,
  onEdit,
  onDelete,
  deleteIsLoading,
}: BlogTableProps) => {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Imagem</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Categorias</TableHead>
            <TableHead>Autor</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array(3).fill(0).map((_, idx) => (
              <TableRow key={idx}>
                <TableCell><Skeleton className="h-6 w-8" /></TableCell>
                <TableCell><Skeleton className="h-12 w-16" /></TableCell>
                <TableCell><Skeleton className="h-6 w-40" /></TableCell>
                <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : error ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                <p className="text-red-500 mb-2">Erro ao carregar posts</p>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.reload()}
                >
                  Tentar novamente
                </Button>
              </TableCell>
            </TableRow>
          ) : filteredPosts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                {searchTerm ? 
                  "Nenhum post encontrado com esses termos de pesquisa" : 
                  "Nenhum post cadastrado ainda"}
              </TableCell>
            </TableRow>
          ) : (
            filteredPosts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-mono text-xs">{post.id.substring(0, 8)}...</TableCell>
                <TableCell>
                  <div className="h-12 w-16 overflow-hidden rounded-md">
                    <img 
                      src={post.image_url || "https://via.placeholder.com/150"} 
                      alt={post.title}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {post.categories?.map((category, idx) => (
                      <Badge key={idx} variant="outline">{category}</Badge>
                    )) || "—"}
                  </div>
                </TableCell>
                <TableCell>{post.author || "—"}</TableCell>
                <TableCell>
                  {post.published_at 
                    ? new Date(post.published_at).toLocaleDateString('pt-BR') 
                    : "Não publicado"}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={post.status === "published" ? "default" : "secondary"}
                  >
                    {post.status === "published" ? "Publicado" : "Rascunho"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      asChild
                    >
                      <Link to={`/blog/${post.slug}`} target="_blank">
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onEdit(post)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onDelete(post.id)}
                      disabled={deleteIsLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default BlogTable;
