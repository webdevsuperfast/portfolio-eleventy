const flatCache = require('flat-cache')
const path = require('path')

const CACHE_KEY = 'portfolio'
const CACHE_FOLDER = path.resolve('./.cache')
const CACHE_FILE = 'portfolio.json'

const { WP_SITE_URL } = require('../../env')

const GRAPHQL_URL = `${WP_SITE_URL}/graphql`

async function requestPortfolio() {
  const cache = flatCache.load(CACHE_FILE, CACHE_FOLDER)
  const cachedItems = cache.getKey(CACHE_KEY)

  if (cachedItems) {
    console.log('Using cached portfolio')
    return cachedItems
  }

  let afterCursor = ''
  let itemsPerRequest = 100

  let makeNewQuery = true

  let portfolios = []

  while (makeNewQuery) {
    console.log(`Trying to fetch ${itemsPerRequest} portfolio`)

    try {
      const data = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: `query {
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
        }),
      })

      const response = await data.json()

      if (response.errors) {
        let errors = response.errors

        errors.map((error) => {
          console.error(error.message)
        })

        throw new Error('Failed to fetch portfolio')
      }

      portfolioInfo = response.data.allPortfolio.pageInfo

      if (portfolioInfo.hasNextPage) {
        makeNewQuery = true
        afterCursor = portfolioInfo.endCursor
      } else {
        makeNewQuery = false
      }

      portfolios = portfolios.concat(response.data.allPortfolio.nodes)
    } catch (error) {
      throw new Error(error)
    }
  }

  for (x = 0; x < portfolios.length; x++) {
    thePortfolio = portfolios[x]
  }

  const portfoliosFormatted = portfolios.map((item) => {
    const cat = []
    for (i = 0; i < item.portfolioCategories.nodes.length; i++) {
      cat[i] = item.portfolioCategories.nodes[i].slug
    }

    const categories = cat.join(' ')

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

  if (portfoliosFormatted.length) {
    cache.setKey(CACHE_KEY, portfoliosFormatted)
    cache.save(true)
  }

  return portfoliosFormatted
}

module.exports = requestPortfolio
