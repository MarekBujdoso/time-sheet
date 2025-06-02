import { format } from 'date-fns';
import { isWeekend } from 'date-fns/fp/isWeekend';
import Decimal from 'decimal.js';
import { Cross, Soup, TreePalm, UserRoundPlus } from 'lucide-react';
import { useContext } from 'react';
import ConfigContext from '../../app/sheet/ConfigContext';
import { InterruptionWithTimeType, type WorkDay } from '../../app/sheet/types';
import { Button } from '../ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../ui/drawer';
import { getTitle, isFullDay } from '../utils/workDay';
import WorkDayForm from './WorkDayForm';
import { DAY_TYPES_KEYS, getIconByDayType } from '../../app/sheet/dayTypes';
import { getDayNameFromDate } from '../../utils/skUtils';

// const calcPercentage = (part: Decimal, whole: Decimal): string => {
//   console.log(part, whole);
//   const perc = part.div(whole).times(100).toNumber().toFixed(0);
//   console.log(perc);
//   return '50';
// }

const getBaseColor = (workDay: WorkDay, officialWorkTime: Decimal) => {
  const {
    compensatoryLeave,
    doctorsLeave,
    doctorsLeaveFamily,
    sickLeave,
    sickLeaveFamily,
    vacation,
    holiday,
    dayWorked,
  } = workDay;
  if (doctorsLeave) return 'bg-rose-200';
  if (doctorsLeaveFamily) return 'bg-rose-200';
  if (sickLeave) return 'bg-rose-200';
  if (sickLeaveFamily) return 'bg-rose-200';
  if (holiday) return 'bg-emerald-100';
  if (compensatoryLeave?.greaterThan(0)) return 'bg-blue-200';
  if (vacation?.equals(officialWorkTime)) return 'bg-emerald-100';
  if (dayWorked.equals(officialWorkTime)) return 'bg-blue-200';
  if (isWeekend(workDay.startTime)) return 'bg-emerald-100';
  if (dayWorked.greaterThan(0)) {
    // if (compensatoryLeave?.greaterThan(0)) return 'bg-gradient-to-r from-blue-200 to-rose-200';
    if (vacation?.greaterThan(0)) return `bg-gradient-to-r from-blue-200 to-emerald-100`;
    if (
      workDay.interruptions?.some(
        (interruption) =>
          interruption.type === InterruptionWithTimeType.DOCTORS_LEAVE ||
          interruption.type === InterruptionWithTimeType.DOCTORS_LEAVE_FAMILY,
      )
    )
      return `bg-gradient-to-r from-blue-200  to-rose-200`;
    // return `bg-gradient-to-r from-blue-200 from-${calcPercentage(dayWorked, officialWorkTime)}% to-rose-200 to-100%`;
  }
  return 'bg-white';
};

interface WorkDayBoxDesktopProps {
  workDay: WorkDay;
  saveWorkDay: (workDay: WorkDay) => void;
}

