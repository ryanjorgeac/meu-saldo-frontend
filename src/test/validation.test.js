import { describe, it, expect } from 'vitest'
import { validateField, validationRegex } from '../utils/validation.js'

describe('Validation Functions Unit Tests', () => {
  describe('Name validation', () => {
    it('should return error for empty name', () => {
      expect(validateField('name', '')).toBe('Nome é obrigatório')
      expect(validateField('name', null)).toBe('Nome é obrigatório')
      expect(validateField('name', undefined)).toBe('Nome é obrigatório')
    })

    it('should return error for whitespace-only name', () => {
      expect(validateField('name', ' ')).toBe('Nome é obrigatório')
      expect(validateField('name', '   ')).toBe('Nome é obrigatório')
      expect(validateField('name', '\t')).toBe('Nome é obrigatório')
      expect(validateField('name', '\n')).toBe('Nome é obrigatório')
      expect(validateField('name', '  \t  \n  ')).toBe('Nome é obrigatório')
    })

    it('should return error for name with numbers', () => {
      expect(validateField('name', 'João123')).toBe('Nome não pode conter números')
      expect(validateField('name', 'Maria2')).toBe('Nome não pode conter números')
      expect(validateField('name', '123Pedro')).toBe('Nome não pode conter números')
      expect(validateField('name', 'Ana1Silva')).toBe('Nome não pode conter números')
    })

    it('should return null for valid names', () => {
      expect(validateField('name', 'João')).toBe(null)
      expect(validateField('name', 'Maria')).toBe(null)
      expect(validateField('name', 'Pedro Silva')).toBe(null)
      expect(validateField('name', 'Ana-Paula')).toBe(null)
      expect(validateField('name', "D'Angelo")).toBe(null)
    })
  })

  describe('Surname validation', () => {
    it('should return error for empty surname', () => {
      expect(validateField('surname', '')).toBe('Sobrenome é obrigatório')
      expect(validateField('surname', null)).toBe('Sobrenome é obrigatório')
      expect(validateField('surname', undefined)).toBe('Sobrenome é obrigatório')
    })

    it('should return error for whitespace-only surname', () => {
      expect(validateField('surname', ' ')).toBe('Sobrenome é obrigatório')
      expect(validateField('surname', '   ')).toBe('Sobrenome é obrigatório')
      expect(validateField('surname', '\t')).toBe('Sobrenome é obrigatório')
      expect(validateField('surname', '\n')).toBe('Sobrenome é obrigatório')
      expect(validateField('surname', '  \t  \n  ')).toBe('Sobrenome é obrigatório')
    })

    it('should return error for surname with numbers', () => {
      expect(validateField('surname', 'Silva123')).toBe('Sobrenome não pode conter números')
      expect(validateField('surname', 'Santos2')).toBe('Sobrenome não pode conter números')
      expect(validateField('surname', '123Oliveira')).toBe('Sobrenome não pode conter números')
      expect(validateField('surname', 'Costa1Lima')).toBe('Sobrenome não pode conter números')
    })

    it('should return null for valid surnames', () => {
      expect(validateField('surname', 'Silva')).toBe(null)
      expect(validateField('surname', 'Santos')).toBe(null)
      expect(validateField('surname', 'Oliveira Santos')).toBe(null)
      expect(validateField('surname', 'Costa-Lima')).toBe(null)
      expect(validateField('surname', "O'Connor")).toBe(null)
    })
  })

  describe('Email validation', () => {
    it('should return error for empty email', () => {
      expect(validateField('email', '')).toBe('E-mail é obrigatório')
      expect(validateField('email', null)).toBe('E-mail é obrigatório')
      expect(validateField('email', undefined)).toBe('E-mail é obrigatório')
    })

    it('should return error for invalid email formats', () => {
      expect(validateField('email', 'invalid-email')).toBe('E-mail inválido')
      expect(validateField('email', 'test@')).toBe('E-mail inválido')
      expect(validateField('email', '@example.com')).toBe('E-mail inválido')
      expect(validateField('email', 'test@.com')).toBe('E-mail inválido')
      expect(validateField('email', 'test@example')).toBe('E-mail inválido')
      expect(validateField('email', 'test.example.com')).toBe('E-mail inválido')
    })

    it('should return null for valid email formats', () => {
      expect(validateField('email', 'test@example.com')).toBe(null)
      expect(validateField('email', 'user.name@domain.co.uk')).toBe(null)
      expect(validateField('email', 'user+tag@example.org')).toBe(null)
      expect(validateField('email', 'user123@test-domain.com')).toBe(null)
    })
  })

  describe('Password validation', () => {
    it('should return error for empty password', () => {
      expect(validateField('password', '')).toBe('Senha é obrigatória')
      expect(validateField('password', null)).toBe('Senha é obrigatória')
      expect(validateField('password', undefined)).toBe('Senha é obrigatória')
    })

    it('should return error for password shorter than 8 characters', () => {
      expect(validateField('password', '123')).toBe('A senha deve ter pelo menos 8 caracteres')
      expect(validateField('password', 'Pass1!')).toBe('A senha deve ter pelo menos 8 caracteres')
      expect(validateField('password', 'Ab1!')).toBe('A senha deve ter pelo menos 8 caracteres')
    })

    it('should return error for password without uppercase letters', () => {
      expect(validateField('password', 'password123!')).toBe('A senha deve conter letras maiúsculas, minúsculas, números e símbolos')
      expect(validateField('password', 'mypassword1@')).toBe('A senha deve conter letras maiúsculas, minúsculas, números e símbolos')
    })

    it('should return error for password without lowercase letters', () => {
      expect(validateField('password', 'PASSWORD123!')).toBe('A senha deve conter letras maiúsculas, minúsculas, números e símbolos')
      expect(validateField('password', 'MYPASSWORD1@')).toBe('A senha deve conter letras maiúsculas, minúsculas, números e símbolos')
    })

    it('should return error for password without numbers', () => {
      expect(validateField('password', 'Password!')).toBe('A senha deve conter letras maiúsculas, minúsculas, números e símbolos')
      expect(validateField('password', 'MyPassword@')).toBe('A senha deve conter letras maiúsculas, minúsculas, números e símbolos')
    })

    it('should return error for password without symbols', () => {
      expect(validateField('password', 'Password123')).toBe('A senha deve conter letras maiúsculas, minúsculas, números e símbolos')
      expect(validateField('password', 'MyPassword123')).toBe('A senha deve conter letras maiúsculas, minúsculas, números e símbolos')
    })

    it('should return null for valid passwords with all requirements', () => {
      expect(validateField('password', 'Password123!')).toBe(null)
      expect(validateField('password', 'MySecure123@')).toBe(null)
      expect(validateField('password', 'StrongPass1#')).toBe(null)
    })

    it('should accept all valid symbol characters', () => {
      const validSymbols = '!@#$%^&*(),.?":{}|<>'
      for (const symbol of validSymbols) {
        expect(validateField('password', `Password123${symbol}`)).toBe(null)
      }
    })

    it('should test complex password combinations', () => {
      const validPasswords = [
        'Abc123!@#',
        'MyP@ssw0rd',
        'S3cur3P@ss',
        'C0mpl3x!Pass',
        'V3ryStr0ng#'
      ]
      
      validPasswords.forEach(password => {
        expect(validateField('password', password)).toBe(null)
      })
    })
  })

  describe('Password confirmation validation', () => {
    it('should return error for empty confirmation', () => {
      expect(validateField('confirmPassword', '', { password: 'Password123!' })).toBe('Confirmação de senha é obrigatória')
      expect(validateField('confirmPassword', null, { password: 'Password123!' })).toBe('Confirmação de senha é obrigatória')
      expect(validateField('confirmPassword', undefined, { password: 'Password123!' })).toBe('Confirmação de senha é obrigatória')
    })

    it('should return error for mismatched passwords', () => {
      expect(validateField('confirmPassword', 'Password123!', { password: 'DifferentPass123!' })).toBe('As senhas não coincidem')
      expect(validateField('confirmPassword', 'Password123', { password: 'Password123!' })).toBe('As senhas não coincidem')
      expect(validateField('confirmPassword', 'PASSWORD123!', { password: 'Password123!' })).toBe('As senhas não coincidem')
    })

    it('should return null for matching passwords', () => {
      expect(validateField('confirmPassword', 'Password123!', { password: 'Password123!' })).toBe(null)
      expect(validateField('confirmPassword', 'MySecure123@', { password: 'MySecure123@' })).toBe(null)
      expect(validateField('confirmPassword', 'C0mpl3x!Pass', { password: 'C0mpl3x!Pass' })).toBe(null)
    })
  })

  describe('Edge cases and special characters', () => {
    it('should handle names with special characters correctly', () => {
      expect(validateField('name', 'José')).toBe(null)
      expect(validateField('name', 'María')).toBe(null)
      expect(validateField('name', 'François')).toBe(null)
      expect(validateField('name', 'Müller')).toBe(null)
      expect(validateField('surname', 'São José')).toBe(null)
      expect(validateField('surname', 'Mendonça')).toBe(null)
    })

    it('should handle whitespace in names', () => {
      expect(validateField('name', ' João ')).toBe(null)
      expect(validateField('surname', ' Silva Santos ')).toBe(null)
    })

    it('should validate regex patterns correctly', () => {
      const hasNumbersRegex = validationRegex.hasNumbers
      const emailRegex = validationRegex.email
      const passwordRegex = validationRegex.password
      
      expect(hasNumbersRegex.test('João123')).toBe(true)
      expect(hasNumbersRegex.test('João')).toBe(false)
      
      expect(emailRegex.test('test@example.com')).toBe(true)
      expect(emailRegex.test('invalid-email')).toBe(false)
      
      expect(passwordRegex.test('Password123!')).toBe(true)
      expect(passwordRegex.test('password123!')).toBe(false)
      expect(passwordRegex.test('PASSWORD123!')).toBe(false)
      expect(passwordRegex.test('Password!')).toBe(false)
      expect(passwordRegex.test('Password123')).toBe(false)
    })
  })
})