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
    <div className='grid auto-rows-min gap-[4px] md:grid-cols-6 grid-cols-4 border bg-white rounded-2xl shadow-md my-[5px] py-[15px] text-sm md:text-base'>
      {isDesktop && (<span></span>)}
      <span className='justify-self-end font-semibold md:py-[6px] self-center'>Meno:</span>
      <Input 
        id="user-name"
        name="userName"
        value={userName}
        autoComplete='off'
        onChange={(e) => setUserName(e.target.value)} 
        />
      <span className='justify-self-end font-semibold md:py-[6px]'>Časový fond:</span>
      <span className='md:py-[6px] self-center'>{config.officialWorkTime.toNumber()}h</span>
      {isDesktop && (<span></span>)}
      {isDesktop && (<span></span>)}
      <span className='justify-self-end font-semibold md:py-[6px]'>Odprac.:</span>
      <span className='md:py-[6px]'>
        {worked.toNumber()}h / {workedDays.toFixed(1)}d
      </span>
      <span className='justify-self-end font-semibold md:py-[6px]'>Nadčasy:</span>
      <span className='md:py-[6px]'>0h / 0.0d</span>
      {isDesktop && (<span></span>)}
      <span className='justify-self-end font-semibold md:py-[6px]'>Dovolenka:</span>
      <span className='md:py-[6px]'>
        {vacation.toNumber()}h / {vacationDays.toFixed(1)}d
      </span>
      
      <span className='justify-self-end font-semibold md:py-[6px]'>NV:</span>
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
  );
};

export default SummaryBoard;
