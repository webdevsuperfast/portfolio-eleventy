const { WP_SITE_URL } = require('../../env')
const GRAPHQL_URL = `${WP_SITE_URL}/graphql`
const Axios = require('axios')
const { setupCache } = require('axios-cache-interceptor')

const axios = Axios.defaults.cache ? Axios : setupCache(Axios)

async function requestTestimonial() {
  let testimonials = []
  const afterCursor = ''
  const itemsPerRequest = 100

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

  const response = await axios({
    url: GRAPHQL_URL,
    method: 'POST',
    headers: headers,
    data: graphqlQuery,
  }).catch(function (error) {
    console.log(error.toJSON())
  })

  testimonials = testimonials.concat(response.data.data.testimonials.nodes)

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

module.exports = requestTestimonial
