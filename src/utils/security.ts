/**
 * Security utilities for input validation and sanitization
 */

// Sanitize HTML to prevent XSS attacks
export function sanitizeHtml(input: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  return input.replace(/[&<>"'/]/g, (char) => map[char]);
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone number (Malaysian format)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+60|0)[0-9]{9,10}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ''));
}

// Validate password strength
export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
}

export function validatePassword(password: string): PasswordValidation {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Sanitize user input for database queries (prevent SQL injection patterns)
export function sanitizeInput(input: string): string {
  // Remove SQL injection patterns
  const sqlPatterns = [
    /(\s|^)(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|FETCH|DECLARE|TRUNCATE)(\s|$)/gi,
    /(\s|^)(OR|AND)(\s+)(\d+)(\s*)(=)(\s*)(\d+)/gi,
    /--/g,
    /;/g,
    /\/\*/g,
    /\*\//g,
  ];

  let sanitized = input;
  sqlPatterns.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, '');
  });

  return sanitized.trim();
}

// Validate URL
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Check for common attack patterns in input
export function hasAttackPatterns(input: string): boolean {
  const attackPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /data:/gi,
    /vbscript:/gi,
    /expression\s*\(/gi,
  ];

  return attackPatterns.some((pattern) => pattern.test(input));
}

// Generate secure random token
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (x) => chars[x % chars.length]).join('');
}

// Rate limiting helper (client-side)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  key: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

// Session timeout helper
let sessionTimeoutId: NodeJS.Timeout | null = null;
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export function resetSessionTimeout(onTimeout: () => void): void {
  if (sessionTimeoutId) {
    clearTimeout(sessionTimeoutId);
  }
  sessionTimeoutId = setTimeout(onTimeout, SESSION_TIMEOUT);
}

export function clearSessionTimeout(): void {
  if (sessionTimeoutId) {
    clearTimeout(sessionTimeoutId);
    sessionTimeoutId = null;
  }
}

// CSRF token management
let csrfToken: string | null = null;

export function getCsrfToken(): string {
  if (!csrfToken) {
    csrfToken = generateSecureToken(32);
    sessionStorage.setItem('csrf_token', csrfToken);
  }
  return csrfToken;
}

export function validateCsrfToken(token: string): boolean {
  const storedToken = sessionStorage.getItem('csrf_token');
  return storedToken === token;
}

// Content Security Policy headers (for reference)
export const CSP_HEADERS = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self' ws: wss:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; '),
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

// Secure cookie options
export const SECURE_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict' as const,
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
};

// Input validation types
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateRequired(value: string, fieldName: string): ValidationResult {
  if (!value || value.trim() === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }
  return { isValid: true };
}

export function validateLength(
  value: string,
  fieldName: string,
  min: number,
  max: number
): ValidationResult {
  if (value.length < min) {
    return { isValid: false, error: `${fieldName} must be at least ${min} characters` };
  }
  if (value.length > max) {
    return { isValid: false, error: `${fieldName} must be no more than ${max} characters` };
  }
  return { isValid: true };
}

export function validateNumber(value: string, fieldName: string): ValidationResult {
  if (isNaN(Number(value))) {
    return { isValid: false, error: `${fieldName} must be a valid number` };
  }
  return { isValid: true };
}

export function validateRange(
  value: number,
  fieldName: string,
  min: number,
  max: number
): ValidationResult {
  if (value < min || value > max) {
    return { isValid: false, error: `${fieldName} must be between ${min} and ${max}` };
  }
  return { isValid: true };
}
