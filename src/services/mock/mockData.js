export const mockSummary = {
    totalBudget: "1.000,00",
    totalSpent: "630,50",
    remainingBudget: "203,75"
}

export const mockCategories = [
  {
    id: "1abcdef",
    name: "Groceries",
    description: "Expenses related to groceries",
    color: "#FF5733",
    icon: "coffee",
    budgetAmount: "800,00",
    userId: "1fedcba",
    isActive: true,
    createdAt: "2025-04-21T12:00:00Z",
    updatedAt: "2025-04-21T12:00:00Z",
    spentAmount: "450,75",
    incomeAmount: "50,00",
    remainingAmount: "350,00",
    transactionCount: 12
  },
  {
    id: "2abcdef",
    name: "Transporte",
    description: "Combustível, ônibus, uber",
    color: "#4ECDC4",
    icon: "map",
    budgetAmount: "300,00",
    userId: "2fedcba",
    isActive: true,
    createdAt: "2025-04-21T12:00:00Z",
    updatedAt: "2025-04-21T12:00:00Z",
    spentAmount: "250,75",
    incomeAmount: "50,00",
    remainingAmount: "49,25",
    transactionCount: 3
  },
  {
    id: "3abcdef",
    name: "Moradia",
    description: "Aluguel, contas, manutenção",
    color: "#45B7D1",
    icon: "shield",
    budgetAmount: "1200,00",
    userId: "3fedcba",
    isActive: true,
    createdAt: "2025-04-21T12:00:00Z",
    updatedAt: "2025-04-21T12:00:00Z",
    spentAmount: "1200,00",
    incomeAmount: "0,00",
    remainingAmount: "0,00",
    transactionCount: 5
  },
  {
    id: "4abcdef",
    name: "Salário",
    description: "Renda mensal principal",
    color: "#96CEB4",
    icon: "happy-face",
    budgetAmount: "5000,00",
    userId: "4fedcba",
    isActive: true,
    createdAt: "2025-04-21T12:00:00Z",
    updatedAt: "2025-04-21T12:00:00Z",
    spentAmount: "0,00",
    incomeAmount: "0,00",
    remainingAmount: "5000,00",
    transactionCount: 0
  },
  {
    id: "5abcdef",
    name: "Freelance",
    description: "Trabalhos extras",
    color: "#FFEAA7",
    icon: "tool",
    budgetAmount: "800,00",
    userId: "5fedcba",
    isActive: true,
    createdAt: "2025-04-21T12:00:00Z",
    updatedAt: "2025-04-21T12:00:00Z",
    spentAmount: "0,00",
    incomeAmount: "0,00",
    remainingAmount: "800,00",
    transactionCount: 0
  },
  {
    id: "6abcdef",
    name: "Entretenimento",
    description: "Cinema, jogos, lazer",
    color: "#DDA0DD",
    icon: "gift",
    budgetAmount: "200,00",
    userId: "6fedcba",
    isActive: true,
    createdAt: "2025-04-21T12:00:00Z",
    updatedAt: "2025-04-21T12:00:00Z",
    spentAmount: "120,00",
    incomeAmount: "0,00",
    remainingAmount: "80,00",
    transactionCount: 2
  }
];


export const mockTransactions = [
  {
    id: 1,
    description: "Supermercado",
    amount: 150.50,
    type: "expense",
    categoryId: 1,
    categoryName: "Alimentação",
    date: "2025-10-07",
    createdAt: "2025-10-07T10:30:00Z"
  },
  {
    id: 2,
    description: "Pagamento Freelance",
    amount: 800.00,
    type: "income",
    categoryId: 5,
    categoryName: "Freelance",
    date: "2025-10-06",
    createdAt: "2025-10-06T14:20:00Z"
  },
  {
    id: 3,
    description: "Combustível",
    amount: 80.00,
    type: "expense",
    categoryId: 2,
    categoryName: "Transporte",
    date: "2025-10-05",
    createdAt: "2025-10-05T08:15:00Z"
  },
  {
    id: 4,
    description: "Salário Outubro",
    amount: 5000.00,
    type: "income",
    categoryId: 4,
    categoryName: "Salário",
    date: "2025-10-01",
    createdAt: "2025-10-01T09:00:00Z"
  },
  {
    id: 5,
    description: "Aluguel",
    amount: 1200.00,
    type: "expense",
    categoryId: 3,
    categoryName: "Moradia",
    date: "2025-10-01",
    createdAt: "2025-10-01T10:00:00Z"
  },
  {
    id: 6,
    description: "Cinema",
    amount: 30.00,
    type: "expense",
    categoryId: 6,
    categoryName: "Entretenimento",
    date: "2025-10-03",
    createdAt: "2025-10-03T19:30:00Z"
  },
  {
    id: 7,
    description: "Restaurante",
    amount: 85.00,
    type: "expense",
    categoryId: 1,
    categoryName: "Alimentação",
    date: "2025-10-04",
    createdAt: "2025-10-04T20:00:00Z"
  },
  {
    id: 8,
    description: "Uber",
    amount: 25.50,
    type: "expense",
    categoryId: 2,
    categoryName: "Transporte",
    date: "2025-10-06",
    createdAt: "2025-10-06T22:45:00Z"
  }
];

export const mockUser = {
  id: 1,
  name: "Ryan Carvalho",
  email: "joao@example.com",
  createdAt: "2025-01-15T10:00:00Z"
};

export const simulateDelay = (ms = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

let nextId = 1000;
export const generateId = () => ++nextId;