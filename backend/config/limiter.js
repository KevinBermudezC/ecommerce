import rateLimit from 'express-rate-limit';
// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many API requests from this IP, please try again after 15 minutes'
});

// More strict limiter for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // limit each IP to 10 login/register attempts per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many authentication attempts from this IP, please try again after an hour'
});

// Specific limiter for product creation/updates
export const productLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // limit each IP to 50 product operations per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many product operations from this IP, please try again after an hour'
});