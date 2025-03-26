import { format } from 'date-fns';
import { isWeekend } from 'date-fns/fp/isWeekend';
import Decimal from 'decimal.js';
import { Soup } from 'lucide-react';
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
    if (workDay.interruptions?.some((interruption) => 
      (interruption.type === InterruptionWithTimeType.DOCTORS_LEAVE) ||
      (interruption.type === InterruptionWithTimeType.DOCTORS_LEAVE_FAMILY)
    
    )) return `bg-gradient-to-r from-blue-200  to-rose-200`;
    // return `bg-gradient-to-r from-blue-200 from-${calcPercentage(dayWorked, officialWorkTime)}% to-rose-200 to-100%`;
  }
  return 'bg-white';
}

interface WorkDayBoxProps {
  workDay: WorkDay;
  saveWorkDay: (workDay: WorkDay) => void;
}

const WorkDayBox = ({ workDay, saveWorkDay }: WorkDayBoxProps) => {
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
    !isFullDay(vacation, config.officialWorkTime) &&
    (compensatoryLeave.greaterThan(0) || interruptions.length > 0 || vacation.greaterThan(0));
  const doctorsLeaveTime = interruptions
    .filter((interruption) => interruption.type === 'doctorsLeave')
    .reduce((acc, interruption) => acc.plus(interruption.time), new Decimal(0));
  const doctorsLeaveFamilyTime = interruptions
    .filter((interruption) => interruption.type === 'doctorsLeaveFamily')
    .reduce((acc, interruption) => acc.plus(interruption.time), new Decimal(0));

  return (
    <>
      <div className={`flex flex-row gap-1 items-center p-2 rounded-md border text-sm shadow-sm md:min-h-[100px] ${getBaseColor(workDay, config.officialWorkTime)}`}>
        <div className='flex flex-col'>
          <span className='text-xs font-semibold'>{format(startTime, 'dd.MM.')}</span>
          <span className='text-xs font-semibold'>{format(startTime, 'EEEEEE')}</span>
        </div>
        <div className='flex flex-col grow'>
          <span className='text-lg font-semibold self-start'>{title}</span>
        </div>
        {hasDisturbance && (
          <div className='grid gap-1'>
            {compensatoryLeave.greaterThan(0) && (
              <span className='text-s font-semibold'>NV: {compensatoryLeave.toNumber()}h</span>
            )}
            {vacation.greaterThan(0) && (
              <span className='text-s font-semibold'>Dovolenka: {vacation.toNumber()}h</span>
            )}
            {doctorsLeaveTime.greaterThan(0) && (
              <span className='text-s font-semibold'>P-čko: {doctorsLeaveTime.toNumber()}h</span>
            )}
            {doctorsLeaveFamilyTime.greaterThan(0) && (
              <span className='text-s font-semibold'>
                Doprovod: {doctorsLeaveFamilyTime.toNumber()}h
              </span>
            )}
          </div>
        )}
        {lunch && <Soup />}
        {dayWorked.greaterThan(0) && (
          <div className='flex flex-col w-14'>
            <span className='text-lg font-semibold'>{dayWorked.toDecimalPlaces(3).toNumber()}</span>
          </div>
        )}
        {!isWeekEnd && (
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant='outline'>Edit</Button>
            </DrawerTrigger>
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
        )}
      </div>
    </>
  );
};

export default WorkDayBox;
