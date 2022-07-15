const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}


const password = process.argv[2]
const name = process.argv[3];
const number = process.argv[4]

const url = `mongodb+srv://aahull08:${password}@cluster0.16wvpec.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

mongoose
  .connect(url)
  .then((result) => {
    console.log('connected')
    if (!name || !number){
      Person.find({}).then((result) => {
        console.log("phonebook:")
        result.forEach((person) => {
          
          console.log(`${person.name} ${person.number}`)
        })
      }).then(() => {
        mongoose.connection.close()
      })
    } else {
      const person = new Person({
        name: name,
        number: number,
      });
      person.save()
      .then(()=> {
        mongoose.connection.close()
      });
      console.log(`Added: ${name} number ${number} to phonebook.`)
    }
  })
  .catch((err) => console.log(err))