import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [flightNumber, setFlightNumber] = useState('')
  const [flight, setFlight] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
const [flights, setFlights] = useState([])
  const [newFlight, setNewFlight] = useState({
    flight_no: '',
    airline: '',
    origin: '',
    destination: '',
    departure: '',
    arrival: '',
    status: 'On Time'
  })
  const [updateFlightNo, setUpdateFlightNo] = useState('')
const [updatedStatus, setUpdatedStatus] = useState('Delayed')
const [updateMessage, setUpdateMessage] = useState('')


  async function handleSearch() {
    setError('')
setFlight(null)
    if (flightNumber.trim() === '') {
      setError('Please enter a flight number')
      setFlight(null)
      return
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/flights/${flightNumber.trim()}`
      )
      const data = await response.json()

      if (!response.ok) {
        setError(data.message)
        setFlight(null)
        return
      }

      setFlight(data)
      setError('')
    } catch {
      setError('Cannot connect to the backend')
      setFlight(null)
    }
  }

  function handleChange(event) {
    setNewFlight({
      ...newFlight,
      [event.target.name]: event.target.value
    })
  }

  async function handleAddFlight(event) {
    event.preventDefault()
    setMessage('')

    try {
      const response = await fetch('http://localhost:5000/api/flights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newFlight)
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.message)
        return
      }

      setMessage('Flight added successfully!')
      loadFlights()
      setNewFlight({
        flight_no: '',
        airline: '',
        origin: '',
        destination: '',
        departure: '',
        arrival: '',
        status: 'On Time'
      })
    } catch {
      setMessage('Cannot connect to the backend')
    }
  }


  
async function handleUpdateStatus(event) {
  event.preventDefault()
  setUpdateMessage('')

  try {
    const response = await fetch(
      `http://localhost:5000/api/flights/${updateFlightNo.trim()}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: updatedStatus })
      }
    )

    const data = await response.json()

    if (!response.ok) {
      setUpdateMessage(data.message)
      return
    }

    setUpdateMessage('Flight status updated successfully!')
    loadFlights()
  } catch {
    setUpdateMessage('Cannot connect to the backend')
  }
}
async function loadFlights() {
  try {
    const response = await fetch('http://localhost:5000/api/flights')
    const data = await response.json()

    if (response.ok) {
      setFlights(data)
    }
  } catch (error) {
    console.log('Error loading flights:', error)
  }
}

useEffect(() => {
  loadFlights()
}, [])

  return (
    <div className="app">
      <header className="navbar">
        <h2>✈ FlightWatch</h2>
        <span>Flight Information System</span>
      </header>

      <main className="main">
        <section className="hero">
          <p className="tagline">YOUR JOURNEY, TRACKED</p>
          <h1>Find your flight.</h1>
          <p className="description">
            Search flights and check their latest recorded status.
          </p>

          <div className="search-box">
            <input
              type="text"
              placeholder="Enter flight number (e.g. AI101)"
              value={flightNumber}
              onChange={(event) => setFlightNumber(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') handleSearch()
              }}
            />
            <button onClick={handleSearch}>Search Flights</button>
          </div>
        </section>

        {error && <section className="info"><p>{error}</p></section>}

        {flight && (
          <section className="info">
            <h2>{flight.airline} — {flight.flight_no}</h2>
            <p><strong>From:</strong> {flight.origin}</p>
            <p><strong>To:</strong> {flight.destination}</p>
            <p><strong>Departure:</strong> {flight.departure}</p>
            <p><strong>Arrival:</strong> {flight.arrival}</p>
            <p><strong>Status:</strong> {flight.status}</p>
          </section>
        )}

<section className="info flights-list">
  <h2>All Flights</h2>
  <p>Browse all flights currently recorded in FlightWatch.</p>

  {flights.length === 0 ? (
    <p>No flights available.</p>
  ) : (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Flight No.</th>
            <th>Airline</th>
            <th>Origin</th>
            <th>Destination</th>
            <th>Departure</th>
            <th>Arrival</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {flights.map((item) => (
            <tr key={item.flight_no}>
              <td>{item.flight_no}</td>
              <td>{item.airline}</td>
              <td>{item.origin}</td>
              <td>{item.destination}</td>
              <td>{item.departure}</td>
              <td>{item.arrival}</td>
              <td>
  <span className={`status ${item.status.toLowerCase().replace(' ', '-')}`}>
    {item.status}
  </span>
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</section>

        <section className="info admin">
          <h2>Admin: Add a Flight</h2>
          <p>Enter the details of a new flight.</p>

          <form onSubmit={handleAddFlight}>
            <input
              name="flight_no"
              placeholder="Flight number (e.g. AI202)"
              value={newFlight.flight_no}
              onChange={handleChange}
              required
            />

            <input
              name="airline"
              placeholder="Airline"
              value={newFlight.airline}
              onChange={handleChange}
              required
            />

            <input
              name="origin"
              placeholder="Origin"
              value={newFlight.origin}
              onChange={handleChange}
              required
            />

            <input
              name="destination"
              placeholder="Destination"
              value={newFlight.destination}
              onChange={handleChange}
              required
            />

            <input
              name="departure"
              placeholder="Departure time"
              value={newFlight.departure}
              onChange={handleChange}
              required
            />

            <input
              name="arrival"
              placeholder="Arrival time"
              value={newFlight.arrival}
              onChange={handleChange}
              required
            />

            <select
              name="status"
              value={newFlight.status}
              onChange={handleChange}
            >
              <option>On Time</option>
              <option>Delayed</option>
              <option>Cancelled</option>
              <option>Boarding</option>
            </select>

            <button type="submit">Add Flight</button>
          </form>

          {message && <p>{message}</p>}
        </section>
        
<section className="info admin">
  <h2>Admin: Update Flight Status</h2>

  <form onSubmit={handleUpdateStatus}>
    <input
      placeholder="Enter flight number (e.g. AI101)"
      value={updateFlightNo}
      onChange={(event) => setUpdateFlightNo(event.target.value)}
      required
    />

    <select
      value={updatedStatus}
      onChange={(event) => setUpdatedStatus(event.target.value)}
    >
      <option>On Time</option>
      <option>Delayed</option>
      <option>Cancelled</option>
      <option>Boarding</option>
    </select>

    <button type="submit">Update Status</button>
  </form>

  {updateMessage && <p>{updateMessage}</p>}
</section>

      </main>

      <footer>FlightWatch · Flight information made simple</footer>
    </div>
  )
}

export default App