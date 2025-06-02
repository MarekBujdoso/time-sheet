import { format } from 'date-fns';
import Decimal from 'decimal.js';
import { Cross, Pickaxe, Soup, TreePalm, UserRoundPlus } from 'lucide-react';
import { useContext } from 'react';
import ConfigContext from '../../app/sheet/ConfigContext';
import { DAY_TYPES_KEYS, getIconByDayType } from '../../app/sheet/dayTypes';
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

export const InterruptionItem = ({
  hours,
  name,
  children,
}: {
  hours: Decimal;
  name: string;
  children: React.ReactNode;
}): React.ReactNode => {
  return (
    <>
      <span className='text-lg px-[10px] justify-self-start text-gray-400 flex justify-center'>
        {children}
        {name}
      </span>
      <span className='text-lg px-[10px] justify-self-end text-gray-400'>{hours.toNumber()}h</span>
    </>
  );
};

const WorkDayBoxDesktop = ({ workDay, saveWorkDay }: WorkDayBoxProps) => {
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

  const MainIcon = getIconByDayType(title as DAY_TYPES_KEYS);

  return (
    <>
      <div
        className={`flex flex-col relative items-center p-2 rounded-3xl border text-sm min-h-[260px] shadow-xl w-[260px] justify-between bg-white`}
      >
        {MainIcon && (
          <div
            className={`flex rounded-full w-[60px] min-h-[60px] justify-center items-center absolute left-[20px] top-[-30px] border ${getBaseColor(workDay, config.officialWorkTime)}`}
          >
            {<MainIcon />}
          </div>
        )}
        {lunch && (
          <div
            className={`flex rounded-full w-[60px] min-h-[60px] justify-center items-center absolute right-[15px] top-[15px] border bg-white`}
          >
            <Soup />
          </div>
        )}
        <div className='flex flex-col mt-[15px]'>
          <span className='text-xl font-semibold'>{format(startTime, 'dd.MM.')}</span>
          <span className='text-xs font-semibold'>{getDayNameFromDate(startTime)}</span>
        </div>
        <div
          className={`${hasDisturbance ? 'grid grid-cols-[auto_1fr] auto-cols-max' : 'flex flex-col py-[0] px-[20px] justify-evenly'} self-stretch basis-1/2 grow content-center `}
        >
          <span
            className={`text-2xl ${hasDisturbance ? 'pl-[10px]' : ''} font-semibold justify-self-start ${dayWorked.equals(0) ? 'col-span-2' : ''} flex justify-center items-center`}
          >
            {MainIcon && <MainIcon className='mr-[10px]' />}
            {title}
          </span>
          <span className='text-2xl pr-[10px] font-semibold justify-self-end self-center'>
            {dayWorked.greaterThan(0) ? dayWorked.toDecimalPlaces(3).toNumber() : ''}
          </span>
          {hasDisturbance && compensatoryLeave.greaterThan(0) && (
            <InterruptionItem hours={compensatoryLeave} name='NV'>
              <Pickaxe className='mr-[10px]' />
            </InterruptionItem>
          )}
          {hasDisturbance && vacation.greaterThan(0) && (
            <InterruptionItem hours={vacation} name='Dovolenka'>
              <TreePalm className='mr-[10px]' />
            </InterruptionItem>
          )}
          {hasDisturbance && doctorsLeaveTime.greaterThan(0) && (
            <InterruptionItem hours={doctorsLeaveTime} name='P-čko'>
              <Cross className='mr-[10px]' />
            </InterruptionItem>
          )}
          {hasDisturbance && doctorsLeaveFamilyTime.greaterThan(0) && (
            <InterruptionItem hours={doctorsLeaveFamilyTime} name='Doprovod'>
              <UserRoundPlus className='mr-[10px]' />
            </InterruptionItem>
          )}
        </div>

        {!isWeekEnd ? (
          <Drawer>
            <>
              <svg className='m-[10px]' width='100%' height='2'>
                <line x1='0' y1='1' x2='100%' y2='1' stroke='lightgrey' strokeWidth='2' />
              </svg>
              <DrawerTrigger asChild>
                <Button variant='outline' size='lg' className='text-lg'>
                  Zmeniť
                </Button>
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
          <div className='min-h-[60px]'></div>
        )}
      </div>
    </>
  );
};

export default WorkDayBoxDesktop;
