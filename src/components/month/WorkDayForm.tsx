import React from "react";
import { format } from "date-fns/format";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { WorkDay } from "../../app/sheet/types";
import { DrawerClose, DrawerFooter } from "../ui/drawer";
import { Button } from "../ui/button";
import { differenceInMinutes } from "date-fns/differenceInMinutes";
import Decimal from "decimal.js";

const calculateDayWorked = (newDay: WorkDay) => {
  const { startTime, endTime, lunch = false, vacation = new Decimal(0), compensatoryLeave = new Decimal(0), doctorsLeave = new Decimal(0), doctorsLeaveFamily = new Decimal(0) } = newDay
  return (differenceInMinutes(endTime, startTime) - (lunch ? 30 : 0 ) - (vacation.toNumber() * 60) - (compensatoryLeave.toNumber() * 60) - (doctorsLeave.toNumber() * 60) - (doctorsLeaveFamily.toNumber() * 60))/ 60
}

interface WorkDayFormProps extends WorkDay {
  saveWorkDay: (workDay: WorkDay) => void
}

const WorkDayForm = ({
  startTime,
  endTime,
  vacation = new Decimal(0),
  lunch,
  sickLeave,
  sickLeaveFamily,
  compensatoryLeave = new Decimal(0),
  doctorsLeave = new Decimal(0),
  doctorsLeaveFamily = new Decimal(0),
  dayWorked,
  saveWorkDay,
}: WorkDayFormProps) => {  
  const [oneDay, setOneDay] = React.useState<WorkDay>({
    month: startTime.getMonth(),
    year: startTime.getFullYear(),
    dayWorked: new Decimal(calculateDayWorked({
      month: startTime.getMonth(),
      year: startTime.getFullYear(),
      startTime,
      endTime,
      lunch,
      vacation,
      compensatoryLeave,
      doctorsLeave,
      doctorsLeaveFamily,
      dayWorked,
    })),
    startTime,
    endTime,
    vacation,
    lunch,
    sickLeave,
    sickLeaveFamily,
    compensatoryLeave,
    doctorsLeave,
    doctorsLeaveFamily,
  })

  const changeDay = React.useCallback((key: string, value: string | Decimal | boolean | Date) => {
    if ((key === 'startTime' || key === 'endTime') && typeof value === 'string') {
      value = new Date(oneDay[key].setHours(Number(value.split(':')[0]), Number(value.split(':')[1])))
    }

    setOneDay((day) => ({
      ...day,
      [key]: value,
      dayWorked: new Decimal(calculateDayWorked({...day, [key]: value})),
    }))
  }, [oneDay])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveWorkDay(oneDay)
  }

    
  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md border p-2 text-sm shadow-sm">
        <div className="grid grid-cols-2 gap-2 items-left p-2">
          <div>
            <Label htmlFor="startTime">Začiatok</Label>
            <Input 
              id="startTime"
              name="startTime" 
              type="time" 
              value={format(oneDay.startTime, 'HH:mm')}
              onChange={(e) => changeDay('startTime', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="endTime">Koniec</Label>
            <Input
              id="endTime"
              type="time"
              name="endTime"
              value={format(oneDay.endTime, 'HH:mm')}
              onChange={(e) => changeDay('endTime', e.target.value)}
              />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox className="bg-white" id="lunchTime" name="lunchTime" checked={oneDay.lunch}
              onCheckedChange={() => changeDay('lunch', !oneDay.lunch)}
            />
            <label 
              htmlFor="lunchTime"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Obed
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Label>Odpracované</Label>
            <span className="text-lg font-semibold">{oneDay.dayWorked.toDecimalPlaces(3).toNumber()}</span></div>
          <div>
            <Label htmlFor="vacation">Dovolenka</Label>
            <Input id="vacation" type="number" name="vacation" value={oneDay.vacation?.toNumber()}
              onChange={(e) => changeDay('vacation', new Decimal(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="compensatoryLeave">Náhradé voľno</Label>
            <Input id="compensatoryLeave" name="compensatoryLeave" type="number" value={oneDay.compensatoryLeave?.toNumber()}
              onChange={(e) => changeDay('compensatoryLeave', new Decimal(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="doctorsLeave">P-čko</Label>
            <Input id="doctorsLeave" name="doctorsLeave" type="number" value={oneDay.doctorsLeave?.toNumber()}
              onChange={(e) => changeDay('doctorsLeave', new Decimal(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="doctorsLeaveFamily">Doprovod</Label>
            <Input id="doctorsLeaveFamily" name="doctorsLeaveFamily" type="number" value={oneDay.doctorsLeaveFamily?.toNumber()}
              onChange={(e) => changeDay('doctorsLeaveFamily', new Decimal(e.target.value))}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox className="bg-white" id="sickLeave" name="sickLeave" checked={oneDay.sickLeave}
              onCheckedChange={() => changeDay('sickLeave', !oneDay.sickLeave)}
            />
            <label 
              htmlFor="sickLeave"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              PN
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox className="bg-white" id="sickLeaveFamily" name="sickLeaveFamily" checked={oneDay.sickLeaveFamily}
              onCheckedChange={() => changeDay('sickLeaveFamily', !oneDay.sickLeaveFamily)}
            />
            <label 
              htmlFor="sickLeaveFamily"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              OČR
            </label>
          </div>
        </div>
      </div>
      <DrawerFooter>
        <DrawerClose asChild>
          <div>
          <Button>Uložiť</Button>
          <Button variant="outline">Zrušiť</Button>
          </div>
        </DrawerClose>
      </DrawerFooter>
    </form>
  );
}

export default WorkDayForm