v = $('video');
player = v.get(0);

// Util functions -------------------------- //
var dispatchEvent = function() {
    // Load an event with all required video data then dispatch it to the content script
    string = "userVideoEvent";
    console.log("videoEvent dispatched")
    var event = new CustomEvent(string, {'detail': {'currentTime': player.currentTime, 'duration': player.duration, 'paused': player.paused}});
    event.initEvent(string);
    document.dispatchEvent(event);
};


// Event Listeners -------------------------- //
v.on('play', dispatchEvent());
v.on('pause', dispatchEvent());

// Todo need to change the way that seeking works
//v.on('seeking', function(){
//    dispatchEvent();
//});



v.on('seeked', dispatchEvent());

document.addEventListener("videoData", function(data){
    //console.log(data.detail);

    if( data.detail.paused == true && player.paused != true){
        player.currentTime = data.detail.currentTime;
        $(player).off('pause');
        player.pause();
        $(player).on('pause', dispatchEvent());
    } else if (data.detail.paused == false && player.paused != false){
        player.currentTime = data.detail.currentTime;
        $(player).off('play');
        player.play();
        $(player).on('play',dispatchEvent());
    } else {
        player.currentTime = data.detail.currentTime;
    }


    console.log("External video request received");
});

