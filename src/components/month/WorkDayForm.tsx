import { format } from 'date-fns/format';
import { set } from 'date-fns/set';
import Decimal from 'decimal.js';
import { Cross, Soup, UserRoundPlus, TreePalm, Pickaxe, House } from 'lucide-react';
import React, { useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ConfigContext from '../../app/sheet/ConfigContext';
import { DAY_TYPES, DAY_TYPES_KEYS } from '../../app/sheet/dayTypes';
import {
  DayType,
  InterruptionTimeProps,
  InterruptionWithTimeType,
  WorkDay,
} from '../../app/sheet/types';
import { Button } from '../ui/button';
import { DrawerClose, DrawerFooter } from '../ui/drawer';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { calculateLunch, calculateWorked, recalculateWorkDay } from '../utils/calculations';
import InterruptionTime from './InterruptionTime';
import { decimalToTimeStr, numberToTimeStr } from './workDayUtils';
import { Checkbox } from '../ui/checkbox';
import { differenceInMinutes } from 'date-fns';

interface WorkDayFormProps {
  workDay: WorkDay;
  saveWorkDay: (workDay: WorkDay) => void;
  saveTillEndOfMonth: (workDay: WorkDay) => void;
}

const WorkDayForm = ({ workDay, saveWorkDay, saveTillEndOfMonth }: WorkDayFormProps) => {
  const config = useContext(ConfigContext);
  const { officialWorkTime, officialStartTime, officialEndTime } = config;
  const [oneDay, setOneDay] = React.useState<WorkDay>({
    ...workDay,
    ...calculateWorked(workDay, config),
  });

  const changeDay = React.useCallback(
    (key: string, value: string | Decimal | boolean | Date | InterruptionTimeProps[]) => {
      setOneDay((day) => {
        let dayWorked = day.dayWorked;
        if ((key === 'startTime' || key === 'endTime') && typeof value === 'string') {
          const timeArray = value.split(':');
          value = new Date(day[key].setHours(Number(timeArray[0]), Number(timeArray[1])));
          dayWorked =
            key === 'startTime'
              ? new Decimal(differenceInMinutes(day.endTime, value) / 60)
              : new Decimal(differenceInMinutes(value, day.startTime) / 60);
        }
        return recalculateWorkDay({ ...day, [key]: value, dayWorked }, config);
      });
    },
    [config],
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement;
    const buttonName = submitter?.name || 'default';
    console.log('buttonName', buttonName);
    if (buttonName === 'SaveToEndOfMonth') {
      saveTillEndOfMonth(oneDay);
    } else {
      saveWorkDay(oneDay);
    }
  };

  const addInterruption = (e: React.FormEvent, type: InterruptionWithTimeType) => {
    e.preventDefault();
    if (oneDay.interruptions.length >= 1) return;
    changeDay('interruptions', [
      ...oneDay.interruptions,
      {
        id: uuidv4(),
        type,
        startTime: set(oneDay.startTime, officialStartTime),
        endTime: set(oneDay.endTime, officialStartTime),
        time: new Decimal(0),
      },
    ]);
  };

  const removeInterruption = (id: string) => {
    changeDay(
      'interruptions',
      oneDay.interruptions.filter((interruption) => interruption.id !== id),
    );
  };

  const updateInterruption = (newInterruption: InterruptionTimeProps) => {
    changeDay(
      'interruptions',
      oneDay.interruptions.map((interruption) =>
        interruption.id === newInterruption.id ? newInterruption : interruption,
      ),
    );
  };

  const changeDayType = (type: keyof typeof DAY_TYPES) => {
    const startTime = set(oneDay.startTime, officialStartTime);
    const endTime = set(oneDay.endTime, officialEndTime);
    setOneDay((day) => ({
      ...DAY_TYPES[type](startTime, endTime, officialWorkTime),
      month: day.month,
      year: day.year,
    }));
  };

  const clearWorkingTime = () => {
    setOneDay((day) => {
      const workedTime = new Decimal(differenceInMinutes(day.endTime, day.startTime) / 60);
      const noWorkTime = !day.noWorkTime;
      return {
        ...day,
        dayWorked: noWorkTime ? new Decimal(0) : workedTime,
        lunch: noWorkTime ? false : calculateLunch(workedTime).greaterThan(0),
        noWorkTime,
      };
    });
  };

  const isCustomDay = React.useMemo(() => oneDay.dayType === DayType.CUSTOM_DAY, [oneDay]);
  const isWorkDay = React.useMemo(() => oneDay.dayType === DayType.WORK_DAY, [oneDay]);

  return (
    <form onSubmit={handleSubmit} name='workDayForm'>
      <div className='rounded-md border p-2 text-sm shadow-sm'>
        <div className='col-span-2 p-2'>
          <Label htmlFor='dayType'>Typ dňa</Label>
          <div className='flex gap-2 flex-wrap justify-between'>
            <Select
              name='dayType'
              value={oneDay.dayType}
              onValueChange={(value) => changeDayType(value as keyof typeof DAY_TYPES)}
            >
              <SelectTrigger id='dayType' className='w-full' autoFocus>
                <SelectValue placeholder='Vyber si deň' />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(DAY_TYPES_KEYS)
                  .filter(([key]) => key !== 'weekend')
                  .map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className='flex p-2 justify-between'>
          <div className='flex items-center space-x-2'>
            <div className='text-sm font-medium leading-none'>Odpracované</div>
            <span className='text-lg font-semibold'>{numberToTimeStr(oneDay.dayWorked)}</span>
          </div>
          {oneDay.lunch && (
            <div className='flex items-center space-x-2 justify-self-end'>
              <Soup />
            </div>
          )}
        </div>
        <div className='flex p-2 justify-between'>
          <div className='flex items-center space-x-2'>
            <House />
            <span className='text-lg font-semibold'>{numberToTimeStr(oneDay.workFromHome)}</span>
          </div>
          <div className='flex items-center space-x-2'>
            <TreePalm />
            <span className='text-lg font-semibold'>{numberToTimeStr(oneDay.vacation)}</span>
          </div>
          <div className='flex items-center space-x-2'>
            <Pickaxe />
            <span className='text-lg font-semibold'>
              {numberToTimeStr(oneDay.compensatoryLeave)}
            </span>
          </div>
        </div>
        <div
          className={`grid ${isCustomDay ? 'grid-cols-[3fr_3fr_1fr]' : 'grid-cols-2'} gap-2 items-left p-2`}
        >
          <div>
            <Label htmlFor='startTime'>Začiatok</Label>
            <Input
              id='startTime'
              name='startTime'
              type='time'
              step='300'
              value={format(oneDay.startTime, 'HH:mm')}
              onChange={(e) => {
                const newValue = e.target.value;
                if (newValue == null || newValue === '') {
                  changeDay(
                    'startTime',
                    `${config.officialStartTime.hours}:${config.officialStartTime.minutes}`,
                  );
                  return;
                }
                changeDay('startTime', newValue);
              }}
              disabled={!isCustomDay || oneDay.noWorkTime}
            />
          </div>
          <div>
            <Label htmlFor='endTime'>Koniec</Label>
            <Input
              id='endTime'
              type='time'
              step='300'
              name='endTime'
              value={format(oneDay.endTime, 'HH:mm')}
              onChange={(e) => {
                const newValue = e.target.value;
                if (newValue == null || newValue === '') {
                  changeDay(
                    'endTime',
                    `${config.officialEndTime.hours}:${config.officialEndTime.minutes}`,
                  );
                  return;
                }
                changeDay('endTime', e.target.value)
              }}
              disabled={!isCustomDay || oneDay.noWorkTime}
            />
          </div>
          {isCustomDay && (
            <div className='flex justify-center items-end space-x-1'>
              <Checkbox
                className='bg-secondary'
                checked={!oneDay.noWorkTime}
                onCheckedChange={clearWorkingTime}
              />
            </div>
          )}
        </div>
        <div className='grid grid-cols-3 gap-2 items-left p-2'>
          {/* <div className='flex items-center space-x-2 justify-between'> */}
          <div className='flex justify-items-start flex-col'>
            {/* <div className='text-sm font-medium leading-none'>Doma</div> */}
            {/* {isCustomDay ? ( */}
            <Label htmlFor='workFromHome'>Doma</Label>
            <Input
              id='workFromHome'
              name='workFromHome'
              type='time'
              min='00:00'
              max='08:00'
              step={300}
              disabled={!isCustomDay}
              value={decimalToTimeStr(oneDay.workFromHome)}
              onChange={(e) => {
                const newValue = e.target.value;
                if (newValue == null || newValue === '') {
                  changeDay('workFromHome', new Decimal(0));
                  return;
                }
                const [hours, minutes] = newValue.split(':').map(Number);
                changeDay('workFromHome', new Decimal(hours).plus(minutes / 60));
              }}
            />
            {/* ) : (
                <span className='text-lg font-semibold'>
                  {numberToTimeStr(oneDay.workFromHome.toDecimalPlaces(3))}
                </span>
              )} */}
          </div>
          {/* </div> */}
          {/* <div className='flex items-center space-x-2 col-span-2 justify-between'> */}
          <div className='flex justify-items-start flex-col'>
            {/* <TreePalm /> */}
            {/* <div className='text-sm font-medium leading-none'>Dovolenka</div> */}
            <Label htmlFor='vacation'>Dovolenka</Label>
            <Input
              className='p-2 m-0'
              id='vacation'
              name='vacation'
              type='time'
              min='00:00'
              max='08:00'
              step={3600}
              value={decimalToTimeStr(oneDay.vacation)}
              disabled={!isCustomDay}
              onChange={(e) => {
                const newValue = e.target.value;
                if (newValue == null || newValue === '') {
                  changeDay('vacation', new Decimal(0));
                  return;
                }
                const [hours, minutes] = newValue.split(':').map(Number);
                changeDay('vacation', new Decimal(hours).plus(minutes / 60));
              }}
            />
            {/* //{' '}
              <span className='text-lg font-semibold'>
                // {numberToTimeStr(calcVacationOneDay(oneDay, config)[0].toDecimalPlaces(3))}
                //{' '}
              </span> */}
          </div>
          <div className='flex justify-items-start flex-col'>
            {/* <Pickaxe /> */}
            {/* <div className='text-sm font-medium leading-none'>NV</div> */}
            <Label htmlFor='compensatoryLeave'>Náhradné voľno</Label>
            <Input
              className=''
              id='compensatoryLeave'
              name='compensatoryLeave'
              type='time'
              min='00:00'
              max='08:00'
              step={900}
              value={decimalToTimeStr(oneDay.compensatoryLeave)}
              disabled={!isCustomDay}
              onChange={(e) => {
                const newValue = e.target.value;
                if (newValue == null || newValue === '') {
                  changeDay('compensatoryLeave', new Decimal(0));
                  return;
                }
                const [hours, minutes] = newValue.split(':').map(Number);
                changeDay('compensatoryLeave', new Decimal(hours).plus(minutes / 60));
              }}
            />
            {/* <span className='text-lg font-semibold'>
                {numberToTimeStr(calcCompensatoryLeave([oneDay], config)[0].toDecimalPlaces(3))}
              </span> */}
          </div>
        </div>
        <div className='grid grid-cols-2 gap-2 items-left p-2'>
          {/* </div> */}
          {oneDay.interruptions.map((interruption) => (
            <InterruptionTime
              key={interruption.id}
              {...interruption}
              remove={removeInterruption}
              update={updateInterruption}
              isDisabled={!isWorkDay && !isCustomDay}
            />
          ))}
          <div>
            <Button
              disabled={!isWorkDay && (!isCustomDay || oneDay.noWorkTime)}
              variant={'outline'}
              type='button'
              onClick={(e) => addInterruption(e, InterruptionWithTimeType.DOCTORS_LEAVE)}
            >
              <Cross /> P-čko
            </Button>
          </div>
          <div className='flex items-center justify-end'>
            <Button
              disabled={!isWorkDay && (!isCustomDay || oneDay.noWorkTime)}
              variant={'outline'}
              type='button'
              onClick={(e) => addInterruption(e, InterruptionWithTimeType.DOCTORS_LEAVE_FAMILY)}
            >
              <UserRoundPlus /> Doprovod
            </Button>
          </div>
        </div>
      </div>
      <DrawerFooter>
        <DrawerClose asChild>
          <div className='flex justify-center space-x-2'>
            <Button
              name='SaveToEndOfMonth'
              type='button'
              onClick={() => saveTillEndOfMonth(oneDay)}
            >
              Uložiť do konca mesiaca
            </Button>
            <Button variant='outline' type='reset'>
              Zrušiť
            </Button>
            <Button name='Save'>Uložiť</Button>
          </div>
        </DrawerClose>
      </DrawerFooter>
    </form>
  );
};

export default WorkDayForm;
