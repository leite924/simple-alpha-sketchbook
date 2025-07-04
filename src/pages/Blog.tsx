
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

const POSTS_PER_PAGE = 6;

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  console.log("Blog component rendering");
  
  const { 
    data: posts = [], 
    isLoading: isLoadingPosts, 
    error: postsError 
  } = useBlogPosts();
  
  const { 
    data: allCategories = [], 
    isLoading: isLoadingCategories 
  } = useAllBlogCategories();

  console.log("Blog data:", { 
    postsCount: posts.length, 
    isLoadingPosts, 
    isLoadingCategories, 
    postsError,
    categories: allCategories.length
  });

  // Filter posts by search term and category
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       (post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesCategory = selectedCategory === "" || 
                         (post.categories?.includes(selectedCategory) || false);
    
    return matchesSearch && matchesCategory;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to first page when filters change
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
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
                setSearchTerm={handleSearchChange}
              />

              <PostGrid
                isLoading={isLoadingPosts}
                posts={posts}
                filteredPosts={paginatedPosts}
                postsError={postsError}
                resetFilters={resetFilters}
              />

              <BlogPagination 
                isVisible={filteredPosts.length > 0}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>

            <div className="w-full lg:w-1/4">
              <CategoryFilter
                isLoading={isLoadingCategories}
                selectedCategory={selectedCategory}
                setSelectedCategory={handleCategoryChange}
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
