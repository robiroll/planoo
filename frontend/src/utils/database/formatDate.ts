export const formatDate = (dateUtc: string) => {
  const [date, time] = dateUtc.split('T')
  const [year, month, day] = date.split('-')
  const [hour, minute] = time.split(':')

  return [year, month, day, hour, minute].map((value) => parseInt(value))
}
