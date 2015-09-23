(function() {

var HEROKU = 'http://peaceful-dawn-6588.herokuapp.com';
var LOCAL = 'http://localhost:9090';
var TSERVE = 'http://98.248.147.65:80';


var clientUserName = '';
var clientUserId = 0;
var clientKey = 0;
var connectedUser = "";

var socket;



// Connect to server after userName has been set
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
	if (message.userNameSet){
		clientUserName = message.userNameSet;

		socket = io.connect(TSERVE);

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
					connectedUser = user2;
					chrome.runtime.sendMessage({connectionResult: {result: true, user2: user2}});
					console.log("Succesfully connected to " + user2)
				} else {
					connectedUser = "";
					chrome.runtime.sendMessage({connectionResult: {result: false, user2: user2}});
					console.log("Failed connecting to " + user2)
				}
			} else if (data.userId > 0) {
				clientUserName = data.userName;
				clientUserId = data.userId;
				clientKey = data.key;

				//chrome.runtime.sendMessage({userInfo: {userId: clientUserId, key: data.key}});

			}

			//console.log(data);
		});

		socket.on("event", function (data) {

			console.log("Background.js: message received")
			chrome.tabs.query({active: true, url: "*://www.youtube.com/*"}, function(tabs){
				chrome.tabs.sendMessage(tabs[0].id, {incomingVideoEvent: data}, function(response) {});
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

				console.log("Connect request outbound : " + message.origin);
				socket.emit("connectRequest", message);
			} else if (message.disconnectRequest) {
				var message = {
					origin: parseInt(clientUserId)
				};

				console.log("Disconnect Request");
				socket.emit("disconnectRequest", message);

			// videoEvent from contentScript
			} else if (message.videoEvent){
				console.log("Video event sending to handler");
				console.log(message.videoEvent.currentTime);
				eventHandler("videoEvent", message.videoEvent);


				// Respond to request to get user info
			} else if (message.getInfo){

				// Send user info to popup.js
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

	var eventHandler = function(eventType, videoEvent){
		var events = ["videoEvent"];

		console.log("videoEvent");
		console.log(videoEvent);
		if(eventType == events[0]){
			details = videoEvent;
			console.log("details:")
			console.log(details);
			var message =
			{command: events[0],
				origin: parseInt(clientUserId),
				currentTime: details.currentTime,
				duration: details.duration,
				paused: details.paused

			};


			emitEvent(message);
		}
	};

	//------------------------------------------/
	// Utility Functions
	var emitMessage = function(message){
		socket.emit("message", message)
	};

	var emitEvent = function (event){
		if (connectedUser != ""){
			console.log("Emitting event to server");
			socket.emit("videoEvent", event);
		}
	}

// Terminating brackets for encapsulating function
})();





