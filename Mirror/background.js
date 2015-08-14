(function() {

var HEROKU = 'http://peaceful-dawn-6588.herokuapp.com';
var LOCAL = 'http://localhost:9090'

var clientUserName = '';
var clientUserId = 0;
var clientKey = 0;
var connectedUser = "";

var socket;



// Connect to server after userName has been set
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
	if (message.userNameSet){
		clientUserName = message.userNameSet;

		console.log("socket connecting")
		socket = io.connect(LOCAL);

		console.log("socket connected");
		// Socket Listeners
		socket.on('connect', function () {
			var userObject = {
				userName: clientUserName
			};
			socket.emit("connected", userObject)
		});

		socket.on('server', function (data) {
			var command = data.command;
			var user1 = data.user1;
			var user2 = data.user2;
			var bool = data.bool;

			if (command == "connectionResult") {
				if (bool == true) {
					chrome.runtime.sendMessage({connectionResult: {result: true, user2: user2}});
					connectedUser = user2;
					console.log("Succesfully connected to " + user2)
				} else {
					chrome.runtime.sendMessage({connectionResult: {result: false, user2: user2}});
					console.log("Failed connecting to " + user2)
				}
			} else if (data.userId > 0) {
				clientUserName = data.userName;
				clientUserId = data.userId;
				clientKey = data.key;

				//chrome.runtime.sendMessage({userInfo: {userId: clientUserId, key: data.key}});

			}

			console.log(data);
		});

		socket.on('message', function (data) {
			var command = data.command;
			var target = data.target;
			var origin = data.origin;
			var bool = data.bool;

			chrome.runtime.sendMessage({keyEvent: event.keyCode})
		});



	}
});
		// Browser Event Listeners

		chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
			// Create page action from contentscript
			if(message.createPA){
				chrome.pageAction.show(sender.tab.id);
				console.log("Showing page action");

				// Connect request from popup
			} else if (message.connectRequest) {
				var message = {
					target: parseInt(message.connectRequest.userId),
					origin: parseInt(clientUserId),
					key: parseInt(message.connectRequest.key)
				};

				console.log(message);
				socket.emit("connectRequest", message);


				// Key press event from injected script
			} else if (message.keyEvent){
				console.log("Key pressed: " + message.keyEvent);

			} else if (message.getInfo){
				chrome.runtime.sendMessage({userInfo:{userId: clientUserId, key: clientKey, userName: clientUserName, connectedUser: connectedUser}})

			}
		});

//------------------------------------------/
// Context Menu
title = "Connect to user";
context = "page";
var showForPages = ["*://www.youtube.com/*"];

var parent = chrome.contextMenus.create({
	"title": "Mirror",
	"contexts":[context],
	"documentUrlPatterns": showForPages
});

})();






