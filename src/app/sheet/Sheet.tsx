import MonthPager from "../../components/month-pager"


const Sheet = () => {
  return (
    <div className="flex flex-col w-full min-h-svh justify-top border-2 border-black p-4 rounded-lg">
      <MonthPager />
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
    </div>
  )
}

export default Sheet