const express = require('express')
const bodyParser = require('body-parser')
const buildDb = require('./db')

const app = express()
const port = process.env.PORT || 8080
const db = buildDb()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.json('Hello World!')
})

app.post('/', (req, res) => {
  const { body } = req

  res.json(body)
})

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server start on port ${port}`)
})
