import 'fullpage.js';
var jquery = require("jquery");
window.$ = window.jQuery = jquery;
import autoComplete from './auto-complete.js';
import axios from 'axios'
import Swal from 'sweetalert2'


$(document).ready(() => {
  const url = 'https://beelineevent.ru'
  const config = { headers: {"Access-Control-Allow-Origin": "*"} }
  let registered = false

  let people = []
  const getPeople = async () => {
    const res = await axios.get(`${url}/people`, config)
    people = res.data 
  }
  getPeople()

  $('#fullpage').fullpage({
    onLeave: function(origin, destination, direction) {
      if ((registered === false) && (destination>=3)) {
        return false
      }
    }  
  });

  // autocomplete

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


  // form
  let id

  $('.continue').click(() => {
    const person = people.find(person => person.name === $('.autocomplete').val())
    if (person) {
      id = person.id
      $('.form__name-wrapper').addClass('hidden')
      $('.form__come').removeClass('hidden')
    } else {
      Swal.fire({
        title: 'Ошибка!',
        text: 'Пользователь не найден',
        type: 'error',
        confirmButtonText: 'Закрыть'
      })
    }
  })

  const alertHandler = () => {
    $.fn.fullpage.moveTo(3)
  }

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
    console.log('id', id)
    registered = true
    if (res.data.response.description === 'updated') {
      Swal.fire({
        title: 'Успешно!',
        text: 'Вы успешно зарегестрированы',
        type: 'success',
        confirmButtonText: 'Закрыть'
      }).then(() => {
        alertHandler()
      })
    } else if (res.data.response.description === 'replay') {
      Swal.fire({
        title: 'Ошибка!',
        text: 'Вы уже зарегестрированы',
        type: 'error',
        confirmButtonText: 'Закрыть'
      }).then(() => {
        alertHandler()
      })
    }
  })
})
