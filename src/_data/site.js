import config from '../../env.js'

const {
  GOOGLE_SITE_VERIFICATION,
  MICROSOFT_SITE_VERIFICATION,
  EMAIL_ADDRESS,
  RESUME,
  SITE_URL,
  TURNSTILE_SITE,
} = config

import { graphqlRequest } from '../../graphql-client.js'

async function requestInformation() {
  let siteInfo = []

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

  try {
    const data = await graphqlRequest(graphqlQuery)
    if (data?.nodeByUri) {
      siteInfo = siteInfo.concat(data.nodeByUri)
    }
  } catch (error) {
    console.error(error)
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
