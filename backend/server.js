
const express = require('express')
const cors = require('cors')
const db = require('./db')

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())

// Test backend
app.get('/', (req, res) => {
  res.send('FlightWatch backend is running!')
})

// Get all flights from MySQL
app.get('/api/flights', (req, res) => {
  db.query('SELECT * FROM flights', (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' })
    }

    res.json(results)
  })
})

// Search for a flight
app.get('/api/flights/:flightNo', (req, res) => {
  const flightNo = req.params.flightNo.toUpperCase()

  db.query(
    'SELECT * FROM flights WHERE flight_no = ?',
    [flightNo],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' })
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Flight not found' })
      }

      res.json(results[0])
    }
  )
})

// Add a new flight
app.post('/api/flights', (req, res) => {
  const {
    flight_no,
    airline,
    origin,
    destination,
    departure,
    arrival,
    status
  } = req.body

  if (
    !flight_no?.trim() ||
    !airline?.trim() ||
    !origin?.trim() ||
    !destination?.trim() ||
    !departure?.trim() ||
    !arrival?.trim() ||
    !status
  ) {
    return res.status(400).json({
      message: 'Please fill in all flight details'
    })
  }

  const flight = [
    flight_no.trim().toUpperCase(),
    airline.trim(),
    origin.trim(),
    destination.trim(),
    departure.trim(),
    arrival.trim(),
    status
  ]

  const sql = `
    INSERT INTO flights
    (flight_no, airline, origin, destination, departure, arrival, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `

  db.query(sql, flight, (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          message: 'Flight number already exists'
        })
      }

      return res.status(500).json({ message: 'Database error' })
    }

    res.status(201).json({ message: 'Flight added successfully' })
  })
})

// Update an existing flight's status
app.put('/api/flights/:flightNo', (req, res) => {
  const flightNo = req.params.flightNo.toUpperCase()
  const { status } = req.body

  const allowedStatuses = [
    'On Time',
    'Delayed',
    'Cancelled',
    'Boarding'
  ]

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid flight status' })
  }

  db.query(
    'UPDATE flights SET status = ? WHERE flight_no = ?',
    [status, flightNo],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' })
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Flight not found' })
      }

      res.json({ message: 'Flight status updated successfully' })
    }
  )
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
