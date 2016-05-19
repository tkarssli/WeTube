(function() {

	var LOCAL = 'http://localhost:3000';
	var AMAZON = 'http://52.34.170.53:3000';

	var socket;
	// Client sided user information
	var clientUserName = '';
	var connectedUser = "";
	// Tab extension send commands to the activeTab
	var activeTab;

	// Start ping loop
	setInterval(function(){
		var message = {time: Date.now()};
		try {
			socket.emit("ping", message)
		} catch(TypeError){

		}
	}, 30000);

	// Connect to server after userName has been set
	chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
		if (message.userNameSet){
			clientUserName = message.userNameSet;
			if(socket){socket.disconnect()}
			socket = io.connect(AMAZON);

			// Latency test


			// Socket Listeners
			socket.on('connect', function () {
				var userObject = {
					userName: clientUserName
				};
				socket.emit("connected", userObject)
			});

			socket.on('userNameTaken', function(data){
				console.log('username Taken');
				chrome.runtime.sendMessage({userNameTaken: data.userName})
			});


			socket.on('server', function (data) {
				var command = data.command;
				//var user1 = data.user1;
				var user2 = data.user2;
				var bool = data.bool;

				console.log(data);

				if (command == "connectionResult") {
					if (bool == true) {
						connectedUser = user2;
						chrome.runtime.sendMessage({connectionResult: {result: true, user2: user2}});
						console.log("Succesfully connected to " + user2)
					}
				} else if(command == "badUser"){
					chrome.runtime.sendMessage({"badUser": true})
					console.log("bad user")

				} else if (data.userId > 0) {
					clientUserName = data.userName;
				}
			});

			socket.on("event", function (data) {

				console.log("Background.js: message received");
				chrome.tabs.sendMessage(activeTab, {incomingVideoEvent: data}, function(response) {});
			});

			socket.on("message", function(data){
				console.log("URL change");
				chrome.tabs.update(activeTab,{url: data.URL, highlighted: true})
			});


			socket.on("pong", function(data){
				var lat = Date.now() - data.time;
				if(latency.length >= 10){
					latency.shift();
					latency.push(lat);
				} else {
					latency.push(lat);
				}
			});
		}
	});

	// Browser Event Listeners
	chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
		// Create page action from contentscript
		try{		var tabId = sender.tab.id;
		} catch(TypeError){}

		if(message.createPA){
			chrome.pageAction.show(tabId);
			if(!activeTab){
				activeTab = tabId;
			}
			console.log("Showing page action");

		// Connect request from popup
		} else if (message.connectRequest) {
			var message = {
				target: message.connectRequest.targetUser
			};

			console.log("Connect request outbound : " + message.origin);
			socket.emit("connectRequest", message);

		// Disconnect request from popup
		} else if (message.disconnectRequest) {
			var message = {
				origin: clientUserName
			};

			console.log("Disconnect Request");
			socket.emit("disconnectRequest", message);

		// URL change request from popup
		} else if (message.urlRequest) {
			var msg = {
				URL: message.urlRequest
			};

			console.log("URL Request to: " + message.urlRequest);
			socket.emit("message", msg);

		// videoEvent from contentScript
		} else if (message.videoEvent && tabId == activeTab){
			console.log("Video event sending to handler");
			eventHandler("videoEvent", message.videoEvent);

		// Get user info request from popup
		} else if (message.getInfo){
			// Send user info to popup.js
			chrome.runtime.sendMessage({userInfo:{
				userName: clientUserName,
				connectedUser: connectedUser}})
		}
	});

	//------------------------------------------/
	// Context Menu
	var title = "Connect to user";
	var context = "page";
	var showForPages = ["*://www.youtube.com/*"];

	var parent = chrome.contextMenus.create({
		"title": "Make this the active tab",
		"contexts":[context],
		"documentUrlPatterns": showForPages,
		"onclick": setActiveTab
	});

	var eventHandler = function(eventType, videoEvent){
		var events = ["videoEvent"];

		if(eventType == events[0]){
			details = videoEvent;
			var message =
			{command: events[0],
				currentTime: details.currentTime,
				duration: details.duration,
				paused: details.paused,
			};
			emitEvent(message);
		}
	};

	//------------------------------------------/
	// Utility Functions
	//var emitMessage = function(message){
	//	socket.emit("message", message)
	//};

	function emitEvent (event){
		if (connectedUser != ""){
			console.log("Emitting event to server");
			socket.emit("videoEvent", event);
		}
	};

	function setActiveTab(info,tab){
		activeTab = tab.id;
		chrome.tabs.reload(activeTab);
	}

// Terminating brackets for encapsulating function
})();





