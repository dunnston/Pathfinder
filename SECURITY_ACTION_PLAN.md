# Security Action Plan - Pathfinder Financial Decision Platform

**Audit Date:** January 2026
**Auditor:** Security Assessment
**Application:** Pathfinder - React 18 + TypeScript + Vite
**Data Classification:** Financial/Personal (Sensitive)

---

## Executive Summary

The Pathfinder application is a client-side financial planning tool that collects and stores sensitive personal and financial information including names, dates of birth, marital status, employment details, income sources, investment accounts, debts, and retirement planning preferences.

### Overall Security Posture: **MODERATE RISK**

The application demonstrates several security best practices:
- Strong input validation using Zod schemas
- TypeScript strict mode preventing common type-related vulnerabilities
- React's built-in XSS protection (no dangerouslySetInnerHTML usage found)
- No use of eval() or dynamic code execution

However, significant concerns exist regarding:
- **Sensitive financial data stored unencrypted in localStorage**
- **No authentication or authorization mechanisms**
- **No Content Security Policy headers configured**
- **No data retention or secure deletion policies**
- **Client-side only architecture with no secure backend**

---

## Risk Summary

| Severity | Count | Description |
|----------|-------|-------------|
| **CRITICAL** | 1 | Unencrypted sensitive data in localStorage |
| **HIGH** | 3 | Missing authentication, no CSP, prototype pollution risk |
| **MEDIUM** | 4 | Missing security headers, no rate limiting, weak ID generation, missing input sanitization |
| **LOW** | 3 | Missing HTTPS enforcement, no audit logging, email validation bypass |
| **INFO** | 4 | Best practice recommendations |

---

## Detailed Findings

### CRITICAL SEVERITY

#### C-1: Unencrypted Sensitive Financial Data in localStorage

**Location:** `src/stores/profileStore.ts`, `src/stores/clientStore.ts`, `src/stores/userStore.ts`

**Description:**
All user financial data is persisted to browser localStorage without encryption. This includes:
- Full names, dates of birth, marital status
- Social Security claiming strategies
- Income amounts and sources
- Investment account balances (even as ranges, this is sensitive)
- Debt information
- Federal employment details (agency, pay grade, years of service)
- Spouse/dependent information

**Attack Scenario:**
1. Malicious browser extension reads localStorage
2. Physical access to unlocked computer exposes all data
3. XSS vulnerability (even in third-party library) could exfiltrate data
4. Shared/public computer usage leaves data accessible
5. Browser sync features may replicate data to compromised devices

**Compliance Impact:**
- GLBA: Requires safeguards for customer financial information
- State privacy laws: Many require encryption of personal financial data
- SOC 2: Encryption at rest is a common requirement

**Remediation:**

**Immediate (Week 1):**
```typescript
// Option 1: Use Web Crypto API for encryption
// src/services/encryption.ts
const ENCRYPTION_KEY_NAME = 'pathfinder-encryption-key';

async function getOrCreateKey(): Promise<CryptoKey> {
  // Generate or retrieve key from secure storage
  // Consider deriving from user password or using WebAuthn
}

export async function encryptData(data: string): Promise<string> {
  const key = await getOrCreateKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(data);
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoded
  );
  // Return base64 encoded iv + ciphertext
}

export async function decryptData(encrypted: string): Promise<string> {
  // Decrypt and return plaintext
}
```

**Short-term (Month 1):**
- Implement encrypted storage wrapper for Zustand persist middleware
- Add session timeout to clear sensitive data
- Implement secure data clearing on logout

**Long-term:**
- Consider IndexedDB with encryption for larger datasets
- Implement server-side storage with proper authentication
- Add client-side key derivation from user password

**Priority:** P0 - Must fix before production use with real financial data

---

### HIGH SEVERITY

#### H-1: No Authentication or Authorization

**Location:** Application-wide

**Description:**
The application has no authentication mechanism. Anyone with access to the URL can:
- View all stored client data (advisor mode)
- Modify any profile data
- Export complete financial profiles
- Access advisor notes

**Attack Scenario:**
- Shared computer: Next user sees previous user's financial data
- URL sharing: Accidental sharing exposes all data
- Advisor mode: No verification that user is actually an advisor

**Compliance Impact:**
- GLBA: Requires access controls for customer financial information
- SOC 2: Access control is a trust service criterion

**Remediation:**

