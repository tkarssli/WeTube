v = $('video');
player = v.get(0);

// Util functions -------------------------- //
var dispatchCustomEvent = function() {
    // Load an event with all required video data then dispatch it to the content script
    string = "userVideoEvent";
    console.log("videoEvent dispatched")
    var event = new CustomEvent(string, {'detail': {'currentTime': player.currentTime, 'duration': player.duration, 'paused': player.paused}});
    event.initEvent(string);
    document.dispatchEvent(event);
};


// Event Listeners -------------------------- //
$(player).on('play.mirror', function(){
    console.log("Video Played");
    dispatchCustomEvent()
});
//$(player).on('pause.mirror', function(){
//    console.log("Video Paused");
//    dispatchCustomEvent()
//});
//$(player).on('seeked.mirror', function(){
//    console.log("Video Seeked");
//    dispatchCustomEvent()
//});






document.addEventListener("videoData", function(data){
    //console.log(data.detail);
    $(player).off('play.mirror');

    if( data.detail.paused == true && player.paused != true){

        player.currentTime = data.detail.currentTime;
        player.pause();

    } else if (data.detail.paused == false && player.paused != false){
        player.currentTime = data.detail.currentTime;
        player.play();

    } else {
        player.currentTime = data.detail.currentTime;

    }


    $(player).on('play.mirror',function(){
        dispatchCustomEvent();
        console.log("Embedded listeners reinitialized")

    });
    console.log("External video request received");
});

