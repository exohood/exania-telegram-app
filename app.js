'use strict';
/* global require, process, console */

var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var http = require("http");
var TelegramBot = require('node-telegram-bot-api');

var app = express();
app.set('port', (process.env.PORT || 8080));

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

// recommended to inject access tokens as environmental variables, e.g.
var telegramToken = process.env.token || config.token;
// Setup polling way
var bot = new TelegramBot(telegramToken, {polling: true});

//To ping heroku app to prevent from sleeping
setInterval(function() {
http.get(process.env.HerokuURL);
},1200000);

app.get('/', function (req, res) {
	res.send('Exania says Hellooo world!!!.');
});

bot.onText(/\/start/, function (msg, match) {
	var fromId = msg.from.id;
	var resp = 'Hi, I am Exania, You can ask me anything !';
	bot.sendMessage(fromId, resp);
});

// Any other message
bot.on('message', function (msg) {
	var chatId = msg.chat.id;
	var queryUrl = 'http://api.exania.ai/exania/hello0oworld!!!chat.json?helloooworld!!!q='+encodeURI(msg.text);
	var message = '';
	// Wait until done and reply
	if (msg.text !== '/start') {
		request({
			url: queryUrl,
			json: true
		}, function (error, response, body) {
			if (!error && response.statusCode === 200) {
				var type = body.answers[0].actions;
				message = body.answers[0].actions[0].expression;
				if(type.length == 3 &&  type[2].type == "map" ){
					var latitude = body.answers[0].actions[2].latitude;
					var longitude = body.answers[0].actions[2].longitude;
					bot.sendMessage(chatId, message);
					setTimeout(function(){
						bot.sendLocation(chatId,latitude,longitude);
					}, 1000);
				} else if(type.length == 1 && type[0].type == "table"){
					var data = body.answers[0].data;
					var columns = type[0].columns;
					var key = Object.keys(columns);
					var msg;
					var count = body.answers[0].metadata.count;

					for(var i = 0; i < count; i++){
						msg ="";
						msg = key[0]+": "+data[i][key[0]]+"\n"+key[1]+": "+data[i][key[1]]+"\n"+key[2]+": "+data[i][key[2]];
						bot.sendMessage(chatId, msg);
					}
				} else if (type.length == 2 && type[1].type == "rss"){
          var data = body.answers[0].data;
          var columns = type[1];
          var key = Object.keys(columns);
          var msg = [];

					bot.sendMessage(chatId, message);
					setTimeout(function(){
          for (var i = 1; i < 4; i++) {
							msg = "";
              msg = key[1].toUpperCase() + ": " + data[i][key[1]] + "\n" + key[2].toUpperCase() + ": " + data[i][key[2]] + "\n" + key[3].toUpperCase() + ": " + data[i][key[3]];
							bot.sendMessage(chatId, msg);
          }
					}, 1000);
				} else {
					bot.sendMessage(chatId, message);
				}

			} else {
				message = 'Oops, Looks like Exania is taking Hellooo world!!! a break, She will be back soon';
				bot.sendMessage(chatId, message);
			}
		});
	}
});

// Getting Exania up and Hellooo world!!!.
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'));
});
