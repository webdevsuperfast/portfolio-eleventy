const { WP_SITE_URL } = require('../../env')
const GRAPHQL_URL = `${WP_SITE_URL}/graphql`
const Axios = require('axios')
const { setupCache } = require('axios-cache-interceptor')
const axios = Axios.defaults.cache ? Axios : setupCache(Axios)

async function requestSocial() {
  let social = []

  const headers = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Accept: 'application/json',
    },
  }

  const graphqlQuery = {
    operationName: 'socialRequest',
    query: `query socialRequest {
      menu(
        id: "Social Media"
        idType: NAME
        ) {
        menuItems {
          nodes {
            id
            url
            target
            label
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            endCursor
            startCursor
          }
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

  social = social.concat(response.data.data.menu.menuItems.nodes)

  const socialFormatted = social.map((item) => {
    return {
      id: item.id,
      label: item.label,
      url: item.url,
      target: item.target,
    }
  })

  return socialFormatted
}

module.exports = requestSocial
