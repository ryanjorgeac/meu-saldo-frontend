// Development configuration
export const USE_MOCK_SERVICES = false; // Set to false to use real backend

// Mock services
export { mockCategoryService } from './mockCategoryService';
export { mockTransactionService } from './mockTransactionService';
export { mockAuthService } from './mockAuthService';

// Real services
export { categoryService } from '../categoryService';
export { transactionService } from '../transactionService';
export { authService } from '../authService';