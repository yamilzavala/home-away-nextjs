# Testing Guide

This project uses **Vitest**, **React Testing Library**, and **MSW (Mock Service Worker)** for comprehensive testing of server components, server actions, and utility functions.

## Setup

### Dependencies
- `vitest` - Test runner
- `@testing-library/react` - React testing utilities
- `@testing-library/jest-dom` - Custom matchers
- `@testing-library/user-event` - User interaction simulation
- `msw` - API mocking

### Configuration Files

#### `vitest.config.ts`
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './setupTests.tsx',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'setupTests.tsx',
      ]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
```

#### `setupTests.tsx`
- Configures MSW server
- Sets up global test utilities
- Mocks Next.js components and navigation

## MSW Setup

### Directory Structure
```
src/
├── mocks/
│   ├── handlers.ts     # API request handlers
│   └── server.ts       # MSW server setup
└── __tests__/
    └── msw-example.test.tsx  # MSW usage examples
```

### Handlers (`src/mocks/handlers.ts`)
Contains mock data and API handlers for:
- **Profiles**: CRUD operations
- **Properties**: Search, filter, CRUD operations
- **Bookings**: CRUD operations with payment status
- **Reviews**: Rating and comment management
- **Favorites**: Add/remove favorites

### Error Handlers
Separate error handlers for testing error scenarios:
```typescript
export const profileErrorHandler = [
  http.get('/api/profile', () => {
    return HttpResponse.json(
      { message: 'Failed to fetch profile' },
      { status: 500 }
    );
  }),
];
```

## Testing Patterns

### 1. Server Actions Tests (`utils/__tests__/actions.test.ts`)

**Key Features:**
- Mock database operations using `vi.mock()`
- Test authentication flows
- Validate data transformations
- Error handling scenarios

**Example:**
```typescript
describe('fetchProperties', () => {
  test('fetches properties without filters', async () => {
    const mockProperties = [{ id: '1', name: 'Test Property' }];
    
    const { db } = await import('../db');
    vi.mocked(db.property.findMany).mockResolvedValue(mockProperties);

    const result = await fetchProperties({});
    
    expect(db.property.findMany).toHaveBeenCalledWith(expectedParams);
    expect(result).toEqual(mockProperties);
  });
});
```

### 2. Server Components Tests (`app/__tests__/page.test.tsx`)

**Key Features:**
- Mock child components
- Test prop passing
- Verify component structure
- Accessibility testing

**Example:**
```typescript
describe('HomePage', () => {
  test('renders with search parameters', async () => {
    const searchParams = { category: 'beach', search: 'luxury' };
    
    render(await HomePage(searchParams));
    
    expect(screen.getByTestId('category-prop')).toHaveTextContent('beach');
    expect(screen.getByTestId('search-prop')).toHaveTextContent('luxury');
  });
});
```

### 3. Utility Functions Tests (`utils/__tests__/format.test.ts`)

**Key Features:**
- Pure function testing
- Edge case handling
- Input validation

**Example:**
```typescript
describe('formatCurrency', () => {
  test('formats positive numbers correctly', () => {
    expect(formatCurrency(100)).toBe('$100');
    expect(formatCurrency(150.99)).toBe('$151');
  });
});
```

### 4. MSW Integration Tests (`src/__tests__/msw-example.test.tsx`)

**Key Features:**
- API mocking demonstration
- Error scenario testing
- Data manipulation during tests
- Network error simulation

**Example:**
```typescript
test('handles API errors', async () => {
  server.use(...propertyErrorHandler);
  
  // Test error handling logic
  expect(true).toBe(true);
});
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests once
```bash
npm run test:run
```

### Generate coverage report
```bash
npm test -- --coverage
```

### Watch mode
```bash
npm test -- --watch
```

## Best Practices

### 1. Test Organization
- Group related tests in `describe` blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### 2. Mocking Strategy
- Mock external dependencies at the top level
- Use `vi.clearAllMocks()` in `beforeEach`
- Mock database operations, not the database itself

### 3. Server Components
- Mock child components to isolate testing
- Test prop passing and data flow
- Verify accessibility attributes

### 4. Server Actions
- Test success and error scenarios
- Validate database interaction parameters
- Test authentication and authorization

### 5. MSW Usage
- Reset handlers between tests
- Use specific error handlers for error testing
- Modify mock data safely during tests

## File Structure

```
├── app/
│   ├── bookings/
│   │   └── __tests__/
│   │       └── page.test.tsx
│   ├── __tests__/
│   │   └── page.test.tsx
│   └── ...
├── utils/
│   ├── __tests__/
│   │   ├── actions.test.ts
│   │   └── format.test.ts
│   └── ...
├── src/
│   ├── mocks/
│   │   ├── handlers.ts
│   │   └── server.ts
│   └── __tests__/
│       └── msw-example.test.tsx
├── setupTests.tsx
├── vitest.config.ts
└── TESTING.md
```

## Common Testing Scenarios

### Testing API Calls with MSW
```typescript
test('fetches and displays data', async () => {
  // Override default handler if needed
  server.use(
    http.get('/api/properties', () => {
      return HttpResponse.json([{ id: '1', name: 'Test' }]);
    })
  );

  render(<YourComponent />);
  
  await waitFor(() => {
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

### Testing Error States
```typescript
test('displays error message', async () => {
  server.use(...errorHandler);
  
  render(<YourComponent />);
  
  await waitFor(() => {
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });
});
```

### Testing Loading States
```typescript
test('shows loading indicator', async () => {
  // Mock a slow response
  server.use(
    http.get('/api/data', async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return HttpResponse.json([]);
    })
  );

  render(<YourComponent />);
  
  expect(screen.getByTestId('loading')).toBeInTheDocument();
});
```

## Troubleshooting

### Common Issues

1. **MSW server not starting**
   - Ensure `setupFiles` is configured in `vitest.config.ts`
   - Check that `server.listen()` is called in `beforeAll`

2. **Mock not working**
   - Verify mock path matches actual import
   - Use `vi.mocked()` to access mocked functions

3. **Async test timing**
   - Use `waitFor` for async operations
   - Mock `setTimeout` if needed

4. **Database mocking**
   - Mock the entire database module
   - Use `vi.mocked()` to access mocked methods

### Debugging Tips

1. Use `console.log` in test files
2. Check mock call history with `vi.mocked().mock.calls`
3. Verify MSW handlers are registered correctly
4. Use `screen.debug()` to inspect rendered DOM

## Coverage Goals

Aim for:
- **90%+** coverage on utility functions
- **80%+** coverage on server actions
- **70%+** coverage on components
- **100%** coverage on critical business logic

Focus on testing:
- User interactions
- Data transformations
- Error handling
- Edge cases
- Authentication flows
