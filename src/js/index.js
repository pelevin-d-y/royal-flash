import 'fullpage.js'
var jquery = require("jquery");
window.$ = window.jQuery = jquery;
import autoComplete from './auto-complete.js'
import axios from 'axios'



$(document).ready(() => {
  $('#fullpage').fullpage({
    
  });
  const config = { headers: {"Access-Control-Allow-Origin": "*"} }

  new autoComplete({
    selector: '.autocomplete',
    source: function(term, suggest) {
      console.log('aaaaaa')
      axios.get('http://192.168.1.211:3000/people', config).then(res => {
        console.log('data', res.data)
        const choices = res.data.map((el) => el.name)
        suggest(choices);
      })
    }
  })
})
