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