const { response, request } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())
app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        JSON.stringify(req.body)
    ].join(' ')
}))

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

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</P>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(item => item.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateId = () => {
    const ids = persons.map(person => person.id)
    while (true) {
        const newId = Math.floor(Math.random() * 99999999999)
        if (ids.indexOf(newId) < 0)
            return newId
    }
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    const names = persons.map(person => person.name)
    if (!body.name) {
        response.status(400).json({
            error: 'name must be presented'
        })
    } else if (names.includes(body.name)) {
        response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        'name': body.name,
        'number': body.number,
        'id': generateId(),
        'date': new Date()
    }

    persons = persons.concat(person)

    response.json(person)

})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})