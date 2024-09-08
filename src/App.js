import './App.css'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import CitiesTable from './components/CitiesTable'
import WeatherPage from './components/WeatherPage'

const App = () => {
  console.log('app started')
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<CitiesTable />} />
          <Route path="/weather/:city" element={<WeatherPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
