
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import HeroSection from "@/components/home/HeroSection";
import BenefitsSection from "@/components/home/BenefitsSection";
import GallerySection from "@/components/home/GallerySection";
import ContactSection from "@/components/home/ContactSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CoursesSection from "@/components/home/CoursesSection";
import BlogPreviewSection from "@/components/home/BlogPreviewSection";

const Index = () => {
  return (
    <MainLayout>
      <HeroSection />
      <BenefitsSection />
      <GallerySection />
      <TestimonialsSection />
      <CoursesSection />
      <BlogPreviewSection />
      <ContactSection />
    </MainLayout>
  );
};

export default Index;
