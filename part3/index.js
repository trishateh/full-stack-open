const http = require ('http')
const express = require ('express')
const cors = require('cors')

const morgan = require('morgan')

const app = express()

app.use(morgan(function(tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        req.method === 'POST' ? JSON.stringify(req.body) : ''
    ].join(' ')
}))

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello world!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})


app.get('/info', (request, response) => {
    response.send(
        `<p>Phonebook has info for ${persons.length} people <br><br> ${Date()} </p>`
        )

})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const duplicate = persons.find(person => person.name === request.body.name)
   
   if(request.body.name === undefined || request.body.number === undefined) {
       response.status(400).json({error: 'Content missing'})
   } else if (duplicate) {
       response.status(400).json({error: 'Name must be unique'})
   } else {
       const person = {
           name: request.body.name,
           number: request.body.number,
           id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
       }
       
    persons= persons.concat(person)

    response.json(person) 
   }

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
