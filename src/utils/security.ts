import DOMPurify from 'dompurify'

/**
 * Sanitizes input string against XSS injection vulnerabilities.
 * Strips script tags, event handlers, and dangerous HTML entities.
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return ''
  
  // First run DOMPurify with strict text-only config
  const purified = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // Strip all HTML tags
    ALLOWED_ATTR: [],
  })

  // Remove any lingering script patterns or suspicious tags
  return purified
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .trim()
}