**Immediate:**
```typescript
// Add session-based access with timeout
// src/hooks/useSession.ts
export function useSession() {
  const [isLocked, setIsLocked] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLocked(true);
      // Clear sensitive state
    }, 15 * 60 * 1000); // 15 minutes

    return () => clearTimeout(timeout);
  }, [/* activity indicators */]);

  return { isLocked, unlock: (pin: string) => /* verify */ };
}
```

**Short-term:**
- Implement PIN/password protection for session access
- Add role-based access for advisor vs consumer modes
- Implement session timeout with automatic lock

**Long-term:**
- Integrate with OAuth 2.0/OIDC provider
- Add multi-factor authentication for advisor access
- Implement audit logging for all data access

**Priority:** P0 - Required for any multi-user or production deployment

---

#### H-2: No Content Security Policy (CSP)

**Location:** `index.html`, `vite.config.ts`

**Description:**
No Content Security Policy headers are configured. This leaves the application vulnerable to XSS attacks if any injection point is discovered.

**Attack Scenario:**
- Injected script could exfiltrate all localStorage data to attacker server
- Third-party library compromise could execute malicious code

**Remediation:**

**Immediate - Add meta tag:**
```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data:;
  font-src 'self';
  connect-src 'self';
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
">
```

**Production - Configure server headers:**
```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none';
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

**Priority:** P1 - Should be implemented before any production deployment

---

#### H-3: Potential Prototype Pollution in Object Spread Operations

**Location:** Multiple stores and form handlers

**Description:**
The application uses object spread operations (`...data`) to merge user-provided data without sanitization. While TypeScript provides some protection, runtime data could potentially include `__proto__` or `constructor` properties.

**Example vulnerable pattern:**
```typescript
// src/stores/profileStore.ts line 94-100
return {
  currentProfile: {
    ...state.currentProfile,
    [section]: {
      ...state.currentProfile[section],
      ...data,  // User-controlled data spread without sanitization
    },
  },
};
```

**Attack Scenario:**
If data validation is bypassed or a future code change introduces a path for unsanitized data:
```javascript
// Attacker provides:
{ "__proto__": { "isAdmin": true } }
```

**Remediation:**

```typescript
// src/services/sanitization.ts
export function sanitizeObject<T extends object>(obj: T): T {
  const dangerous = ['__proto__', 'constructor', 'prototype'];

  function clean(input: unknown): unknown {
    if (input === null || typeof input !== 'object') {
      return input;
    }

    if (Array.isArray(input)) {
      return input.map(clean);
    }

    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input)) {
      if (!dangerous.includes(key)) {
        result[key] = clean(value);
      }
    }
    return result;
  }

  return clean(obj) as T;
}

// Use in stores:
updateSection: (section, data) =>
  set((state) => ({
    currentProfile: {
      ...state.currentProfile,
      [section]: {
        ...state.currentProfile[section],
        ...sanitizeObject(data),
      },
    },
  })),
