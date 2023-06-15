import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import tz from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(tz)

const timezone = dayjs.tz.guess()

const INPUT_FORMAT = 'YYYY-MM-DDTHH:mm'
const CALENDAR_FORMAT = 'YYYYMMDDTHHmm000Z'
const READABLE_FORMAT = 'MMMM D, YYYY h:mm A'

export const formatInputToUtc = (date) => dayjs.tz(date, timezone).utc().format(INPUT_FORMAT)

export const formatUtcToInput = (date) => dayjs.utc(date).tz(timezone).format(INPUT_FORMAT)

export const formatUtcToCalendar = (date) => dayjs.utc(date).tz(timezone).format(CALENDAR_FORMAT)

export const formatUtcToReadable = (date) => dayjs.utc(date).tz(timezone).format(READABLE_FORMAT)
