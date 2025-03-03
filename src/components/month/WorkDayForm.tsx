import React from "react";
import { Cross, UserRoundPlus } from "lucide-react";
import { format } from "date-fns/format";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { InterruptionTimeProps, InterruptionWithTimeType, WorkDay, WorkDayFull } from "../../app/sheet/types";
import { DrawerClose, DrawerFooter } from "../ui/drawer";
import { Button } from "../ui/button";
import { differenceInMinutes } from "date-fns/differenceInMinutes";
import Decimal from "decimal.js";
import { DAY_TYPES, DAY_TYPES_KEYS, identifyDayType } from "../../app/sheet/dayTypes";
import InterruptionTime from "./InterruptionTime";
import { v4 as uuidv4 } from 'uuid'
import { set } from "date-fns/set";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { calculateWorked, recalculateWorkDay } from "../utils/calculations";



interface WorkDayFormProps {
  workDay: WorkDayFull
  saveWorkDay: (workDay: WorkDay) => void
}

const WorkDayForm = ({
  workDay,
  saveWorkDay,
}: WorkDayFormProps) => {  
  const [oneDay, setOneDay] = React.useState<WorkDayFull>({
    ...workDay,
    ...calculateWorked(new Decimal(differenceInMinutes(workDay.endTime, workDay.startTime)).dividedBy(60), workDay.interruptions, workDay.compensatoryLeave),
  })
  const [dayType, setDayType] = React.useState<keyof typeof DAY_TYPES>(identifyDayType(oneDay, new Decimal(7.5)))

  const changeDay = React.useCallback((key: string, value: string | Decimal | boolean | Date | InterruptionTimeProps[]) => {
    if ((key === 'startTime' || key === 'endTime') && typeof value === 'string') {
      value = new Date(oneDay[key].setHours(Number(value.split(':')[0]), Number(value.split(':')[1])))
    }

    setOneDay((day) => recalculateWorkDay({...day, [key]: value}, new Decimal(7.5)))
  }, [oneDay])

  const handleSubmit = (formData: FormData) => {
    console.log('submit', oneDay)
    console.log(formData)
    // e.preventDefault();
    saveWorkDay(oneDay)
  }

  const addInterruption = (e: React.FormEvent, type: InterruptionWithTimeType) => {
    e.preventDefault();
    if (oneDay.interruptions.length >= 3) return
    changeDay('interruptions',[...oneDay.interruptions, {id: uuidv4(), type, startTime: set(oneDay.startTime, { hours: 7, minutes: 30 }), endTime: set(oneDay.endTime, {hours: 7, minutes: 30}), time: new Decimal(0)}])
  }

  const removeInterruption = (id: string) => {
    changeDay('interruptions', oneDay.interruptions.filter((interruption) => interruption.id !== id))
  }

  const updateInterruption = (newInterruption: InterruptionTimeProps) => {
    changeDay('interruptions', oneDay.interruptions.map((interruption) => interruption.id === newInterruption.id ? newInterruption : interruption))
  }

  const changeDayType = (type: keyof typeof DAY_TYPES) => {
    setDayType(type)
    setOneDay((day) => ({...DAY_TYPES[type], startTime: set(day.startTime, { hours: 7, minutes: 30 }), endTime: set(day.endTime, {hours: 15, minutes: 30}), month: day.month, year: day.year}))
  }

  const isDisabled = dayType !== 'workType'

  return (
    <form action={handleSubmit}>
      <div className="rounded-md border p-2 text-sm shadow-sm">
        <div className="grid grid-cols-2 gap-2 items-left p-2">
          <div className="col-span-2">
            <Label>Typ dňa</Label>
            <div className="flex gap-2 flex-wrap justify-between">
              <Select name="dayType" value={dayType} onValueChange={(value) => changeDayType(value as keyof typeof DAY_TYPES)}>
                <SelectTrigger>
                  <SelectValue placeholder="Vyber si deň" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(DAY_TYPES_KEYS).map(([key, value]) => (
                    <SelectItem key={key} value={key}>{value}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* <DrawerClose asChild> */}
                {/* <div className="flex flex-wrap justify-between">
                  <Button variant={dayType === 'vacation' ? 'default' : 'outline'} onClick={() => changeDayType('vacation')}>Dovolenka</Button>
                  <Button variant={dayType === 'holiday' ? 'default' : 'outline'} onClick={() => changeDayType('holiday')}>Štátny sviatok</Button>
                  <Button variant={dayType === 'doctorsLeave' ? 'default' : 'outline'} onClick={() => changeDayType('doctorsLeave')}>P-čko deň</Button>
                  <Button variant={dayType === 'doctorsLeaveFamily' ? 'default' : 'outline'} onClick={() => changeDayType('doctorsLeaveFamily')}>Doprovod - deň</Button>
                  <Button variant={dayType === 'compensatoryLeave' ? 'default' : 'outline'} onClick={() => changeDayType('compensatoryLeave')}>NV - deň</Button>
                  <Button variant={dayType === 'sickLeave' ? 'default' : 'outline'} onClick={() => changeDayType('sickLeave')}>PN</Button>
                  <Button variant={dayType === 'sickLeaveFamily' ? 'default' : 'outline'} onClick={() => changeDayType('sickLeaveFamily')}>OČR</Button>
                </div> */}
              {/* </DrawerClose> */}
              {/* <Button variant={dayType === 'workType' ? 'default' : 'outline'} type="button" onClick={() => changeDayType('workType')}>Práca</Button> */}
            </div>
          </div>
          <div className="flex items-center space-x-2 col-span-2 justify-between">
            <div className="flex items-center space-x-2">
              <Label>Odpracované</Label>
              <span className="text-lg font-semibold">{oneDay.dayWorked.toDecimalPlaces(3).toNumber()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Label>Doma</Label>
              <span className="text-lg font-semibold">{oneDay.workFromHome.toDecimalPlaces(3).toNumber()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox className="bg-white" disabled id="lunchTime" name="lunchTime" checked={oneDay.lunch}
                // onCheckedChange={() => changeDay('lunch', !oneDay.lunch)}
              />
              <label 
                htmlFor="lunchTime"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Obed
              </label>
            </div>
          </div>
          {/* <div className="flex items-center space-x-2">
          </div> */}
          <div>
            <Label htmlFor="startTime">Začiatok</Label>
            <Input 
              id="startTime"
              name="startTime" 
              type="time"
              step="900"
              value={format(oneDay.startTime, 'HH:mm')}
              onChange={(e) => changeDay('startTime', e.target.value)}
              disabled={isDisabled}
            />
          </div>
          <div>
            <Label htmlFor="endTime">Koniec</Label>
            <Input
              id="endTime"
              type="time"
              step="900"
              name="endTime"
              value={format(oneDay.endTime, 'HH:mm')}
              onChange={(e) => changeDay('endTime', e.target.value)}
              disabled={isDisabled}
              />
          </div>
          <div>
            <Label htmlFor="vacation">Dovolenka</Label>
            <Input disabled={isDisabled} id="vacation" type="number" name="vacation" value={oneDay.vacation?.toNumber()}
              min={0} max={7.5} step={0.5}
              onChange={(e) => changeDay('vacation', new Decimal(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="compensatoryLeave">Náhradé voľno</Label>
            <Input disabled={isDisabled} id="compensatoryLeave" name="compensatoryLeave" type="number" value={oneDay.compensatoryLeave?.toNumber()}
              min={0} max={7.5} step={0.5}
              onChange={(e) => changeDay('compensatoryLeave', new Decimal(e.target.value))}
            />
          </div>
          {oneDay.interruptions.map((interruption) => (
            <InterruptionTime key={interruption.id} {...interruption} remove={removeInterruption} update={updateInterruption} />
          ))}
          <div>
            <Button disabled={isDisabled} variant={'outline'} type="button" onClick={(e) => addInterruption(e, InterruptionWithTimeType.DOCTORS_LEAVE)}><Cross /> P-cko</Button>
          </div>
          <div className="flex items-center justify-end">
            <Button disabled={isDisabled} variant={'outline'} type="button" onClick={(e) => addInterruption(e, InterruptionWithTimeType.DOCTORS_LEAVE_FAMILY)}><UserRoundPlus /> Doprovod</Button>
          </div>
        </div>
      </div>
      <DrawerFooter>
        <DrawerClose asChild>
          <div className="flex justify-center space-x-2">
            <Button name="Save">Uložiť</Button>
            <Button variant="outline" type="button">Zrušiť</Button>
          </div>
        </DrawerClose>
      </DrawerFooter>
    </form>
  );
}

export default WorkDayForm