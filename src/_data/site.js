import config from '../../env.js'

const {
  WP_SITE_URL,
  GOOGLE_SITE_VERIFICATION,
  MICROSOFT_SITE_VERIFICATION,
  EMAIL_ADDRESS,
  RESUME,
  SITE_URL,
  TURNSTILE_SITE,
  TURNSTILE_SECRET,
} = config

import Axios from 'axios'
import { setupCache } from 'axios-cache-interceptor'

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
      nodeByUri(uri: "/") {
        __typename
        ... on ContentType {
          id
          name
          description
        }
        ... on Page {
          id
          title
          content
          seo {
            metaDesc
            title
          }
        }
      }
    }`,
  }

  const response = await axios({
    url: `${WP_SITE_URL}/graphql`,
    method: 'POST',
    headers: headers,
    data: graphqlQuery,
  }).catch(function (error) {
    console.log(error.toJSON())
  })

  if (response?.data?.data?.nodeByUri) {
    siteInfo = siteInfo.concat(response.data.data.nodeByUri)
  }

  const siteInfoFormatted = {
    title: siteInfo[0]?.seo?.title,
    description: siteInfo[0]?.seo?.metaDesc,
    pageTitle: siteInfo[0]?.title,
    pageContent: siteInfo[0]?.content,
    google_site_verification: GOOGLE_SITE_VERIFICATION,
    microsoft_site_verification: MICROSOFT_SITE_VERIFICATION,
    resume: RESUME,
    email_address: EMAIL_ADDRESS,
    url: SITE_URL,
    turnstile_site_key: TURNSTILE_SITE,
  }

  return siteInfoFormatted
}

export default requestInformation
