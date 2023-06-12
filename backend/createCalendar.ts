const ics = require('ics')

export const createCalendar = async (event) => ics.createEvent(event, (error, value) => {
  if (error) {
    console.error(error);
    return;
  }
  
  return value;
})
