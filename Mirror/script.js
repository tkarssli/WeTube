$('video').on('play',function(){
    playEvent();
})

var playEvent = function() {
    var event = document.createEvent('Event');
    event.initEvent('playEvent');
    document.dispatchEvent(event);
}