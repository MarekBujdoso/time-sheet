// import { useState } from 'react'
import Decimal from 'decimal.js'
import './App.css'
import ConfigContext from './app/sheet/ConfigContext'
import Sheet from './app/sheet/Sheet'

function App() {
  // const [count, setCount] = useState(0)

// urobit tu context a provider pre nejaky config prihlaseneho usera
  return (
    <ConfigContext.Provider value={{ officialWorkTime: new Decimal(7.5), lunchBreak: 0.5, officialStartTime: { hours: 7, minutes: 30 }, officialEndTime: { hours: 15, minutes: 30 } }}>
      <Sheet />
    </ConfigContext.Provider>
  )
}

export default App
