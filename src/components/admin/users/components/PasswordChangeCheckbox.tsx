
import { Checkbox } from "@/components/ui/checkbox";

interface PasswordChangeCheckboxProps {
  isEditing: boolean;
  changePassword: boolean;
  onChangePassword: (checked: boolean) => void;
  isCurrentUserSuperAdmin: boolean;
}

const PasswordChangeCheckbox = ({ 
  isEditing, 
  changePassword, 
  onChangePassword, 
  isCurrentUserSuperAdmin 
}: PasswordChangeCheckboxProps) => {
  if (!isEditing) return null;

  return (
    <div className="flex items-center space-x-2">
      <Checkbox 
        id="changePassword" 
        checked={changePassword}
        onCheckedChange={(checked) => {
          console.log("Checkbox changePassword alterado para:", checked);
          onChangePassword(checked as boolean);
        }}
      />
      <label htmlFor="changePassword" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Alterar senha
        {!isCurrentUserSuperAdmin && (
          <span className="text-xs text-muted-foreground ml-1">
            (apenas super admins)
          </span>
        )}
      </label>
    </div>
  );
};

export default PasswordChangeCheckbox;
