import Decimal from "decimal.js";
import { decimalToTimeStr } from "../../workDayBox/utils/workDayUtils";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";

const WorkDayFormInputItem = ({ dayType, value, changeDayValues, label, disabled, step, icon }: { dayType: string, value: Decimal, changeDayValues: (key: string, value: Decimal) => void, label: string, disabled: boolean, step: number, icon: React.ReactNode }) => {
  return (
    <div className='flex justify-items-start flex-col'>
      <Label htmlFor={dayType}>{label}</Label>
      <div className='flex items-center space-x-2'>
        {icon}
      <Input
        className='p-2 m-0'
        id={dayType}
        name={dayType}
        type='time'
        min='00:00'
        max='08:00'
        step={step}
        value={decimalToTimeStr(value)}
        disabled={disabled}
        onChange={(e) => {
          const newValue = e.target.value;
          if (newValue == null || newValue === '') {
            changeDayValues(dayType.toString(), new Decimal(0));
            return;
          }
          const [hours, minutes] = newValue.split(':').map(Number);
          changeDayValues(dayType.toString(), new Decimal(hours).plus(minutes / 60));
        }}
        />
        </div>
    </div>
  )
}

export default WorkDayFormInputItem;