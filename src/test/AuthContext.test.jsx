import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useContext } from 'react'
import AuthContext, { AuthProvider } from '../context/AuthContext'

function AuthConsumer() {
  const { login, logout } = useContext(AuthContext)

  return (
    <>
      <button
        onClick={() =>
          login({ id: 1, email: 'teste@teste.com' }, 'valid-token')
        }
      >
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </>
  )
}

describe('AuthContext storage behavior', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should persist and clear auth data on logout', () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    )

    fireEvent.click(screen.getByText('Login'))

    expect(localStorage.getItem('authToken')).toBe('valid-token')
    expect(localStorage.getItem('user')).toBe(
      JSON.stringify({ id: 1, email: 'teste@teste.com' })
    )

    localStorage.setItem('refreshToken', 'refresh-token')
    fireEvent.click(screen.getByText('Logout'))

    expect(localStorage.getItem('authToken')).toBeNull()
    expect(localStorage.getItem('user')).toBeNull()
    expect(localStorage.getItem('refreshToken')).toBeNull()
  })
})
