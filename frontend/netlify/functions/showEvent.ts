// import template from './template.ts'
// import template from '../../dist/index.html'
import db from '../../src/utils/database/db.ts'
import { builder } from '@netlify/functions'

const handler = async (event, context) => {
  const [, id] = event.path.split('/event/')

  console.log('id', id)

  try {
    const result = await db.query('SELECT * FROM events WHERE id = $1', [id])

    console.log(result)

    if (result.rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Event not found' }),
      }
    }

    const event = result.rows[0]

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
      },
      body: ``,
    }
  } catch (error) {
    console.error(error)
  }
}

module.exports = { handler: builder(handler) }
