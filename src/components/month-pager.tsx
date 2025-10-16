import React from "react"
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "./ui/pagination"
import { getMonthName, MAX_MONTH, MIN_MONTH } from "../utils/skUtils"

interface MonthPagerProps {
  update: (month: number, year: number) => void
}

const MonthPager = ({ update }: MonthPagerProps) => {
  const [activeMonth, setActiveMonth] = React.useState(new Date().getMonth())
  const [activeYear, setActiveYear] = React.useState(new Date().getFullYear())
  const switchToPrevMonth = React.useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const month = activeMonth === MIN_MONTH ? MAX_MONTH : activeMonth - 1
    const year = activeMonth === MIN_MONTH ? activeYear - 1 : activeYear
    setActiveMonth(month)
    setActiveYear(year)
    update(month, year)
  }, [activeMonth, setActiveMonth, setActiveYear, update, activeYear])

  const switchToNextMonth = React.useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const month = activeMonth === MAX_MONTH ? MIN_MONTH : activeMonth + 1
    const year = activeMonth === MAX_MONTH ? activeYear + 1 : activeYear
    setActiveMonth(month)
    setActiveYear(year)
    update(month, year)
  }, [activeMonth, setActiveMonth, setActiveYear, update, activeYear])

  return (
  <div className="flex  w-full">
    <div className="w-full">
      <Pagination >
        <PaginationContent className="w-full justify-between">
          <PaginationItem>
            <PaginationPrevious size="lg" className="select-none px-8 border bg-white shadow-md" onClick={switchToPrevMonth} />
          </PaginationItem>
          <div className="w-50 select-none font-semibold text-xl">
            {`${getMonthName(activeMonth)} ${activeYear}`}
          </div>
          <PaginationItem>
            <PaginationNext size="lg" className="select-none border px-8 bg-white shadow-md" onClick={switchToNextMonth} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  </div>
  )
}

export default MonthPager