
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
  totalStudents: number;
  activeClasses: number;
  totalRevenue: number;
  newEnrollments: number;
}

export interface PaymentTransaction {
  id: number;
  userName: string;
  description: string;
  amount: number;
  date: Date;
  status: "completed" | "pending" | "failed";
  paymentMethod?: string;
  userId?: string;
}

export interface ClassItem {
  id: string;
  courseName: string;
  courseId?: string;
  period: string;
  days: string;
  price: string | number;
  totalSpots: string | number;
  spotsAvailable: string | number;
  availableSpots: string | number;
  isActive?: boolean;
  image?: string;
  instructor?: string;
  description?: string;
  time?: string;
  location?: string;
  month?: string;
  year?: string;
}

export interface FormValues {
  courseName: string;
  courseId?: string;
  courseSlug?: string;
  period: string;
  days: string;
  price: string | number;
  totalSpots: string | number;
  availableSpots: string | number;
  spotsAvailable?: string | number;
  isActive?: boolean;
  image?: string;
  instructor?: string;
  description?: string;
  time?: string;
  location?: string;
  month?: string;
  year?: string;
  startDate?: Date;
  endDate?: Date;
}

// Converter function for Supabase data
export const convertSupabaseToClassItem = (supabaseClass: any): ClassItem => {
  return {
    id: supabaseClass.id,
    courseName: supabaseClass.course_name,
    courseId: supabaseClass.course_id,
    period: supabaseClass.period,
    days: supabaseClass.days,
    price: supabaseClass.price,
    totalSpots: supabaseClass.total_spots,
    spotsAvailable: supabaseClass.spots_available,
    availableSpots: supabaseClass.spots_available,
    isActive: supabaseClass.is_active,
    instructor: supabaseClass.instructor,
    description: supabaseClass.description,
    time: supabaseClass.time,
    location: supabaseClass.location,
    image: supabaseClass.image,
    month: supabaseClass.month,
    year: supabaseClass.year,
  };
};