```

**Priority:** P1 - Defense in depth measure

---

### MEDIUM SEVERITY

#### M-1: Missing Security Headers in Development/Production

**Location:** `vite.config.ts`, deployment configuration

**Description:**
The application does not configure security headers that should be present in production.

**Missing Headers:**
- `Strict-Transport-Security` (HSTS)
- `X-Content-Type-Options`
- `X-Frame-Options`
- `Referrer-Policy`
- `Permissions-Policy`

**Remediation:**

```typescript
// vite.config.ts - for development
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  },
});
```

For production, configure these at the web server/CDN level.

**Priority:** P2

---

#### M-2: Weak ID Generation

**Location:** `src/stores/profileStore.ts:58`, `src/stores/clientStore.ts:40`

**Description:**
Profile and client IDs are generated using `Date.now()` + `Math.random()`, which is not cryptographically secure and could be predictable.

```typescript
function generateId(): string {
  return `profile_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
```

**Attack Scenario:**
- IDs could be enumerated if exposed in URLs
- Collision possible under high load

**Remediation:**

```typescript
function generateId(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}
```

**Priority:** P2

---

#### M-3: No Rate Limiting or Abuse Prevention

**Location:** Application-wide

**Description:**
No protection against rapid-fire actions that could be used for enumeration or abuse. While this is primarily a client-side app, adding basic protection is good practice.

**Remediation:**
- Implement debouncing on sensitive operations
- Add rate limiting if/when backend is added
- Consider captcha for export operations

**Priority:** P2

---

#### M-4: JSON Export Contains All Sensitive Data

**Location:** `src/pages/consumer/ProfileSummary.tsx:55-71`

**Description:**
The export function downloads all profile data as unencrypted JSON. While this is intended functionality, there's no warning about the sensitivity of the exported data.

```typescript
const handleExportJSON = () => {
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  // Downloads sensitive financial data without warning
};
```

**Remediation:**
- Add confirmation dialog warning about sensitive data
- Consider password-protecting exported files
- Add audit logging for export operations

**Priority:** P2

---

### LOW SEVERITY

#### L-1: No HTTPS Enforcement

**Location:** Application configuration

**Description:**
No enforcement of HTTPS connections. In development, HTTP is used by default.

**Remediation:**
- Configure HSTS header in production
- Redirect HTTP to HTTPS at deployment level
- Use `upgrade-insecure-requests` CSP directive

**Priority:** P3

---

#### L-2: No Audit Logging

**Location:** Application-wide

**Description:**
No logging of security-relevant events such as:
- Profile creation/modification
- Data exports
- Session starts
- Failed validation attempts

**Remediation:**
Implement a logging service for security events:

```typescript
// src/services/auditLog.ts
interface AuditEvent {
  timestamp: Date;
  action: 'create' | 'update' | 'delete' | 'export' | 'view';
  resource: string;
  details?: string;
}

export function logAuditEvent(event: AuditEvent): void {
  // Store locally and/or send to backend when available
  console.info('[AUDIT]', JSON.stringify(event));
}
```

**Priority:** P3

---

#### L-3: Email Validation Can Be Bypassed

**Location:** `src/pages/advisor/AddClient.tsx:34`

**Description:**
Email validation uses a simple regex that can be bypassed with certain edge cases. Additionally, email is optional but when provided, validation is client-side only.

**Remediation:**
- Use a more robust email validation library
- Consider server-side validation when backend is added

**Priority:** P3

---

### INFORMATIONAL

#### I-1: TypeScript Strict Mode Properly Enabled

**Location:** `tsconfig.app.json`

**Status:** GOOD - `strict: true` is enabled, providing type safety that prevents many common vulnerabilities.

---

#### I-2: No Dangerous React Patterns Detected

**Status:** GOOD - No usage of:
- `dangerouslySetInnerHTML`
- `eval()` or `new Function()`
- Direct DOM manipulation via `innerHTML`

---

#### I-3: Input Validation Framework in Place

**Location:** `src/services/validation.ts`

**Status:** GOOD - Zod schemas provide strong input validation. Recommendations:
- Add maximum length constraints to all string fields
- Consider adding regex patterns for sensitive fields

---

#### I-4: Dependencies Should Be Audited Regularly

**Location:** `package.json`

**Recommendation:**
- Run `npm audit` regularly
- Set up automated dependency scanning (Dependabot, Snyk)
- Pin dependency versions for predictable builds
- Current dependencies appear low-risk but should be monitored

---

## Recommended Implementation Timeline

### Week 1 (Critical)
- [ ] Add CSP meta tag to index.html
- [ ] Implement data sanitization for object spreads
- [ ] Add security headers to Vite config
- [ ] Create encryption service stub (can be no-op initially)

### Week 2-4 (High Priority)
- [ ] Implement localStorage encryption
- [ ] Add session management with timeout
- [ ] Add export confirmation dialog
- [ ] Replace weak ID generation

### Month 2 (Medium Priority)
- [ ] Add audit logging framework
- [ ] Implement PIN/password protection
- [ ] Add rate limiting for sensitive operations
- [ ] Comprehensive input sanitization review

### Month 3+ (Long-term)
- [ ] Design and implement backend authentication
- [ ] Server-side data storage with encryption
- [ ] Full audit logging with retention
- [ ] Penetration testing
- [ ] Security code review of new features

---

## Compliance Checklist

### GLBA (Gramm-Leach-Bliley Act)
- [ ] Written information security plan
- [ ] Employee training program
- [ ] Encryption of customer financial information - **NOT MET**
- [ ] Access controls - **NOT MET**
- [ ] Regular security assessments

### General Data Protection Best Practices
- [ ] Data encryption at rest - **NOT MET**
- [ ] Data encryption in transit - **PARTIAL** (depends on deployment)
- [ ] Access controls - **NOT MET**
- [ ] Audit logging - **NOT MET**
- [ ] Data retention policy - **NOT MET**
- [ ] Secure data deletion - **NOT MET**
- [ ] Privacy notice - **NOT MET**

---

## Sign-off

This security assessment identifies the current state of the Pathfinder application. The findings should be addressed according to the recommended timeline before the application is used with real financial data in production.

**Note:** This application should NOT be used to store actual client financial data until at minimum the CRITICAL and HIGH severity issues are addressed.

---

*Document Version: 1.0*
*Assessment Date: January 2026*
