import Decimal from "decimal.js"
import { InterruptionTimeProps, WorkDayFull } from "../../app/sheet/types"
import { differenceInMinutes } from "date-fns/differenceInMinutes"

export const calculateWorked = (workedHours: Decimal, interruptions: InterruptionTimeProps[] = [], compensatoryLeave: Decimal) => {
  const interruptionsTime = interruptions.reduce((acc, { time }) => acc.add(time), new Decimal(0))
  const lunchTime = new Decimal(workedHours.minus(interruptionsTime).greaterThanOrEqualTo(6) ? 0.5 : 0)
  // const maxWorkTime = Math.min(workedHours, (dailyWorkTime.toNumber() * 60 + 30))
  console.log(workedHours.toNumber(), lunchTime.toNumber(), interruptionsTime.toNumber())
  return {dayWorked: workedHours.minus(interruptionsTime).minus(lunchTime).plus(compensatoryLeave),lunch: lunchTime.greaterThan(0)}
}

const calculateOfficialWork = (workedHours: Decimal, interruptions: InterruptionTimeProps[] = [], vacation: Decimal) => {
  const interruptionsTime = interruptions.reduce((acc, { time }) => acc.add(time), new Decimal(0))
  return workedHours.minus(interruptionsTime).minus(vacation)
}

export const recalculateWorkDay = (workDay: WorkDayFull, officialWorkTime: Decimal) => {
  const workedTime = new Decimal(differenceInMinutes(workDay.endTime, workDay.startTime)).dividedBy(60)
  const {dayWorked, lunch } = calculateWorked(workedTime, workDay.interruptions, workDay.compensatoryLeave)
  const officialWork = calculateOfficialWork(officialWorkTime, workDay.interruptions, workDay.vacation)
  const worked = officialWork.minus(dayWorked)
  const workFromHome = worked.greaterThan(0) ? worked : new Decimal(0)
  return {
    ...workDay,
    lunch,
    dayWorked,
    workFromHome
  }
}

