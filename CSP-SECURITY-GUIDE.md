# Content Security Policy (CSP) Security Guide

## Overview
This document explains the Content Security Policy (CSP) implementation for the Largo Laboratory Portal GitHub Pages site. CSP helps prevent XSS attacks, clickjacking, and other code injection attacks by restricting the sources of content that can be loaded on the page.

## Current CSP Configuration

### Standard Configuration (Most HTML Files)
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self';
  connect-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
">
```

### Index.html Configuration (React App)
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
">
```

## CSP Directives Explained

### `default-src 'self'`
- **Purpose**: Fallback for all resource types
- **Value**: Only allow resources from the same origin
- **Security**: High - prevents loading resources from external domains

### `script-src 'self' 'unsafe-inline'`
- **Purpose**: Control where JavaScript can be loaded from
- **Why 'unsafe-inline'**: GitHub Pages static site with inline scripts that cannot easily be externalized
- **Security Impact**: Medium - allows inline scripts but still blocks external scripts
- **Mitigation**: All inline scripts reviewed for safety; no eval() or Function() usage

### `style-src 'self' 'unsafe-inline'`
- **Purpose**: Control where CSS can be loaded from
- **Why 'unsafe-inline'**: 879 inline style attributes throughout HTML files
- **Security Impact**: Low - inline styles are generally safe
- **Future Goal**: Move critical inline styles to external CSS files

### `img-src 'self' data: https:`
- **Purpose**: Control where images can be loaded from
- **Why 'data:'**: Supports data URI images (base64 encoded images)
- **Why 'https:'**: Allows loading images from secure external sources
- **Security**: Medium - prevents mixed content attacks

### `font-src 'self' [https://fonts.gstatic.com]`
- **Purpose**: Control where fonts can be loaded from
- **Security**: High - restricts font sources

### `connect-src 'self' [https:]`
- **Purpose**: Control where scripts can make network requests (fetch, XMLHttpRequest, WebSocket)
- **Security**: High for 'self', Medium for 'https:' - allows HTTPS API calls

### `object-src 'none'`
- **Purpose**: Disallow plugins (Flash, Java, etc.)
- **Security**: Very High - prevents dangerous plugin content

### `base-uri 'self'`
- **Purpose**: Restrict URLs that can be used in `<base>` element
- **Security**: High - prevents base tag hijacking

### `form-action 'self' [mailto:]`
- **Purpose**: Restrict where forms can submit
- **Why 'mailto:'**: Some forms send emails directly
- **Security**: High - prevents form hijacking

### `frame-ancestors 'none'`
- **Purpose**: Prevent clickjacking by disallowing page embedding
- **Security**: Very High - prevents clickjacking attacks

### `upgrade-insecure-requests`
- **Purpose**: Automatically upgrade HTTP requests to HTTPS
- **Security**: High - prevents mixed content warnings

## Security Improvements Made

### 1. Removed Inline Event Handlers
**Before:**
```html
<button onclick="switchTab('daily', this)">Daily</button>
```

**After:**
```html
<button class="tab-button" data-tab="daily">Daily</button>

<script>
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', function() {
        const tabName = this.getAttribute('data-tab');
        // ... tab switching logic
    });
});
</script>
```

**Benefit**: Separates behavior from markup, easier to audit and maintain

### 2. Added CSP Meta Tags
- All major HTML files now have appropriate CSP meta tags
- Different configurations for different use cases (static vs React)

### 3. Avoided Dangerous JavaScript Patterns
- No `eval()` usage in codebase
- No `Function()` constructor usage
- `setTimeout()` and `setInterval()` use function references, not strings
- No dangerous string-to-code conversions

## Known Limitations

### 1. 'unsafe-inline' for Scripts
**Issue**: We still allow inline scripts with `'unsafe-inline'` directive

**Reason**: 
- GitHub Pages is a static hosting service (no server-side processing)
- Cannot generate nonces or hashes dynamically
- Many inline scripts throughout the codebase

**Mitigation**:
- All inline scripts manually reviewed
- No user input processed in inline scripts
- No dangerous patterns (eval, Function constructor)

**Future Improvement**: Move to external JavaScript files where feasible

### 2. 'unsafe-inline' for Styles
**Issue**: 879 inline style attributes throughout HTML

**Reason**:
- Extensive use of inline styles for component-specific styling
- Moving all to CSS would be a major refactor

**Security Impact**: Very low - inline styles rarely pose security risks

**Future Improvement**: Extract commonly used inline styles to CSS classes

### 3. HTTPS Sources for Images
**Issue**: `img-src` allows any HTTPS source

