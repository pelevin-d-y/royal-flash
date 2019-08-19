import 'fullpage.js';
var jquery = require("jquery");
window.$ = window.jQuery = jquery;
import autoComplete from './auto-complete.js';
import axios from 'axios'


$(document).ready(() => {
  const url = 'http://127.0.0.1:3000'
  const config = { headers: {"Access-Control-Allow-Origin": "*"} }

  let people = []
  const getPeople = async () => {
    const res = await axios.get(`${url}/people`, config)
    people = res.data 
  }
  getPeople()
  setTimeout(() => {
    console.log('people', people)
  }, 300)
  $('#fullpage').fullpage({
    
  });

  new autoComplete({
    selector: '.autocomplete',
    source: function(term, suggest) {
      const lowerTerm = term.toLowerCase()
      axios.get(`${url}/people`, config).then(res => {
        const choices = res.data.map((el) => el.name)
        var matches = [];
        for (let i=0; i<choices.length; i++) {
          if (~choices[i].toLowerCase().indexOf(lowerTerm))  {
            matches.push(choices[i]);
          }
        }
        suggest(matches);
      })
    }
  })
  let id
  $('.form__name-next').click(() => {
    id = people.find(person => person.name === $('.autocomplete').val()).id
  })

  $('.form').submit(async evt => {
    evt.preventDefault()
    const formData = $(evt.target).serializeArray()

    const data = {
      "registred": true,
      "field1": formData[1].value,
      "field2": formData[2].value,
      "field3": formData[3].value,
    }
    const res = await axios.post(`${url}/people/${id}`, data, config)
    console.log('submit', res, id)
  })
})
