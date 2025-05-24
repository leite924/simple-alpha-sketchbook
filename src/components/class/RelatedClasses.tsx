
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface RelatedClass {
  slug: string;
  title: string;
  image: string;
  period: string;
  schedule: string;
  date: string;
}

interface RelatedClassesProps {
  relatedClasses: RelatedClass[];
}

const RelatedClasses = ({ relatedClasses }: RelatedClassesProps) => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Outras turmas disponíveis</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedClasses.map((classItem, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-40 overflow-hidden relative">
                <img
                  src={classItem.image}
                  alt={classItem.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-0 left-0 bg-amber-600 text-white px-3 py-1 rounded-br-lg font-medium text-sm">
                  {classItem.date}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">{classItem.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{classItem.schedule}</p>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link to={`/turmas/${classItem.slug}`}>Ver detalhes</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedClasses;
