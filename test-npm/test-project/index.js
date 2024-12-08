const axios = require('axios');

axios.get('https://api.github.com')
  .then(response => console.log(response.data))
  .catch(error => console.error(error));
