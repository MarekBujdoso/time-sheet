import { format } from "date-fns/format";
import { X } from "lucide-react";
import React from "react";
import { InterruptionTimeProps } from "../../app/sheet/types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { set } from "date-fns/set";
import Decimal from "decimal.js";
import { differenceInMinutes } from "date-fns/differenceInMinutes";

interface InterruptionTimeCompProps extends InterruptionTimeProps {
  remove: (id: string) => void
  update: (newValue: InterruptionTimeProps) => void
}

// nemozem hned ratat s prerusenim, ale az ked stlacim check
const InterruptionTime = (props: InterruptionTimeCompProps) => {
  const { id, type, startTime, endTime, remove, update } = props
  const interruption = { id, type, startTime, endTime }
  // const [startTimeNew, setStartTime] = React.useState(startTime)
  // const [endTimeNew, setEndTime] = React.useState(endTime)

  const interruptionTitle = type === 'doctorsLeave' ? 'P-čko' : 'Doprovod'

  return (
    <div className="col-span-2 flex items-center space-x-2 justify-between">
      <Label className="w-[100px]" htmlFor="doctorsLeave">{interruptionTitle}</Label>
      <div className="flex items-center space-x-1">
        <Input className="w-[100px]"
          id="interruptionStart" name="interruptionStart"
          type="time" 
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
          step="900"
          value={format(endTime, 'HH:mm')}
          onChange={(e) => {
            const [hours, minutes] = e.target.value.split(':').map(Number)
            const newEndTime = set(endTime, { hours, minutes })
            update({...interruption, endTime: newEndTime, time: new Decimal(differenceInMinutes(newEndTime, startTime) / 60)})
          }}
          //   // setEndTime(set(endTimeNew, { hours, minutes }))
          //   update(id, 'endTime', set(endTime, { hours, minutes }))
          // }}
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
