import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Transactions from '../pages/transactions/Transactions'
import Categories from '../pages/categories/Categories'
import CategoryCard from '../components/categoryCard/CategoryCard'
import { parseMoneyInputToCents } from '../utils/money'
import { resolveCategoryStyle } from '../utils/colors'

const serviceMocks = vi.hoisted(() => ({
  mockGetCategories: vi.fn(),
  mockGetSummary: vi.fn(),
  mockCreateCategory: vi.fn(),
  mockUpdateCategory: vi.fn(),
  mockDeleteCategory: vi.fn(),
  mockGetTransactions: vi.fn(),
  mockCreateTransaction: vi.fn(),
  mockUpdateTransaction: vi.fn(),
  mockDeleteTransaction: vi.fn(),
}))

vi.mock('../services', () => ({
  categoryService: {
    getCategories: serviceMocks.mockGetCategories,
    getSummary: serviceMocks.mockGetSummary,
    createCategory: serviceMocks.mockCreateCategory,
    updateCategory: serviceMocks.mockUpdateCategory,
    deleteCategory: serviceMocks.mockDeleteCategory,
  },
  transactionService: {
    getTransactions: serviceMocks.mockGetTransactions,
    createTransaction: serviceMocks.mockCreateTransaction,
    updateTransaction: serviceMocks.mockUpdateTransaction,
    deleteTransaction: serviceMocks.mockDeleteTransaction,
  },
}))

const emptyTransactionsResponse = {
  data: [],
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
}

const categoryOptions = [
  {
    id: 'cat-1',
    name: 'Moradia',
    description: null,
    icon: null,
    color: null,
    budgetAmount: '0,00',
    spentAmount: '0,00',
    remainingAmount: '0,00',
    transactionCount: 0,
    isActive: true,
  },
]

