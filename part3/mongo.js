const mongoose = require('mongoose')

if (process.argv.length <3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://trishateh:${password}@cluster0.wni4v.mongodb.net/person-app?retryWrites=true&w=majority`

mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', phonebookSchema)

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
    })
} else if (process.argv.length === 5) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })

    person.save().then(result => {
        console.log(`Added "${process.argv[3]}" with number "${process.argv[4]}" to phonebook`)
        mongoose.connection.close()
    })
}

