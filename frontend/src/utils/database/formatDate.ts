import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export const formatDate = (date: string, tz: string) => {
  const baseDate = dayjs(date).tz(tz)
  const dateArray = [baseDate.year(), baseDate.month(), baseDate.date(), baseDate.hour(), baseDate.minute()]
  return dateArray
}
