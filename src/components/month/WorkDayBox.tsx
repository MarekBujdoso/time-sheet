import { format } from 'date-fns';
import Decimal from 'decimal.js';
import { Soup } from 'lucide-react';
import { useContext } from 'react';
import ConfigContext from '../../app/sheet/ConfigContext';
import { getDayNameFromDate } from '../../utils/skUtils';
import { Button } from '../ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../ui/drawer';
import useWorkDayBox from './useWorkDayBox';
import WorkDayForm from './WorkDayForm';
import { getBaseColor, WorkDayBoxProps } from './workDayUtils';

const WorkDayBox = ({ workDay, saveWorkDay }: WorkDayBoxProps) => {
  const config = useContext(ConfigContext);
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
    month,
    year,
    isWeekEnd,
    title,
    hasDisturbance,
    doctorsLeaveTime,
    doctorsLeaveFamilyTime,
  } = useWorkDayBox(workDay, config);

  return (
    <>
      <div
        className={`flex flex-row gap-1 items-center p-2 rounded-md border text-sm shadow-sm md:min-h-[240px] md:shadow-xl md:w-[380px] ${getBaseColor(workDay, config.officialWorkTime)}`}
      >
        <div className='flex flex-col'>
          <span className='text-xs font-semibold'>{format(startTime, 'dd.MM.')}</span>
          <span className='text-xs font-semibold'>{getDayNameFromDate(startTime, true)}</span>
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
              <Button variant='outline'>Zmeniť</Button>
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
