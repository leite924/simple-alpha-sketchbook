
import React from 'react';
import ClassDetails from "@/components/class/ClassDetails";
import EnrollmentForm from "@/components/class/enrollment/EnrollmentForm";

interface ClassContentProps {
  classData: any;
}

const ClassContent: React.FC<ClassContentProps> = ({ classData }) => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Class Details */}
          <div className="lg:col-span-2">
            <ClassDetails 
              id={classData.id.toString()}
              courseName={classData.courseName}
              courseSlug={classData.courseSlug}
              period={classData.period}
              days={classData.days}
              time={classData.time}
              location={classData.location}
              startDate={classData.startDate}
              endDate={classData.endDate}
              spotsAvailable={classData.spotsAvailable}
              price={classData.price.replace('R$ ', '')}
              description={classData.description}
              image={classData.image}
            />
          </div>
          
          {/* Enrollment Form */}
          <div className="lg:col-span-1">
            <EnrollmentForm 
              spotsAvailable={classData.spotsAvailable} 
              totalSpots={classData.totalSpots}
              classTitle={classData.courseName}
              classPeriod={`${classData.month}/${classData.year} - ${classData.period}`}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClassContent;
