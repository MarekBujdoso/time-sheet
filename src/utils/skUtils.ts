const monthsMap: { [key: number]: string } = {
  0: 'Január',
  1: 'Február',
  2: 'Marec',
  3: 'Apríl',
  4: 'Máj',
  5: 'Jún',
  6: 'Júl',
  7: 'August',
  8: 'September',
  9: 'Október',
  10: 'November',
  11: 'December',
};

export const MAX_MONTH = 11
export const MIN_MONTH = 0

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