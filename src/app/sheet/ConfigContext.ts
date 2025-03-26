import Decimal from "decimal.js"
import React from "react"

export interface ConfigContextType {
  officialWorkTime: Decimal
  lunchBreak: number
  officialStartTime: {hours: number, minutes: number}
  officialEndTime: {hours: number, minutes: number}
  defaultStartTime: {hours: number, minutes: number}
  defaultEndTime: {hours: number, minutes: number}
}

const ConfigContext = React.createContext<ConfigContextType>({
  officialWorkTime: new Decimal(7.5),
  lunchBreak: 0.5,
  officialStartTime: {hours: 7, minutes: 30}, 
  officialEndTime: {hours: 15, minutes: 30}, // calculated from startTime, officialWorkTime and lunchBreak
  defaultStartTime: {hours: 7, minutes: 30},
  defaultEndTime: {hours: 15, minutes: 30},
})

export default ConfigContext