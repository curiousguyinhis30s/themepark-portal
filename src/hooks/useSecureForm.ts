import { useState, useCallback } from 'react';
import {
  sanitizeInput,
  sanitizeHtml,
  hasAttackPatterns,
  ValidationResult,
  validateRequired,
  validateLength,
  isValidEmail,
  isValidPhone,
  checkRateLimit,
} from '../utils/security';

interface FormField {
  value: string;
  error?: string;
  touched: boolean;
}

interface FormState {
  [key: string]: FormField;
}

interface FieldConfig {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  type?: 'text' | 'email' | 'phone' | 'number' | 'password';
  sanitize?: boolean;
  customValidator?: (value: string) => ValidationResult;
}

interface FormConfig {
  [key: string]: FieldConfig;
}

export function useSecureForm(config: FormConfig) {
  const initialState: FormState = {};
  Object.keys(config).forEach((key) => {
    initialState[key] = { value: '', error: undefined, touched: false };
  });

  const [fields, setFields] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateField = useCallback(
    (name: string, value: string): string | undefined => {
      const fieldConfig = config[name];
      if (!fieldConfig) return undefined;

      // Check for attack patterns
      if (hasAttackPatterns(value)) {
        return 'Invalid input detected';
      }

      // Required validation
      if (fieldConfig.required) {
        const result = validateRequired(value, name);
        if (!result.isValid) return result.error;
      }

      // Length validation
      if (fieldConfig.minLength !== undefined || fieldConfig.maxLength !== undefined) {
        const result = validateLength(
          value,
          name,
          fieldConfig.minLength || 0,
          fieldConfig.maxLength || Infinity
        );
        if (!result.isValid) return result.error;
      }

      // Type-specific validation
      switch (fieldConfig.type) {
        case 'email':
          if (value && !isValidEmail(value)) {
            return 'Invalid email address';
          }
          break;
        case 'phone':
          if (value && !isValidPhone(value)) {
            return 'Invalid phone number';
          }
          break;
        case 'number':
          if (value && isNaN(Number(value))) {
            return 'Must be a valid number';
          }
          break;
      }

      // Custom validator
      if (fieldConfig.customValidator) {
        const result = fieldConfig.customValidator(value);
        if (!result.isValid) return result.error;
      }

      return undefined;
    },
    [config]
  );

  const setValue = useCallback(
    (name: string, value: string) => {
      const fieldConfig = config[name];
      let sanitizedValue = value;

      // Sanitize input if configured
      if (fieldConfig?.sanitize !== false) {
        sanitizedValue = sanitizeInput(value);
        if (fieldConfig?.type === 'text') {
          sanitizedValue = sanitizeHtml(sanitizedValue);
        }
      }

      setFields((prev) => ({
        ...prev,
        [name]: {
          value: sanitizedValue,
          error: prev[name].touched ? validateField(name, sanitizedValue) : undefined,
          touched: prev[name].touched,
        },
      }));
    },
    [config, validateField]
  );

  const setTouched = useCallback(
    (name: string) => {
      setFields((prev) => ({
        ...prev,
        [name]: {
          ...prev[name],
          touched: true,
          error: validateField(name, prev[name].value),
        },
      }));
    },
    [validateField]
  );

  const validateAll = useCallback((): boolean => {
    let isValid = true;
    const newFields = { ...fields };

    Object.keys(config).forEach((name) => {
      const error = validateField(name, fields[name].value);
      newFields[name] = {
        ...fields[name],
        touched: true,
        error,
      };
      if (error) isValid = false;
    });

    setFields(newFields);
    return isValid;
  }, [fields, config, validateField]);

  const handleSubmit = useCallback(
    async (
      onSubmit: (values: Record<string, string>) => Promise<void>,
      rateLimitKey?: string
    ) => {
      // Rate limit check
      if (rateLimitKey && !checkRateLimit(rateLimitKey, 5, 60000)) {
        setSubmitError('Too many attempts. Please wait before trying again.');
        return;
      }

      // Validate all fields
      if (!validateAll()) {
        return;
      }

      setIsSubmitting(true);
      setSubmitError(null);

      try {
        const values: Record<string, string> = {};
        Object.keys(fields).forEach((name) => {
          values[name] = fields[name].value;
        });
        await onSubmit(values);
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setIsSubmitting(false);
      }
    },
    [fields, validateAll]
  );

  const reset = useCallback(() => {
    const resetState: FormState = {};
    Object.keys(config).forEach((key) => {
      resetState[key] = { value: '', error: undefined, touched: false };
    });
    setFields(resetState);
    setSubmitError(null);
  }, [config]);

  const getFieldProps = useCallback(
    (name: string) => ({
      value: fields[name]?.value || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setValue(name, e.target.value),
      onBlur: () => setTouched(name),
      error: fields[name]?.error,
      touched: fields[name]?.touched,
    }),
    [fields, setValue, setTouched]
  );

  return {
    fields,
    setValue,
    setTouched,
    validateAll,
    handleSubmit,
    reset,
    getFieldProps,
    isSubmitting,
    submitError,
    isValid: Object.values(fields).every((f) => !f.error),
  };
}

// Hook for secure API calls with CSRF protection
export function useSecureApi() {
  const fetchWithCsrf = useCallback(
    async (url: string, options: RequestInit = {}): Promise<Response> => {
      // Get CSRF token from session
      const csrfToken = sessionStorage.getItem('csrf_token');

      const headers = new Headers(options.headers);
      if (csrfToken) {
        headers.set('X-CSRF-Token', csrfToken);
      }
      headers.set('Content-Type', 'application/json');

      // Add Authorization header if token exists
      const authToken = localStorage.getItem('token');
      if (authToken) {
        headers.set('Authorization', `Bearer ${authToken}`);
      }

      return fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });
    },
    []
  );

  const secureGet = useCallback(
    (url: string) => fetchWithCsrf(url, { method: 'GET' }),
    [fetchWithCsrf]
  );

  const securePost = useCallback(
    (url: string, data: unknown) =>
      fetchWithCsrf(url, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    [fetchWithCsrf]
  );

  const securePut = useCallback(
    (url: string, data: unknown) =>
      fetchWithCsrf(url, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    [fetchWithCsrf]
  );

  const secureDelete = useCallback(
    (url: string) => fetchWithCsrf(url, { method: 'DELETE' }),
    [fetchWithCsrf]
  );

  return { secureGet, securePost, securePut, secureDelete };
}
