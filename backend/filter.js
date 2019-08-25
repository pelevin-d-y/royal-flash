// const people = require('./people')
const fs = require('fs')
const axios = require('axios')
// console.log(people)


const url = 'https://beelineevent.ru'
const config = { headers: {"Access-Control-Allow-Origin": "*"} }

let people
const getPeople = async () => {
  const res = await axios.get(`${url}/people`, config)
  people = res.data
  const filtredPeople =  JSON.stringify(people.filter(person => person.registred === true))
  // console.log('filtredPeople', filtredPeople)
  fs.writeFile("filteredPeople.json", filtredPeople, 'utf8', (err, data) => {
    if (err){
      console.log('err', err);
  } else {
    console.log(data)
  }
  })
} 

getPeople()

