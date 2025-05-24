
import { useParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import ClassHero from "@/components/class/ClassHero";
import ClassNavigation from "@/components/class/ClassNavigation";
import ClassContent from "@/components/class/ClassContent";
import RelatedClasses from "@/components/class/RelatedClasses";
import ClassLoading from "@/components/class/ClassLoading";
import ClassNotFound from "@/components/class/ClassNotFound";
import { useClassDetail } from "@/hooks/classes/useClassDetail";
import { relatedClassesData } from "@/data/mockClassesData";

const ClassDetail = () => {
  const { classSlug } = useParams();
  const { classData, loading } = useClassDetail(classSlug);

  if (loading) {
    return <ClassLoading />;
  }

  if (!classData) {
    return <ClassNotFound />;
  }

  return (
    <MainLayout>
      {/* Hero Section */}
      <ClassHero 
        image={classData.image}
        month={classData.month}
        year={classData.year}
        period={classData.period}
        courseName={classData.courseName}
        description={classData.description}
      />

      {/* Navigation */}
      <ClassNavigation />

      {/* Main Content */}
      <ClassContent classData={classData} />
      
      {/* Related Classes */}
      <RelatedClasses relatedClasses={relatedClassesData} />
    </MainLayout>
  );
};

export default ClassDetail;
