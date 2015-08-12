var HEROKU = 'http://peaceful-dawn-6588.herokuapp.com';
var LOCAL = 'http://localhost:9090'

var userName = 'user_x';

var socket = io.connect(LOCAL);
var socketId = 1001;



// Socket Listeners
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
	var command = data.command;

	chrome.runtime.sendMessage({keyEvent: event.keyCode})


});



// Browser Event Listeners

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	// Create page action from contentscript
	if(message.createPA){
		chrome.pageAction.show(sender.tab.id)
		console.log("Showing page action")

	// Connect request from popup
	} else if (message.connectRequest) {


	// Key press event from injected script
	} else if (message.keyEvent){
		console.log("Key pressed: " + message.keyEvent);
	}
});

//------------------------------------------/
// Context Menu
title = "Connect to user";
context = "page";
var showForPages = ["*://www.youtube.com/*"]
genericOnClick = function(){
	console.log("TESTES")
};

var parent = chrome.contextMenus.create({
	"title": "Mirror",
	"contexts":[context],
	"onclick": genericOnClick,
	"documentUrlPatterns": showForPages
});





