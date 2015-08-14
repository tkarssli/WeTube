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

		socket = io.connect(LOCAL);

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

		socket.on("message", function (data) {
			var command = data.command;

			console.log("Background.js: message received")
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
				chrome.tabs.sendMessage(tabs[0].id, {incomingVideoEvent: command}, function(response) {});
			});
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


			// videoEvent from contentScript
			} else if (message.videoEvent){
				eventHandler(message.videoEvent);

			} else if (message.getInfo){
				chrome.runtime.sendMessage({userInfo:{userId: clientUserId, key: clientKey, userName: clientUserName, connectedUser: connectedUser}})

			}
		});

//------------------------------------------/
// Context Menu
var title = "Connect to user";
var context = "page";
var showForPages = ["*://www.youtube.com/*"];

var parent = chrome.contextMenus.create({
	"title": "Mirror",
	"contexts":[context],
	"documentUrlPatterns": showForPages
});




//------------------------------------------/
// Utility Functions

var eventHandler = function(videoEvent){
	var events = ["play","stop","seek","seeked"];

	if(videoEvent.playEvent){
		var message =
		{command: events[0],
		origin: parseInt(clientUserId)};

		emitMessage(message);
	}
};

var emitMessage = function(message){
	socket.emit("message", message)
};

// Terminating brackets for main function
})();





