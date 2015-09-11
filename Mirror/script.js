v = $('video');
player = v.get(0);


// Event Listeners -------------------------- //
v.on('play',function(){
    dispatchEvent();
});
v.on('pause', function(){
    dispatchEvent();
});

// Todo need to change the way that seeking works
//v.on('seeking', function(){
//    dispatchEvent();
//});

v.on('seeked', function(){
    dispatchEvent();
});

document.addEventListener("videoData", function(data){
    console.log(data.detail);
    player.play();

    player.currentTime = data.detail.currentTime;
    player.paused = data.detail.paused;


    console.log("External play request received");
});

// Util functions -------------------------- //
var dispatchEvent = function() {
    // Load an event with all required video data then dispatch it to the content script
    string = "userVideoEvent";
    var event = new CustomEvent(string, {'detail': {'currentTime': player.currentTime, 'duration': player.duration, 'paused': player.paused}});
    event.initEvent(string);
    document.dispatchEvent(event);
};