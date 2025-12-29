export interface ValidationRule {
  type: 'required' | 'email' | 'phone' | 'minLength' | 'maxLength' | 'pattern'
  message?: string
  value?: number | string | RegExp
}

export interface FieldConfig {
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'date' | 'time' | 'number'
  placeholder?: string
  required?: boolean
  rules?: ValidationRule[]
  options?: { value: string; label: string }[]
  rows?: number
  maxlength?: number
  autocomplete?: string
  halfWidth?: boolean
}

export function useFormValidation() {
  const errors = ref<Record<string, string>>({})
  const touched = ref<Record<string, boolean>>({})

  const validators = {
    required: (value: string, message?: string) => {
      if (!value || value.trim() === '') {
        return message || 'Detta fält är obligatoriskt'
      }
      return null
    },

    email: (value: string, message?: string) => {
      if (!value) return null
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return message || 'Ange en giltig e-postadress'
      }
      return null
    },

    phone: (value: string, message?: string) => {
      if (!value) return null
      // Swedish phone format: 07XXXXXXXX or +46XXXXXXXXX
      const phoneRegex = /^(\+46|0)[0-9]{7,11}$/
      const cleanedValue = value.replace(/[\s-]/g, '')
      if (!phoneRegex.test(cleanedValue)) {
        return message || 'Ange ett giltigt telefonnummer'
      }
      return null
    },

    minLength: (value: string, min: number, message?: string) => {
      if (!value) return null
      if (value.length < min) {
        return message || `Minst ${min} tecken krävs`
      }
      return null
    },

    maxLength: (value: string, max: number, message?: string) => {
      if (!value) return null
      if (value.length > max) {
        return message || `Max ${max} tecken tillåtna`
      }
      return null
    },

    pattern: (value: string, pattern: RegExp, message?: string) => {
      if (!value) return null
      if (!pattern.test(value)) {
        return message || 'Ogiltigt format'
      }
      return null
    },
  }

  const validateField = (
    fieldName: string,
    value: string,
    rules: ValidationRule[] = [],
    required = false
  ): string | null => {
    // Check required first
    if (required) {
      const requiredError = validators.required(value)
      if (requiredError) return requiredError
    }

    // Check other rules
    for (const rule of rules) {
      let error: string | null = null

      switch (rule.type) {
        case 'required':
          error = validators.required(value, rule.message)
          break
        case 'email':
          error = validators.email(value, rule.message)
          break
        case 'phone':
          error = validators.phone(value, rule.message)
          break
        case 'minLength':
          error = validators.minLength(value, rule.value as number, rule.message)
          break
        case 'maxLength':
          error = validators.maxLength(value, rule.value as number, rule.message)
          break
        case 'pattern':
          error = validators.pattern(value, rule.value as RegExp, rule.message)
          break
      }

      if (error) return error
    }

    return null
  }

  const validate = (
    formData: Record<string, string>,
    fields: FieldConfig[]
  ): boolean => {
    const newErrors: Record<string, string> = {}
    let isValid = true

    for (const field of fields) {
      const value = formData[field.name] || ''
      const error = validateField(field.name, value, field.rules, field.required)

      if (error) {
        newErrors[field.name] = error
        isValid = false
      }
    }

    errors.value = newErrors
    return isValid
  }

  const validateSingleField = (
    fieldName: string,
    value: string,
    field: FieldConfig
  ) => {
    const error = validateField(fieldName, value, field.rules, field.required)
    if (error) {
      errors.value = { ...errors.value, [fieldName]: error }
    } else {
      const { [fieldName]: _, ...rest } = errors.value
      errors.value = rest
    }
  }

  const markTouched = (fieldName: string) => {
    touched.value = { ...touched.value, [fieldName]: true }
  }

  const clearErrors = () => {
    errors.value = {}
    touched.value = {}
  }

  const getError = (fieldName: string) => {
    return touched.value[fieldName] ? errors.value[fieldName] : undefined
  }

  return {
    errors,
    touched,
    validate,
    validateSingleField,
    markTouched,
    clearErrors,
    getError,
  }
}
