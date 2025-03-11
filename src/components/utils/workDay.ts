import { isWeekend } from "date-fns";
import Decimal from "decimal.js";
import { ConfigContextType } from "../../app/sheet/ConfigContext";
import { WorkDay } from "../../app/sheet/types";

export const isFullDay = (hours: Decimal | undefined, workTime: Decimal): boolean => {
  return hours?.equals(workTime) ?? false;
};

export const getTitle = (workDay: WorkDay, config: ConfigContextType): string => {
  const {
    startTime,
    // endTime,
    // lunch = false,
    compensatoryLeave = new Decimal(0),
    doctorsLeave = false,
    doctorsLeaveFamily = false,
    sickLeave = false,
    sickLeaveFamily = false,
    dayWorked,
    // workFromHome = new Decimal(0),
    vacation = new Decimal(0),
    holiday = false,
    // interruptions = []
  } = workDay;
  const isWeekEnd = isWeekend(startTime);
  const isFullCompensatoryLeave = isFullDay(compensatoryLeave, config.officialWorkTime);
  const isFullVacation = isFullDay(vacation, config.officialWorkTime);
  const isWorkingDay =
    !isWeekEnd &&
    !isFullCompensatoryLeave &&
    !doctorsLeave &&
    !doctorsLeaveFamily &&
    !sickLeave &&
    !sickLeaveFamily &&
    !isFullVacation &&
    !holiday &&
    dayWorked.greaterThan(0);

  if (isFullCompensatoryLeave) return 'Náhradné voľno';
  if (doctorsLeave) return 'P-čko celý deň';
  if (doctorsLeaveFamily) return 'Doprovod celý deň';
  if (sickLeave) return 'PN';
  if (sickLeaveFamily) return 'OČR';
  if (isFullVacation) return 'Dovolenka';
  if (holiday) return 'Štátny sviatok';
  if (isWeekEnd) return 'Víkend';
  if (isWorkingDay) return 'Práca';
  return '';
};