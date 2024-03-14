const {
  GOOGLE_SITE_VERIFICATION,
  MICROSOFT_SITE_VERIFICATION,
  EMAIL_ADDRESS,
  RESUME,
  WP_SITE_URL,
} = require('../../env')

const GRAPHQL_URL = `${WP_SITE_URL}/graphql`
const Axios = require('axios')
const { setupCache } = require('axios-cache-interceptor')

const axios = Axios.defaults.cache ? Axios : setupCache(Axios)

async function requestInformation() {
  let siteInfo = []

  const headers = {
    'content-type': 'application/json',
    Accept: 'application/json',
  }

  const graphqlQuery = {
    operationName: 'requestInformation',
    query: `query requestInformation {
      page(idType: DATABASE_ID, id: 439) {
        title
        content,
        seo {
          metaDesc,
          title
        },
        socialMediaInformation {
          socialMedia {
            social {
              name,
              url
            }
          }
        }
      }
    }`,
  }

  const response = await axios({
    url: GRAPHQL_URL,
    method: 'POST',
    headers: headers,
    data: graphqlQuery,
  }).catch(function (error) {
    console.log(error.toJSON())
  })

  siteInfo = siteInfo.concat(response.data.data.page)

  const siteInfoFormatted = siteInfo.map((item) => {
    return {
      title: item.seo.title,
      description: item.seo.metaDesc,
      google_site_verification: GOOGLE_SITE_VERIFICATION,
      microsoft_site_verification: MICROSOFT_SITE_VERIFICATION,
      resume: RESUME,
      email_address: EMAIL_ADDRESS,
      url: 'https://www.rotsenacob.com',
    }
  })

  return siteInfoFormatted
}

module.exports = requestInformation
