# Dashboard Page Components

This directory contains modular components and hooks for the main dashboard page.

## Structure

### Components

- **DashboardHeader.tsx** - Page header with title and welcome message
- **StatsSection.tsx** - Displays course statistics (in progress, completed, hours learned)
- **SearchAndFilters.tsx** - Search bar and filter controls (type, status, sort)
- **CoursesSection.tsx** - Displays individual courses and bundles with expansion logic
- **EmptyState.tsx** - Empty state when no courses match filters

### Custom Hooks

- **useDashboardData.ts** - Fetches and processes course data from API
  - Fetches payment history
  - Calculates course progress
  - Processes individual courses and bundles
  - Returns: courses, loading state, error, and utility functions

- **useDashboardFilters.ts** - Manages filtering, sorting, and search logic
  - Handles search term, filter status, filter type, and sort order
  - Computes filtered and sorted courses
  - Calculates stats and finds most recent course
  - Returns: filter states, setters, filtered courses, stats, and most recent course

- **useBundleExpansion.ts** - Manages bundle expansion state
  - Handles showing all courses in a bundle
  - Fetches progress for bundle courses
  - Returns: expansion state and handlers

### Types

- **types.ts** - Shared TypeScript interfaces
  - `EnrolledCourse` - Main course data structure

### Exports

- **index.ts** - Barrel export for clean imports

## Usage

```tsx
import {
  DashboardHeader,
  StatsSection,
  SearchAndFilters,
  CoursesSection,
  EmptyState,
  useDashboardData,
  useDashboardFilters,
  useBundleExpansion,
} from '@/components/Dashboard/DashboardPage';
```

## Benefits of Modular Structure

1. **Separation of Concerns** - Each component has a single responsibility
2. **Reusability** - Components can be reused in other parts of the app
3. **Testability** - Easier to write unit tests for individual components
4. **Maintainability** - Changes are isolated to specific files
5. **Readability** - Main page file is much cleaner and easier to understand
6. **Custom Hooks** - Business logic is separated from UI rendering
