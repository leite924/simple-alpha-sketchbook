
import React from "react";
import { useParams } from "react-router-dom";

const BlogPostPage = () => {
  const { slug } = useParams();
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Post do Blog</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">Post: {slug}</p>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;
