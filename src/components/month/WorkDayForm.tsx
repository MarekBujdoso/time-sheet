import { format } from 'date-fns/format';
import { set } from 'date-fns/set';
import Decimal from 'decimal.js';
import { Cross, Soup, UserRoundPlus, TreePalm, Pickaxe } from 'lucide-react';
import React, { useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ConfigContext from '../../app/sheet/ConfigContext';
import { DAY_TYPES, DAY_TYPES_KEYS, identifyDayType } from '../../app/sheet/dayTypes';
import {
  InterruptionTimeProps,
  InterruptionWithTimeType,
  WorkDay,
  WorkDayFull,
} from '../../app/sheet/types';
import { Button } from '../ui/button';
import { DrawerClose, DrawerFooter } from '../ui/drawer';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { calculateWorked, calcVacation, recalculateWorkDay } from '../utils/calculations';
import InterruptionTime from './InterruptionTime';
import { numberToTimeStr } from './workDayUtils';

interface WorkDayFormProps {
  workDay: WorkDayFull;
  saveWorkDay: (workDay: WorkDay) => void;
  saveTillEndOfMonth: (workDay: WorkDay) => void;
}

const WorkDayForm = ({ workDay, saveWorkDay, saveTillEndOfMonth }: WorkDayFormProps) => {
  console.log('workDay', workDay);
  const config = useContext(ConfigContext);
  const { officialWorkTime, officialStartTime, officialEndTime } = config;
  const [oneDay, setOneDay] = React.useState<WorkDayFull>({
    ...workDay,
    ...calculateWorked(workDay, config),
  });

  const changeDay = React.useCallback(
    (key: string, value: string | Decimal | boolean | Date | InterruptionTimeProps[]) => {
      setOneDay((day) => {
        if ((key === 'startTime' || key === 'endTime') && typeof value === 'string') {
          const timeArray = value.split(':');
          value = new Date(day[key].setHours(Number(timeArray[0]), Number(timeArray[1])));
        }
        return recalculateWorkDay({ ...day, [key]: value }, config);
      });
    },
    [config],
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement;
    const buttonName = submitter?.name || 'default';
    if (buttonName === 'SaveToEndOfMonth') {
      saveTillEndOfMonth(oneDay);
    } else {
      saveWorkDay(oneDay);
    }
  };

  const addInterruption = (e: React.FormEvent, type: InterruptionWithTimeType) => {
    e.preventDefault();
    if (oneDay.interruptions.length >= 3) return;
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
      month: day.month + 1,
      year: day.year,
    }));
  };

  const isDisabled = React.useMemo(
    () => identifyDayType(oneDay, officialWorkTime) !== 'workDay',
    [oneDay, officialWorkTime],
  );

  return (
    <form onSubmit={handleSubmit} name='workDayForm'>
      <div className='rounded-md border p-2 text-sm shadow-sm'>
        <div className='grid grid-cols-2 gap-2 items-left p-2'>
          <div className='col-span-2'>
            <Label htmlFor='dayType'>Typ dňa</Label>
            <div className='flex gap-2 flex-wrap justify-between'>
              <Select
                name='dayType'
                value={identifyDayType(oneDay, officialWorkTime)}
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
          <div>
            <Label htmlFor='startTime'>Začiatok</Label>
            <Input
              id='startTime'
              name='startTime'
              type='time'
              step='900'
              value={format(oneDay.startTime, 'HH:mm')}
              onChange={(e) => changeDay('startTime', e.target.value)}
              disabled
            />
          </div>
          <div>
            <Label htmlFor='endTime'>Koniec</Label>
            <Input
              id='endTime'
              type='time'
              step='900'
              name='endTime'
              value={format(oneDay.endTime, 'HH:mm')}
              onChange={(e) => changeDay('endTime', e.target.value)}
              disabled
            />
          </div>
          <div className='flex items-center space-x-2 col-span-2 justify-between'>
            <div className='flex items-center space-x-2'>
              <div className='text-sm font-medium leading-none'>Odpracované</div>
              <span className='text-lg font-semibold'>{numberToTimeStr(oneDay.dayWorked)}</span>
            </div>
            <div className='flex items-center space-x-2'>{oneDay.lunch && <Soup />}</div>
            <div className='flex items-center space-x-2'>
              <div className='text-sm font-medium leading-none'>Doma</div>
              <span className='text-lg font-semibold'>
                {numberToTimeStr(oneDay.workFromHome.toDecimalPlaces(3))}
              </span>
            </div>
          </div>
          <div className='flex items-center space-x-2 col-span-2 justify-between'>
            <div className='flex items-center space-x-2'>
              <div className='text-sm font-medium leading-none'>Dovolenka</div>
              <span className='text-lg font-semibold'>
                {numberToTimeStr(calcVacation([oneDay], config)[0].toDecimalPlaces(3))}
              </span>
            </div>
            <div className='flex items-center space-x-2'>
              <div className='text-sm font-medium leading-none'>Náhradné voľno</div>
              <span className='text-lg font-semibold'>
                {numberToTimeStr(oneDay.compensatoryLeave.toDecimalPlaces(3))}
              </span>
            </div>
          </div>
          {oneDay.interruptions.map((interruption) => (
            <InterruptionTime
              key={interruption.id}
              {...interruption}
              remove={removeInterruption}
              update={updateInterruption}
              // isDisabled={isDisabled}
            />
          ))}
          <div>
            <Button
              disabled={isDisabled}
              variant={'outline'}
              type='button'
              onClick={(e) => addInterruption(e, InterruptionWithTimeType.DOCTORS_LEAVE)}
            >
              <Cross /> P-čko
            </Button>
          </div>
          <div className='flex items-center justify-end'>
            <Button
              disabled={isDisabled}
              variant={'outline'}
              type='button'
              onClick={(e) => addInterruption(e, InterruptionWithTimeType.DOCTORS_LEAVE_FAMILY)}
            >
              <UserRoundPlus /> Doprovod
            </Button>
          </div>
          <div className='flex items-center'>
            <Button
              disabled={isDisabled}
              variant={'outline'}
              type='button'
              onClick={(e) => addInterruption(e, InterruptionWithTimeType.VACATION)}
            >
              <TreePalm /> Dovolenka
            </Button>
          </div>
          <div className='flex items-center justify-end'>
            <Button
              disabled={isDisabled}
              variant={'outline'}
              type='button'
              onClick={(e) => addInterruption(e, InterruptionWithTimeType.COMPENSATORY_LEAVE)}
            >
              <Pickaxe /> NV
            </Button>
          </div>
        </div>
      </div>
      <DrawerFooter>
        <DrawerClose asChild>
          <div className='flex justify-center space-x-2'>
            <Button name='SaveToEndOfMonth'>Uložiť do konca mesiaca</Button>
            <Button variant='outline' type='button'>
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
