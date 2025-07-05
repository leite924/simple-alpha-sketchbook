
import ClassDetails from "./ClassDetails";
import EnrollmentForm from "./enrollment/EnrollmentForm";

interface ClassContentProps {
  classData: any;
}

const ClassContent = ({ classData }: ClassContentProps) => {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Detalhes da turma */}
          <div className="lg:col-span-2">
            <ClassDetails 
              id={classData.id}
              courseName={classData.courseName}
              courseSlug={classData.courseSlug}
              period={classData.period}
              days={classData.days}
              time={classData.time}
              location={classData.location}
              startDate={classData.startDate}
              endDate={classData.endDate}
              spotsAvailable={classData.spotsAvailable}
              price={classData.price}
              description={classData.description}
              image={classData.image}
              classData={classData}
            />
          </div>
          
          {/* Formulário de inscrição */}
          <div className="lg:col-span-1">
            <EnrollmentForm 
              spotsAvailable={classData.spotsAvailable}
              totalSpots={classData.totalSpots}
              classTitle={classData.courseName}
              classPeriod={classData.period}
              classId={classData.classId}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClassContent;
