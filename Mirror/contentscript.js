console.log("Initializing Mirror");

// Youtube video element
v = $('video');
player = v.get(0);

// Video Event Listeners -------------------------- //
$(player).on('play.mirror', function(){
    chrome.runtime.sendMessage({videoEvent: {'currentTime': player.currentTime, 'duration': player.duration, 'paused': player.paused}});
});

//------------------------------------------/
// Event Dispatchers

// create pageAction
chrome.runtime.sendMessage({createPA: "createPA"});

//------------------------------------------/
// Event listeners

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    console.log("ContentScript.js: A Message has been received");
    if (message.incomingVideoEvent) {
        console.log("ContentScript.js: Message is a Video Event");
        var extTime = Date.now() - message.incomingVideoEvent.backTime;
        message.incomingVideoEvent.currentTime = message.incomingVideoEvent.currentTime + extTime * .001 + message.incomingVideoEvent.avgLat * .001 + .300;

        if (message.incomingVideoEvent.paused == true && player.paused != true) {
            player.currentTime = message.incomingVideoEvent.currentTime;
            player.pause();

        } else if (message.incomingVideoEvent.paused == false && player.paused != false) {
            player.currentTime = message.incomingVideoEvent.currentTime;
            player.play();
            console.log(Date.now());

        } else {
            player.currentTime = message.incomingVideoEvent.currentTime;
            console.log(Date.now());
        }
    }
});







