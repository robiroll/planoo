import db from "../../backend/db.ts";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers
    }
  }

  const body = JSON.parse(event.body);
  const { id, title, description, startDate, endDate, location } = body;

  if(!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, message: 'Missing id' }),
      headers,
    };
  }

  if(!title || !description || !startDate || !endDate || !location) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, message: 'Missing required fields' }),
      headers,
    };
  }

  try {
    await db.query(
      "UPDATE events SET title = $1, description = $2, start_date = $3, end_date = $4, location = $5 WHERE id = $6",
      [title, description, startDate, endDate, location, id]
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
      headers,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Internal server error' }),
      headers,
    };
  }
}

export { handler };