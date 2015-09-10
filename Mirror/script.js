v = $('video');
player = v.get(0);


// Event Listeners -------------------------- //
v.on('play',function(){
    dispatchEvent("playEvent");
});
v.on('pause', function(){
    dispatchEvent("pauseEvent");
});
v.on('seeking', function(){
    dispatchEvent("seekingEvent");
});
v.on('seeked', function(){
    dispatchEvent("seekedEvent");
});

document.addEventListener("videoData", function(data){
    console.log(data.detail);
    player.play();

    player.currentTime = data.detail.currentTime;
    player.paused = data.detail.paused;


    console.log("External play request received");
});

// Util functions -------------------------- //
var dispatchEvent = function(string) {
    var event = new CustomEvent(string, {'detail': {'currentTime': player.currentTime, 'duration': player.duration, 'paused': player.paused}});
    event.initEvent(string);
    document.dispatchEvent(event);
};