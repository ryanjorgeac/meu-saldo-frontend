import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import Register from '../pages/auth/Register'


const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

vi.mock('../services/authService', () => ({
  default: {
    register: vi.fn()
  }
}))

const renderRegister = () => {
  return render(
    <BrowserRouter>
      <Register />
    </BrowserRouter>
  )
}

describe('Register Component Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Name validation', () => {
    it('should show error when name is empty', async () => {
      const user = userEvent.setup()
      renderRegister()
      
      const nameInput = screen.getByLabelText(/^nome$/i)
      await user.click(nameInput)
      await user.tab()
      
      expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument()
    })

    it('should show error when name contains numbers', async () => {
      const user = userEvent.setup()
      renderRegister()
      
      const nameInput = screen.getByLabelText(/^nome$/i)
      await user.type(nameInput, 'João123')
      await user.tab()
      
      expect(screen.getByText('Nome não pode conter números')).toBeInTheDocument()
    })

    it('should accept valid name without numbers', async () => {
      const user = userEvent.setup()
      renderRegister()
      
      const nameInput = screen.getByLabelText(/^nome$/i)
      await user.type(nameInput, 'João Silva')
      await user.tab()
      
      expect(screen.queryByText('Nome não pode conter números')).not.toBeInTheDocument()
      expect(screen.queryByText('Nome é obrigatório')).not.toBeInTheDocument()
    })
  })

  describe('Surname validation', () => {
    it('should show error when surname is empty', async () => {
      const user = userEvent.setup()
      renderRegister()
      
      const surnameInput = screen.getByLabelText(/sobrenome/i)
      await user.click(surnameInput)
      await user.tab()
      
      expect(screen.getByText('Sobrenome é obrigatório')).toBeInTheDocument()
    })

    it('should show error when surname contains numbers', async () => {
      const user = userEvent.setup()
      renderRegister()
      
      const surnameInput = screen.getByLabelText(/sobrenome/i)
      await user.type(surnameInput, 'Silva123')
      await user.tab()
      
      expect(screen.getByText('Sobrenome não pode conter números')).toBeInTheDocument()
    })

    it('should accept valid surname without numbers', async () => {
      const user = userEvent.setup()
      renderRegister()
      
      const surnameInput = screen.getByLabelText(/sobrenome/i)
      await user.type(surnameInput, 'Silva Santos')
      await user.tab()
      
      expect(screen.queryByText('Sobrenome não pode conter números')).not.toBeInTheDocument()
      expect(screen.queryByText('Sobrenome é obrigatório')).not.toBeInTheDocument()
    })
  })

  describe('Email validation', () => {
    it('should show error when email is empty', async () => {
      const user = userEvent.setup()
      renderRegister()
      
      const emailInput = screen.getByLabelText(/e-mail/i)
      await user.click(emailInput)
      await user.tab()
      
      expect(screen.getByText('E-mail é obrigatório')).toBeInTheDocument()
    })

    it('should show error for invalid email format', async () => {
      const user = userEvent.setup()
      renderRegister()
      
      const emailInput = screen.getByLabelText(/e-mail/i)
      await user.type(emailInput, 'invalid-email')
      await user.tab()
      
      expect(screen.getByText('E-mail inválido')).toBeInTheDocument()
    })

    it('should accept valid email format', async () => {
      const user = userEvent.setup()
      renderRegister()
      
      const emailInput = screen.getByLabelText(/e-mail/i)
      await user.type(emailInput, 'user@example.com')
      await user.tab()
      
      expect(screen.queryByText('E-mail inválido')).not.toBeInTheDocument()
      expect(screen.queryByText('E-mail é obrigatório')).not.toBeInTheDocument()
    })
  })

  describe('Password validation', () => {
    it('should show error when password is empty', async () => {
      const user = userEvent.setup()
      renderRegister()
      
      const passwordInput = screen.getByLabelText(/^senha$/i)
      await user.click(passwordInput)
      await user.tab()
      
      expect(screen.getByText('Senha é obrigatória')).toBeInTheDocument()
    })

    it('should show error when password is too short', async () => {
      const user = userEvent.setup()
      renderRegister()
      
      const passwordInput = screen.getByLabelText(/^senha$/i)
      await user.type(passwordInput, '123')
      await user.tab()
      
      expect(screen.getByText('A senha deve ter pelo menos 8 caracteres')).toBeInTheDocument()
    })

    it('should show error when password lacks uppercase letters', async () => {
      const user = userEvent.setup()
      renderRegister()
      
      const passwordInput = screen.getByLabelText(/^senha$/i)
      await user.type(passwordInput, 'password123!')
      await user.tab()
      
      expect(screen.getByText('A senha deve conter letras maiúsculas, minúsculas, números e símbolos')).toBeInTheDocument()
    })

    it('should show error when password lacks lowercase letters', async () => {
      const user = userEvent.setup()
      renderRegister()
      
      const passwordInput = screen.getByLabelText(/^senha$/i)
      await user.type(passwordInput, 'PASSWORD123!')
      await user.tab()
      
      expect(screen.getByText('A senha deve conter letras maiúsculas, minúsculas, números e símbolos')).toBeInTheDocument()
    })

    it('should show error when password lacks numbers', async () => {
      const user = userEvent.setup()
      renderRegister()
      
      const passwordInput = screen.getByLabelText(/^senha$/i)
      await user.type(passwordInput, 'Password!')
      await user.tab()
      
      expect(screen.getByText('A senha deve conter letras maiúsculas, minúsculas, números e símbolos')).toBeInTheDocument()
    })

    it('should show error when password lacks symbols', async () => {
      const user = userEvent.setup()
      renderRegister()
      
      const passwordInput = screen.getByLabelText(/^senha$/i)
      await user.type(passwordInput, 'Password123')
      await user.tab()
      
      expect(screen.getByText('A senha deve conter letras maiúsculas, minúsculas, números e símbolos')).toBeInTheDocument()
    })

    it('should accept valid password with all requirements', async () => {
      const user = userEvent.setup()
      renderRegister()
      
      const passwordInput = screen.getByLabelText(/^senha$/i)
      await user.type(passwordInput, 'Password123!')
      await user.tab()
      
      expect(screen.queryByText('A senha deve conter letras maiúsculas, minúsculas, números e símbolos')).not.toBeInTheDocument()
      expect(screen.queryByText('Senha é obrigatória')).not.toBeInTheDocument()
    })

    it('should accept password with various symbol types', async () => {
      const user = userEvent.setup()
      renderRegister()
      
      const passwordInput = screen.getByLabelText(/^senha$/i)
      const validPasswords = [
        'Password123@',
        'Password123#',
        'Password123$',
        'Password123%',
        'Password123^',
        'Password123&',
        'Password123*',
        'Password123(',
        'Password123)',
        'Password123.',
        'Password123,',
        'Password123?',
        'Password123:',
        'Password123|',
        'Password123<',
        'Password123>'
      ]
      
      for (const password of validPasswords) {
        await user.clear(passwordInput)
        await user.type(passwordInput, password)
        await user.tab()
        
        expect(screen.queryByText('A senha deve conter letras maiúsculas, minúsculas, números e símbolos')).not.toBeInTheDocument()
      }
    })
  })

  describe('Password confirmation validation', () => {
    it('should show error when password confirmation is empty', async () => {
      const user = userEvent.setup()
      renderRegister()
      
      const confirmPasswordInput = screen.getByLabelText(/confirme sua senha/i)
      await user.click(confirmPasswordInput)
      await user.tab()
      
      expect(screen.getByText('Confirmação de senha é obrigatória')).toBeInTheDocument()
    })

    it('should show error when passwords do not match', async () => {
      const user = userEvent.setup()
      renderRegister()
      
      const passwordInput = screen.getByLabelText(/^senha$/i)
      const confirmPasswordInput = screen.getByLabelText(/confirme sua senha/i)
      
      await user.type(passwordInput, 'Password123!')
      await user.type(confirmPasswordInput, 'DifferentPassword123!')
      await user.tab()
      
      expect(screen.getByText('As senhas não coincidem')).toBeInTheDocument()
    })

    it('should accept matching passwords', async () => {
      const user = userEvent.setup()
      renderRegister()
      
      const passwordInput = screen.getByLabelText(/^senha$/i)
      const confirmPasswordInput = screen.getByLabelText(/confirme sua senha/i)
      
      await user.type(passwordInput, 'Password123!')
      await user.type(confirmPasswordInput, 'Password123!')
      await user.tab()
      
      expect(screen.queryByText('As senhas não coincidem')).not.toBeInTheDocument()
      expect(screen.queryByText('Confirmação de senha é obrigatória')).not.toBeInTheDocument()
    })

    it('should update confirmation validation when password changes', async () => {
      const user = userEvent.setup()
      renderRegister()
      
      const passwordInput = screen.getByLabelText(/^senha$/i)
      const confirmPasswordInput = screen.getByLabelText(/confirme sua senha/i)

      await user.type(passwordInput, 'Password123!')
      await user.type(confirmPasswordInput, 'Password123!')

      await user.clear(passwordInput)
      await user.type(passwordInput, 'NewPassword123!')
      
      expect(screen.getByText('As senhas não coincidem')).toBeInTheDocument()
    })
  })
})