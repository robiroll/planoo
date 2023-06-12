import dayjs from "dayjs";

export const formatDate = (date: string) => {
  const baseDate = dayjs(date);
  const dateArray = [
    baseDate.year(),
    baseDate.month(),
    baseDate.date(),
    baseDate.hour(),
    baseDate.minute(),
  ];
  return dateArray;
};