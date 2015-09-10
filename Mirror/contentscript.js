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

    //console.log("Content Script: " + data.detail.currentTime);
    chrome.runtime.sendMessage( {videoEvent: data});
    //console.log("Play Event");
});

document.addEventListener("pauseEvent", function (data) {
    console.log("Pause Event");
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    console.log("ContentScript.js: A Message has been received");
    if (message.incomingVideoEvent){
        console.log("ContentScript.js: Message is a Video Event");
        //console.log("Data received in content script: ");
        //console.log(message);
        dispatchEvent("videoData", message.incomingVideoEvent)
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
var dispatchEvent = function(string, data) {
    var event = new CustomEvent(string, {'detail': data});
    event.initEvent(string);
    document.dispatchEvent(event);
};



