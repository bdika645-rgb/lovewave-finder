import { useState, useCallback } from 'react';

export interface FieldError {
  message: string;
  id: string;
}

export interface FormErrors {
  [fieldName: string]: FieldError | undefined;
}

export function useFormValidation() {
  const [errors, setErrors] = useState<FormErrors>({});

  const setFieldError = useCallback((fieldName: string, message: string) => {
    setErrors(prev => ({
      ...prev,
      [fieldName]: { message, id: `${fieldName}-error` }
    }));
  }, []);

  const clearFieldError = useCallback((fieldName: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  const getFieldProps = useCallback((fieldName: string) => {
    const error = errors[fieldName];
    return {
      'aria-invalid': error ? 'true' as const : undefined,
      'aria-describedby': error ? error.id : undefined,
    };
  }, [errors]);

  const hasErrors = Object.keys(errors).length > 0;

  return {
    errors,
    setFieldError,
    clearFieldError,
    clearAllErrors,
    getFieldProps,
    hasErrors,
  };
}
