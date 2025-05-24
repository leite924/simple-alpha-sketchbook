
import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  register?: UseFormRegisterReturn;
  type?: string;
  placeholder?: string;
  children?: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  error,
  register,
  type = 'text',
  placeholder = '',
  children,
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div>
        {children || (
          <input
            id={id}
            type={type}
            placeholder={placeholder}
            className={`shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            {...register}
          />
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FormField;
