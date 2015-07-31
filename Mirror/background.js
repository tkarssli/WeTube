

var userName = 'user_x';

var socket = io.connect('http://localhost:9090');
var socketId = 1001;

console.log("Attempting to Connect");
socket.on('connect', function() {
	console.log("Connection Established");

});

socket.on('message', function(data){
	console.log('Data received: ' + data.action);
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
	console.log(message);
	console.log("Key pressed: " + message.keyEvent);
	var keyDown = message.keyEvent;
	var jsonObject = {
		'@class': 'UserObject',
		userName: userName,
		socketId: socketId,
		action: keyDown
	};
	socket.json.send(jsonObject);
})

document.onkeydown = function() {
	console.log("Key pressed: " + event.keyCode);
	var keyDown = event.keyCode;
	var jsonObject = {'@class': 'UserObject',
		userName: userName,
		socketId: socketId,
		action: keyDown
	};


};