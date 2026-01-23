import { useContext } from 'react';
import ConfigContext from '../../../app/sheet/ConfigContext';
import { WorkDay } from '../../../app/sheet/types';
import { calcDoctorsLeave, calcDoctorsLeaveFamily, calcWorkFreeDay } from '../../utils/calculations';
import Decimal from 'decimal.js';
import { DAY_INTERRUPTIONS_KEYS, TIME_TYPES_KEYS } from '../../../app/sheet/dayTypes';

const DayDisturbances = ({
  workDay,
  ItemComponent,
}: {
  workDay: WorkDay;
  ItemComponent: React.ComponentType<{ name: string; hours: Decimal; children?: React.ReactNode }>;
}) => {
  const config = useContext(ConfigContext);
  const { vacation, compensatoryLeave, workFromHome } = workDay;
  const doctorsLeaveTime = calcDoctorsLeave([workDay], config)[0];
  const doctorsLeaveFamilyTime = calcDoctorsLeaveFamily([workDay], config)[0];
  const workFreeDayTime = calcWorkFreeDay([workDay], config)[0];

  return (
    <div className='grid gap-1 grid-cols-[auto_1fr] gap-y-[0px]'>
      {compensatoryLeave.greaterThan(0) && <ItemComponent name={TIME_TYPES_KEYS.compensatoryLeave} hours={compensatoryLeave} />}
      {vacation.greaterThan(0) && <ItemComponent name={TIME_TYPES_KEYS.vacation} hours={vacation} />}
      {doctorsLeaveTime.greaterThan(0) && <ItemComponent name={DAY_INTERRUPTIONS_KEYS.doctorsLeave} hours={doctorsLeaveTime} />}
      {doctorsLeaveFamilyTime.greaterThan(0) && (
        <ItemComponent name={DAY_INTERRUPTIONS_KEYS.doctorsLeaveFamily} hours={doctorsLeaveFamilyTime} />
      )}
      {workFromHome.greaterThan(0) && <ItemComponent name={TIME_TYPES_KEYS.workFromHome} hours={workFromHome} />}
      {workFreeDayTime.greaterThan(0) && <ItemComponent name={DAY_INTERRUPTIONS_KEYS.workFreeDay} hours={workFreeDayTime} />}
    </div>
  );
};

export default DayDisturbances;
