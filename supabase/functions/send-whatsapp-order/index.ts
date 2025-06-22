import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders,
      status: 200,
    })
  }

  try {
    const { phone } = await req.json()

    const WHATSAPP_PHONE_NUMBER_ID = '705071749349205'
    const WHATSAPP_ACCESS_TOKEN = 'EAAXtusKK5RoBO6kP2369TF1rZCF6JnDyKiIIPNYVaB7sJTbXunyn6CDGwXXs3ltkhnOaVEYcQdPl9aZCxZBwsytg5IXIPRo1UlZBKvyEeS80VLirKTml1knI0gghXE0LZBxNZBseytpZBfIK4U33qBB04ayZBGHHZBqH750A56HvBs0IGmMWOZBUZACZCaZCLArbGLTfGOMX6XuzLP11Fx0ZAGUFZBnEZArOBreWw15eXZBvimrZAJEvYYad1YVFTYVZAkHIgZDZD'

    const WHATSAPP_API_URL = `https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`

    // Clean phone number
    let phoneNumber = phone.replace(/\D/g, '')
    if (!phoneNumber.startsWith('91')) {
      phoneNumber = '91' + phoneNumber
    }

    const res = await fetch(WHATSAPP_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'template',
        template: {
          name: 'hello_world',
          language: {
            code: 'en_US',
          },
        },
      }),
    })

    const result = await res.json()

    if (!res.ok) {
      throw new Error(result.error?.message || 'WhatsApp API error')
    }

    return new Response(JSON.stringify({
      success: true,
      id: result.messages?.[0]?.id,
      to: phoneNumber,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: err.message,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
