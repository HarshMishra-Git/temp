
// Environment variables handling
export const env = {
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',
  PORT: process.env.PORT || '3000',
  NODE_ENV: process.env.NODE_ENV || 'development'
};
