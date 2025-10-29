import { format } from 'date-fns';
import { isWeekend } from 'date-fns/fp/isWeekend';
import { Soup } from 'lucide-react';
import { useContext } from 'react';
import ConfigContext from '../../app/sheet/ConfigContext';
import { hasDisturbance } from '../../app/sheet/dayTypes';
import { getDayNameFromDate } from '../../utils/skUtils';
import { Button } from '../ui/button';
import { Drawer, DrawerTrigger } from '../ui/drawer';
import { calcDoctorsLeave, calcDoctorsLeaveFamily } from '../utils/calculations';
import { getTitle } from '../utils/workDay';
import { getBaseColor, numberToTimeStr, WorkDayBoxProps } from './workDayUtils';
import WorkDayDrawerContent from './WorkDayDrawerContent';

const WorkDayBox = ({ workDay, saveWorkDay, saveTillEndOfMonth }: WorkDayBoxProps) => {
  const config = useContext(ConfigContext);
  const { startTime, lunch = false, dayWorked, vacation, compensatoryLeave, workFromHome } = workDay;
  const isWeekEnd = isWeekend(startTime);
  const title = getTitle(workDay);
  const hasDisturb = hasDisturbance(workDay);
  const doctorsLeaveTime = calcDoctorsLeave([workDay], config)[0];
  const doctorsLeaveFamilyTime = calcDoctorsLeaveFamily([workDay], config)[0];

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
        {hasDisturb && (
          <div className='grid gap-1'>
            {compensatoryLeave.greaterThan(0) && (
              <span className='text-s font-semibold'>
                NV: {numberToTimeStr(compensatoryLeave)}h
              </span>
            )}
            {vacation.greaterThan(0) && (
              <span className='text-s font-semibold'>Dovolenka: {numberToTimeStr(vacation)}h</span>
            )}
            {doctorsLeaveTime.greaterThan(0) && (
              <span className='text-s font-semibold'>
                P-čko: {numberToTimeStr(doctorsLeaveTime)}h
              </span>
            )}
            {doctorsLeaveFamilyTime.greaterThan(0) && (
              <span className='text-s font-semibold'>
                Doprovod: {numberToTimeStr(doctorsLeaveFamilyTime)}h
              </span>
            )}
            {workFromHome.greaterThan(0) && (
            <span className='text-s font-semibold'>
              Doma: {numberToTimeStr(workFromHome)}h
            </span>
          )}
          </div>
        )}
        {lunch && <Soup />}
        {dayWorked.greaterThan(0) && (
          <div className='flex flex-col w-14'>
            <span className='text-lg font-semibold'>
              {numberToTimeStr(dayWorked.toDecimalPlaces(3))}
            </span>
          </div>
        )}
        {!isWeekEnd && (
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant='outline'>Zmeniť</Button>
            </DrawerTrigger>
            <WorkDayDrawerContent
              workDay={workDay}
              saveWorkDay={saveWorkDay}
              saveTillEndOfMonth={saveTillEndOfMonth}
            />
          </Drawer>
        )}
      </div>
    </>
  );
};

export default WorkDayBox;
