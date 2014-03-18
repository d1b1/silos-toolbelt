#!/usr/bin/env node

var program = require("commander");
var request = require("request");
var colors = require("colors");
var _ = require("underscore");

// List - List all Apps (silos app:list or silos list)
// 
program
  .version('0.0.1')
  .option('-l, --list', 'List all Silos')
  .option('-c, --create [name]', 'Create a Silo', '')
  .parse(process.argv);

if (program.list) {
	console.log('List all Silos')
}

if (program.create) {
	
  var opts = {
  	url: 'http://silos-platform.herokuapp.com/create',
  	form: { appname: program.create, mode: "json" }
  }

  // TODO: Check to see if the app name is free?
  console.log("Starting Silo creation...")

  // TODO: Refactor this to allow it work with a promise or 
  // provide updates as it waits for data.

  request.post(opts, function (err, r, body) {
     if (err) 
     	return console.log("Unable to create app", err)

     console.log("Silo Report:")

     // TODO: Build the local silos.json file.
     // TODO: Update the endpoint /create to give more data on the Mongo URL.
     // TODO: Update the endpoint /create to give more data on the REDIS URL.
     
     if (body == 'App Name already used.') {
     	return console.log('Sorry that silo name is already in use.'.red)
     }

     var data = JSON.parse(body)

     console.log('Silo URL: ', 'http://' + data.domain.hostname)
  })

}

if (program.list) {
	
  var opts = {
  	url: 'http://silos-platform.herokuapp.com/apps?mode=json'
  }

  // TODO: Refactor this to allow it work with a promise or provide updates as it waits for data.

  request.get(opts, function (err, r, body) {
     if (err) 
     	return console.log("Unable to access the silos API.", err)

     var data = JSON.parse(body)

     _.each(data, function(silo) {
     	console.log(' ', silo.name.bold,  pad(20 - silo.name.length, ' ', ' '), '    ', silo.web_url.green)
     })
  })
}

function pad(width, string, padding) { 
  return (width <= string.length) ? string : pad(width, padding + string, padding)
}
