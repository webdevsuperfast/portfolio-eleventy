import { graphqlRequest } from '../../graphql-client.js'

async function requestPortfolio() {
  const portfolios = []
  const itemsPerRequest = 50
  const afterCursor = ''

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
          databaseId
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
    const portfolioNodes = data?.allPortfolio?.nodes ?? []

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
