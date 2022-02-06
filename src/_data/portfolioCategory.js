const fetch = require('node-fetch');
const axios = require('axios');
const flatCache = require('flat-cache');
const path = require('path');
const { data } = require('autoprefixer');

const CACHE_KEY = 'category';
const CACHE_FOLDER = path.resolve('./.cache');
const CACHE_FILE = 'category.json';

const GRAPHQL_URL = process.env.NODE_ENV === 'production' ? 'https://cdn.rotsenacob.com/graphql' : 'https://rotsenacob.ddev.site/graphql';

async function requestCategory() {
  const cache = flatCache.load(CACHE_FILE, CACHE_FOLDER);
  const cachedItems = cache.getKey(CACHE_KEY);

  if (cachedItems) {
    console.log(`Using cached ${CACHE_KEY}`);
    return cachedItems;
  }

  let afterCursor = '';
  let itemsPerRequest = 100;

  let makeNewQuery = true;

  let categories = [];

  while (makeNewQuery) {
    console.log(`Trying to fetch ${itemsPerRequest} ${CACHE_KEY}`);

    try {
      const data = await fetch( GRAPHQL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: `query {
            portfolioCategories(first: ${itemsPerRequest}, after: "${afterCursor}") {
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
          }`
        })
      } );

      const response = await data.json();

      if ( response.errors ) {
        let errors = response.errors;

        errors.map( (error) => {
          console.error(error.message);
        });

        throw new Error(`Error fetching ${CACHE_KEY}`);
      }

      categoryInfo = response.data.portfolioCategories.pageInfo;

      if ( categoryInfo.hasNextPage ) {
        makeNewQuery = true;
        afterCursor = categoryInfo.endCursor;
      } else {
        makeNewQuery = false;
      }

      categories = categories.concat(response.data.portfolioCategories.nodes);
    } catch ( error ) {
      throw new Error(error);
    }
  }

  for ( x = 0; x < categories.length; x++ ) {
    theCategory = categories[x];
  }

  const categoriesFormatted = categories.map( (item) => {
    return {
      id: item.portfolioCategoryId,
      name: item.name,
      slug: item.slug,
    }
  });

  if ( categoriesFormatted.length ) {
    cache.setKey( CACHE_KEY, categoriesFormatted );
    cache.save( true );
  }

  return categoriesFormatted;
}

module.exports = requestCategory;