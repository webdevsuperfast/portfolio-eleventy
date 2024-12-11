import config from '../../env.js'

const { WP_SITE_URL } = config
import Axios from 'axios'
import { setupCache } from 'axios-cache-interceptor'

const axios = Axios.defaults.cache ? Axios : setupCache(Axios)

async function requestSocial() {
  let social = []

  const headers = {
    'content-type': 'application/json',
    Accept: 'application/json',
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
    response.data.data.menu &&
    response.data.data.menu.menuItems
  ) {
    social = social.concat(response.data.data.menu.menuItems.nodes)
  }

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

export default requestSocial
