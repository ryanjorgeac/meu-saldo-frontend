import { simulateDelay, generateId, mockCategories } from './mockData';
import { formatCurrencyFromCents } from '../../utils/money';

let commitments = [
  {
    id: 'c1abcdef',
    description: 'Aluguel',
    amountCents: 120000,
    amount: '1.200,00',
    type: 'EXPENSE',
    frequency: 'MONTHLY',
    date: '2025-01-01T12:00:00Z',
    categoryId: mockCategories[2]?.id || '3abcdef',
    createdAt: '2025-01-01T12:00:00Z',
    updatedAt: '2025-01-01T12:00:00Z',
  },
  {
    id: 'c2abcdef',
    description: 'Spotify',
    amountCents: 2490,
    amount: '24,90',
    type: 'EXPENSE',
    frequency: 'MONTHLY',
    date: '2025-01-15T12:00:00Z',
    categoryId: mockCategories[0]?.id || '1abcdef',
    createdAt: '2025-01-15T12:00:00Z',
    updatedAt: '2025-01-15T12:00:00Z',
  },
];

export const mockCommitmentService = {
  getCommitments: async () => {
    await simulateDelay(300);
    return JSON.parse(JSON.stringify(commitments));
  },

  getCommitment: async (id) => {
    await simulateDelay(200);
    const commitment = commitments.find((c) => c.id === id);
    if (!commitment) throw new Error('Compromisso não encontrado.');
    return JSON.parse(JSON.stringify(commitment));
  },

  createCommitment: async (data) => {
    await simulateDelay(400);
    if (!data.description?.trim()) throw new Error('Descrição é obrigatória.');
    const newCommitment = {
      id: generateId(),
      ...data,
      amount: formatCurrencyFromCents(data.amountCents),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    commitments.push(newCommitment);
    return JSON.parse(JSON.stringify(newCommitment));
  },

  updateCommitment: async (id, data) => {
    await simulateDelay(400);
    const index = commitments.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Compromisso não encontrado.');
    commitments[index] = {
      ...commitments[index],
      ...data,
      amount:
         data.amountCents !== undefined && data.amountCents !== null
           ? formatCurrencyFromCents(data.amountCents)
           : commitments[index].amount,
      updatedAt: new Date().toISOString(),
    };
    return JSON.parse(JSON.stringify(commitments[index]));
  },

  deleteCommitment: async (id) => {
    await simulateDelay(300);
    const index = commitments.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Compromisso não encontrado.');
    commitments.splice(index, 1);
  },

  logCommitment: async (id) => {
    await simulateDelay(500);
    const commitment = commitments.find((c) => c.id === id);
    if (!commitment) throw new Error('Compromisso não encontrado.');
    return {
      id: generateId(),
      description: commitment.description,
      amount: commitment.amount,
      amountCents: commitment.amountCents,
      type: commitment.type,
      categoryId: commitment.categoryId,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
  },
};
