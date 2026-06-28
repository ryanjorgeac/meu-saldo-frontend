// Development configuration — set VITE_USE_MOCK_SERVICES=true in .env to enable mocks
export const USE_MOCK_SERVICES = import.meta.env.VITE_USE_MOCK_SERVICES === 'true';

// Mock services
export { mockCategoryService } from './mockCategoryService';
export { mockTransactionService } from './mockTransactionService';
export { mockAuthService } from './mockAuthService';
export { mockCommitmentService } from './mockCommitmentService';

// Real services
export { categoryService } from '../categoryService';
export { transactionService } from '../transactionService';
export { authService } from '../authService';
export { commitmentService } from '../commitmentService';