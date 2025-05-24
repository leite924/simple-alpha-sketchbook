
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useBlogPosts, useAllBlogCategories } from "@/hooks/useBlogPosts";

// Components
import BlogHero from "@/components/blog/BlogHero";
import BlogSearch from "@/components/blog/BlogSearch";
import PostGrid from "@/components/blog/PostGrid";
import BlogPagination from "@/components/blog/BlogPagination";
import CategoryFilter from "@/components/blog/CategoryFilter";
import FeaturedPost from "@/components/blog/FeaturedPost";
import NewsletterSignup from "@/components/blog/NewsletterSignup";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  
  const { 
    data: posts = [], 
    isLoading: isLoadingPosts, 
    error: postsError 
  } = useBlogPosts();
  
  const { 
    data: allCategories = [], 
    isLoading: isLoadingCategories 
  } = useAllBlogCategories();
  
  // Format the date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Filter posts by search term and category
  const filteredPosts = posts.filter((post) => {
    // Filter by search term
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       (post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    // Filter by category
    const matchesCategory = selectedCategory === "" || 
                         (post.categories?.includes(selectedCategory) || false);
    
    return matchesSearch && matchesCategory;
  });

  // Reset filters handler
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
  };

  return (
    <MainLayout>
      {/* Blog Hero */}
      <BlogHero />

      {/* Blog Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="w-full lg:w-3/4">
              {/* Search */}
              <BlogSearch 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />

              {/* Blog Posts */}
              <PostGrid
                isLoading={isLoadingPosts}
                posts={posts}
                filteredPosts={filteredPosts}
                postsError={postsError}
                resetFilters={resetFilters}
              />

              {/* Pagination */}
              <BlogPagination isVisible={filteredPosts.length > 0} />
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-1/4">
              {/* Categories */}
              <CategoryFilter
                isLoading={isLoadingCategories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categories={allCategories}
              />

              {/* Featured Post */}
              <FeaturedPost />

              {/* Newsletter */}
              <NewsletterSignup />
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Blog;
