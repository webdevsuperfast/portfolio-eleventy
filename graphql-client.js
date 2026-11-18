import config from './env.js'
import Axios from 'axios'
import { setupCache } from 'axios-cache-interceptor'

const axios = Axios.defaults.cache ? Axios : setupCache(Axios)

export async function graphqlRequest(graphqlQuery) {
  if (!config.WP_SITE_URL) {
    throw new Error('WP_SITE_URL is not set')
  }

  const user = config.WP_GRAPHQL_USER
  const password = config.WP_GRAPHQL_APP_PASSWORD?.replace(/\s/g, '')

  if (Boolean(user) !== Boolean(password)) {
    throw new Error(
      'Set both WP_GRAPHQL_USER and WP_GRAPHQL_APP_PASSWORD, or neither'
    )
  }

  const headers = {
    'content-type': 'application/json',
    Accept: 'application/json',
  }

  if (user && password) {
    headers.Authorization = `Basic ${Buffer.from(`${user}:${password}`, 'utf8').toString('base64')}`
  }

  const response = await axios({
    url: `${config.WP_SITE_URL}/graphql`,
    method: 'POST',
    headers,
    data: graphqlQuery,
    timeout: 10000,
  })

  const { data, errors } = response.data ?? {}

  if (errors?.length || !data) {
    const detail = errors?.length
      ? errors.map((error) => error.message).join('; ')
      : 'response contained no data'
    throw new Error(`GraphQL request failed: ${detail}`)
  }

  return data
}
