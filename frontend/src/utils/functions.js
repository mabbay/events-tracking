exports.dateToString = (date) => {
  if (!date instanceof Date)
    throw new Error("dateToString expects a Date object");
  const year = date.getFullYear();
  // month starts from 0
  let month = date.getMonth() + 1; if (month < 10) month = '0' + month;
  let day = date.getDate(); if (day < 10) day = '0' + day;
  return `${year}-${month}-${day}`;
};
exports.formatHour = (number) => {
  if (!number instanceof Number) throw new Error("formatHour expects a Number object");
  if (number < 10) number = '0' + number;
  return number + 'h';
};