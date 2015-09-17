var userName = "";
var userId = 0;
var userKey=0;
var connectedUser = '';



window.onload = function() {

  console.log("Instantiated");

  var connectForm = document.getElementById("connectForm");
  var userNameForm = document.getElementById("userNameForm");
  var testSpan = document.getElementById("testSpan");

  chrome.runtime.sendMessage({getInfo: true});

  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

    if (message.userInfo) {
      userName = message.userInfo.userName;
      userId = message.userInfo.userId;
      userKey = message.userInfo.key;
      connectedUser = message.userInfo.connectedUser;

      //console.log("message returned " + userName + " " + userId + " " + userKey)



      // Determine what DOM element should be shown based on information returned from background.js
      if (userName == '' && userId == 0 && userKey == 0) {
        userNameForm.removeAttribute("hidden");
      } else{
        if(connectedUser == '') {
          document.getElementById("userId1").innerHTML = String(userId);
          document.getElementById("userKey1").innerHTML = String(userKey);
          connectForm.removeAttribute("hidden");
        } else{

          testSpan.removeAttribute("hidden");
        }
      }
    } else if (message.connectionResult){
      connectedUser = message.connectionResult.user2;
      location.reload();
    }
  });

  // DOM Listeners ---------------------------------------------------------------------------------//
  document.getElementById("userNameButton").addEventListener("click", function() {
    connectForm.removeAttribute("hidden");
    userNameForm.setAttribute("hidden", "hidden");

    userName = document.getElementById("userNameField").value;
    chrome.runtime.sendMessage({userNameSet: userName});

    console.log(userName);

    location.reload();
  });

  document.getElementById("playButton").addEventListener("click", function(){

    chrome.runtime.sendMessage({
      playRequest: document.getElementById("currentTime").value
    })
      console.log("play request");
      console.log(document.getElementById("currentTime").value)
  });

  document.getElementById("connectButton").addEventListener("click", function(){
    var userId = document.getElementById("userIdField").value;
    var key = document.getElementById("keyField").value;

    console.log("userId: " + userId);
    console.log("key: " + key);

    chrome.runtime.sendMessage({
      connectRequest: {userId: userId, key: key}
    })

    location.reload();

  });
};





