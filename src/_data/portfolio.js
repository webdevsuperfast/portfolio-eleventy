import config from '../../env.js'

const { WP_SITE_URL } = config
import axios from 'axios'
import { setupCache } from 'axios-cache-interceptor'

const axiosInstance = axios.defaults.cache ? axios : setupCache(axios)

async function requestPortfolio() {
  const afterCursor = ''
  const itemsPerRequest = 50
  const portfolios = []

  const headers = {
    'content-type': 'application/json',
    Accept: 'application/json',
  }

  const graphqlQuery = {
    operationName: 'portfolioRequest',
    query: `query portfolioRequest {
      allPortfolio(
        first: ${itemsPerRequest}
        after: "${afterCursor}"
        where: {orderby: {field: TITLE, order: ASC}}
        ) {
        nodes {
          portfolioCategories {
            nodes {
              slug
              name
            }
          }
          clientInformation {
            clientName
            clientWebsite
          }
          featuredImage {
            node {
              altText
              thumbnail: sourceUrl(size: PORTFOLIO_THUMBNAIL)
              featuredImage: sourceUrl
            }
          }
          id
          content
          title
          slug
          portfolioId
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
    const response = await axiosInstance({
      url: `${WP_SITE_URL}/graphql`,
      method: 'POST',
      headers: headers,
      data: graphqlQuery,
    })

    const portfolioNodes = response.data.data.allPortfolio.nodes

    for (const item of portfolioNodes) {
      const thumbnail =
        item.featuredImage &&
        item.featuredImage.node &&
        item.featuredImage.node.thumbnail
          ? item.featuredImage.node.thumbnail
          : null

      const categories = item.portfolioCategories.nodes
        .map((category) => category.slug)
        .join(' ')
      const categoriesData = item.portfolioCategories.nodes
        .map((category) => category.slug)
        .join(',')

      portfolios.push({
        id: item.portfolioId,
        title: item.title,
        slug: item.slug,
        content: item.content,
        thumbnail: thumbnail,
        featuredImage:
          item.featuredImage &&
          item.featuredImage.node &&
          item.featuredImage.node.featuredImage
            ? item.featuredImage.node.featuredImage
            : null,
        imageAlt:
          item.featuredImage &&
          item.featuredImage.node &&
          item.featuredImage.node.altText
            ? item.featuredImage.node.altText
            : null,
        category: categories,
        clientName: item.clientInformation.clientName,
        clientWebsite: item.clientInformation.clientWebsite,
        dataGroups: categoriesData,
      })
    }

    return portfolios
  } catch (error) {
    console.error(error)
    return [] // Return empty array in case of error
  }
}

export default requestPortfolio
