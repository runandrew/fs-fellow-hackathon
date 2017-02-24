// Main application file

// Required libraries
const express = require('express');
const volleyball = require('volleyball');
const bodyParser = require('body-parser');
const axios = require('axios')

// Required files
const routerApi = require('./api/routes');

// App creation
const app = express();
const PORT = 8585;

// Auth
const WebClient = require('@slack/client').WebClient;
// const token = process.env.SLACK_API_TOKEN || '';
const token = 'xoxp-2151814398-115835264133-146901531847-9a968e0bd682a7da3200025fcfa77bb7'
const web = new WebClient(token);

// Middleware

// Logging
app.use(volleyball);
// Parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Routers
app.use('/api', routerApi);

app.use((req, res, next) => {
  res.send('Hello');

  // Set scope
  axios.get('https://slack.com/oauth/authorize', {
    client_id: '2151814398.146240978852',
    scope: 'channel.history'
  })
  .then(()=>{
    console.log('the current token', token)
    web.channels.list(function(err, info) {
      if (err) {
        console.log('Error:', err);
      } else {
        for(var i in info.channels) {
          console.log(info.channels[i].name);
        }
      }
    });
    console.log('messages', web.messages.channel)

    web.chat.postMessage('#something', 'Hello there', function(err, res) {
      if (err) {
        console.log('Error:', err);
      } else {
        console.log('Message sent: ', res);
      }
    });
  })



})
});

// Start the server
app.listen(PORT, () => {
    console.log(`We're online on port ${PORT}`);
});

// Error logging middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).send(err.message || 'Internal server error');
});
