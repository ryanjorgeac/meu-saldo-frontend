import { describe, it, expect } from 'vitest'
import { validateField } from '../utils/validation.js'

describe('Register Validation Logic Tests', () => {

  describe('Critical Validation Rules', () => {
    it('should reject names with numbers (new validation rule)', () => {
      const testCases = [
        { input: 'João123', expected: 'Nome não pode conter números' },
        { input: 'Maria2024', expected: 'Nome não pode conter números' },
        { input: '123Pedro', expected: 'Nome não pode conter números' },
        { input: 'Ana1', expected: 'Nome não pode conter números' },
        { input: 'Carlos7Silva', expected: 'Nome não pode conter números' }
      ];

      testCases.forEach(({ input, expected }) => {
        expect(validateField('name', input)).toBe(expected);
      });
    });

    it('should reject surnames with numbers (new validation rule)', () => {
      const testCases = [
        { input: 'Silva123', expected: 'Sobrenome não pode conter números' },
        { input: 'Santos2024', expected: 'Sobrenome não pode conter números' },
        { input: '123Oliveira', expected: 'Sobrenome não pode conter números' },
        { input: 'Costa1', expected: 'Sobrenome não pode conter números' },
        { input: 'Lima7Pereira', expected: 'Sobrenome não pode conter números' }
      ];

      testCases.forEach(({ input, expected }) => {
        expect(validateField('surname', input)).toBe(expected);
      });
    });

    it('should require symbols in passwords (updated validation rule)', () => {
      const testCases = [
        { input: 'Password123', expected: 'A senha deve conter letras maiúsculas, minúsculas, números e símbolos' },
        { input: 'MyPassword123', expected: 'A senha deve conter letras maiúsculas, minúsculas, números e símbolos' },
        { input: 'StrongPass1', expected: 'A senha deve conter letras maiúsculas, minúsculas, números e símbolos' },
        { input: 'SecurePass9', expected: 'A senha deve conter letras maiúsculas, minúsculas, números e símbolos' }
      ];

      testCases.forEach(({ input, expected }) => {
        expect(validateField('password', input)).toBe(expected);
      });
    });

    it('should accept valid passwords with all requirements including symbols', () => {
      const validPasswords = [
        'Password123!',
        'MySecure123@',
        'StrongPass1#',
        'ValidPass1$',
        'GoodPass123%',
        'SecurePass1^',
        'MyPassword1&',
        'StrongWord1*',
        'ValidEntry1(',
        'SecureLogin1)',
        'MyAccount1.',
        'StrongAuth1,',
        'ValidUser1?',
        'SecureData1:',
        'MySystem1{',
        'StrongCode1}',
        'ValidKey1|',
        'SecureHash1<',
        'MyToken1>'
      ];

      validPasswords.forEach(password => {
        expect(validateField('password', password)).toBe(null);
      });
    });

    it('should accept valid names and surnames without numbers', () => {
      const validNames = [
        'João',
        'Maria',
        'Pedro Silva',
        'Ana Paula',
        'Carlos Eduardo',
        'Fernanda',
        'José',
        'Luiza',
        'Rafael',
        'Isabella'
      ];

      const validSurnames = [
        'Silva',
        'Santos',
        'Oliveira',
        'Costa Lima',
        'Pereira',
        'Ferreira',
        'Rodrigues',
        'Almeida',
        'Nascimento',
        'Carvalho'
      ];

      validNames.forEach(name => {
        expect(validateField('name', name)).toBe(null);
      });

      validSurnames.forEach(surname => {
        expect(validateField('surname', surname)).toBe(null);
      });
    });

    it('should maintain all existing validation rules', () => {
      expect(validateField('name', '')).toBe('Nome é obrigatório');
      expect(validateField('surname', '')).toBe('Sobrenome é obrigatório');
      expect(validateField('email', '')).toBe('E-mail é obrigatório');
      expect(validateField('password', '')).toBe('Senha é obrigatória');
      expect(validateField('confirmPassword', '')).toBe('Confirmação de senha é obrigatória');

      expect(validateField('email', 'invalid-email')).toBe('E-mail inválido');
      expect(validateField('email', 'valid@email.com')).toBe(null);

      expect(validateField('password', 'short')).toBe('A senha deve ter pelo menos 8 caracteres');

      expect(validateField('confirmPassword', 'different', { password: 'Password123!' })).toBe('As senhas não coincidem');
      expect(validateField('confirmPassword', 'Password123!', { password: 'Password123!' })).toBe(null);
    });
  });

  describe('Regression Prevention', () => {
    it('should prevent regression of name validation (numbers not allowed)', () => {
      const invalidNames = ['João1', 'Maria2', 'Pedro3', 'Ana4', 'Carlos5'];
      invalidNames.forEach(name => {
        expect(validateField('name', name)).toBe('Nome não pode conter números');
      });
    });

    it('should prevent regression of surname validation (numbers not allowed)', () => {
      const invalidSurnames = ['Silva1', 'Santos2', 'Oliveira3', 'Costa4', 'Lima5'];
      invalidSurnames.forEach(surname => {
        expect(validateField('surname', surname)).toBe('Sobrenome não pode conter números');
      });
    });

    it('should prevent regression of password validation (symbols required)', () => {
      const invalidPasswords = ['Password123', 'MySecure123', 'StrongPass1', 'ValidPass1'];
      invalidPasswords.forEach(password => {
        expect(validateField('password', password)).toBe('A senha deve conter letras maiúsculas, minúsculas, números e símbolos');
      });
    });
  });
});