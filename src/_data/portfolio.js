const { WP_SITE_URL } = require('../../env')

const GRAPHQL_URL = `${WP_SITE_URL}/graphql`

const Axios = require('axios')
const { setupCache } = require('axios-cache-interceptor')

const axios = Axios.defaults.cache ? Axios : setupCache(Axios)

async function requestPortfolio() {
  let afterCursor = ''
  let itemsPerRequest = 100
  let portfolios = []

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

  const response = await axios({
    url: GRAPHQL_URL,
    method: 'POST',
    headers: headers,
    data: graphqlQuery,
  }).catch(function (error) {
    console.log(error.toJSON())
  })

  portfolios = portfolios.concat(response.data.data.allPortfolio.nodes)

  const portfoliosFormatted = portfolios.map((item) => {
    let categories = []
    for (i = 0; i < item.portfolioCategories.nodes.length; i++) {
      categories[i] = item.portfolioCategories.nodes[i].slug
    }

    categories = categories.join(' ')

    return {
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
    }
  })

  return portfoliosFormatted
}

module.exports = requestPortfolio