**Reason**:
- Laboratory may need to load equipment images from various secure sources
- Vendor documentation and diagrams

**Mitigation**: Only trusted HTTPS sources should be used in practice

## Browser Extension Compatibility

### Issue
Strict CSP can block browser extensions from functioning properly.

### Solution
Our CSP is configured to be reasonably secure while not blocking common browser extensions:
- We allow `'unsafe-inline'` which most extensions require
- We don't use strict `script-src` hashes that would block extension scripts
- We allow HTTPS connections for extension communication

### Extensions That Should Work
- Password managers (LastPass, 1Password, Dashlane)
- Ad blockers (uBlock Origin, AdBlock)
- Accessibility tools
- Developer tools

## Testing CSP

### Browser Console
Open browser DevTools Console to see CSP violations:
```
Content Security Policy: The page's settings blocked the loading of a resource at ...
```

### CSP Evaluator
Use Google's CSP Evaluator to analyze your policy:
https://csp-evaluator.withgoogle.com/

### CSP Reporter (Future Enhancement)
Consider adding `report-uri` directive to collect CSP violation reports:
```html
report-uri https://your-reporting-endpoint.com/csp-violations
```

## Best Practices Followed

### ✅ Do's
1. **Use 'self' as default**: Restrict to same-origin by default
2. **Be specific**: Use specific directives rather than wildcards
3. **Disable dangerous features**: `object-src 'none'` blocks plugins
4. **Use HTTPS**: `upgrade-insecure-requests` upgrades HTTP to HTTPS
5. **Review inline code**: All inline scripts audited for safety
6. **Document limitations**: This guide documents known issues

### ❌ Don'ts
1. **Don't use 'unsafe-eval'**: Never allow eval() or Function() constructor
2. **Don't use wildcards**: Avoid `*` in directives (we don't)
3. **Don't skip CSP**: Every public HTML file should have CSP
4. **Don't ignore violations**: Check console for CSP errors regularly

## GitHub Pages Specific Considerations

### No Server-Side CSP Headers
- GitHub Pages doesn't allow custom HTTP headers
- Must use `<meta>` tags for CSP
- Cannot use nonces (require server-side generation)
- Cannot use dynamic CSP policies

### Static Site Advantages
- No server-side code injection risks
- No database injection risks
- Simpler security model
- Easier to audit

### Static Site Limitations
- Cannot generate per-request nonces
- Cannot use strict CSP without 'unsafe-inline'
- Must be more permissive than server-rendered sites

## Future Security Improvements

### Short Term (Next 3-6 months)
1. Extract inline scripts to external `.js` files where feasible
2. Add CSP to remaining HTML files (107 total files)
3. Create template HTML files with proper CSP for new pages
4. Document CSP requirements in developer guide

### Medium Term (6-12 months)
1. Implement CSP reporting endpoint
2. Move more inline styles to CSS classes
3. Generate CSP hash values for remaining inline scripts
4. Add CSP testing to CI/CD pipeline

### Long Term (12+ months)
1. Consider migrating to a framework that supports strict CSP
2. Implement subresource integrity (SRI) for external resources
3. Add automated CSP testing in development workflow
4. Regular security audits of CSP configuration

## Incident Response

### If CSP Violation Occurs
1. **Check browser console** for violation details
2. **Identify the blocked resource** (URL, type)
3. **Verify legitimacy** of the resource
4. **Update CSP** if resource is legitimate and necessary
5. **Document the change** in this guide

### If Attack Detected
1. **Review CSP logs** for violation patterns
2. **Check for compromised files** in repository
3. **Rotate credentials** if breach suspected
4. **Update CSP** to prevent similar attacks
5. **Notify team** and stakeholders

## Resources

### CSP Documentation
- [MDN Web Docs - CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Google CSP Guide](https://developers.google.com/web/fundamentals/security/csp)
- [CSP Quick Reference](https://content-security-policy.com/)

### Security Tools
- [Google CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [Mozilla Observatory](https://observatory.mozilla.org/)
- [Security Headers Checker](https://securityheaders.com/)

### Related Security Topics
- [OWASP XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [GitHub Pages Security](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)
- [HIPAA Compliance Guidelines](https://www.hhs.gov/hipaa/index.html)

## Questions?

For questions about CSP configuration or security concerns, contact:
- **Security Team**: [security team contact]
- **DevOps Team**: [devops team contact]
- **Documentation**: See `CLAUDE.md` for code patterns and standards

---
**Last Updated**: November 2024  
**Document Owner**: Largo Laboratory DevOps Team  
**Next Review**: February 2025
