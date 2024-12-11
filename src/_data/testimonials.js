import config from '../../env.js'

const { WP_SITE_URL } = config
import axios from 'axios'
import { setupCache } from 'axios-cache-interceptor'

const cachedAxios = axios.defaults.cache ? axios : setupCache(axios)

async function requestTestimonial() {
  let testimonials = []
  const afterCursor = ''
  const itemsPerRequest = 20

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }

  const graphqlQuery = {
    operationName: 'testimonialRequest',
    query: `query testimonialRequest {
      testimonials(
        first: ${itemsPerRequest}
        after: "${afterCursor}" 
        where: {orderby: {field: TITLE, order: ASC}}
        ) {
        nodes {
          content
          featuredImage {
            node {
              altText
              sourceUrl
            }
          }
          title
          slug
          testimonialId
          testimonialDetails {
            testimonialLocation
            testimonialScore
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          endCursor
          startCursor
        }
      }
    }`,
  }

  const response = await cachedAxios({
    url: `${WP_SITE_URL}/graphql`,
    method: 'POST',
    headers: headers,
    data: graphqlQuery,
  }).catch(function (error) {
    console.log(error.toJSON())
  })

  if (response?.data?.data?.testimonials?.nodes) {
    testimonials = testimonials.concat(response.data.data.testimonials.nodes)
  }

  const testimonialsFormatted = testimonials.map((item) => {
    return {
      id: item.testimonialId,
      title: item.title,
      slug: item.slug,
      content: item.content,
      image: item.featuredImage.node.sourceUrl,
      imageAlt: item.featuredImage.node.altText,
      location: item.testimonialDetails.testimonialLocation,
      score: item.testimonialDetails.testimonialScore,
    }
  })

  return testimonialsFormatted
}

export default requestTestimonial
