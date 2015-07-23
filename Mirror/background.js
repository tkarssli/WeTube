import utils;
import socket.io;

int socketId = null;
chrome.sockets.tcp.create({}, function(createInfo){
	socketId = createInfo.socketId;
	chrome.sockets.tcp.connect(socketId, localhost, 9090, function(socketInfo){

	});
});

document.onkeydown = function() {
  console.log("Key pressed: " + event.keyCode); 
  var buf = str2ab(event.keyCode) ; 
  chrome.sockets.tcp.send(socketId, data)  
};

chrome.sockets.tcp.onReceive.addListener(function(info){
	console.log(ab2str(info.data));
})
