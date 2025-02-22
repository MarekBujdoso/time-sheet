import { getDaysInMonth } from "date-fns/getDaysInMonth"
import { toDate } from "date-fns/toDate"
import React from "react"
import MonthPager from "../../components/month-pager"
import WorkDayBox from "../../components/month/WorkDayBox"
import { WorkDay } from "./types"
import Decimal from "decimal.js"

const config = {
  dailyWorkTime: 7.5,
  lunchBreak: 0.5,
}

const tempData: WorkDay[] = [
  {
    month: 1,
    year: 2025,
    startTime: toDate(new Date(2025, 0, 1, 7, 30, 0)),
    endTime: toDate(new Date(2025, 0, 1, 15, 30, 0)),
    dayWorked: new Decimal(0),
    vacation: new Decimal(7.5),
  },
  {
    month: 1,
    year: 2025,
    startTime: toDate(new Date(2025, 0, 2, 7, 30, 0)),
    endTime: toDate(new Date(2025, 0, 2, 14, 30, 0)),
    doctorsLeaveFamily: new Decimal(7.5),
    dayWorked: new Decimal(0),
  },
  {
    month: 1,
    year: 2025,
    startTime: toDate(new Date(2025, 0, 3, 7, 30, 0)),
    endTime: toDate(new Date(2025, 0, 3, 15, 30, 0)),
    sickLeaveFamily: true,
    dayWorked: new Decimal(0),
  },
  {
    month: 1,
    year: 2025,
    startTime: toDate(new Date(2025, 0, 4, 7, 30, 0)),
    endTime: toDate(new Date(2025, 0, 4, 15, 30, 0)),
    dayWorked: new Decimal(0),
    sickLeave: true,
  },
  {
    month: 1,
    year: 2025,
    startTime: toDate(new Date(2025, 0, 5, 7, 30, 0)),
    endTime: toDate(new Date(2025, 0, 5, 14, 30, 0)),
    compensatoryLeave: new Decimal(7.5),
    dayWorked: new Decimal(7.5),
  },
  {
    month: 1,
    year: 2025,
    startTime: toDate(new Date(2025, 0, 6, 7, 30, 0)),
    endTime: toDate(new Date(2025, 0, 6, 15, 30, 0)),
    dayWorked: new Decimal(0),
    holiday: true,
  },
  {
    month: 2,
    year: 2025,
    startTime: toDate(new Date(2025, 1, 1, 0, 0, 0)),
    endTime: toDate(new Date(2025, 1, 1, 0, 0, 0)),
    lunch: false,
    compensatoryLeave: new Decimal(0),
    doctorsLeave: new Decimal(0),
    doctorsLeaveFamily: new Decimal(0),
    sickLeaveFamily: false,
    dayWorked: new Decimal(0),
    workFromHome: new Decimal(0),
    sickLeave: false,
  },
  {
    month: 2,
    year: 2025,
    startTime: toDate(new Date(2025, 1, 2, 7, 30, 0)),
    endTime: toDate(new Date(2025, 1, 2, 14, 30, 0)),
    doctorsLeave: new Decimal(7.5),
    dayWorked: new Decimal(0),
  },
  {
    month: 2,
    year: 2025,
    startTime: toDate(new Date(2025, 1, 3, 7, 30, 0)),
    endTime: toDate(new Date(2025, 1, 3, 15, 30, 0)),
    lunch: true,
    compensatoryLeave: new Decimal(0.5),
    doctorsLeave: new Decimal(0.5),
    doctorsLeaveFamily: new Decimal(0.5),
    dayWorked: new Decimal(4.5),
    workFromHome: new Decimal(0),
    vacation: new Decimal(0.5),
  },
  {
    month: 2,
    year: 2025,
    startTime: toDate(new Date(2025, 1, 4, 7, 30, 0)),
    endTime: toDate(new Date(2025, 1, 4, 15, 30, 0)),
    lunch: true,
    compensatoryLeave: new Decimal(0),
    doctorsLeave: new Decimal(0),
    doctorsLeaveFamily: new Decimal(0),
    dayWorked: new Decimal(7.5),
    workFromHome: new Decimal(0),
  },
  {
    month: 2,
    year: 2025,
    startTime: toDate(new Date(2025, 1, 5, 7, 30, 0)),
    endTime: toDate(new Date(2025, 1, 5, 15, 30, 0)),
    lunch: false,
    compensatoryLeave: new Decimal(0),
    doctorsLeave: new Decimal(0),
    doctorsLeaveFamily: new Decimal(0),
    dayWorked: new Decimal(7.5),
    workFromHome: new Decimal(0),
  },
  {
    month: 2,
    year: 2025,
    startTime: toDate(new Date(2025, 1, 6, 7, 30, 0)),
    endTime: toDate(new Date(2025, 1, 6, 15, 30, 0)),
    lunch: true,
    compensatoryLeave: new Decimal(0),
    doctorsLeave: new Decimal(0),
    doctorsLeaveFamily: new Decimal(0),
    dayWorked: new Decimal(7.5),
    workFromHome: new Decimal(0),
  },
  {
    month: 2,
    year: 2025,
    startTime: toDate(new Date(2025, 1, 7, 7, 30, 0)),
    endTime: toDate(new Date(2025, 1, 7, 15, 30, 0)),
    sickLeave: true,
    dayWorked: new Decimal(0),
  },
  {
    month: 3,
    year: 2025,
    startTime: toDate(new Date(2025, 2, 4, 7, 30, 0)),
    endTime: toDate(new Date(2025, 2, 4, 15, 30, 0)),
    sickLeave: true,
    dayWorked: new Decimal(0),
  }
]

