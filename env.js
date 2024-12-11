import dotenv from 'dotenv'
dotenv.config()

export default {
  WP_SITE_URL: process.env.WP_SITE_URL,
  GOOGLE_SITE_VERIFICATION: process.env.GOOGLE_SITE_VERIFICATION,
  MICROSOFT_SITE_VERIFICATION: process.env.MICROSOFT_SITE_VERIFICATION,
  EMAIL_ADDRESS: process.env.EMAIL_ADDRESS,
  RESUME: process.env.RESUME,
  SITE_URL: process.env.SITE_URL,
  TURNSTILE_SITE: process.env.TURNSTILE_SITE,
  TURNSTILE_SECRET: process.env.TURNSTILE_SECRET,
}
