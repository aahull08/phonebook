const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log("connecting to ", url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(err => {
    console.log('error connecting to MongoDB: ', err.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function(num) {
        if (num.includes("-")) {
          return /\d{2,3}-\d/.test(num);
        } else {
          return /\d+/.test(num);
        }
      }
    },
    required: true
  }
})

personSchema.set('toJSON', {
  transform: (document,returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema);