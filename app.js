// Main application file

// Required libraries
const express = require('express');
const volleyball = require('volleyball');
const bodyParser = require('body-parser');
const axios = require('axios')
const fs = require('fs');

// Required files
const routerApi = require('./api/routes');

// App creation
const app = express();
const PORT = 8585;

// Auth
const WebClient = require('@slack/client').WebClient;
const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
// const token = process.env.SLACK_API_TOKEN || '';
const token = require('./.secrets.js').apiToken;
const web = new WebClient(token);

// reads JSON file and pushes new message text as string into messages array, before re-writing the JSON file
const writeToDB = message => {
  fs.readFile('./database.json', 'utf8', function readFileCallback(err, data){
      if (err){
        console.log(err);
      } else {
        let obj = JSON.parse(data); //now it an object
        obj.messages.push(message); //add some data
        let json = JSON.stringify(obj); //convert it back to json
        fs.writeFile('./database.json', json, 'utf8', (error) => {
          if (error) throw error;
          console.log('Saved!')
        }); // write it back
  }});
}
const Andrew = 'U2VTX4JKB';

var rtm = new RtmClient(token);

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
});

rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
  if (message.user === Andrew) {
    console.log('Andrew said: ', message);
    // console.log(typeof message.text)
    writeToDB(message.text);
  }
});


rtm.start();

// Middleware

// Logging
app.use(volleyball);
// Parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Routers
app.use('/api', routerApi);

app.use((req, res, next) => {

    web.channels.list(function(err, info) {
      if (err) {
        console.log('Error:', err);
      } else {
        for(var i in info.channels) {
          console.log(info.channels[i].name);
        }
      }
    });

    // console.log('messages', web.messages.channel);

    // web.chat.postMessage('#something', 'Hello there', function(err, res) {
    //   if (err) {
    //     console.log('Error:', err);
    //   } else {
    //     console.log('Message sent: ', res);
    //   }
    // });




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
