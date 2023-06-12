import db from '../../src/utils/database/db.ts'

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
    }
  }

  const body = JSON.parse(event.body)
  const { id, name } = body

  if (!id || !name) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, message: 'Missing required fields' }),
      headers,
    }
  }

  try {
    await db.query('UPDATE events SET guests = array_append(guests, $1) WHERE id = $2', [name, id])

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Guest added successfully' }),
      headers,
    }
  } catch (error) {
    console.log('ERROR', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false }),
      headers,
    }
  }
}
