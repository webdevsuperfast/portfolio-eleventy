import { graphqlRequest } from '../../graphql-client.js'

const requestCategory = async () => {
  let afterCursor = ''
  let itemsPerRequest = 10
  let categories = []

  const graphqlQuery = {
    operationName: 'categoryRequest',
    query: `query categoryRequest {
      portfolioCategories(
        first: ${itemsPerRequest} 
        after: "${afterCursor}"
        where: {orderby: NAME, order: ASC, hideEmpty: true}
        ) {
        nodes {
          name
          portfolioCategoryId
          slug
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
    if (data?.portfolioCategories?.nodes) {
      categories = categories.concat(data.portfolioCategories.nodes)
    }
  } catch (error) {
    console.error(error)
  }

  const categoriesFormatted = categories.map((item) => {
    return {
      id: item.portfolioCategoryId,
      name: item.name,
      slug: item.slug,
      filter: item.slug,
    }
  })

  categoriesFormatted.unshift({
    id: 0,
    name: 'All',
    slug: 'all',
    filter: 'all',
  })

  return categoriesFormatted
}

export default requestCategory
