# Contributing to Kanban Board

Thank you for your interest in contributing to the Kanban Board project! This document provides guidelines for contributing.

## Getting Started

1. **Fork the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/kanban-board.git
   cd kanban-board
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment**
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your configuration
   \`\`\`

4. **Set up database**
   \`\`\`bash
   npx prisma migrate dev
   \`\`\`

5. **Run development server**
   \`\`\`bash
   npm run dev
   \`\`\`

## Development Workflow

### 1. Create a Branch

\`\`\`bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
\`\`\`

### 2. Make Changes

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

### 3. Run Tests

\`\`\`bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Type checking
npm run type-check

# Linting
npm run lint
\`\`\`

### 4. Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

\`\`\`
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting, missing semi colons, etc
refactor: code refactoring
test: adding tests
chore: maintenance tasks
\`\`\`

Examples:
\`\`\`bash
git commit -m "feat: add task filtering by priority"
git commit -m "fix: resolve drag and drop issue on mobile"
git commit -m "docs: update API documentation"
\`\`\`

### 5. Push and Create PR

\`\`\`bash
git push origin feature/your-feature-name
\`\`\`

Then create a Pull Request on GitHub.

## Code Style

### TypeScript

- Use TypeScript for all new code
- Define proper types/interfaces
- Avoid \`any\` type when possible
- Use functional components with hooks

### React Components

\`\`\`typescript
// Good
export const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
  // Component logic
  return <div>...</div>;
};

// Component with ref forwarding
export const MyComponent = React.forwardRef<HTMLDivElement, Props>(
  (props, ref) => {
    return <div ref={ref}>...</div>;
  }
);
\`\`\`

### File Naming

- Components: PascalCase (e.g., \`TaskCard.tsx\`)
- Utilities: camelCase (e.g., \`formatDate.ts\`)
- Hooks: camelCase with 'use' prefix (e.g., \`useTaskFilter.ts\`)
- Types: PascalCase (e.g., \`Task.ts\`)

### Imports

Order imports:
1. React/Next.js
2. Third-party libraries
3. Internal components
4. Internal utilities
5. Types
6. Styles

\`\`\`typescript
import React from 'react';
import { useRouter } from 'next/navigation';
import { DndContext } from '@dnd-kit/core';

import TaskCard from '@/components/tasks/TaskCard';
import { formatDate } from '@/lib/utils';
import { Task } from '@/types';

import styles from './styles.module.css';
\`\`\`

## Testing

### Unit Tests

\`\`\`typescript
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
\`\`\`

### Integration Tests

\`\`\`typescript
describe('Task Flow', () => {
  it('creates and moves a task', async () => {
    // Test implementation
  });
});
\`\`\`

## API Changes

When adding/modifying API endpoints:

1. Update the API documentation in \`API.md\`
2. Add proper error handling
3. Include request/response examples
4. Add integration tests

## Database Changes

When modifying the database schema:

1. Create a new Prisma migration
   \`\`\`bash
   npx prisma migrate dev --name description_of_change
   \`\`\`

2. Update TypeScript types if needed
3. Update seed data if applicable
4. Document the changes

## Pull Request Process

1. **PR Description**
   - Describe what changes were made
   - Reference any related issues
   - Include screenshots for UI changes
   - List breaking changes if any

2. **Checklist**
   - [ ] Code follows project style guidelines
   - [ ] Tests added/updated and passing
   - [ ] Documentation updated
   - [ ] No console errors or warnings
   - [ ] Commits follow conventional format
   - [ ] PR has a clear title and description

3. **Review Process**
   - Wait for CI/CD checks to pass
   - Address review comments
   - Request re-review after changes

## Feature Requests

To propose a new feature:

1. Check if it already exists in issues
2. Create a new issue with \`enhancement\` label
3. Describe the feature and use case
4. Discuss with maintainers before implementing

## Bug Reports

When reporting bugs:

1. Use the bug report template
2. Include reproduction steps
3. Provide error messages/screenshots
4. Mention your environment (OS, browser, etc.)

## Project Structure

\`\`\`
kanban-board/
├── app/              # Next.js app directory
│   ├── api/         # API routes
│   └── ...
├── components/      # React components
│   ├── boards/     # Board-related components
│   ├── tasks/      # Task-related components
│   ├── ui/         # Reusable UI components
│   └── dnd/        # Drag & drop components
├── lib/            # Utility functions
├── prisma/         # Database schema
├── store/          # State management
├── types/          # TypeScript types
└── __tests__/      # Test files
\`\`\`

## Deployment

Only maintainers can deploy to production. However, you can:

1. Test locally with production build:
   \`\`\`bash
   npm run build
   npm start
   \`\`\`

2. Test with Docker:
   \`\`\`bash
   docker-compose up
   \`\`\`

## Questions?

- Check the [README](README.md)
- Review [API Documentation](API.md)
- Ask in GitHub Discussions
- Contact maintainers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing! 🎉

