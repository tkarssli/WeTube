var context_id = -1;

console.log("Initializing Mirror");

document.onkeydown = function() {
    //console.log("Key pressed: " + event.keyCode);
    chrome.runtime.sendMessage({keyEvent: event.keyCode})
};

//------------------------------------------/

var s = document.createElement('script');
s.src = chrome.extension.getURL('script.js');
(document.head||document.documentElement).appendChild(s);
s.onload = function() {
    s.parentNode.removeChild(s);
};

// Event listener
