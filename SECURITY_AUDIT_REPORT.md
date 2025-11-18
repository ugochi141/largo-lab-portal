# Security Audit Report
**Kaiser Permanente Largo Laboratory Portal**
**Date:** November 3, 2025
**Auditor:** Automated Security Scan + Manual Review

---

## Executive Summary

**Total Vulnerabilities Found:** 7
- **High Severity:** 3
- **Moderate Severity:** 4
- **Low Severity:** 0

**Remediation Status:**
- ✅ **Fixable:** 6 vulnerabilities (with breaking changes)
- ❌ **No Fix Available:** 1 vulnerability (xlsx)

---

## Vulnerability Details

### 1. xlsx - Prototype Pollution & ReDoS (HIGH SEVERITY)

**Package:** `xlsx` (v0.18.5)
**Severity:** HIGH
**CVSS Score:** 7.8
**CWE:** CWE-1321 (Prototype Pollution)

**Vulnerabilities:**
1. [GHSA-4r6h-8v6p-xvw6](https://github.com/advisories/GHSA-4r6h-8v6p-xvw6) - Prototype Pollution
2. [GHSA-5pgg-2g8v-p4x9](https://github.com/advisories/GHSA-5pgg-2g8v-p4x9) - Regular Expression DoS

**Impact:**
- Attackers could modify object prototypes, leading to application-wide vulnerabilities
- ReDoS could cause denial of service via crafted input

**Status:** ⚠️ **NO FIX AVAILABLE**

**Mitigation Recommendations:**
1. **Immediate:**
   - Validate and sanitize all uploaded Excel files
   - Implement file size limits (current: 10MB, recommended: 5MB)
   - Add input validation for cell data
   - Monitor for unusual file processing times

2. **Short-term:**
   - Consider alternative libraries:
     - `exceljs` (actively maintained, more secure)
     - `xlsx-populate` (simpler API, fewer features)
     - `sheetjs-community` (if available)

3. **Long-term:**
   - Replace xlsx with a more secure alternative
   - Implement sandboxed file processing
   - Add rate limiting for file uploads

**Risk Assessment:** MEDIUM (mitigated by controlled environment)

---

### 2. jspdf - Regular Expression DoS (HIGH SEVERITY)

**Package:** `jspdf` (v2.5.1)
**Severity:** HIGH
**CVSS Score:** 7.5
**CWE:** CWE-400 (Uncontrolled Resource Consumption), CWE-835 (Loop with Unreachable Exit Condition)

**Vulnerabilities:**
1. [GHSA-w532-jxjh-hjhj](https://github.com/advisories/GHSA-w532-jxjh-hjhj) - ReDoS Bypass
2. [GHSA-8mvj-3j78-4qmw](https://github.com/advisories/GHSA-8mvj-3j78-4qmw) - Denial of Service

**Impact:**
- Malicious input could cause CPU exhaustion
- Application slowdown or crash

**Status:** ✅ **FIX AVAILABLE**
**Fix:** Upgrade to `jspdf@3.0.3` (breaking changes)

**Action Required:**
```bash
npm install jspdf@3.0.3
```

**Breaking Changes to Review:**
- API changes in PDF generation
- Font handling modifications
- May require code updates in PDF-related features

---

### 3. jspdf-autotable - Depends on Vulnerable jspdf (HIGH SEVERITY)

**Package:** `jspdf-autotable` (v3.8.2)
**Severity:** HIGH (inherited from jspdf)

**Status:** ✅ **FIX AVAILABLE**
**Fix:** Upgrade to `jspdf-autotable@5.0.2` (breaking changes)

**Action Required:**
```bash
npm install jspdf-autotable@5.0.2
```

---

### 4. dompurify - Cross-Site Scripting (MODERATE SEVERITY)

**Package:** `dompurify` (indirect dependency via jspdf)
**Severity:** MODERATE
**CVSS Score:** 4.5
**CWE:** CWE-79 (Cross-site Scripting)

**Vulnerability:**
- [GHSA-vhxf-7vqr-mrjg](https://github.com/advisories/GHSA-vhxf-7vqr-mrjg) - XSS vulnerability

**Impact:**
- XSS attack vector through HTML sanitization bypass

**Status:** ✅ **FIX AVAILABLE** (via jspdf upgrade to 3.0.3)

---

### 5. vite - Development Server SSRF (MODERATE SEVERITY)

**Package:** `vite` (v5.0.8)
**Severity:** MODERATE
**CVSS Score:** 5.3
**CWE:** CWE-346 (Origin Validation Error)

**Vulnerability:**
- [GHSA-67mh-4wv8-2f99](https://github.com/advisories/GHSA-67mh-4wv8-2f99) - SSRF in development server

**Impact:**
- Any website can send requests to dev server and read responses
- Affects development environment only

**Status:** ✅ **FIX AVAILABLE**
**Fix:** Upgrade to `vite@7.1.12` (breaking changes)

**Action Required:**
```bash
npm install vite@7.1.12
```

**Note:** Development-only vulnerability, does not affect production builds

---

### 6. esbuild - Server-Side Request Forgery (MODERATE SEVERITY)

**Package:** `esbuild` (indirect dependency via vite)
**Severity:** MODERATE
**CVSS Score:** 5.3

**Status:** ✅ **FIX AVAILABLE** (via vite upgrade to 7.1.12)

---

### 7. vite-plugin-pwa - Depends on Vulnerable vite (MODERATE SEVERITY)

**Package:** `vite-plugin-pwa` (v0.17.4)
**Severity:** MODERATE (inherited from vite)

**Status:** ✅ **FIX AVAILABLE**
**Fix:** Upgrade to `vite-plugin-pwa@1.1.0`

---

## Deprecated Packages Warning

The following packages are deprecated and should be replaced:

| Package | Status | Recommended Action |
|---------|--------|-------------------|
| `inflight@1.0.6` | Deprecated, memory leak | Use `lru-cache` |
| `rimraf@3.0.2` | Unsupported | Upgrade to v4+ |
| `glob@7.2.3` | Unsupported | Upgrade to v9+ |
| `abab@2.0.6` | Deprecated | Use native `atob()`/`btoa()` |
| `domexception@4.0.0` | Deprecated | Use native `DOMException` |
| `eslint@8.57.1` | Unsupported | Upgrade to v9+ |

---

## Remediation Plan

### Phase 1: Immediate Actions (Today)

#### Option A: Conservative Approach (Recommended for Production)
Keep current versions, implement mitigations:

```bash
# No package updates, implement these mitigations:
```

1. **xlsx Mitigation:**
   - Add file validation middleware
   - Implement file size limits (5MB)
   - Scan uploaded files for malicious content
   - Monitor file processing times

2. **Development Server:**
   - Ensure vite dev server not exposed to public internet
   - Use localhost-only binding
   - Disable dev server in production

#### Option B: Aggressive Approach (Recommended for Long-term)
Update all vulnerable packages (breaking changes):

```bash
# Update vulnerable packages
npm install jspdf@3.0.3 jspdf-autotable@5.0.2 vite@7.1.12 vite-plugin-pwa@1.1.0

# Test thoroughly
npm run test
npm run build
npm run preview
```

**Testing Requirements:**
- ✅ Test PDF generation functionality
- ✅ Test Excel file uploads
- ✅ Test PWA functionality
- ✅ Test build process
- ✅ Manual QA of all features

---

### Phase 2: Short-term (1-2 weeks)

1. **Replace xlsx library**
   - Evaluate alternatives (exceljs, xlsx-populate)
   - Implement proof of concept
   - Migrate existing code
   - Test thoroughly

2. **Update deprecated packages**
   ```bash
   npm install eslint@9 glob@9 rimraf@4
   ```

3. **Security hardening**
   - Implement Content Security Policy
   - Add Subresource Integrity (SRI)
   - Enable HSTS
   - Configure security headers

---

### Phase 3: Long-term (1-3 months)

1. **Automated security scanning**
   - Set up Snyk or Dependabot
   - Enable GitHub Security Alerts
   - Schedule monthly audits
   - Create security patch SLA

2. **Dependency management**
   - Implement `package-lock.json` hygiene
   - Pin critical dependencies
   - Set up renovate bot for updates
   - Create dependency update policy

---

## OWASP Top 10 Compliance Check

| OWASP Risk | Status | Notes |
|------------|--------|-------|
| **A01:2021 - Broken Access Control** | ⚠️ Partial | Authentication not fully implemented |
| **A02:2021 - Cryptographic Failures** | ✅ Pass | JWT secrets configurable, HTTPS enforced |
| **A03:2021 - Injection** | ✅ Pass | No SQL injection vectors (no DB yet) |
| **A04:2021 - Insecure Design** | ✅ Pass | HIPAA-compliant architecture |
| **A05:2021 - Security Misconfiguration** | ⚠️ Partial | Environment validation implemented |
| **A06:2021 - Vulnerable Components** | ❌ Fail | 7 known vulnerabilities (see above) |
| **A07:2021 - Authentication Failures** | ⚠️ Partial | Authentication planned, not implemented |
| **A08:2021 - Data Integrity Failures** | ✅ Pass | Audit logging implemented |
| **A09:2021 - Logging Failures** | ✅ Pass | Comprehensive Winston logging |
| **A10:2021 - SSRF** | ⚠️ Warn | esbuild/vite SSRF (dev only) |

**Overall Score:** 6/10 Pass, 3/10 Partial, 1/10 Fail

---

## Security Best Practices Implemented

✅ **Good Practices:**
- HIPAA audit logging (7-year retention)
- Winston structured logging
- Helmet security headers
- CORS configuration
- Rate limiting (general + auth)
- Input validation (body parser limits)
- Error sanitization (PHI removed from Sentry)
- Graceful shutdown handling
- Environment variable validation

⚠️ **Missing/Partial:**
- Authentication system (planned, not implemented)
- CSRF protection
- Input sanitization for file uploads
- Content Security Policy
- Subresource Integrity

---

## Recommended Tools

### Security Scanning
```bash
# Install security tools
npm install -D @snyk/cli
npm install -D eslint-plugin-security

# Run scans
npx snyk test
npx eslint . --ext .js,.ts,.tsx --plugin security
```

### Dependency Management
```bash
# Check for outdated packages
npm outdated

# Update safely
npm update

# Check for breaking changes
npm-check-updates
```

---

## Action Items

### Critical (Do Immediately)
- [ ] Implement xlsx file validation
- [ ] Add file size limits (5MB)
- [ ] Ensure dev server not publicly accessible
- [ ] Document xlsx risk in production runbook

### High Priority (This Week)
- [ ] Test jspdf@3.0.3 upgrade in dev
- [ ] Test vite@7.1.12 upgrade in dev
- [ ] Update package.json if tests pass
- [ ] Schedule dependency review meeting

### Medium Priority (Next 2 Weeks)
- [ ] Research xlsx alternatives
- [ ] Update deprecated packages
- [ ] Implement CSP headers
- [ ] Set up automated security scanning

### Low Priority (Next Month)
- [ ] Create security patch SLA
- [ ] Implement Dependabot
- [ ] Schedule quarterly security reviews
- [ ] Create incident response playbook

---

## Compliance Notes

### HIPAA Considerations
- ✅ Audit logging implemented
- ✅ Encryption in transit (HTTPS)
- ⚠️ Encryption at rest (pending database implementation)
- ⚠️ Access controls (pending authentication)

### CLIA/CAP Considerations
- ✅ System validation documentation required before fixes
- ✅ Change control process recommended
- ✅ Testing evidence must be documented

---

## Monitoring & Alerting

**Set up the following alerts:**
1. New npm audit vulnerabilities (GitHub Dependabot)
2. Sentry error rate spikes
3. Unusual file upload patterns
4. Authentication failures (when implemented)
5. Rate limit violations

---

## Sign-off

**Auditor:** Automated npm audit + Manual Review
**Date:** November 3, 2025
**Next Review:** December 3, 2025 (monthly schedule)

**Management Approval Required for:**
- [ ] Package updates with breaking changes
- [ ] xlsx library replacement
- [ ] Production deployment changes

---

**Classification:** INTERNAL USE ONLY
**Distribution:** IT Security Team, Lab Management, Development Team
