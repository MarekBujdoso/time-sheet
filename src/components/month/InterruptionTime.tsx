import { differenceInMinutes } from "date-fns/differenceInMinutes";
import { format } from "date-fns/format";
import { set } from "date-fns/set";
import Decimal from "decimal.js";
import { X } from "lucide-react";
import { InterruptionTimeProps } from "../../app/sheet/types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useContext } from "react";
import ConfigContext from "../../app/sheet/ConfigContext";
import { checkTheEndingTime } from "../utils/workDay";
import { DAY_INTERRUPTIONS_KEYS } from "../../app/sheet/dayTypes";

interface InterruptionTimeCompProps extends InterruptionTimeProps {
  remove: (id: string) => void
  update: (newValue: InterruptionTimeProps) => void
}

const InterruptionTime = (props: InterruptionTimeCompProps) => {
  const config = useContext(ConfigContext);
  const { id, type, startTime, endTime, remove, update } = props
  const interruption = { id, type, startTime, endTime }

  const interruptionTitle = DAY_INTERRUPTIONS_KEYS[type]

  return (
    <div className="col-span-2 flex items-center space-x-2 justify-between">
      <Label className="w-[100px]" htmlFor="doctorsLeave">{interruptionTitle}</Label>
      <div className="flex items-center space-x-1">
        <Input className="w-[100px]"
          id="interruptionStart" name="interruptionStart"
          type="time"
          min={`${String(config.officialStartTime.hours).padStart(2,'0')}:${config.officialStartTime.minutes}`}
          max={`${String(config.officialEndTime.hours).padStart(2,'0')}:${config.officialEndTime.minutes}`}
          step="900"
          value={format(startTime, 'HH:mm')}
          onChange={(e) => {
            const [hours, minutes] = e.target.value.split(':').map(Number)
            const newStartTime = set(startTime, { hours, minutes })
            update({...interruption, startTime: newStartTime, time: new Decimal(differenceInMinutes(endTime, newStartTime) / 60)})
          }}
        />
        <Input className="w-[100px]"
            id="interruptionEnd" name="interruptionEnd"
          type="time"
          min={`${String(config.officialStartTime.hours).padStart(2,'0')}:${config.officialStartTime.minutes}`}
          max={`${String(config.officialEndTime.hours).padStart(2,'0')}:${config.officialEndTime.minutes}`}
          step="900"
          value={format(endTime, 'HH:mm')}
          onChange={(e) => {
            const [hours, minutes] = e.target.value.split(':').map(Number)
            const newEndTime = set(endTime, { hours, minutes })
            update({...interruption, endTime: newEndTime, time: new Decimal(differenceInMinutes(newEndTime, startTime) / 60)})
          }}
          onBlur={() => {
            const [hours, minutes] = format(endTime, 'HH:mm').split(':').map(Number)
            const isEnding = checkTheEndingTime(hours, minutes)
            const newEndTime = set(endTime, { hours: isEnding ? config.officialEndTime.hours : hours, minutes: isEnding ? config.officialEndTime.minutes : minutes })
            update({...interruption, endTime: newEndTime, time: new Decimal(differenceInMinutes(newEndTime, startTime) / 60)})
          }}
        />
      </div>
      <div  className="flex items-center space-x-1">
        {/* <Button variant={'outline'} type="button" onClick={() => (console.log('+'))}><Check /></Button>  */}
        <Button variant={'outline'} type="button" onClick={() => remove(id)}><X /></Button> 
      </div>
    </div>
  )
}

export default InterruptionTime
