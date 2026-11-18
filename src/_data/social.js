import { graphqlRequest } from '../../graphql-client.js'

async function requestSocial() {
  let social = []

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

  try {
    const data = await graphqlRequest(graphqlQuery)
    if (data?.menu?.menuItems?.nodes) {
      social = social.concat(data.menu.menuItems.nodes)
    }
  } catch (error) {
    console.error(error)
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
