const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');


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

morgan.token('body', req => {
  return JSON.stringify(req.body)
})

app.use(cors());
app.use(express.json())
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body", {
  skip: function(req, ___) {return req.method !== "POST"}
}))
app.use(express.static('build'))

app.get('/api/persons', (request, response) => {
  response.send(persons)
})

app.get('/info', (request, response) => {
  const numOfPeople = `Phonebook has infor for ${persons.length} people.`
  const date = new Date()
  response.send(`<p>${numOfPeople}</p><p>${date}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(person => person.id === id);
  if(!person){
    response.status(402).end()
  } else {
    response.send(person)
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(person => person.id !== id);

  response.status(204).end();
})



app.post('/api/persons/', (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(404).json({error: "Name Missing"})
  } else if (!body.number){
    return response.status(404).json({error: "Number Missing"})
  } else if (persons.find(person => person.name.toLowerCase() === body.name.toLowerCase())){
    return response.status(404).json({error: 'name must be unique'})
  }

  const newPersonObj = {
    id: Math.floor(Math.random() * (10000 - 1) + 1),
    "name": body.name,
    "number": body.number
  }

  persons = persons.concat(newPersonObj)
  response.json(newPersonObj)
})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})