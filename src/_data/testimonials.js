const fetch = require('node-fetch');
const flatCache = require('flat-cache');
const path = require('path');

const CACHE_KEY = 'testimonials';
const CACHE_FOLDER = path.resolve('./.cache');
const CACHE_FILE = 'testimonials.json';

const GRAPHQL_URL = process.env.NODE_ENV === 'production' ? 'https://cdn.rotsenacob.com/graphql' : 'https://rotsenacob.ddev.site/graphql';

async function requestTestimonial() {
  const cache = flatCache.load(CACHE_FILE, CACHE_FOLDER);
  const cachedItems = cache.getKey(CACHE_KEY);

  if (cachedItems) {
    console.log(`Using cached ${CACHE_KEY}`);
    return cachedItems;
  }

  let afterCursor = '';
  let itemsPerRequest = 100;

  let makeNewQuery = true;

  let testimonials = [];

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
            testimonials(
              first: ${itemsPerRequest}
              after: "${afterCursor}" 
              where: {orderby: {field: TITLE, order: ASC}}
              ) {
              nodes {
                content
                featuredImage {
                  node {
                    altText
                    sourceUrl
                  }
                }
                title
                slug
                testimonialId
                testimonialDetails {
                  testimonialLocation
                  testimonialScore
                }
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

        throw new Error('Failed to fetch testimonial');
      }

      testimonialInfo = response.data.testimonials.pageInfo;

      if ( testimonialInfo.hasNextPage ) {
        makeNewQuery = true;
        afterCursor = testimonialInfo.endCursor;
      } else {
        makeNewQuery = false;
      }

      testimonials = testimonials.concat(response.data.testimonials.nodes);
    } catch ( error ) {
      throw new Error(error);
    }
  }

  for ( x = 0; x < testimonials.length; x++ ) {
    theTestimonial = testimonials[x];
  }

  const testimonialsFormatted = testimonials.map( (item) => {
    return {
      id: item.testimonialId,
      title: item.title,
      slug: item.slug,
      content: item.content,
      image: item.featuredImage.node.sourceUrl,
      imageAlt: item.featuredImage.node.altText,
      location: item.testimonialDetails.testimonialLocation,
      score: item.testimonialDetails.testimonialScore
    }
  });

  if ( testimonialsFormatted.length ) {
    cache.setKey( CACHE_KEY, testimonialsFormatted );
    cache.save( true );
  }

  return testimonialsFormatted;
}

module.exports = requestTestimonial;