import React from "react"
import MonthPager from "../../components/month-pager"
import { Button } from "../../components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../components/ui/collapsible"


const Sheet = () => {
  const [open, setOpen] = React.useState(false)
  const currentMonth = new Date().getMonth() + 1
  return (
    <div className="flex flex-col w-full min-h-svh justify-top border-2 border-black p-4 rounded-lg">
      <MonthPager month={currentMonth}/>
      <div className="flex flex-row w-full gap-4">
        <div className="flex flex-col">
          <span>odpracovane: 60h / 8d</span>
          <span>P-cko: 4h / 0,5d</span>
          <span>PN: 0h / 0d</span>
        </div>
        <div className="flex flex-col">
          <span>nadcasy: 60h / 8d</span>
          <span>P-cko dop.: 0h / 0d</span>
          <span>OCR: 0h / 0d</span>
        </div>
      </div>
      <div>
        <Collapsible className="rounded-md border" open={open} onOpenChange={setOpen}>
          <div className="flex flex-row gap-5 items-center p-2">
            <span className="text-sm font-semibold">1.</span>
            <div className="flex flex-col">
              <span className="text-sm">7:30 - 15:30</span>
              <span className="text-sm">obed: 0,5h</span>
            </div>
            <div className="flex flex-col grow">
              <span className="text-sm">NV: 0h</span>
              <span className="text-sm">P-cko: 0h</span>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="default">
                {/* <ChevronsUpDown className="h-4 w-4" /> */}
                <span className="text-lg font-semibold">7,5</span>
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent className="space-y-2">
            <div className="rounded-md border p-2 text-sm shadow-sm">
              <div className="flex flex-row gap-5 items-center p-2">
                <div className="flex flex-col">
                  <span className="text-sm">7:30 - 15:30</span>
                  <span className="text-sm">obed: 0,5h</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm">NV: 0h</span>
                  <span className="text-sm">P-cko: 0h</span>
                </div>
                <div className="flex flex-col grow">
                  <span className="text-sm">Praca doma: 0h</span>
                  <span className="text-sm">OCR: 0h</span>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
        <Collapsible className="rounded-md border" open={false}>
          <div className="flex flex-row gap-5 items-center p-2">
            <span className="text-sm font-semibold">2.</span>
            <div className="flex flex-col">
              <span className="text-sm">7:30 - 15:30</span>
              <span className="text-sm">obed: 0,5h</span>
            </div>
            <div className="flex flex-col grow">
              <span className="text-sm">NV: 0h</span>
              <span className="text-sm">P-cko: 0h</span>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="default">
                {/* <ChevronsUpDown className="h-4 w-4" /> */}
                <span className="text-lg font-semibold">7,5</span>
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent className="space-y-2">
            <div className="rounded-md border p-2 text-sm shadow-sm">
              <div className="flex flex-row gap-5 items-center p-2">
                <div className="flex flex-col">
                  <span className="text-sm">7:30 - 15:30</span>
                  <span className="text-sm">obed: 0,5h</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm">NV: 0h</span>
                  <span className="text-sm">P-cko: 0h</span>
                </div>
                <div className="flex flex-col grow">
                  <span className="text-sm">Praca doma: 0h</span>
                  <span className="text-sm">OCR: 0h</span>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  )
}

export default Sheet