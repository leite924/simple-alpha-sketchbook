export interface ClassItem {
  id: string;
  courseName: string;
  courseId?: string;
  period: string;
  days: string;
  time?: string;
  price: number;
  totalSpots: number;
  spotsAvailable: number;
  instructor?: string;
  location?: string;
  isActive?: boolean;
  image?: string;
  startDate?: Date;
  endDate?: Date;
  month?: string;
  year?: string;
}

export interface FormValues {
  courseName: string;
  courseId?: string;
  period: string;
  days: string;
  price: number | string;
  totalSpots: number | string;
  availableSpots: number | string;
  isActive?: boolean;
}

export function convertSupabaseToClassItem(item: any): ClassItem {
  return {
    id: item.id,
    courseName: item.course_name,
    courseId: item.course_id,
    period: item.period,
    days: item.days,
    price: item.price,
    totalSpots: item.total_spots,
    spotsAvailable: item.spots_available,
    isActive: item.is_active
  };
}
