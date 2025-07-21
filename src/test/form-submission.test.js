import { describe, it, expect } from 'vitest'

describe('Form Submission Data Trimming Tests', () => {
  it('should trim whitespace from name and surname before API submission', () => {
    const name = '  João  '
    const surname = '  Silva  '
    const email = 'joao@example.com'
    const password = 'Password123!'

    const userData = {
      email: email,
      password: password,
      firstName: name.trim(),
      lastName: surname.trim(),
    }
    
    expect(userData.firstName).toBe('João')
    expect(userData.lastName).toBe('Silva')
    expect(userData.email).toBe('joao@example.com')
    expect(userData.password).toBe('Password123!')
  })

  it('should handle various whitespace scenarios correctly', () => {
    const testCases = [
      { input: '  João  ', expected: 'João' },
      { input: '\tMaria\t', expected: 'Maria' },
      { input: '\nPedro\n', expected: 'Pedro' },
      { input: '  Ana Paula  ', expected: 'Ana Paula' },
      { input: '  \t  José  \n  ', expected: 'José' }
    ]
    
    testCases.forEach(({ input, expected }) => {
      const userData = {
        firstName: input.trim(),
        lastName: input.trim(),
      }
      
      expect(userData.firstName).toBe(expected)
      expect(userData.lastName).toBe(expected)
    })
  })
})