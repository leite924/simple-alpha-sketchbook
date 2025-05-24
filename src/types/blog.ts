
export interface BlogPost {
  id: string;
  title: string;
  content?: string;
  excerpt?: string;
  slug: string;
  image_url?: string;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
  status?: string;
  categories?: string[];
  author?: string;
  author_id?: string;
  read_time?: string;
}

export interface CreatePostPayload extends Omit<BlogPost, 'id'> {
  author_id?: string;
}

export interface UpdatePostPayload {
  id: string;
  post: Partial<BlogPost>;
}
