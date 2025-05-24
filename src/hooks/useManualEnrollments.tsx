
import { useEnrollmentsList } from './enrollments/useEnrollmentsList';
import { useEnrollmentDetail } from './enrollments/useEnrollmentDetail';
import { useEnrollmentActions } from './enrollments/useEnrollmentActions';

// Re-exports for backward compatibility
export const useManualEnrollments = useEnrollmentsList;
export const useManualEnrollment = useEnrollmentDetail;
export const useManualEnrollmentActions = useEnrollmentActions;
