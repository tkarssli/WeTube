v = $('video');
var vElement = v.get(0);


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

document.addEventListener("playRequest", function(data){
    $('video').get(0).play();
    console.log("External play request received");
});

// Util functions -------------------------- //
var dispatchEvent = function(string) {
    var event = document.createEvent('Event');
    event.initEvent(string);
    document.dispatchEvent(event);
};