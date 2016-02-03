var userName = "";
var userId = 0;
var userKey=0;
var connectedUser = '';



window.onload = function() {

  console.log("Instantiated");

  var connectForm = document.getElementById("connectForm");
  var userNameForm = document.getElementById("userNameForm");
  var completedForm = document.getElementById("completedForm");

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
      } else if(connectedUser == '') {
          setTimeout(function() {
                if (userId == 0) {
                  chrome.runtime.sendMessage({getInfo: true});
                  console.log("fired")}
              }
          ,200);
          connectForm.removeAttribute("hidden");
          document.getElementsByClassName("userName")[0].innerHTML = userName;
          document.getElementsByClassName("userId")[0].innerHTML = String(userId);
          document.getElementsByClassName("userKey")[0].innerHTML = String(userKey);

        } else{
          document.getElementsByClassName("userName")[1].innerHTML = userName;
          document.getElementsByClassName("userId ")[1].innerHTML = String(userId);
          document.getElementsByClassName("userKey")[1].innerHTML = String(userKey);
          document.getElementById("connectedUser").innerHTML = connectedUser;
          completedForm.removeAttribute("hidden");

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

  document.getElementById("connectButton").addEventListener("click", function(){
    var userId = document.getElementById("userIdField").value;
    var key = document.getElementById("keyField").value;

    console.log("userId: " + userId);
    console.log("key: " + key);

    chrome.runtime.sendMessage({
      connectRequest: {userId: userId, key: key}
    });

    location.reload();
  });

  document.getElementById("disconnectButton").addEventListener("click", function(){
    chrome.runtime.sendMessage({disconnectRequest: true});
    location.reload();
  });

  document.getElementById("urlButton").addEventListener("click", function(){
    var url = document.getElementById("urlField").value;
    console.log(url);
    chrome.runtime.sendMessage({urlRequest: url});
  })
};





