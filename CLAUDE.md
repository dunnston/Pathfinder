# CLAUDE.md - Project Guidelines for Claude Code

## Project Overview

**Project:** Pathfinder - Financial Decision Platform  
**Tech Stack:** React 18 + TypeScript + Tailwind CSS + Vite  
**Reference:** See `DESIGN_DOCUMENT.md` for complete product specification

---

## Critical Rules

### 🚫 Never Do

1. **Never start the dev server** - Always ask the user to start it. Assume it's already running unless told otherwise.
2. **Never commit directly to `main`** - All work happens on feature branches.
3. **Never force push** - If there's a conflict, resolve it properly.
4. **Never skip the PR process** - Even for small changes.
5. **Never delete branches without asking** - User manages branch cleanup.
6. **Never modify `package.json` dependencies without discussing** - Always confirm before adding new packages.

### ✅ Always Do

1. **Always pull before starting new work** - Ensure you have the latest `main`.
2. **Always work on a feature branch** - Never commit to `main` directly.
3. **Always write meaningful commit messages** - Use conventional commit format.
4. **Always check for TypeScript errors** - Run `npm run typecheck` before committing.
5. **Always run linting** - Run `npm run lint` before committing.
6. **Always reference the DESIGN_DOCUMENT.md** - Ensure work aligns with specifications.
7. **Always check MVP_TRACKER.md first** - Review current phase and task status before starting work.
8. **Always update MVP_TRACKER.md** - Mark tasks complete and log session progress when ending work.

---

## Git Workflow

### Starting New Work

```bash
# 1. Always start by switching to main and pulling latest
git checkout main
git pull origin main

# 2. Create a feature branch with descriptive name
git checkout -b feature/[section]-[description]

# Examples:
git checkout -b feature/discovery-basic-context
git checkout -b feature/ui-question-card-component
git checkout -b fix/profile-validation-error
git checkout -b refactor/store-architecture
```

### Branch Naming Convention

| Prefix | Use Case | Example |
|--------|----------|---------|
| `feature/` | New functionality | `feature/retirement-vision-section` |
| `fix/` | Bug fixes | `fix/date-picker-validation` |
| `refactor/` | Code improvements | `refactor/profile-store` |
| `docs/` | Documentation | `docs/api-types` |
| `style/` | UI/styling changes | `style/question-card-spacing` |
| `test/` | Adding tests | `test/profile-validation` |

### Making Commits

Use conventional commit format:

```bash
# Format: type(scope): description

# Examples:
git commit -m "feat(discovery): add basic context form fields"
git commit -m "fix(validation): correct date parsing for birth year"
git commit -m "style(cards): adjust padding on question cards"
git commit -m "refactor(store): simplify profile state management"
git commit -m "docs(readme): update setup instructions"
git commit -m "test(profile): add unit tests for validation"
```

**Commit Types:**
- `feat` - New feature
- `fix` - Bug fix
- `style` - Styling/UI changes (not CSS-in-JS logic)
- `refactor` - Code restructuring without behavior change
- `docs` - Documentation only
- `test` - Adding or updating tests
- `chore` - Build process, dependencies, tooling

### Completing Work

```bash
# 1. Stage and commit your changes
git add .
git commit -m "feat(scope): description"

# 2. Push the feature branch
git push origin feature/your-branch-name

# 3. Create PR (tell user to review/merge on GitHub)
# DO NOT merge yourself - notify user that PR is ready

# 4. After user merges, they will handle branch cleanup
```

### Pull Request Process

When a feature branch is ready:

1. **Push the branch** to origin
2. **Notify the user** that a PR is ready for review
3. **Provide a summary** of changes in the PR description format:

```markdown
## Summary
Brief description of what this PR accomplishes

## Changes
- Added X component
- Modified Y store
- Fixed Z validation

## Testing
- [ ] TypeScript compiles without errors
- [ ] Linting passes
- [ ] Manually tested in browser

## Related
- References DESIGN_DOCUMENT.md Section X
- Closes #issue (if applicable)
```

