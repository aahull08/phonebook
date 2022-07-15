require('dotenv').config()
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const Person = require(`./models/person.js`);

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
  Person.find({}).then(people => {
    response.json(people)
  })
})

app.get('/info', (request, response) => {
  const numOfPeople = `Phonebook has infor for ${persons.length} people.`
  const date = new Date()
  response.send(`<p>${numOfPeople}</p><p>${date}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
  // const id = Number(request.params.id);
  // const person = persons.find(person => person.id === id);
  // if(!person){
  //   response.status(402).end()
  // } else {
  //   response.send(person)
  // }
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(500).send({error: 'malformatted id'})
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons/', (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(404).json({error: "Name Missing"})
  } else if (!body.number){
    return response.status(404).json({error: "Number Missing"})
  }

  const person = new Person({
    "name": body.name,
    "number": body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.put('/api/persons/:id', (request, response) => {
  const body = request.body;
  const person ={
    name: body.name,
    number: body.number
  }
  
  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

// const errorHandler = (error, request, response, next) => {
//   console.error(error);

//   if (error.name === 'CastError') {
//     return response.status(400).send({ error: 'malformatted id' })
//   } 

//   next(error)
// }



const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// errorhandler middleware???