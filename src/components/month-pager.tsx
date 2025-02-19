import React, { SetStateAction } from "react"
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "./ui/pagination"


const monthsMap: { [key: number]: string } = {
  1: "Januar", 
  2: "Februar", 
  3: "Marec", 
  4: "April", 
  5: "Maj", 
  6: "Jun", 
  7: "Jul", 
  8: "August", 
  9: "September", 
  10: "Oktober", 
  11: "November", 
  12: "December",
}

interface MonthPagerProps {
  month: number,
  setMonth: (month: SetStateAction<number>) => void
  year: number,
  setYear: (year: SetStateAction<number>) => void
}

const MonthPager = ({ month, setMonth, year, setYear }: MonthPagerProps) => {
  const switchToPrevMonth = React.useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (month === 1) {
      setYear((prev: number) => prev - 1)
    }
    setMonth((prev: number) => prev > 1 ? prev - 1 : 12)
  }, [month, setMonth, setYear])

  const switchToNextMonth = React.useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (month === 12) {
      setYear((prev: number) => prev + 1)
    }
    setMonth((prev: number) => prev < 12 ? prev + 1 : 1)
  }, [month, setMonth, setYear])

  return (
//   <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
  <div className="flex  w-full">
    <div className="w-full">
      <Pagination >
        <PaginationContent className="w-full justify-between">
          <PaginationItem>
            <PaginationPrevious size="lg" className="select-none" onClick={switchToPrevMonth} />
          </PaginationItem>
          {/* <PaginationItem>
            <PaginationLink className="w-40 select-none" onClick={handleMonth} isActive>{monthsMap[activeMonth]}</PaginationLink>
          </PaginationItem> */}
          <div className="w-40 select-none">
            {`${monthsMap[month]} ${year}`}
          </div>
          {/* <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem> */}
          <PaginationItem>
            <PaginationNext size="lg" className="select-none" onClick={switchToNextMonth} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  </div>
  )
}

export default MonthPager