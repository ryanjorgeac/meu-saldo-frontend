import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import Login from '../pages/auth/Login'

const mockNavigate = vi.fn()
const mockLogin = vi.fn()
const { mockAuthLogin } = vi.hoisted(() => ({
  mockAuthLogin: vi.fn()
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: {} })
  }
})

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({ login: mockLogin })
}))

vi.mock('../services', () => ({
  authService: {
    login: mockAuthLogin
  }
}))

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  )
}

describe('Login Component Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Login submission', () => {
    it('should login when backend returns valid user and token', async () => {
      const user = userEvent.setup()
      mockAuthLogin.mockResolvedValue({
        user: { id: 1, email: 'teste@teste.com' },
        token: 'jwt-token'
      })

      renderLogin()

      await user.type(screen.getByLabelText(/e-mail/i), 'teste@teste.com')
      await user.type(screen.getByPlaceholderText('••••••••'), 'Teste@123')
      await user.click(screen.getByRole('button', { name: /entrar/i }))

      expect(mockAuthLogin).toHaveBeenCalledWith({
        email: 'teste@teste.com',
        password: 'Teste@123'
      })
      expect(mockLogin).toHaveBeenCalledWith(
        { id: 1, email: 'teste@teste.com' },
        'jwt-token'
      )
      expect(mockNavigate).toHaveBeenCalledWith('/categories')
    })

    it('should show error and not login on wrong credentials', async () => {
      const user = userEvent.setup()
      mockAuthLogin.mockRejectedValue(new Error('E-mail ou senha inválidos.'))

      renderLogin()

      await user.type(screen.getByLabelText(/e-mail/i), 'teste@teste.com')
      await user.type(screen.getByPlaceholderText('••••••••'), 'Teste@123123123123')
      await user.click(screen.getByRole('button', { name: /entrar/i }))

      expect(mockLogin).not.toHaveBeenCalled()
      expect(mockNavigate).not.toHaveBeenCalled()
      expect(await screen.findByText('E-mail ou senha inválidos.')).toBeInTheDocument()
    })

    it('should reject backend response without token', async () => {
      const user = userEvent.setup()
      mockAuthLogin.mockResolvedValue({
        user: { id: 1, email: 'teste@teste.com' }
      })

      renderLogin()

      await user.type(screen.getByLabelText(/e-mail/i), 'teste@teste.com')
      await user.type(screen.getByPlaceholderText('••••••••'), 'Teste@123')
      await user.click(screen.getByRole('button', { name: /entrar/i }))

      expect(mockLogin).not.toHaveBeenCalled()
      expect(mockNavigate).not.toHaveBeenCalled()
      expect(
        await screen.findByText('Resposta inválida do servidor. Token não recebido.')
      ).toBeInTheDocument()
    })
  })

  describe('Email validation', () => {
    it('should show error when email is empty on blur', async () => {
      const user = userEvent.setup()
      renderLogin()
      
      const emailInput = screen.getByLabelText(/e-mail/i)
      await user.click(emailInput)
      await user.tab()
      
      expect(screen.getByText('E-mail é obrigatório')).toBeInTheDocument()
    })

    it('should show error for invalid email format on blur', async () => {
      const user = userEvent.setup()
      renderLogin()
      
      const emailInput = screen.getByLabelText(/e-mail/i)
      await user.type(emailInput, 'invalid-email')
      await user.tab()
      
      expect(screen.getByText('E-mail inválido')).toBeInTheDocument()
    })

    it('should not show error for valid email on blur', async () => {
      const user = userEvent.setup()
      renderLogin()
      
      const emailInput = screen.getByLabelText(/e-mail/i)
      await user.type(emailInput, 'test@example.com')
      await user.tab()
      
      expect(screen.queryByText('E-mail é obrigatório')).not.toBeInTheDocument()
      expect(screen.queryByText('E-mail inválido')).not.toBeInTheDocument()
    })
  })

  describe('Password validation', () => {
    it('should show error when password is empty on blur', async () => {
      const user = userEvent.setup()
      renderLogin()
      
      const passwordInput = screen.getByPlaceholderText('••••••••')
      await user.click(passwordInput)
      await user.tab()
      
      expect(screen.getByText('Senha é obrigatória')).toBeInTheDocument()
    })

    it('should show error when password is too short on blur', async () => {
      const user = userEvent.setup()
      renderLogin()
      
      const passwordInput = screen.getByPlaceholderText('••••••••')
      await user.type(passwordInput, '123')
      await user.tab()
      
      expect(screen.getByText('A senha deve ter pelo menos 8 caracteres')).toBeInTheDocument()
    })

    it('should not show error for valid password on blur', async () => {
      const user = userEvent.setup()
      renderLogin()
      
      const passwordInput = screen.getByPlaceholderText('••••••••')
      await user.type(passwordInput, 'validpassword123')
      await user.tab()
      
      expect(screen.queryByText('Senha é obrigatória')).not.toBeInTheDocument()
      expect(screen.queryByText('A senha deve ter pelo menos 8 caracteres')).not.toBeInTheDocument()
    })
  })
})
