
export type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "viewer" | "instructor" | "student";
  status: "active" | "inactive" | "pending";
  createdAt: Date;
  lastLogin?: Date;
};

export interface DashboardStats {
  totalUsers: number;
  totalCourses: number;
  totalClasses: number;
  totalEnrollments: number;
  monthlyRevenue: number;
  activeStudents: number;
}

export interface FormValues {
  courseName: string;
  courseId?: string;
  period: string;
  days: string;
  price: string | number;
  totalSpots: string | number;
  availableSpots: string | number;
  isActive?: boolean;
  image?: string;
  instructor?: string;
  description?: string;
  time?: string;
  location?: string;
}
