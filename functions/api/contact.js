export async function onRequestPost(context) {
  const ip = context.request.headers.get('CF-Connecting-IP')
  try {
    const formData = await context.request.formData()
    // const { token, ip } = formData // Destructuring for concise variable access
    const token = formData.get('cf-turnstile-response')

    const tokenValidated = await validateToken(
      ip,
      token,
      context.env.TURNSTILE_SECRET
    )

    if (!tokenValidated) {
      return new Response('Token validation failed.', { status: 403 })
    }

    await submitHandler(formData, context.env)

    return new Response('Ok', { status: 200 })
  } catch (e) {
    console.error(e)
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

async function submitHandler(formData, env) {
  const { name, email, website, services, message } =
    Object.fromEntries(formData)

  const formData2 = new URLSearchParams()

  formData2.append('fname', name)
  formData2.append('fmail', email)
  formData2.append('fwebsite', website)
  formData2.append('fservice', services)
  formData2.append('fmessage', message)
  formData2.append('_wpcf7_unit_tag', '1d3501d')

  try {
    const response = await fetch(
      `${env.WP_SITE_URL}/wp-json/contact-form-7/v1/contact-forms/3/feedback`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        body: formData.toString(), // Convert URLSearchParams to string
      }
    )

    if (!response.ok) {
      throw new Error('Failed to submit form data to Contact Form 7')
    }
  } catch (e) {
    console.error(e)
    // Handle submission error
  }
}
