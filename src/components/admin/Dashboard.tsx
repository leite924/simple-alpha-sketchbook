
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStats } from "./types";
import { ChartBar, Users, Book, DollarSign } from "lucide-react";

const Dashboard = () => {
  // Em um app real, esses dados viriam de uma API
  const [stats] = useState<DashboardStats>({
    totalStudents: 256,
    activeClasses: 18,
    totalRevenue: 42580.25,
    newEnrollments: 34
  });

  // Dados do gráfico (em um app real, viriam de uma API)
  const recentActivity = [
    { date: "01/05", enrollments: 4 },
    { date: "02/05", enrollments: 6 },
    { date: "03/05", enrollments: 2 },
    { date: "04/05", enrollments: 8 },
    { date: "05/05", enrollments: 5 },
    { date: "06/05", enrollments: 9 },
    { date: "07/05", enrollments: 0 }
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Total de Alunos" 
          value={stats.totalStudents.toString()} 
          description="Alunos matriculados" 
          icon={<Users className="h-4 w-4" />}
          trend="+12% desde o último mês"
          trendUp={true}
        />
        
        <StatsCard 
          title="Turmas Ativas" 
          value={stats.activeClasses.toString()} 
          description="Em andamento" 
          icon={<Book className="h-4 w-4" />}
          trend="+3 novas turmas"
          trendUp={true}
        />
        
        <StatsCard 
          title="Receita Total" 
          value={`R$ ${stats.totalRevenue.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`} 
          description="Últimos 30 dias" 
          icon={<DollarSign className="h-4 w-4" />}
          trend="+18.5% desde o último mês"
          trendUp={true}
        />
        
        <StatsCard 
          title="Novas Matrículas" 
          value={stats.newEnrollments.toString()} 
          description="Último mês" 
          icon={<ChartBar className="h-4 w-4" />}
          trend="+6 desde a semana passada"
          trendUp={true}
        />
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>Matrículas nos últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-60">
              <div className="flex h-52 items-end gap-2">
                {recentActivity.map((day, i) => (
                  <div key={i} className="relative flex w-full flex-col items-center">
                    <div 
                      className="bg-primary w-full rounded-sm" 
                      style={{height: `${(day.enrollments / 10) * 100}%`}}
                    ></div>
                    <span className="mt-2 text-xs">{day.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximos Eventos</CardTitle>
            <CardDescription>Próximas turmas e atividades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {title: "Início Turma JavaScript Avançado", date: "10/05/2025", type: "class"},
                {title: "Workshop UI/UX Design", date: "15/05/2025", type: "event"},
                {title: "Palestra - Tendências em Desenvolvimento Web", date: "22/05/2025", type: "event"},
                {title: "Início Turma React Framework", date: "01/06/2025", type: "class"}
              ].map((event, i) => (
                <div key={i} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground">{event.date}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    event.type === 'class' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {event.type === 'class' ? 'Turma' : 'Evento'}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <button className="text-sm text-blue-600 hover:underline">
              Ver todos os eventos
            </button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend: string;
  trendUp: boolean;
}

const StatsCard = ({ title, value, description, icon, trend, trendUp }: StatsCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary/10 p-1 flex items-center justify-center text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        <div className={`flex items-center pt-2 text-xs ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
          {trendUp ? '↑' : '↓'} {trend}
        </div>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
