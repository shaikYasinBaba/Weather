import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import './CitiesTable.css'

const CitiesTable = () => {
  const [cities, setCities] = useState([])
  const [filteredCities, setFilteredCities] = useState([])
  const [search, setSearch] = useState('')
  const [fetchError, setFetchError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [start, setStart] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const navigate = useNavigate()

  const fetchCitiesData = async startIndex => {
    setLoading(true)
    try {
      const apiUrl = `https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&rows=50&start=${startIndex}`
      const response = await fetch(apiUrl)
      const data = await response.json()
      if (data.records.length === 0) {
        setHasMore(false)
      } else {
        setCities(prevCities => [...prevCities, ...data.records])
        setFilteredCities(prevCities => [...prevCities, ...data.records])
      }
    } catch (error) {
      setFetchError('Error fetching cities data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCitiesData(start)
  }, [start])

  useEffect(() => {
    const filterCities = () => {
      if (search.trim()) {
        const filtered = cities.filter(city =>
          city.fields.label_en
            .toLowerCase()
            .includes(search.trim().toLowerCase()),
        )
        setFilteredCities(filtered)
      } else {
        setFilteredCities(cities)
      }
    }

    const debounceTimeout = setTimeout(() => {
      filterCities()
    }, 300)

    return () => clearTimeout(debounceTimeout)
  }, [search, cities])

  const handleCityClick = city => {
    const {coordinates} = city.geometry
    const [lon, lat] = coordinates

    navigate(`/weather/${city.fields.label_en}`, {state: {lat, lon}})
  }

  const loadMoreCities = () => {
    setStart(prevStart => prevStart + 50)
  }

  return (
    <div className="maindiv">
      <div className="title">
        <div>
          <h1>Cities List</h1>
          {fetchError && <p>{fetchError}</p>}
        </div>
        <div>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Country Name..."
          />
        </div>
      </div>
      <div className="table-div">
        <table className="cities-table">
          <thead className="cities-table-thead">
            <tr>
              <th>City Name</th>
              <th>Country</th>
              <th>Timezone</th>
            </tr>
          </thead>
          <tbody>
            {filteredCities.length > 0 ? (
              filteredCities.map(city => (
                <tr key={city.recordid}>
                  <td onClick={() => handleCityClick(city)}>
                    {city.fields.name}
                  </td>
                  <td>{city.fields.cou_name_en}</td>
                  <td>{city.fields.timezone}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{textAlign: 'center'}}>
                  No such country is found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {loading && <p>Loading more cities...</p>}
      {!hasMore && <p>No more cities to load.</p>}
      {hasMore && !loading && (
        <button type="button" onClick={loadMoreCities}>
          Load More
        </button>
      )}
    </div>
  )
}

export default CitiesTable
