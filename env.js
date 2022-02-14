const dotenv = require('dotenv')
dotenv.config()

module.exports = {
  WP_SITE_URL: process.env.WP_SITE_URL,
  GOOGLE_SITE_VERIFICATION: process.env.GOOGLE_SITE_VERIFICATION,
  MICROSOFT_SITE_VERIFICATION: process.env.MICROSOFT_SITE_VERIFICATION,
}
