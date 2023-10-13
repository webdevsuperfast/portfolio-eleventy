const { WP_SITE_URL } = require('../../env')

const GRAPHQL_URL = `${WP_SITE_URL}/graphql`

const Axios = require('axios')
const { setupCache } = require('axios-cache-interceptor')

const axios = Axios.defaults.cache ? Axios : setupCache(Axios)

async function requestCategory() {
  let afterCursor = ''
  let itemsPerRequest = 100
  let categories = []

  const headers = {
    'content-type': 'application/json',
    Accept: 'application/json',
  }

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

  const response = await axios({
    url: GRAPHQL_URL,
    method: 'post',
    headers: headers,
    data: graphqlQuery,
  })

  if (response.errors) {
    let errors = response.errors

    errors.map((error) => {
      console.log(error.message)
    })

    throw new Error(`Error fetching {$GRAPHQL_URL}`)
  }

  categories = categories.concat(response.data.data.portfolioCategories.nodes)

  const categoriesFormatted = categories.map((item) => {
    return {
      id: item.portfolioCategoryId,
      name: item.name,
      slug: item.slug,
      filter: `.${item.slug}`,
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

module.exports = requestCategory
