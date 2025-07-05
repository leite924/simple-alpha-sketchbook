
import React from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StudentRegistrationFormData } from './types';

interface WhatsAppSectionProps {
  register: UseFormRegister<StudentRegistrationFormData>;
  errors: FieldErrors<StudentRegistrationFormData>;
  setValue: UseFormSetValue<StudentRegistrationFormData>;
  watch: UseFormWatch<StudentRegistrationFormData>;
  isLoading: boolean;
}

const WhatsAppSection: React.FC<WhatsAppSectionProps> = ({
  register,
  errors,
  setValue,
  watch,
  isLoading
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">WhatsApp</h3>
      
      <div className="grid grid-cols-3 gap-2">
        <div>
          <Label htmlFor="countryCode">País *</Label>
          <Select onValueChange={(value) => setValue('countryCode', value)} defaultValue="+55" disabled={isLoading}>
            <SelectTrigger className={errors.countryCode ? "border-red-500" : ""}>
              <SelectValue placeholder="DDI" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="+55">🇧🇷 +55</SelectItem>
              <SelectItem value="+1">🇺🇸 +1</SelectItem>
              <SelectItem value="+54">🇦🇷 +54</SelectItem>
              <SelectItem value="+56">🇨🇱 +56</SelectItem>
              <SelectItem value="+57">🇨🇴 +57</SelectItem>
            </SelectContent>
          </Select>
          {errors.countryCode && (
            <p className="text-sm text-red-500 mt-1">{errors.countryCode.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="areaCode">DDD *</Label>
          <Input
            id="areaCode"
            {...register("areaCode")}
            placeholder="11"
            maxLength={2}
            className={errors.areaCode ? "border-red-500" : ""}
            disabled={isLoading}
          />
          {errors.areaCode && (
            <p className="text-sm text-red-500 mt-1">{errors.areaCode.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="phoneNumber">Número *</Label>
          <Input
            id="phoneNumber"
            {...register("phoneNumber")}
            placeholder="999999999"
            maxLength={9}
            className={errors.phoneNumber ? "border-red-500" : ""}
            disabled={isLoading}
          />
          {errors.phoneNumber && (
            <p className="text-sm text-red-500 mt-1">{errors.phoneNumber.message}</p>
          )}
        </div>
      </div>
      
      <p className="text-sm text-gray-600">
        WhatsApp completo: {watch('countryCode')} ({watch('areaCode')}) {watch('phoneNumber')}
      </p>
    </div>
  );
};

export default WhatsAppSection;
