import Decimal from 'decimal.js';
import './App.css';
import ConfigContext from './app/sheet/ConfigContext';
import Sheet from './app/sheet/Sheet';

function App() {
  // config prihlaseneho usera
  return (
    <ConfigContext.Provider
      value={{
        userName: '',
        officialWorkTime: new Decimal(7.5),
        lunchBreak: 0.5,
        officialStartTime: { hours: 7, minutes: 30 },
        officialEndTime: { hours: 15, minutes: 30 },
        defaultStartTime: { hours: 7, minutes: 30 },
        defaultEndTime: { hours: 15, minutes: 30 },
      }}
    >
      <Sheet />
    </ConfigContext.Provider>
  );
}

export default App;