4. **Wait for user** to review and merge
5. **After merge**, pull latest main before starting new work

---

## Project Structure

```
/pathfinder
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/          # Buttons, inputs, cards, etc.
│   │   ├── discovery/       # Discovery wizard components
│   │   └── layout/          # Shell, navigation, headers
│   ├── pages/               # Route-level page components
│   ├── hooks/               # Custom React hooks
│   ├── stores/              # Zustand state stores
│   ├── services/            # Business logic & utilities
│   ├── types/               # TypeScript type definitions
│   ├── data/                # Static data (questions, options)
│   └── styles/              # Global styles if needed
├── public/                  # Static assets
├── docs/                    # Additional documentation
├── DESIGN_DOCUMENT.md       # Product specification
├── CLAUDE.md                # This file
├── MVP_TRACKER.md           # MVP implementation progress tracker
└── README.md                # Project readme
```

### File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `QuestionCard.tsx` |
| Hooks | camelCase with `use` prefix | `useProfile.ts` |
| Stores | camelCase with `Store` suffix | `profileStore.ts` |
| Types | PascalCase | `ProfileTypes.ts` |
| Utilities | camelCase | `validation.ts` |
| Data files | camelCase | `retirementQuestions.ts` |

---

## Development Commands

```bash
# Install dependencies (ask user first if needed)
npm install

# Type checking - RUN BEFORE COMMITTING
npm run typecheck

# Linting - RUN BEFORE COMMITTING
npm run lint

# Format code
npm run format

# Build for production
npm run build

# Preview production build
npm run preview
```

**Note:** Do NOT run `npm run dev` - ask the user to start the dev server.

---

## Code Standards

### TypeScript

- **Strict mode enabled** - No `any` types unless absolutely necessary
- **Explicit return types** on functions
- **Interface over type** for object shapes (unless union needed)
- **Proper null handling** - Use optional chaining and nullish coalescing

```typescript
// ✅ Good
interface UserProfile {
  name: string;
  age: number;
  spouse?: SpouseInfo;
}

function getDisplayName(profile: UserProfile): string {
  return profile.spouse?.name ?? 'N/A';
}

// ❌ Bad
type UserProfile = any;

function getDisplayName(profile) {
  return profile.spouse.name;
}
```

### React Components

- **Functional components only** - No class components
- **Named exports** for components
- **Props interface** defined above component
- **Destructure props** in function signature

```typescript
// ✅ Good
interface QuestionCardProps {
  question: string;
  helpText?: string;
  children: React.ReactNode;
}

export function QuestionCard({ question, helpText, children }: QuestionCardProps) {
  return (
    <div className="rounded-lg border p-6">
      <h3 className="text-lg font-medium">{question}</h3>
      {helpText && <p className="text-sm text-gray-500">{helpText}</p>}
      {children}
    </div>
  );
}

// ❌ Bad
export default function(props) {
  return <div>{props.question}</div>;
}
```

### Tailwind CSS

- **Use Tailwind utilities** - Avoid custom CSS unless necessary
- **Extract repeated patterns** into components, not @apply
- **Follow design system** - Use colors/spacing from DESIGN_DOCUMENT.md
- **Mobile-first** - Start with mobile styles, add responsive modifiers

```tsx
// ✅ Good - Reusable component
export function PrimaryButton({ children, ...props }: ButtonProps) {
  return (
    <button 
      className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      {...props}
    >
      {children}
    </button>
  );
}

// ❌ Bad - Inline repetition everywhere
<button className="rounded-lg bg-blue-600 px-4 py-2...">Save</button>
<button className="rounded-lg bg-blue-600 px-4 py-2...">Next</button>
```

### State Management (Zustand)

- **Separate stores** by domain (profile, ui, etc.)
- **Keep stores focused** - Don't create god stores
- **Use selectors** for derived state
- **Persist critical data** to localStorage

