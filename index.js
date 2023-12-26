const express = require('express')
const app = express()
const cors = require('cors')


app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

//morgan
const morgan = require('morgan')

// create custom format for morgan, to be logged into terminal
const customFormat = 
morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      JSON.stringify(req.body)
    ].join(' ')
  })

app.use(customFormat)

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

// /
app.get('/', (req, res) => {
    res.send("<h1>PhoneBook</h1>")
})

// /info: Date and # of people in Phonebook 
app.get('/info', (req, res) => {

    // Date
    const currentDateTime = new Date()
    res.send(`Phonebook has info for ${persons.length} people <br /> ${currentDateTime} `)
})

// /api/persons
app.get('/api/persons', (req, res) => {
    res.json(persons)
})

// /api/persons/id - get
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.filter(person => person.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

// api/persons/id - delete
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})


// generate person ID
const generateId = () => {

    // Normal
    // const maxId = persons.length > 0
    // ? Math.max(...persons.map(p => p.id))
    // : 0
    // return maxId + 1

    //Random 
    return Math.floor(Math.random() * (1000000000 - 1) + 1)
}

// api/persons - add note person to phonebook
app.post('/api/persons', (req, res) => {

    const body = req.body 
    // console.log("body", body)
    // console.log("body content", body.name)

    // check if name is missing
    if (!body.name) {
        return res.status(400).json({
            error: 'name missing'
        })
    }

    // check if number is missing 
    if (!body.number) {
        return res.status(400).json({
            error: 'number is missing'
        })
    }

    // Check that name is unique
    if (persons.some(person => person.name === body.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        });
    }



    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    res.json(persons)
})

const PORT = process.env.PORT || 3001 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
