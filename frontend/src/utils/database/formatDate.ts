import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export const formatDate = (date: string) => {
  const baseDate = dayjs(date).utc()
  const dateArray = [baseDate.year(), baseDate.month(), baseDate.date(), baseDate.hour(), baseDate.minute()]
  return dateArray
}
