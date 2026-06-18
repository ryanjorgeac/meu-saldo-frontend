import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../services/mock/index.js', async () => {
  const actual = await vi.importActual('../services/mock/index.js')
  return {
    ...actual,
    USE_MOCK_SERVICES: true,
  }
})

describe('mockCategoryService balances', () => {
  beforeEach(async () => {
    vi.resetModules()
  })

  it('sets remainingAmount to the full budget when a new category has no transactions', async () => {
    const { mockCategoryService } = await import('../services/mock/mockCategoryService.js')

    const createdCategory = await mockCategoryService.createCategory({
      name: 'Teste saldo',
      description: '',
      budgetAmount: 1000,
      icon: null,
      color: null,
      isActive: true,
    })

    expect(createdCategory.budgetAmount).toBe('10,00')
    expect(createdCategory.spentAmount).toBe('0,00')
    expect(createdCategory.remainingAmount).toBe('10,00')
  })

  it('includes new category budget in the remaining summary', async () => {
    const { mockCategoryService } = await import('../services/mock/mockCategoryService.js')

    await mockCategoryService.createCategory({
      name: 'Teste resumo',
      description: '',
      budgetAmount: 1000,
      icon: null,
      color: null,
      isActive: true,
    })

    const summary = await mockCategoryService.getSummary()

    expect(summary.totalBudget).toBe('8.310,00')
    expect(summary.totalSpent).toBe('2.021,50')
    expect(summary.remainingBudget).toBe('6.289,25')
  })
})
