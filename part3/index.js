const http = require ('http')
require('dotenv').config()

const express = require ('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()

const Person = require('./models/person')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

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

app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(results => {
        response.json(results.map(person => person.toJSON()))
    }).catch(error => next(error))   
})

app.get('/api/persons/:id', (request, response,next) => {
    Person.findById(request.params.id)
        .then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }        
        })
        .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
    response.send(
        `<p>Phonebook has info for ${persons.length} people <br><br> ${Date()} </p>`
        ).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const newPerson = new Person({
        name: request.body.name,
        number: request.body.number
    })
    newPerson
        .save()
        .then(savedPerson => savedPerson.toJSON())
        .then(savedAndFormattedPerson => {
            response.json(savedAndFormattedPerson)
        }) 
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const updatedPerson = {
        name: request.body.name,
        number: request.body.number,
    }
    Person.findByIdAndUpdate(request.params.id, updatedPerson, {new: true})
        .then(updatedPerson => {
        response.json(updatedPerson)
    })
        .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if(error.name === 'CastError') {
        return response.status(400).send({error: 'malformatted id'})
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    }
    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
