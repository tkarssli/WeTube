console.log("Content Script Loaded");

// Youtube video element
v = $('video');
player = v.get(0);
var paused=false;

// Video Event Listeners -------------------------- //
$(player).on('play', function(){
    console.log("play click");


        chrome.runtime.sendMessage({
            videoEvent: {
                'currentTime': player.currentTime,
                'duration': player.duration,
                'paused': player.paused
            }
        });
});

// Check 4 times per second if video is paused
console.log('first' + player.paused);


var checkPaused = function(){
    //console.log(player.paused);
    if(player.paused && !(paused == player.paused)) {
        paused = true;
        chrome.runtime.sendMessage({
            videoEvent: {
                'currentTime': player.currentTime,
                'duration': player.duration,
                'paused': player.paused
            }
        });
        console.log('paused')
    } else if(!player.paused && !(paused == player.paused)) {
        paused = false;
    }
};

setInterval(checkPaused, 500);
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

        if (message.incomingVideoEvent.paused == true && player.paused != true) {
            player.currentTime = message.incomingVideoEvent.currentTime;
            player.pause();

        } else if (message.incomingVideoEvent.paused == false && player.paused != false) {
            player.currentTime = message.incomingVideoEvent.currentTime;
            player.play();

        } else {
            player.currentTime = message.incomingVideoEvent.currentTime;
        }
    }
});