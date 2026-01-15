import React from 'react';
import { WorkDay } from '../../../app/sheet/types';
import { ConfigContextType } from '../../../app/sheet/ConfigContext';
import {
  calcDoctorsLeave,
  calcDoctorsLeaveFamily,
  calcSickLeave,
  calcSickLeaveFamily,
  calcWorked,
  calcVacation,
  calcCompensatoryLeave,
  calcWorkFreeDay,
  calcWorkFromHome,
  calcMonthWorkTime,
} from '../../utils/calculations';

const useMonthSummary = (monthData: WorkDay[], config: ConfigContextType) =>
  React.useMemo(() => {
    const [vacation, vacationDays] = calcVacation(monthData, config);
    const [sickLeave, sickLeaveDays] = calcSickLeave(monthData, config);
    const [sickLeaveFamily, sickLeaveFamilyDays] = calcSickLeaveFamily(monthData, config);
    const [doctorsLeave, doctorsLeaveDays] = calcDoctorsLeave(monthData, config);
    const [doctorsLeaveFamily, doctorsLeaveFamilyDays] = calcDoctorsLeaveFamily(
      monthData,
      config,
    );
    const [compensatoryLeave, compensatoryLeaveDays] = calcCompensatoryLeave(
      monthData,
      config,
    );
    const [workFreeDay, workFreeDayDays] = calcWorkFreeDay(monthData, config);
    const [workFromHome, workFromHomeDays] = calcWorkFromHome(monthData, config);
    const [workTimeInMonth, workTimeInMonthDays] = calcMonthWorkTime(monthData, config);
    const [wrk, wrkDays] = calcWorked(monthData, config);
    const worked = wrk.plus(compensatoryLeave).plus(workFreeDay).plus(workFromHome);
    const workedDays = wrkDays
      .plus(compensatoryLeaveDays)
      .plus(workFreeDayDays)
      .plus(workFromHomeDays);

    return {
      vacation,
      vacationDays,
      sickLeave,
      sickLeaveDays,
      sickLeaveFamily,
      sickLeaveFamilyDays,
      doctorsLeave,
      doctorsLeaveDays,
      doctorsLeaveFamily,
      doctorsLeaveFamilyDays,
      workTimeInMonth,
      workTimeInMonthDays,
      worked,
      workedDays,
    };
  }, [monthData, config]);

export default useMonthSummary;
