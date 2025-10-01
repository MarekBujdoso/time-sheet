import './App.css';
import ConfigContext, { configDefaults } from './app/sheet/ConfigContext';
import Sheet from './app/sheet/Sheet';

function App() {
  // config prihlaseneho usera
  return (
    <ConfigContext.Provider value={configDefaults}>
      <Sheet />
    </ConfigContext.Provider>
  );
}

export default App;
