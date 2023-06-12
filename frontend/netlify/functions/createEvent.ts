import db from '../../src/utils/database/db.ts'

const generateId = () => {
  return Math.floor(Math.random() * 900000) + 100000
}

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const id = generateId()

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
    }
  }

  const body = JSON.parse(event.body)
  const { title, description, startDate, endDate, location } = body

  try {
    await db.query(
      'INSERT INTO events (id, title, description, start_date, end_date, location) VALUES ($1, $2, $3, $4, $5, $6)',
      [id, title, description, startDate, endDate, location],
    )

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, id }),
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

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, id }),
    headers,
  }
}
