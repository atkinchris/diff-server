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

    await db.insert(body)
    res.redirect('/')
  })

  app.get('/:id', async (req, res) => {
    const { id } = req.params
    const nomination = await db.get(id)

    res.render('edit', { nomination })
  })

  app.post('/:id', async (req, res) => {
    const { body } = req
    const { id } = req.params

    await db.update(id, body)
    res.redirect('/')
  })

  app.delete('/:id', async (req, res) => {
    const { id } = req.params

    await db.remove(id)
    res.sendStatus(200)
  })

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server start on port http://localhost:${port}`)
  })
}

server()
