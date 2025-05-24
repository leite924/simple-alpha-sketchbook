import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarCheck, MapPin, Clock, Users, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ClassDetailsProps {
  id: string;
  courseName: string;
  courseSlug: string;
  period: string;
  days: string;
  time: string;
  location: string;
  startDate: string;
  endDate: string;
  spotsAvailable: number;
  price: string;
  description?: string;
  image?: string;
  classData?: any; // Add classData as an optional prop
}

const ClassDetails: React.FC<ClassDetailsProps> = ({
  id,
  courseName,
  courseSlug,
  period,
  days,
  time,
  location,
  startDate,
  endDate,
  spotsAvailable,
  price,
  description,
  image,
  classData, // Add classData to destructuring
}) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Handle enrollment - Navigate to checkout
  const handleEnroll = () => {
    navigate(`/checkout/${id}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold">{courseName}</h1>
              <Badge variant={spotsAvailable > 0 ? "default" : "destructive"}>
                {spotsAvailable > 0 ? `${spotsAvailable} vagas` : 'Esgotado'}
              </Badge>
            </div>
            
            {image && (
              <div className="mb-6">
                <img 
                  src={image} 
                  alt={courseName} 
                  className="w-full h-64 object-cover rounded-md" 
                />
              </div>
            )}
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Detalhes da Turma</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
                  <span>{period}</span>
                </div>
                <div className="flex items-center">
                  <CalendarCheck className="mr-2 h-5 w-5 text-muted-foreground" />
                  <span>{days}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
                  <span>{time}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-muted-foreground" />
                  <span>{location}</span>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Datas</h2>
              <p>
                <strong>Início:</strong> {formatDate(startDate)}
              </p>
              <p>
                <strong>Término:</strong> {formatDate(endDate)}
              </p>
            </div>
            
            {description && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Descrição</h2>
                <p className="text-gray-700">{description}</p>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button asChild>
                <Link to={`/courses/${courseSlug}`}>Ver Detalhes do Curso</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/classes">Ver Outras Turmas</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Inscrição</h2>
            
            <div className="mb-6">
              <p className="text-2xl font-bold">R$ {price}</p>
              <p className="text-sm text-muted-foreground">Investimento total</p>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <Users className="mr-2 h-5 w-5 text-muted-foreground" />
                <span>
                  <strong>{spotsAvailable}</strong> vagas disponíveis
                </span>
              </div>
            </div>
            
            <Button 
              className="w-full" 
              size="lg" 
              disabled={spotsAvailable <= 0}
              onClick={handleEnroll}
            >
              {spotsAvailable > 0 ? 'Matricular-se' : 'Turma Esgotada'}
            </Button>
            
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Ao se matricular, você concorda com os nossos termos e condições.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClassDetails;
