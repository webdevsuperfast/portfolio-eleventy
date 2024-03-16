const { WP_SITE_URL } = require('../../env')
const GRAPHQL_URL = `${WP_SITE_URL}/graphql`
const Axios = require('axios')
const { setupCache } = require('axios-cache-interceptor')

const axiosInstance = Axios.defaults.cache ? Axios : setupCache(Axios)

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
      url: GRAPHQL_URL,
      method: 'POST',
      headers: headers,
      data: graphqlQuery,
    })

    const portfolioNodes = response.data.data.allPortfolio.nodes

    for (const item of portfolioNodes) {
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
        thumbnail: item.featuredImage.node.thumbnail,
        featuredImage: item.featuredImage.node.featuredImage,
        imageAlt: item.featuredImage.node.altText,
        category: categories,
        clientName: item.clientInformation.clientName,
        clientWebsite: item.clientInformation.clientWebsite,
        dataGroups: categoriesData,
      })
    }

    return portfolios
  } catch (error) {
    console.error(error.toJSON())
    return [] // Return empty array in case of error
  }
}

module.exports = requestPortfolio
