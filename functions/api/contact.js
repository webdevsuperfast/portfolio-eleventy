export async function onRequestPost(context) {
  try {
    const ip = context.request.headers.get('CF-Connecting-IP')
    const formData = await context.request.formData()
    const userAgent = await context.request.headers.get('user-agent')
    const token = formData.get('cf-turnstile-response')

    const tokenValidated = await validateToken(
      ip,
      token,
      context.env.TURNSTILE_SECRET
    )

    if (!tokenValidated) {
      return new Response('Token validation failed.', { status: 403 })
    }

    const submission = await submitHandler(
      extractFormData(formData),
      context.env,
      userAgent
    )
    if (!submission) {
      return new Response('Error', { status: 403 })
    } else {
      return Response.redirect(context.env.SITE_URL)
    }
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

function extractFormData(formData) {
  const data = new FormData()

  data.append('fname', formData.get('name'))
  data.append('fmail', formData.get('email'))
  data.append('fwebsite', formData.get('website'))
  data.append('fservice', formData.get('services'))
  data.append('fmessage', formData.get('message'))
  data.append('_wpcf7_unit_tag', '1d3501d')

  return data
}

async function submitHandler(formData, env, userAgent) {
  try {
    const response = await fetch(
      `${env.WP_SITE_URL}/wp-json/contact-form-7/v1/contact-forms/3/feedback`,
      {
        method: 'POST',
        headers: {
          'User-Agent': userAgent,
        },
        body: formData,
      }
    )

    if (!response.ok) {
      throw new Error('Failed to submit form data to Contact Form 7')
    }

    return response
  } catch (e) {
    console.error(e)
    // Handle submission error
  }
}
