export default (number: number) => {
  const formatter = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(number);
};
