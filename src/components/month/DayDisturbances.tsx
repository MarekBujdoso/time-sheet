import { useContext } from 'react';
import ConfigContext from '../../app/sheet/ConfigContext';
import { WorkDay } from '../../app/sheet/types';
import { calcDoctorsLeave, calcDoctorsLeaveFamily } from '../utils/calculations';
import Decimal from 'decimal.js';

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

  return (
    <div className='grid gap-1 grid-cols-[auto_1fr] gap-y-[0px]'>
      {compensatoryLeave.greaterThan(0) && <ItemComponent name='NV' hours={compensatoryLeave} />}
      {vacation.greaterThan(0) && <ItemComponent name='Dovolenka' hours={vacation} />}
      {doctorsLeaveTime.greaterThan(0) && <ItemComponent name='P-čko' hours={doctorsLeaveTime} />}
      {doctorsLeaveFamilyTime.greaterThan(0) && (
        <ItemComponent name='Doprovod' hours={doctorsLeaveFamilyTime} />
      )}
      {workFromHome.greaterThan(0) && <ItemComponent name='Doma' hours={workFromHome} />}
    </div>
  );
};

export default DayDisturbances;
