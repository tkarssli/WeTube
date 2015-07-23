var context_id = -1;

console.log("Initializing Mirror");

// document.onkeydown = function() {
//   console.log("Key pressed: " + event.keyCode);    
//   chrome.tabs.executeScript(null,{code:"$('video').pause()}")   
// };

//------------------------------------------/

var s = document.createElement('script');
s.src = chrome.extension.getURL('script.js');
(document.head||document.documentElement).appendChild(s);
s.onload = function() {
    s.parentNode.removeChild(s);
};

// Event listener
document.addEventListener('RW759_connectExtension', function(e) {
    // e.detail contains the transferred data (can be anything, ranging
    // from JavaScript objects to strings).
    // Do something, for example:
    alert(e.detail);
});
