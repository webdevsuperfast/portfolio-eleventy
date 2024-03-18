export async function onRequestPost(context) {
  const ip = context.request.headers.get('CF-Connecting-IP')
  const formData = await context.request.formData()

  const name = formData.get('name')
  const email = formData.get('email')
  const service = formData.get('service')
  const website = formData.get('website')
  const message = formData.get('message')
  const token = formData.get('cf-turnstile-response')

  try {
    const tokenValidated = await validateToken(
      ip,
      token,
      context.env.TURNSTILE_SECRET
    )

    if (!tokenValidated) {
      return new Response('Token validation failed', { status: 403 })
    }

    await forwardMessage(
      name,
      email,
      service,
      website,
      message,
      context.env.WP_SITE_URL
    )

    return new Response('Ok', { status: 200 })
  } catch (e) {
    console.log(e)
    return new Response('Error sending message.', { status: 500 })
  }
}

async function validateToken(ip, token, TURNSTILE_SECRET) {
  const formData = new FormData()
  formData.append('secret', TURNSTILE_SECRET)
  formData.append('response', token)
  formData.append('remoteip', ip)

  const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

  const response = await fetch(url, {
    body: formData,
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error('Failed to validate token')
  }

  const data = await response.json()
  return data.success
}

async function forwardMessage(
  name,
  email,
  service,
  website,
  message,
  WP_SITE_URL
) {
  const formData = new FormData()
  formData.append('form-name', 'contact')
  formData.append('fname', name)
  formData.append('fmail', email)
  formData.append('fservice', service)
  formData.append('fwebsite', website)
  formData.append('fmessage', message)

  const url = `${WP_SITE_URL}/wp-json/contact-form-7/v1/contact-forms/3/feedback`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: new URLSearchParams(formData).toString(),
  })

  if (!response.ok) {
    throw new Error('Failed to forward message')
  }
}