const WorkDayBoxDesktop = ({ workDay, saveWorkDay }: WorkDayBoxDesktopProps) => {
  const {
    startTime,
    endTime,
    lunch = false,
    compensatoryLeave = new Decimal(0),
    doctorsLeave = false,
    doctorsLeaveFamily = false,
    sickLeave = false,
    sickLeaveFamily = false,
    dayWorked,
    workFromHome = new Decimal(0),
    vacation = new Decimal(0),
    holiday = false,
    interruptions = [],
  } = workDay;
  const config = useContext(ConfigContext);
  const month = startTime.getMonth();
  const year = startTime.getFullYear();
  const isWeekEnd = isWeekend(startTime);
  const title = getTitle(workDay, config);
  const hasDisturbance =
    !isFullDay(compensatoryLeave, config.officialWorkTime) &&
    !doctorsLeave &&
    !doctorsLeaveFamily &&
    !sickLeave &&
    !sickLeaveFamily &&
    !isFullDay(vacation, config.officialWorkTime) &&
    (compensatoryLeave.greaterThan(0) || interruptions.length > 0 || vacation.greaterThan(0));
  const doctorsLeaveTime = interruptions
    .filter((interruption) => interruption.type === 'doctorsLeave')
    .reduce((acc, interruption) => acc.plus(interruption.time), new Decimal(0));
  const doctorsLeaveFamilyTime = interruptions
    .filter((interruption) => interruption.type === 'doctorsLeaveFamily')
    .reduce((acc, interruption) => acc.plus(interruption.time), new Decimal(0));
  const MainIcon = getIconByDayType(title as DAY_TYPES_KEYS);

  return (
    <>
      <div
        className={`flex flex-col relative items-center p-2 rounded-3xl border text-sm min-h-[260px] shadow-xl w-[260px] justify-between bg-white`}
      >
        {MainIcon && (<div className={`flex rounded-full w-[60px] min-h-[60px] justify-center items-center absolute left-[20px] top-[-30px] border ${getBaseColor(workDay, config.officialWorkTime)}`}>
          {<MainIcon />}
        </div>)}
        {lunch && (<div className={`flex rounded-full w-[60px] min-h-[60px] justify-center items-center absolute right-[15px] top-[15px] border bg-white`}>
          <Soup />
        </div>)}
        <div className='flex flex-col mt-[15px]'>
          <span className='text-xl font-semibold'>{format(startTime, 'dd.MM.')}</span>
          <span className='text-xs font-semibold'>{getDayNameFromDate(startTime)}</span>
        </div>
        <div className={`${hasDisturbance ? 'grid grid-cols-[auto_1fr] auto-cols-max' : 'flex flex-col py-[0] px-[20px] justify-evenly'} self-stretch basis-1/2 grow content-center `}>
          <span
            className={`text-2xl ${hasDisturbance ? 'pl-[10px]' : ''} font-semibold justify-self-start ${dayWorked.equals(0) ? 'col-span-2' : ''} flex justify-center items-center`}
          >
            {MainIcon && (<MainIcon className='mr-[10px]'/>)}{title}
          </span>
          <span className='text-2xl pr-[10px] font-semibold justify-self-end self-center'>
            {dayWorked.greaterThan(0) ? dayWorked.toDecimalPlaces(3).toNumber() : ''}
          </span>
          {hasDisturbance && compensatoryLeave.greaterThan(0) && (
            <>
              <span className='text-lg px-[10px] justify-self-start text-gray-400'>NV:</span>
              <span className='text-lg px-[10px] justify-self-end text-gray-400'>
                {' '}
                {compensatoryLeave.toNumber()}h
              </span>
            </>
          )}
          {hasDisturbance && vacation.greaterThan(0) && (
            <>
              <span className='text-lg px-[10px] justify-self-start text-gray-400 flex justify-center'><TreePalm className='mr-[10px]'/>Dovolenka:</span>
              <span className='text-lg px-[10px] justify-self-end text-gray-400'>{vacation.toNumber()}h</span>
            </>
          )}
          {hasDisturbance && doctorsLeaveTime.greaterThan(0) && (
            <>
              <span className='text-lg px-[10px] justify-self-start text-gray-400 flex justify-center'><Cross className='mr-[10px]'/>P-čko:</span>
              <span className='text-lg px-[10px] justify-self-end text-gray-400'>
                {' '}
                {doctorsLeaveTime.toNumber()}h
              </span>
            </>
          )}
          {hasDisturbance && doctorsLeaveFamilyTime.greaterThan(0) && (
            <>
              <span className='text-lg px-[10px] justify-self-start text-gray-400 flex justify-center'><UserRoundPlus className='mr-[10px]'/>Doprovod:</span>
              <span className='text-lg px-[10px] justify-self-end text-gray-400'>
                {' '}
                {doctorsLeaveFamilyTime.toNumber()}h
              </span>
            </>
          )}
        </div>
        
        {!isWeekEnd ? (
          <Drawer>
            <>
              <svg className='m-[10px]' width='100%' height='2'>
                <line x1='0' y1='1' x2='100%' y2='1' stroke='lightgrey' strokeWidth='2' />
              </svg>
              <DrawerTrigger asChild>
                <Button variant='outline' size='lg' className='text-lg'>Zmeniť</Button>
              </DrawerTrigger>
            </>
            <DrawerContent>
              <div className='mx-auto w-full max-w-sm'>
                <DrawerHeader>
                  <DrawerTitle>Denný súhrn ({format(startTime, 'dd.MM.')})</DrawerTitle>
                  <DrawerDescription>Nastav si svoj deň.</DrawerDescription>
                </DrawerHeader>
                <WorkDayForm
                  workDay={{
                    month,
                    year,
                    startTime,
                    endTime,
                    lunch,
                    compensatoryLeave,
                    doctorsLeave,
                    doctorsLeaveFamily,
                    sickLeave,
                    sickLeaveFamily,
                    dayWorked,
                    workFromHome,
                    vacation,
                    interruptions,
                    holiday,
                  }}
                  saveWorkDay={saveWorkDay}
                />
              </div>
            </DrawerContent>
          </Drawer>
        ) : (
          <div className='min-h-[60px]'>
          </div>
        )}
      </div>
    </>
  );
};

export default WorkDayBoxDesktop;
