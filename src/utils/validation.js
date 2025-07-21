const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
const HAS_NUMBERS_REGEX = /\d/;

/**
 * Validates individual form fields based on field type and value
 * @param {string} field - The field name to validate
 * @param {string} value - The value to validate
 * @param {object} context - Optional context for validation (e.g., password for confirmPassword)
 * @returns {string|null} - Error message if invalid, null if valid
 */
export const validateField = (field, value, context = {}) => {
  switch (field) {
    case "name":
    case "firstName":
      if (!value || !value.trim()) return "Nome é obrigatório";
      return HAS_NUMBERS_REGEX.test(value) ? "Nome não pode conter números" : null;
    
    case "surname":
    case "lastName":
      if (!value || !value.trim()) return "Sobrenome é obrigatório";
      return HAS_NUMBERS_REGEX.test(value) ? "Sobrenome não pode conter números" : null;
    
    case "email":
      if (!value) return "E-mail é obrigatório";
      return EMAIL_REGEX.test(value) ? null : "E-mail inválido";
    
    case "password":
      if (!value) return "Senha é obrigatória";
      if (value.length < 8) return "A senha deve ter pelo menos 8 caracteres";
      return PASSWORD_REGEX.test(value)
        ? null
        : "A senha deve conter letras maiúsculas, minúsculas, números e símbolos";
    
    case "confirmPassword":
      if (!value) return "Confirmação de senha é obrigatória";
      return value === context.password ? null : "As senhas não coincidem";
    
    default:
      return null;
  }
};

/**
 * Validates multiple form fields at once
 * @param {object} fields - Object with field names as keys and values as values
 * @param {object} context - Optional context for validation
 * @returns {object} - Object with field names as keys and error messages/null as values
 */
export const validateForm = (fields, context = {}) => {
  const errors = {};
  
  Object.entries(fields).forEach(([fieldName, value]) => {
    errors[fieldName] = validateField(fieldName, value, context);
  });
  
  return errors;
};

/**
 * Checks if a form has any validation errors
 * @param {object} errors - Object with field names as keys and error messages/null as values
 * @returns {boolean} - True if there are errors, false if all fields are valid
 */
export const hasValidationErrors = (errors) => {
  return Object.values(errors).some((error) => error !== null);
};

/**
 * Validation utility for specific auth forms
 */
export const authValidation = {
  /**
   * Validates registration form data
   * @param {object} formData - Registration form data
   * @returns {object} - Validation errors object
   */
  validateRegistration: (formData) => {
    const { name, surname, email, password, confirmPassword } = formData;
    return validateForm(
      { name, surname, email, password, confirmPassword },
      { password }
    );
  },

  /**
   * Validates login form data
   * @param {object} formData - Login form data
   * @returns {object} - Validation errors object
   */
  validateLogin: (formData) => {
    const { email, password } = formData;
    // For login, we only check basic requirements, not complex password rules
    const loginErrors = validateForm({ email }, {});
    
    // Simplified password validation for login
    if (!password) {
      loginErrors.password = "Senha é obrigatória";
    } else if (password.length < 8) {
      loginErrors.password = "A senha deve ter pelo menos 8 caracteres";
    } else {
      loginErrors.password = null;
    }
    
    return loginErrors;
  },

  /**
   * Validates forgot password form data
   * @param {object} formData - Forgot password form data
   * @returns {object} - Validation errors object
   */
  validateForgotPassword: (formData) => {
    const { email } = formData;
    return validateForm({ email }, {});
  }
};


export const validationRegex = {
  email: EMAIL_REGEX,
  password: PASSWORD_REGEX,
  hasNumbers: HAS_NUMBERS_REGEX
};
