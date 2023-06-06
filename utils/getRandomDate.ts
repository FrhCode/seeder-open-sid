export default function getRandomDate(startDate: Date, endDate: Date) {
  const startMillis = startDate.getTime();
  const endMillis = endDate.getTime();
  const randomMillis = startMillis + Math.random() * (endMillis - startMillis);
  const randomDate = new Date(randomMillis);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  const [month, date, year] = new Intl.DateTimeFormat("en-US", options)
    .format(randomDate)
    .split("/");

  return [date, month, year].join("-");
}
