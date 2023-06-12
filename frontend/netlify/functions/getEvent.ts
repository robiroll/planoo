import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'
import { formatDate } from '../../src/utils/database/formatDate.ts'

import db from '../../src/utils/database/db.ts'
import { createCalendar } from '../../src/utils/database/createCalendar.ts'

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const id = event.queryStringParameters.id

  try {
    const result = await db.query('SELECT * FROM events WHERE id = $1', [id])

    if (result.rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Event not found' }),
      }
    }

    const event = result.rows[0]

    const beginDate = formatDate(event.start_date)
    const endDate = formatDate(event.end_date)

    const calendarOptions = {
      title: event.title,
      description: event.description,
      location: event.location,
      start: beginDate,
      end: endDate,
    }

    const calendar = await createCalendar(calendarOptions)
    const stringCalendar = calendar?.toString()

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        event,
        calendar: stringCalendar,
        downloadLink: `data:text/calendar;charset=utf-8,${encodeURIComponent(stringCalendar)}`,
      }),
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error getting event' }),
    }
  }
}
