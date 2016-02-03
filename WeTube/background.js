(function() {

	//var HEROKU = 'http://peaceful-dawn-6588.herokuapp.com'; // No longer any plans to use Heroku
	var LOCAL = 'http://192.168.1.141:3000';
	var TSERVE = 'http://tserve.noip.me:80';
	var AMAZON = 'http://52.34.170.53:80';

	var socket;
	// Client sided user information
	var clientUserName = '';
	var clientUserId = 0;
	var clientKey = 0;
	// Currently connected user
	var connectedUser = "";
	// For calculating the average latency
	var latency =[];
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

			socket = io.connect(AMAZON);

			// Latency test


			// Socket Listeners
			socket.on('connect', function () {
				var userObject = {
					userName: clientUserName
				};
				socket.emit("connected", userObject)
			});

			socket.on('server', function (data) {
				var command = data.command;
				//var user1 = data.user1;
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
				}
			});

			socket.on("event", function (data) {

				console.log("Background.js: message received");
				data.backTime = Date.now();
				data.avgLat += averageLatency();
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
				target: parseInt(message.connectRequest.userId),
				origin: parseInt(clientUserId),
				key: parseInt(message.connectRequest.key)
			};

			console.log("Connect request outbound : " + message.origin);
			socket.emit("connectRequest", message);

		// Disconnect request from popup
		} else if (message.disconnectRequest) {
			var message = {
				origin: parseInt(clientUserId)
			};

			console.log("Disconnect Request");
			socket.emit("disconnectRequest", message);

		// URL change request from popup
		} else if (message.urlRequest) {
			var msg = {
				origin: parseInt(clientUserId),
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
			chrome.runtime.sendMessage({userInfo:{userId: clientUserId, key: clientKey, userName: clientUserName, connectedUser: connectedUser}})
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
				origin: parseInt(clientUserId),
				currentTime: details.currentTime,
				duration: details.duration,
				paused: details.paused,
				avgLat: averageLatency()
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

	function averageLatency(){
		var length = latency.length;
		var total = 0;

		for(var time in latency){
			total += parseInt(time);
		}
		return total/length;
	};

	function setActiveTab(info,tab){
		activeTab = tab.id;
	}

// Terminating brackets for encapsulating function
})();