describe('Frontend integration contract', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    serviceMocks.mockGetCategories.mockResolvedValue(categoryOptions)
    serviceMocks.mockGetSummary.mockResolvedValue({
      totalBudget: '0,00',
      totalSpent: '0,00',
      remainingBudget: '0,00',
    })
    serviceMocks.mockGetTransactions.mockResolvedValue(emptyTransactionsResponse)
    serviceMocks.mockCreateCategory.mockResolvedValue({ id: 'new-category' })
    serviceMocks.mockUpdateCategory.mockResolvedValue({ id: 'cat-1' })
    serviceMocks.mockCreateTransaction.mockResolvedValue({ id: 'new-transaction' })
    serviceMocks.mockUpdateTransaction.mockResolvedValue({ id: 'tx-1' })
    serviceMocks.mockDeleteCategory.mockResolvedValue(undefined)
    serviceMocks.mockDeleteTransaction.mockResolvedValue(undefined)
    vi.spyOn(window, 'alert').mockImplementation(() => {})
    vi.spyOn(window, 'confirm').mockReturnValue(true)
  })

  it('converts human-readable money input into integer cents', () => {
    expect(parseMoneyInputToCents('450,25')).toBe(45025)
    expect(parseMoneyInputToCents('450.25')).toBe(45025)
    expect(parseMoneyInputToCents('1.000,00')).toBe(100000)
    expect(() => parseMoneyInputToCents('450,256')).toThrow('Invalid money input')
  })

  it('resolves null category visuals to the API fallback style', () => {
    expect(resolveCategoryStyle({ color: null, icon: null })).toEqual({
      color: '#9CA3AF',
      icon: 'tag',
    })

    expect(resolveCategoryStyle({ color: '  ', icon: 'coffee' })).toEqual({
      color: '#9CA3AF',
      icon: 'coffee',
    })
  })

  it('submits new transactions with amountCents and without decimal amount', async () => {
    const user = userEvent.setup()

    render(<Transactions />)

    await screen.findByRole('button', { name: /nova transação/i })
    await user.click(screen.getByRole('button', { name: /nova transação/i }))

    await user.type(screen.getByPlaceholderText('Descrição da transação'), 'Aluguel')
    await user.type(screen.getByPlaceholderText('0,00'), '45025')
    await user.type(screen.getByPlaceholderText('DD/MM/AAAA'), '18062026')

    const categorySelect = document.querySelector('.transaction-modal select[name="category"]')
    await user.selectOptions(categorySelect, 'cat-1')
    await user.click(screen.getByRole('button', { name: /salvar/i }))

    await waitFor(() => expect(serviceMocks.mockCreateTransaction).toHaveBeenCalledTimes(1))

    const payload = serviceMocks.mockCreateTransaction.mock.calls[0][0]
    expect(payload).toMatchObject({
      description: 'Aluguel',
      amountCents: 45025,
      type: 'EXPENSE',
      categoryId: 'cat-1',
    })
    expect(payload).not.toHaveProperty('amount')
    expect(payload.date).toMatch(/^2026-06-18T12:00:00.000Z$/)
  })

  it('does not reuse response money strings when updating a transaction', async () => {
    const user = userEvent.setup()

    serviceMocks.mockGetTransactions.mockResolvedValue({
      ...emptyTransactionsResponse,
      data: [
        {
          id: 'tx-1',
          description: 'Mercado',
          amount: '150,50',
          type: 'EXPENSE',
          categoryId: 'cat-1',
          date: '2026-06-18T12:00:00.000Z',
        },
      ],
      total: 1,
    })

    const { container } = render(<Transactions />)

    await screen.findByText('Mercado')
    const editButton = container.querySelector('.edit-button')
    await user.click(editButton)

    const descriptionInput = screen.getByPlaceholderText('Descrição da transação')
    await user.clear(descriptionInput)
    await user.type(descriptionInput, 'Mercado ajustado')

    const dateInput = screen.getByDisplayValue('18 de junho de 2026')
    await user.clear(dateInput)
    await user.type(dateInput, '19062026')

    await user.click(screen.getByRole('button', { name: /salvar/i }))

    await waitFor(() => expect(serviceMocks.mockUpdateTransaction).toHaveBeenCalledTimes(1))

    const [, payload] = serviceMocks.mockUpdateTransaction.mock.calls[0]
    expect(payload).toMatchObject({
      description: 'Mercado ajustado',
      type: 'EXPENSE',
      categoryId: 'cat-1',
    })
    expect(payload).not.toHaveProperty('amountCents')
    expect(payload).not.toHaveProperty('amount')
    expect(payload.date).toMatch(/^2026-06-19T12:00:00.000Z$/)
  })

  it('submits new categories with cent-based budgetAmount and nullable visuals', async () => {
    const user = userEvent.setup()

    render(<Categories />)

    await screen.findByRole('button', { name: /nova categoria/i })
    await user.click(screen.getByRole('button', { name: /nova categoria/i }))

    await user.type(screen.getByLabelText('Nome da Categoria'), 'Mercado')
    await user.type(screen.getByPlaceholderText('0,00'), '100000')
    await user.click(screen.getByRole('button', { name: /criar/i }))

    await waitFor(() => expect(serviceMocks.mockCreateCategory).toHaveBeenCalledTimes(1))

    expect(serviceMocks.mockCreateCategory).toHaveBeenCalledWith({
      name: 'Mercado',
      description: '',
      budgetAmount: 100000,
      icon: null,
      color: null,
      isActive: true,
    })
  })

  it('renders category cards safely when icon and color are null', () => {
    const { container } = render(
      <CategoryCard
        category={{
          id: 'cat-1',
          name: 'Sem categoria',
          description: null,
          icon: null,
          color: null,
          budgetAmount: '0,00',
          spentAmount: '0,00',
          remainingAmount: '0,00',
          transactionCount: 0,
          isActive: true,
        }}
      />
    )

    const identification = container.querySelector('.category-card__identification')
    expect(identification.style.getPropertyValue('--category-color')).toBe('#9CA3AF')
    expect(container.querySelector('.category-card__icon svg')).toBeInTheDocument()
    expect(screen.getByText('Sem categoria')).toBeInTheDocument()
  })
})
