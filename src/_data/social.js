const fetch = require('node-fetch');
const flatCache = require('flat-cache');
const path = require('path');

const CACHE_KEY = 'social';
const CACHE_FOLDER = path.resolve('./.cache');
const CACHE_FILE = 'social.json';

const GRAPHQL_URL = process.env.NODE_ENV === 'production' ? 'https://cdn.rotsenacob.com/graphql' : 'https://rotsenacob.ddev.site/graphql';

async function requestSocial() {
  const cache = flatCache.load(CACHE_FILE, CACHE_FOLDER);
  const cachedItems = cache.getKey(CACHE_KEY);

  if (cachedItems) {
    console.log(`Using cached ${CACHE_KEY}`);
    return cachedItems;
  }

  let afterCursor = '';
  let itemsPerRequest = 100;

  let makeNewQuery = true;

  let social = [];

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

      socialInfo = response.data.menu.menuItems.pageInfo;

      if ( socialInfo.hasNextPage ) {
        makeNewQuery = true;
        afterCursor = socialInfo.endCursor;
      } else {
        makeNewQuery = false;
      }

      social = social.concat(response.data.menu.menuItems.nodes);
    } catch ( error ) {
      throw new Error(error);
    }
  }

  for ( x = 0; x < social.length; x++ ) {
    theSocial = social[x];
  }

  const socialFormatted = social.map( (item) => {
    return {
      id: item.id,
      label: item.label,
      url: item.url,
      target: item.target
    }
  });

  if ( socialFormatted.length ) {
    cache.setKey( CACHE_KEY, socialFormatted );
    cache.save( true );
  }

  return socialFormatted;
}

module.exports = requestSocial;