const addMissingDays = (data: WorkDay[], activeYear: number, activeMonth: number): WorkDay[] => {
  const daysInMonth = getDaysInMonth(new Date(activeYear, activeMonth))
  const days = data.map((data) => data.startTime.getDate())
  for (let i = 1; i <= daysInMonth; i++) {
    if (!days.includes(i)) {
      data.push({
        month: 1,
        year: 2025,
        startTime: toDate(new Date(2025, activeMonth, i, 0, 0, 0)),
        endTime: toDate(new Date(2025, activeMonth, i, 0, 0, 0)),
        lunch: false,
        compensatoryLeave: new Decimal(0),
        doctorsLeave: new Decimal(0),
        doctorsLeaveFamily: new Decimal(0),
        sickLeaveFamily: false,
        dayWorked: new Decimal(0),
        workFromHome: new Decimal(0),
        sickLeave: false,
      })
    }
  }
  return data.sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
}

const Sheet = () => {
  // const currentMonth = new Date().getMonth() + 1
  const [activeMonth, setActiveMonth] = React.useState(new Date().getMonth() + 1)
  const [activeYear, setActiveYear] = React.useState(new Date().getFullYear())
  
  const data = React.useMemo(() => (
    tempData.filter((data) => data.month === activeMonth && data.year === activeYear)
  ), [activeMonth, activeYear])
  const [monthData, setMonthData] = React.useState(addMissingDays(data, activeYear, activeMonth-1)) // mothData or data ???

  const sickLeave = monthData.filter((data) => data.sickLeave).reduce((acc, data) => acc + (data.sickLeave ? config.dailyWorkTime : 0), 0)
  const sickLeaveDays = (sickLeave / config.dailyWorkTime).toFixed(1)
  const doctorsLeave = monthData.filter((data) => data.doctorsLeave).reduce((acc, data) => acc + (data.doctorsLeave?.toNumber() ?? 0), 0)
  const doctorsLeaveDays = (doctorsLeave / config.dailyWorkTime).toFixed(1)
  const doctorsLeaveFamily = monthData.filter((data) => data.doctorsLeaveFamily).reduce((acc, data) => acc + (data.doctorsLeaveFamily?.toNumber() ?? 0), 0)
  const doctorsLeaveFamilyDays = (doctorsLeaveFamily / config.dailyWorkTime).toFixed(1)
  const worked = monthData.filter((data) => data.dayWorked).reduce((acc, data) => acc + (data.dayWorked.toNumber()), 0)
  const workedDays = (worked / config.dailyWorkTime).toFixed(1)
  const compensatoryLeave = monthData.filter((data) => data.compensatoryLeave).reduce((acc, data) => acc + (data.compensatoryLeave?.toNumber() ?? 0), 0)
  const compensatoryLeaveDays = (compensatoryLeave / config.dailyWorkTime).toFixed(1)
  const sickLeaveFamily = monthData.filter((data) => data.sickLeaveFamily).reduce((acc, data) => acc + (data.sickLeaveFamily ? config.dailyWorkTime : 0), 0)
  const sickLeaveFamilyDays = (sickLeaveFamily / config.dailyWorkTime).toFixed(1)
  
  const saveWorkDay = React.useCallback((workDay: WorkDay) => {
    setMonthData((month) => {
      const dayIndex = month.findIndex((data) => data.startTime.getDate() === workDay.startTime.getDate())
      if (dayIndex !== -1) {
        month[dayIndex] = workDay
      }
      return [...month]
    })
  }, [])


  return (
    <div className="flex flex-col w-full min-w-[400px] min-h-svh justify-top border-2 border-black p-2 rounded-lg ">
      <MonthPager month={activeMonth} setMonth={setActiveMonth} year={activeYear} setYear={setActiveYear}/>
      <div className="grid auto-rows-min gap-2 md:grid-cols-3 grid-cols-2">
        {/* <div className="flex flex-col"> */}
          <span>odpr.: {worked}h / {workedDays}d</span>
          <span>NV: {compensatoryLeave}h / {compensatoryLeaveDays}d</span>
          <span>P-cko: {doctorsLeave}h / {doctorsLeaveDays}d</span>
          <span>Dopr.: {doctorsLeaveFamily}h / {doctorsLeaveFamilyDays}d</span>
          <span>PN: {sickLeave}h / {sickLeaveDays}d</span>
          <span>OCR: {sickLeaveFamily}h / {sickLeaveFamilyDays}d</span>
        {/* </div> */}
      </div>
      <div>
        <div className="grid auto-rows-min gap-1 md:grid-cols-3">
          {monthData.map((data) => (
            <WorkDayBox key={data.startTime.toISOString()} {...data} saveWorkDay={saveWorkDay} />
          ))}
          {/* <WorkDayCollapsible
            month={1}
            year={2025}
            startTime={new Date()}
            endTime={new Date()}
            lunch={true}
            compensatoryLeave={new Decimal(0)}
            doctorsLeave={new Decimal(7.5)}
            doctorsLeaveFamily={new Decimal(0)}
            sickLeaveFamily={false}
            dayWorked={new Decimal(0)}
            workFromHome={new Decimal(0)}
            sickLeave={false}
          /> */}
        </div>
      </div>
    </div>
  )
}

export default Sheet