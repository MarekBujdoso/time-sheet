import {
  calcCompensatoryLeave,
  calcDoctorsLeave,
  calcDoctorsLeaveFamily,
  calcSickLeave,
  calcSickLeaveFamily,
  calcWorked,
  calcVacation,
} from '../../components/utils/calculations';
import React, { useContext } from 'react';
import { WorkDay } from '../../app/sheet/types';
import ConfigContext from '../../app/sheet/ConfigContext';
import { Input } from '../ui/input';
import { useMediaQuery } from 'react-responsive';

const SummaryBoard = ({
  monthData,
  setUserName,
  userName,
}: {
  monthData: WorkDay[];
  setUserName: (userName: string) => void;
  userName: string;
}) => {
  const config = useContext(ConfigContext);
  const isDesktop = useMediaQuery({ minWidth: 767 });
  const [vacation, vacationDays] = React.useMemo(
    () => calcVacation(monthData, config),
    [monthData, config],
  );
  const [sickLeave, sickLeaveDays] = React.useMemo(
    () => calcSickLeave(monthData, config),
    [monthData, config],
  );
  const [sickLeaveFamily, sickLeaveFamilyDays] = React.useMemo(
    () => calcSickLeaveFamily(monthData, config),
    [monthData, config],
  );
  const [doctorsLeave, doctorsLeaveDays] = React.useMemo(
    () => calcDoctorsLeave(monthData, config),
    [monthData, config],
  );
  const [doctorsLeaveFamily, doctorsLeaveFamilyDays] = React.useMemo(
    () => calcDoctorsLeaveFamily(monthData, config),
    [monthData, config],
  );
  const [worked, workedDays] = React.useMemo(
    () => calcWorked(monthData, config),
    [monthData, config],
  );
  const [compensatoryLeave, compensatoryLeaveDays] = React.useMemo(
    () => calcCompensatoryLeave(monthData, config),
    [monthData, config],
  );

  return (
    <div className='border bg-white rounded-2xl shadow-md my-[5px] text-sm md:text-base py-[15px]'>
      <div className='grid auto-rows-min gap-[4px] md:grid-cols-5 grid-cols-3 my-[4px]  '>
        <span className='justify-self-end font-semibold md:py-[6px] self-center'>Meno:</span>
        <Input
          className='col-span-2 w-[95%] md:w-auto'
          id='user-name'
          name='userName'
          value={userName}
          autoComplete='off'
          onChange={(e) => setUserName(e.target.value)}
        />
        <span className='justify-self-end font-semibold md:py-[6px]'>Časový fond:</span>
        <span className='md:py-[6px] self-center col-span-2 md:col-span-1'>
          {config.officialWorkTime.toNumber()}h
        </span>
        {isDesktop && (
          <>
            <span className='justify-self-end font-semibold md:py-[6px]'>{isDesktop ? 'Odpracovaný čas:' : 'Odprac.:'}</span>
            <span className='md:py-[6px]'>
              {worked.toNumber()}h / {workedDays.toFixed(1)}d
            </span>
            <span></span>
            <span className='justify-self-end font-semibold md:py-[6px]'>Nadčasy:</span>
            <span className='md:py-[6px]'>0h / 0.0d</span>
          </>
        )}
      </div>
      <div className='grid auto-rows-min gap-[4px] md:w-[calc(98vw-16px)] md:grid-cols-6 grid-cols-4'>
        {!isDesktop && (
          <>
            <span className='justify-self-end font-semibold md:py-[6px]'>Odprac.:</span>
            <span className='md:py-[6px]'>
              {worked.toNumber()}h / {workedDays.toFixed(1)}d
            </span>
            <span className='justify-self-end font-semibold md:py-[6px]'>Nadčasy:</span>
            <span className='md:py-[6px]'>0h / 0.0d</span>
          </>
        )}
        <span className='justify-self-end font-semibold md:py-[6px]'>Dovolenka:</span>
        <span className='md:py-[6px]'>
          {vacation.toNumber()}h / {vacationDays.toFixed(1)}d
        </span>

        <span className='justify-self-end font-semibold md:py-[6px]'>{isDesktop ? 'Náhradné voľno:' : 'NV:'}</span>
        <span className='md:py-[6px]'>
          {compensatoryLeave.toNumber()}h / {compensatoryLeaveDays.toFixed(1)}d
        </span>
        <span className='justify-self-end font-semibold md:py-[6px]'>P-čko:</span>
        <span className='md:py-[6px]'>
          {doctorsLeave.toNumber()}h / {doctorsLeaveDays.toFixed(1)}d
        </span>
        <span className='justify-self-end font-semibold md:py-[6px]'>Doprovod:</span>
        <span className='md:py-[6px]'>
          {doctorsLeaveFamily.toNumber()}h / {doctorsLeaveFamilyDays.toFixed(1)}d
        </span>
        <span className='justify-self-end font-semibold md:py-[6px]'>PN:</span>
        <span className='md:py-[6px]'>
          {sickLeave.toNumber()}h / {sickLeaveDays.toFixed(1)}d
        </span>
        <span className='justify-self-end font-semibold md:py-[6px]'>OČR:</span>
        <span className='md:py-[6px]'>
          {sickLeaveFamily.toNumber()}h / {sickLeaveFamilyDays.toFixed(1)}d
        </span>
      </div>
    </div>
  );
};

export default SummaryBoard;
