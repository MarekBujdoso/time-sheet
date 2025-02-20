import { getDaysInMonth } from "date-fns/getDaysInMonth"
import { toDate } from "date-fns/toDate"
import React from "react"
import MonthPager from "../../components/month-pager"
import WorkDayBox from "../../components/month/WorkDayBox"
import WorkDayCollapsible from "../../components/month/WorkDayCollapsible"
import { WorkDay } from "./types"

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
    dayWorked: 0,
    vacation: 7.5,
  },
  {
    month: 1,
    year: 2025,
    startTime: toDate(new Date(2025, 0, 2, 7, 30, 0)),
    endTime: toDate(new Date(2025, 0, 2, 14, 30, 0)),
    doctorsLeaveFamily: 7.5,
    dayWorked: 0,
  },
  {
    month: 1,
    year: 2025,
    startTime: toDate(new Date(2025, 0, 3, 7, 30, 0)),
    endTime: toDate(new Date(2025, 0, 3, 15, 30, 0)),
    sickLeaveFamily: true,
    dayWorked: 0,
  },
  {
    month: 1,
    year: 2025,
    startTime: toDate(new Date(2025, 0, 4, 7, 30, 0)),
    endTime: toDate(new Date(2025, 0, 4, 15, 30, 0)),
    dayWorked: 0,
    sickLeave: true,
  },
  {
    month: 1,
    year: 2025,
    startTime: toDate(new Date(2025, 0, 5, 7, 30, 0)),
    endTime: toDate(new Date(2025, 0, 5, 14, 30, 0)),
    compensatoryLeave: 7.5,
    dayWorked: 7.5,
  },
  {
    month: 1,
    year: 2025,
    startTime: toDate(new Date(2025, 0, 6, 7, 30, 0)),
    endTime: toDate(new Date(2025, 0, 6, 15, 30, 0)),
    dayWorked: 0,
    holiday: true,
  },
  {
    month: 2,
    year: 2025,
    startTime: toDate(new Date(2025, 1, 1, 0, 0, 0)),
    endTime: toDate(new Date(2025, 1, 1, 0, 0, 0)),
    lunchTime: 0,
    compensatoryLeave: 0,
    doctorsLeave: 0,
    doctorsLeaveFamily: 0,
    sickLeaveFamily: false,
    dayWorked: 0,
    workFromHome: 0,
    sickLeave: false,
  },
  {
    month: 2,
    year: 2025,
    startTime: toDate(new Date(2025, 1, 2, 7, 30, 0)),
    endTime: toDate(new Date(2025, 1, 2, 14, 30, 0)),
    doctorsLeave: 7.5,
    dayWorked: 0,
  },
  {
    month: 2,
    year: 2025,
    startTime: toDate(new Date(2025, 1, 3, 7, 30, 0)),
    endTime: toDate(new Date(2025, 1, 3, 15, 30, 0)),
    lunchTime: 0.5,
    compensatoryLeave: 0.5,
    doctorsLeave: 0.5,
    doctorsLeaveFamily: 0.5,
    dayWorked: 4.5,
    workFromHome: 0,
    vacation: 0.5,
  },
  {
    month: 2,
    year: 2025,
    startTime: toDate(new Date(2025, 1, 4, 7, 30, 0)),
    endTime: toDate(new Date(2025, 1, 4, 15, 30, 0)),
    lunchTime: 0.5,
    compensatoryLeave: 0,
    doctorsLeave: 0,
    doctorsLeaveFamily: 0,
    dayWorked: 7.5,
    workFromHome: 0,
  },
  {
    month: 2,
    year: 2025,
    startTime: toDate(new Date(2025, 1, 5, 7, 30, 0)),
    endTime: toDate(new Date(2025, 1, 5, 15, 30, 0)),
    lunchTime: 0,
    compensatoryLeave: 0,
    doctorsLeave: 0,
    doctorsLeaveFamily: 0,
    dayWorked: 7.5,
    workFromHome: 0,
  },
  {
    month: 2,
    year: 2025,
    startTime: toDate(new Date(2025, 1, 6, 7, 30, 0)),
    endTime: toDate(new Date(2025, 1, 6, 15, 30, 0)),
    lunchTime: 0.5,
    compensatoryLeave: 0,
    doctorsLeave: 0,
    doctorsLeaveFamily: 0,
    dayWorked: 7.5,
    workFromHome: 0,
  },
  {
    month: 2,
    year: 2025,
    startTime: toDate(new Date(2025, 1, 7, 7, 30, 0)),
    endTime: toDate(new Date(2025, 1, 7, 15, 30, 0)),
    sickLeave: true,
    dayWorked: 0,
  },
  {
    month: 3,
    year: 2025,
    startTime: toDate(new Date(2025, 2, 4, 7, 30, 0)),
    endTime: toDate(new Date(2025, 2, 4, 15, 30, 0)),
    sickLeave: true,
    dayWorked: 0,
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
        lunchTime: 0,
        compensatoryLeave: 0,
        doctorsLeave: 0,
        doctorsLeaveFamily: 0,
        sickLeaveFamily: false,
        dayWorked: 0,
        workFromHome: 0,
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
  
  const data = tempData.filter((data) => data.month === activeMonth && data.year === activeYear)
  const monthData = addMissingDays(data, activeYear, activeMonth-1)

  const sickLeave = monthData.filter((data) => data.sickLeave).reduce((acc, data) => acc + (data.sickLeave ? config.dailyWorkTime : 0), 0)
  const sickLeaveDays = (sickLeave / config.dailyWorkTime).toFixed(1)
  const doctorsLeave = monthData.filter((data) => data.doctorsLeave).reduce((acc, data) => acc + (data.doctorsLeave ?? 0), 0)
  const doctorsLeaveDays = (doctorsLeave / config.dailyWorkTime).toFixed(1)
  const doctorsLeaveFamily = monthData.filter((data) => data.doctorsLeaveFamily).reduce((acc, data) => acc + (data.doctorsLeaveFamily ?? 0), 0)
  const doctorsLeaveFamilyDays = (doctorsLeaveFamily / config.dailyWorkTime).toFixed(1)
  const worked = monthData.filter((data) => data.dayWorked).reduce((acc, data) => acc + (data.dayWorked ?? 0), 0)
  const workedDays = (worked / config.dailyWorkTime).toFixed(1)
  const compensatoryLeave = monthData.filter((data) => data.compensatoryLeave).reduce((acc, data) => acc + (data.compensatoryLeave ?? 0), 0)
  const compensatoryLeaveDays = (compensatoryLeave / config.dailyWorkTime).toFixed(1)
  const sickLeaveFamily = monthData.filter((data) => data.sickLeaveFamily).reduce((acc, data) => acc + (data.sickLeaveFamily ? config.dailyWorkTime : 0), 0)
  const sickLeaveFamilyDays = (sickLeaveFamily / config.dailyWorkTime).toFixed(1)
  
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
          {data.map((data) => (
            <WorkDayBox key={data.startTime.toISOString()} {...data} />
          ))}
          <WorkDayCollapsible
            month={1}
            year={2025}
            startTime={new Date()}
            endTime={new Date()}
            lunchTime={0.5}
            compensatoryLeave={0}
            doctorsLeave={7.5}
            doctorsLeaveFamily={0}
            sickLeaveFamily={false}
            dayWorked={0}
            workFromHome={0}
            sickLeave={false}
          />
        </div>
      </div>
    </div>
  )
}

export default Sheet