```typescript
// ✅ Good
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProfileStore {
  profile: FinancialProfile | null;
  currentSection: DiscoverySection;
  setProfile: (profile: FinancialProfile) => void;
  updateSection: <K extends keyof FinancialProfile>(
    section: K, 
    data: Partial<FinancialProfile[K]>
  ) => void;
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      profile: null,
      currentSection: 'basic-context',
      setProfile: (profile) => set({ profile }),
      updateSection: (section, data) => 
        set((state) => ({
          profile: state.profile 
            ? { ...state.profile, [section]: { ...state.profile[section], ...data } }
            : null,
        })),
    }),
    { name: 'pathfinder-profile' }
  )
);
```

---

## Working with the Design Document

The `DESIGN_DOCUMENT.md` is the source of truth. Before implementing any feature:

1. **Read the relevant section** of the design document
2. **Use the defined types** from the Data Models section
3. **Follow the UI/UX guidelines** for component design
4. **Match the user flows** as specified
5. **Reference the question bank** in Appendix B for discovery content

### Key Sections to Reference

| Building | Reference Section |
|----------|-------------------|
| Discovery forms | MVP Specification, Data Models |
| UI components | UI/UX Guidelines |
| Type definitions | Data Models (copy TypeScript interfaces) |
| Questions/prompts | Appendix B: Question Bank |
| Profile output | Appendix A: Example Profile |

---

## Testing Checklist

Before marking any work as complete:

- [ ] TypeScript compiles without errors (`npm run typecheck`)
- [ ] Linting passes (`npm run lint`)
- [ ] Component renders without console errors
- [ ] Responsive design works (mobile, tablet, desktop)
- [ ] Keyboard navigation works
- [ ] Form validation works correctly
- [ ] Data persists correctly (if applicable)
- [ ] Matches design document specifications

---

## Communication Patterns

### When Starting Work

```
"I'll be working on [feature]. Let me pull the latest main first and create a feature branch."
```

### When Needing the Dev Server

```
"Could you start the dev server so I can verify these changes? (npm run dev)"
```

### When Ready for Review

```
"I've pushed the feature branch `feature/xyz` and it's ready for PR review. Here's a summary of changes:
- [Change 1]
- [Change 2]

Please review and merge when ready."
```

### When Blocked

```
"I need clarification on [specific thing] before proceeding. The design document says X, but [question/conflict]."
```

---

## Common Patterns

### Adding a New Discovery Section

1. Create types in `src/types/`
2. Add questions data in `src/data/`
3. Create section component in `src/components/discovery/`
4. Add route in pages
5. Update store to handle section data
6. Update progress tracking

### Adding a New Component

1. Create in appropriate `src/components/` subfolder
2. Export from index file
3. Add TypeScript interface for props
4. Include JSDoc comment for complex components
5. Test responsive behavior

### Adding a New Store

1. Create in `src/stores/`
2. Define interface for store state and actions
3. Add persistence if needed
4. Export typed hook
5. Document in store file

---

## Troubleshooting

### TypeScript Errors

- Check that all imports have proper type exports
- Ensure interfaces match actual data shapes
- Verify generic type parameters

### Tailwind Not Applying

- Check class names for typos
- Verify Tailwind config includes the file path
- Clear Vite cache: `rm -rf node_modules/.vite`

### State Not Persisting

- Check Zustand persist middleware config
- Verify localStorage is available
- Check for serialization issues with dates/functions

---

## Quick Reference

```bash
# Start new feature
git checkout main && git pull origin main
git checkout -b feature/description

# Commit work
npm run typecheck && npm run lint
git add . && git commit -m "feat(scope): description"

# Push for PR
git push origin feature/description
# Then notify user PR is ready

# After merge (user handles)
git checkout main && git pull origin main
```

---

*Last Updated: January 2026*
