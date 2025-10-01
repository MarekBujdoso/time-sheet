import Decimal from "decimal.js"
import React from "react"

export interface ConfigContextType {
  userName: string
  officialWorkTime: Decimal
  lunchBreak: number
  officialStartTime: {hours: number, minutes: number}
  officialEndTime: {hours: number, minutes: number}
  defaultStartTime: {hours: number, minutes: number}
  defaultEndTime: {hours: number, minutes: number}
}

export const configDefaults: ConfigContextType = {
  userName: '',
  officialWorkTime: new Decimal(7.5),
  lunchBreak: 0.5,
  officialStartTime: {hours: 7, minutes: 30}, 
  officialEndTime: {hours: 15, minutes: 0}, // calculated from startTime, officialWorkTime and lunchBreak
  defaultStartTime: {hours: 7, minutes: 30}, // default - fixed time
  defaultEndTime: {hours: 15, minutes: 0}, 
}

// export const configDefaults: ConfigContextType = {
//   userName: '',
//   officialWorkTime: new Decimal(6.25),
//   lunchBreak: 0.5,
//   officialStartTime: {hours: 7, minutes: 30}, 
//   officialEndTime: {hours: 13, minutes: 45}, // calculated from startTime, officialWorkTime and lunchBreak
//   defaultStartTime: {hours: 7, minutes: 30}, // default - fixed time
//   defaultEndTime: {hours: 13, minutes: 45}, 
// }

const ConfigContext = React.createContext<ConfigContextType>(configDefaults)

export default ConfigContext