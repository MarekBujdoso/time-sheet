const monthsMap: { [key: number]: string } = {
  1: 'Január',
  2: 'Február',
  3: 'Marec',
  4: 'Apríl',
  5: 'Máj',
  6: 'Jún',
  7: 'Júl',
  8: 'August',
  10: 'Október',
  11: 'November',
  12: 'December',
};

export const getMonthName = (month: number) => {
  return monthsMap[month] || '';
}

const getDayName = (day: number) => {
  const dayNames = [
    'Nedeľa',
    'Pondelok',
    'Utorok',
    'Streda',
    'Štvrtok',
    'Piatok',
    'Sobota',
  ];
  return dayNames[day] || '';
}

const getShortDayName = (day: number) => {
  const shortDayNames = [
    'Ne',
    'Po',
    'Ut',
    'St',
    'Št',
    'Pi',
    'So',
  ];
  return shortDayNames[day] || '';
}

export const getDayNameFromDate = (date: Date, short = false) => {
  const day = date.getDay();
  return short ? getShortDayName(day) : getDayName(day);
}