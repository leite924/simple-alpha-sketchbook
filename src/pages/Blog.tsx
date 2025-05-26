
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

  // Filter posts by search term and category
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       (post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesCategory = selectedCategory === "" || 
                         (post.categories?.includes(selectedCategory) || false);
    
    return matchesSearch && matchesCategory;
  });

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
  };

  return (
    <MainLayout>
      <BlogHero />

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-3/4">
              <BlogSearch 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />

              <PostGrid
                isLoading={isLoadingPosts}
                posts={posts}
                filteredPosts={filteredPosts}
                postsError={postsError}
                resetFilters={resetFilters}
              />

              <BlogPagination isVisible={filteredPosts.length > 0} />
            </div>

            <div className="w-full lg:w-1/4">
              <CategoryFilter
                isLoading={isLoadingCategories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categories={allCategories}
              />

              <FeaturedPost />

              <NewsletterSignup />
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Blog;
