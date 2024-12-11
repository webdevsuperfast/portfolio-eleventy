// import { WP_SITE_URL } from '../../env.js'
import config from '../../env.js'

const { WP_SITE_URL } = config

import Axios from 'axios'
import { setupCache } from 'axios-cache-interceptor'

const axios = Axios.defaults.cache ? Axios : setupCache(Axios)

const requestCategory = async () => {
  let afterCursor = ''
  let itemsPerRequest = 10
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
    url: `${WP_SITE_URL}/graphql`,
    method: 'post',
    headers: headers,
    data: graphqlQuery,
  }).catch(function (error) {
    console.log(error.toJSON())
  })

  if (
    response &&
    response.data &&
    response.data.data &&
    response.data.data.portfolioCategories
  ) {
    categories = categories.concat(response.data.data.portfolioCategories.nodes)
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
