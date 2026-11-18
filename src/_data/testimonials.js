import { graphqlRequest } from '../../graphql-client.js'

async function requestTestimonial() {
  let testimonials = []
  const afterCursor = ''

  const graphqlQuery = {
    operationName: 'testimonialRequest',
    query: `query testimonialRequest {
      testimonials(
        after: "${afterCursor}" 
        where: {orderby: {field: TITLE, order: ASC}}
        ) {
        nodes {
          content
          featuredImage {
            node {
              altText
              thumbnail: sourceUrl(size: PORTFOLIO_THUMBNAIL)
              featuredImage: sourceUrl
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

  try {
    const data = await graphqlRequest(graphqlQuery)
    if (data?.testimonials?.nodes) {
      testimonials = testimonials.concat(data.testimonials.nodes)
    }
  } catch (error) {
    console.error(error)
  }

  const testimonialsFormatted = testimonials.map((item) => {
    return {
      id: item.testimonialId,
      title: item.title,
      slug: item.slug,
      content: item.content,
      image:
        item.featuredImage &&
        item.featuredImage.node &&
        item.featuredImage.node.featuredImage
          ? item.featuredImage.node.featuredImage
          : null,
      imageAlt:
        item.featuredImage && item.featuredImage.node
          ? item.featuredImage.node.altText
          : null,
      location: item.testimonialDetails?.testimonialLocation,
      score: item.testimonialDetails?.testimonialScore,
    }
  })

  return testimonialsFormatted
}

export default requestTestimonial
