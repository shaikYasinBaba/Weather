import {useEffect, useState} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import '../WeatherPage.css'

const WeatherPage = () => {
  const [weatherData, setWeatherData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const {state} = location
  const {lat, lon} = state || {}
  const navigate = useNavigate()

  const navigationtohome = () => {
    navigate('/')
  }

  // My API key
  const apiKey = 'b8fbd44d678b8f73c63323f2888f83e3'

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!lat || !lon) {
        setError('Latitude and Longitude are required.')
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        const response = await fetch(apiUrl)

        if (!response.ok) {
          throw new Error('Error fetching weather data')
        }

        const data = await response.json()
        setWeatherData(data)
      } catch (fetchError) {
        // Renamed to fetchError
        setError(fetchError.message)
      } finally {
        setLoading(false)
      }
    }

    fetchWeatherData()
  }, [lat, lon, apiKey])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (weatherData) {
    return (
      <div className="weather-container">
        <h2>Weather in {weatherData.name}</h2>
        <p>Temperature: {weatherData.main.temp}°C</p>
        <p>Weather: {weatherData.weather[0].description}</p>
        <p>Humidity: {weatherData.main.humidity}%</p>
        <p>Wind Speed: {weatherData.wind.speed} m/s</p>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="bi bi-arrow-left-circle"
          onClick={navigationtohome}
          id="myicon"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"
          />
        </svg>
      </div>
    )
  }

  return null
}

export default WeatherPage
