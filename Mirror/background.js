var HEROKU = 'http://peaceful-dawn-6588.herokuapp.com';
var LOCAL = 'http://localhost:9090'

var userName = 'user_x';

var socket = io.connect(LOCAL);
var socketId = 1001;



socket.on('connect', function(){
	var userObject = {
		userName: userName
	};
	socket.emit("connected", userObject)
});

socket.on('server', function(data){
	console.log(data);
})

socket.on('message', function(data){
});



chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	console.log(message);
	console.log("Key pressed: " + message.keyEvent);
	var keyDown = message.keyEvent;
	var jsonObject = {
		'@class': 'UserObject',
		userName: userName,
		sessionId: socketId,
		action: keyDown
	};
	socket.json.send(jsonObject);

});