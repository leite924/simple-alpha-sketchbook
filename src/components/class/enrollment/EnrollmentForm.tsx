
import EnrollmentFormContainer from "./EnrollmentFormContainer";

interface EnrollmentFormProps {
  spotsAvailable: number;
  totalSpots: number;
  classTitle: string;
  classPeriod: string;
}

// This component is a wrapper to maintain backward compatibility
const EnrollmentForm = (props: EnrollmentFormProps) => {
  return <EnrollmentFormContainer {...props} />;
};

export default EnrollmentForm;
