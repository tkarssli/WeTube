console.log("Initializing Mirror");


//------------------------------------------/
// Event Dispatchers

// create pageAction
chrome.runtime.sendMessage({createPA: "createPA"});

//document.onkeydown = function() {
//    chrome.runtime.sendMessage({keyEvent: event.keyCode})
//};

//------------------------------------------/
// Event listeners

document.addEventListener("playEvent", function (data) {
    chrome.runtime.sendMessage( {videoEvent: {playEvent: true}})
    console.log("Play Event");
});

document.addEventListener("pauseEvent", function (data) {
    console.log("Pause Event");
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    console.log("ConentScript.js: A Message has been received")
    if (message.incomingVideoEvent){

            console.log("ContentScript.js: Message is a Video Event")
           dispatchEvent("playRequest")
    }
});


//------------------------------------------/
// Inject Javascript to current page

function injectScript(script){

    // Create script on current page, async is false because
    // the jquery should load before the injected script.
    var s = document.createElement('script');
    s.async= false;
    s.src = chrome.extension.getURL(script);
    s.onload = function() {
        this.parentNode.removeChild(this);
    };
    (document.head||document.documentElement).appendChild(s);
}

injectScript("jquery.min.js");
setTimeout(injectScript("script.js"), 100);


// Util functions -------------------------- //
var dispatchEvent = function(string) {
    var event = document.createEvent('Event');
    event.initEvent(string);
    document.dispatchEvent(event);
};



