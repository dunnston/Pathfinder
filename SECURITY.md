# Security Guidelines - Pathfinder

This document establishes security development guidelines for the Pathfinder Financial Decision Platform. All contributors must follow these guidelines when developing features or reviewing code.

---

## Table of Contents

1. [Data Classification](#data-classification)
2. [Input Validation Rules](#input-validation-rules)
3. [Output Encoding](#output-encoding)
4. [Data Handling Best Practices](#data-handling-best-practices)
5. [Secure Coding Standards](#secure-coding-standards)
6. [Security Review Checklist](#security-review-checklist)
7. [Incident Response Guidelines](#incident-response-guidelines)
8. [Dependency Management](#dependency-management)

---

## Data Classification

### Sensitive Data Categories

The application handles the following types of sensitive data:

| Category | Examples | Handling Requirements |
|----------|----------|----------------------|
| **PII** | Names, DOB, addresses, email | Encrypt at rest, minimize collection |
| **Financial** | Income, account balances, debts | Encrypt at rest, access logging required |
| **Employment** | Employer, salary, pay grade | Encrypt at rest, need-to-know basis |
| **Health-related** | Disability status, insurance | Encrypt at rest, special protection |

### Data Retention

- User profile data: Retain only while actively needed
- Session data: Clear after 15 minutes of inactivity
- Export files: User responsibility after download
- Audit logs: Retain for compliance period (typically 7 years for financial)

---

## Input Validation Rules

### General Principles

1. **Never trust user input** - All input must be validated
2. **Validate on the client AND server** - Client validation for UX, server for security
3. **Use allowlists over blocklists** - Define what IS allowed, not what isn't
4. **Validate type, length, format, and range**

### String Inputs

```typescript
// Required: Maximum length on ALL string fields
const nameSchema = z.string()
  .min(1, 'Name is required')
  .max(100, 'Name must be 100 characters or less')
  .regex(/^[a-zA-Z\s\-']+$/, 'Name contains invalid characters');

// For free-text fields, still limit length
const notesSchema = z.string()
  .max(5000, 'Notes must be 5000 characters or less');

// Dangerous patterns to reject
const DANGEROUS_PATTERNS = [
  /<script/i,
  /javascript:/i,
  /on\w+=/i,
  /__proto__/,
  /constructor/,
];
```

### Numeric Inputs

```typescript
// Always define min/max ranges
const ageSchema = z.number()
  .int('Age must be a whole number')
  .min(18, 'Must be at least 18')
  .max(120, 'Please enter a valid age');

const currencySchema = z.number()
  .min(0, 'Amount cannot be negative')
  .max(999999999, 'Amount exceeds maximum')
  .multipleOf(0.01, 'Amount must be valid currency');
```

### Email Validation

```typescript
// Use robust email validation
const emailSchema = z.string()
  .email('Invalid email address')
  .max(254, 'Email too long')
  .toLowerCase()
  .refine(
    (email) => !email.includes('..'),
    'Invalid email format'
  );
```

### Date Validation

```typescript
// Validate date ranges make sense
const birthDateSchema = z.coerce.date()
  .refine(
    (date) => date <= new Date(),
    'Birth date cannot be in the future'
  )
  .refine(
    (date) => date.getFullYear() >= 1900,
    'Please enter a valid birth date'
  );
```

### File Upload Validation (if implemented)

```typescript
// If file uploads are added:
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['application/pdf', 'image/png', 'image/jpeg'];

function validateFile(file: File): boolean {
  if (file.size > MAX_FILE_SIZE) return false;
  if (!ALLOWED_TYPES.includes(file.type)) return false;
  // Check magic bytes, not just extension
  return true;
}
```

---

## Output Encoding

### React's Built-in Protection

React automatically escapes content rendered in JSX:

```tsx
// SAFE - React escapes this automatically
<p>{userInput}</p>
<span>{profile.name}</span>
```

### Dangerous Patterns to NEVER Use

```tsx
// NEVER use dangerouslySetInnerHTML with user data
<div dangerouslySetInnerHTML={{ __html: userInput }} /> // DANGEROUS

// NEVER use eval or Function constructor
eval(userInput); // DANGEROUS
new Function(userInput)(); // DANGEROUS

// NEVER set innerHTML directly
element.innerHTML = userInput; // DANGEROUS
```

### URL Handling

```typescript
// Validate URLs before using
function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    // Only allow https
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

// When creating links from user data
<a href={isValidUrl(userUrl) ? userUrl : '#'}>Link</a>
```

### JSON Output

```typescript
// When exporting data, sanitize before stringifying
function safeJsonExport(data: unknown): string {
  return JSON.stringify(data, (key, value) => {
    // Remove any functions or dangerous keys
    if (typeof value === 'function') return undefined;
    if (key.startsWith('_')) return undefined;
    return value;
  }, 2);
}
```

---

## Data Handling Best Practices

### localStorage Security

```typescript
// Current: Data stored unencrypted (TO BE FIXED)
localStorage.setItem('key', JSON.stringify(data));

// Target: Encrypt sensitive data before storage
import { encryptData, decryptData } from '@/services/encryption';

async function secureStore(key: string, data: unknown): Promise<void> {
  const encrypted = await encryptData(JSON.stringify(data));
  localStorage.setItem(key, encrypted);
}

async function secureRetrieve<T>(key: string): Promise<T | null> {
  const encrypted = localStorage.getItem(key);
  if (!encrypted) return null;
  const decrypted = await decryptData(encrypted);
  return JSON.parse(decrypted) as T;
}
```

### State Management Security

```typescript
// Sanitize data before storing in state
import { sanitizeObject } from '@/services/sanitization';

updateSection: (section, data) =>
  set((state) => ({
    currentProfile: {
      ...state.currentProfile,
      [section]: sanitizeObject({
        ...state.currentProfile?.[section],
        ...data,
      }),
    },
  })),
```

### Clearing Sensitive Data

```typescript
// Clear sensitive data on logout/timeout
function clearSensitiveData(): void {
  // Clear all Pathfinder localStorage keys
  const keysToRemove = [
    'pathfinder-profile',
    'pathfinder-clients',
    'pathfinder-user',
  ];

  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });

  // Force garbage collection of sensitive objects
  // Reset all Zustand stores to initial state
}
```

### Data Export Security

```typescript
// Warn users before exporting sensitive data
async function handleExport(): Promise<void> {
  const confirmed = await showConfirmDialog({
    title: 'Export Financial Data',
    message: 'This will download your complete financial profile. ' +
             'The file will contain sensitive information including income, ' +
             'account balances, and personal details. ' +
             'Store this file securely and do not share it.',
    confirmText: 'I Understand - Export',
    cancelText: 'Cancel',
  });

  if (confirmed) {
    // Log the export event
    auditLog('export', 'profile', currentProfile.id);
    // Proceed with export
  }
}
```

---

## Secure Coding Standards

### TypeScript Requirements

```typescript
// REQUIRED: Enable strict mode in tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noImplicitReturns": true
  }
}

// REQUIRED: Explicit types for function parameters and returns
function calculateAge(birthDate: Date): number {
  // ...
}

// AVOID: any type
function processData(data: any) { } // BAD
function processData(data: unknown) { } // BETTER - requires type narrowing
```

### Object Spread Safety

```typescript
// ALWAYS sanitize before spreading user data
const DANGEROUS_KEYS = ['__proto__', 'constructor', 'prototype'];

function sanitizeObject<T extends object>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;

  const result = {} as T;
  for (const [key, value] of Object.entries(obj)) {
    if (!DANGEROUS_KEYS.includes(key)) {
      result[key as keyof T] = typeof value === 'object'
        ? sanitizeObject(value)
        : value;
    }
  }
  return result;
}

// Use in all stores and handlers:
const safeData = sanitizeObject(userProvidedData);
setState({ ...state, ...safeData });
```

### ID Generation

```typescript
// Use cryptographically secure random IDs
function generateSecureId(prefix: string = ''): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  const hex = Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
  return prefix ? `${prefix}_${hex}` : hex;
}

// Replace weak implementations:
// BAD: `${Date.now()}_${Math.random().toString(36)}`
// GOOD: generateSecureId('profile')
```

### Error Handling

```typescript
// Never expose internal errors to users
try {
  await saveProfile(data);
} catch (error) {
  // Log full error internally
  console.error('Profile save failed:', error);

  // Show generic message to user
  showError('Unable to save profile. Please try again.');

  // Never: showError(error.message) - may leak sensitive info
}
```

### Logging Security

```typescript
// Never log sensitive data
// BAD:
console.log('Saving profile:', profile); // Logs financial data!

// GOOD:
console.log('Saving profile:', profile.id);

// Use structured logging for audit trail
function auditLog(action: string, resource: string, id: string): void {
  const entry = {
    timestamp: new Date().toISOString(),
    action,
    resource,
    resourceId: id,
    // Never include the actual data
  };
  // Store/send audit log
}
```

---

## Security Review Checklist

Use this checklist when reviewing code changes:

### Input Handling
- [ ] All user inputs are validated with Zod schemas
- [ ] String inputs have maximum length limits
- [ ] Numeric inputs have min/max ranges
- [ ] Date inputs are validated for reasonable ranges
- [ ] No raw user input is used in URLs or file paths

### Data Security
- [ ] Sensitive data is not logged to console
- [ ] Object spreads use sanitized data
- [ ] No use of `dangerouslySetInnerHTML`
- [ ] No use of `eval()` or `new Function()`
- [ ] No direct DOM manipulation with user data

### State Management
- [ ] Zustand stores sanitize input before storing
- [ ] Sensitive state is cleared on logout/timeout
- [ ] localStorage data handling follows security guidelines

### React Components
- [ ] No dangerous patterns in JSX
- [ ] Event handlers don't expose sensitive data
- [ ] Props are properly typed (no `any`)
- [ ] Error boundaries catch and safely handle errors

### Type Safety
- [ ] TypeScript strict mode passes
- [ ] No `any` types without explicit justification
- [ ] Proper null/undefined handling
- [ ] Explicit return types on functions

### Dependencies
- [ ] No new dependencies without security review
- [ ] `npm audit` shows no high/critical vulnerabilities
- [ ] Dependencies are pinned to specific versions

---

## Incident Response Guidelines

### Severity Levels

| Level | Description | Response Time | Examples |
|-------|-------------|---------------|----------|
| **P0** | Data breach, active exploit | Immediate | Unauthorized data access, XSS exploit |
| **P1** | High risk vulnerability | < 24 hours | Auth bypass, injection flaw |
| **P2** | Medium risk | < 1 week | Missing validation, info disclosure |
| **P3** | Low risk | < 1 month | Best practice violations |

### Response Procedure

1. **Identify and Contain**
   - Document the issue with evidence
   - Determine scope of impact
   - If active exploit: take application offline if necessary

2. **Assess Impact**
   - What data may have been exposed?
   - How many users affected?
   - Is there evidence of exploitation?

3. **Remediate**
   - Develop and test fix
   - Deploy through normal PR process (expedited for P0/P1)
   - Verify fix is effective

4. **Communicate**
   - P0: Immediate notification to stakeholders
   - Document in incident log
   - User notification if data was exposed

5. **Post-Mortem**
   - Root cause analysis
   - Timeline of events
   - Lessons learned
   - Preventive measures

### Reporting Security Issues

If you discover a security vulnerability:

1. **Do NOT** create a public GitHub issue
2. **Do NOT** discuss in public channels
3. **DO** contact the security team directly
4. **DO** provide detailed reproduction steps
5. **DO** allow reasonable time for fix before disclosure

---

## Dependency Management

### Adding New Dependencies

Before adding any new package:

1. **Security Check**
   - Check npm audit status
   - Review recent issues/PRs for security concerns
   - Check package maintenance activity
   - Review dependencies of the package

2. **Necessity Check**
   - Can this be implemented without a dependency?
   - Is the package well-maintained?
   - What's the package size impact?

3. **Documentation**
   - Document why the package was added
   - Note any security considerations

### Regular Maintenance

```bash
# Run weekly
npm audit

# Run monthly
npm outdated
npm update

# Review and update as needed
npm audit fix
```

### Lockfile

- **Always commit** `package-lock.json`
- **Never delete** lockfile to "fix" issues
- **Review** lockfile changes in PRs

---

## Security Headers Reference

When deploying to production, ensure these headers are configured:

```
# Prevent MIME type sniffing
X-Content-Type-Options: nosniff

# Prevent clickjacking
X-Frame-Options: DENY

# Enable XSS filter
X-XSS-Protection: 1; mode=block

# Control referrer information
Referrer-Policy: strict-origin-when-cross-origin

# Force HTTPS
Strict-Transport-Security: max-age=31536000; includeSubDomains

# Content Security Policy
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none';

# Control browser features
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

---

## Quick Reference Card

### Safe Patterns

```typescript
// Input validation
z.string().min(1).max(100)
z.number().int().min(0).max(1000)

// Rendering user data
<p>{userData}</p>  // React escapes

// ID generation
crypto.getRandomValues(new Uint8Array(16))

// Object updates
setState({ ...state, ...sanitizeObject(data) })
```

### Dangerous Patterns - NEVER USE

```typescript
// Direct HTML insertion
dangerouslySetInnerHTML={{ __html: userInput }}
element.innerHTML = userInput

// Dynamic code execution
eval(userInput)
new Function(userInput)

// Unsanitized object spread
{ ...userProvidedObject }

// Logging sensitive data
console.log(financialProfile)
```

---

*Last Updated: January 2026*
*Version: 1.0*
