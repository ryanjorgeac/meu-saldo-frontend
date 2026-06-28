// Service configuration - easily switch between mock and real services
import { 
  USE_MOCK_SERVICES, 
  mockCategoryService, 
  mockTransactionService, 
  mockAuthService,
  mockCommitmentService,
  categoryService as realCategoryService,
  transactionService as realTransactionService,
  authService as realAuthService,
  commitmentService as realCommitmentService,
} from './mock';

// Export the appropriate services based on configuration
export const categoryService = USE_MOCK_SERVICES ? mockCategoryService : realCategoryService;
export const transactionService = USE_MOCK_SERVICES ? mockTransactionService : realTransactionService;
export const authService = USE_MOCK_SERVICES ? mockAuthService : realAuthService;
export const commitmentService = USE_MOCK_SERVICES ? mockCommitmentService : realCommitmentService;

// Helper function to check if we're using mocks
export const isUsingMocks = () => USE_MOCK_SERVICES;
