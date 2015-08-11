console.log("Initializing Mirror");


//------------------------------------------/
// Event Dispatchers

// Create pageAction
chrome.runtime.sendMessage({createPA: "createPA"});

document.onkeydown = function() {
    chrome.runtime.sendMessage({keyEvent: event.keyCode})
};

//------------------------------------------/
// Event listeners

document.addEventListener("playEvent", function (data) {
    chrome.runtime.sendMessage({keyEvent: event.keyCode})
    console.log("Play Event");
});

document.addEventListener("pauseEvent", function (data) {
    console.log("Pause Event");
});


//------------------------------------------/
// Inject Javascript to current page
function injectScript(script){
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




