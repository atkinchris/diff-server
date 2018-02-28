const express = require('express')
const bodyParser = require('body-parser')

const buildDb = require('./db')

const server = async () => {
  const app = express()
  const port = process.env.PORT || 8080
  const db = await buildDb()

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.set('view engine', 'ejs')

  app.get('/', async (req, res) => {
    const nominations = await db.all()

    res.render('index', { nominations })
  })

  app.post('/', async (req, res) => {
    const { body } = req

    try {
      await db.insert(body)

      res.redirect('/')
    } catch (error) {
      console.log(error)
      res.status(400).json(error)
    }
  })

  app.get('/nominations/:id', async (req, res) => {
    const { id } = req.params
    const entries = await db.select(id)

    res.json(entries)
  })

  app.post('/nominations:id', async (req, res) => {
    const { body } = req
    const { id } = req.params

    try {
      await db.update(id, body)
      res.sendStatus(200)
    } catch (error) {
      console.log(error)
      res.status(400).json(error)
    }
  })

  app.delete('/:id', async (req, res) => {
    const { id } = req.params

    try {
      await db.remove(id)
      res.sendStatus(200)
    } catch (error) {
      console.log(error)
      res.status(400).json(error)
    }
  })

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server start on port http://localhost:${port}`)
  })
}

server()
