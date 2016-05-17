var userName = "";
var userId = 0;
var userKey=0;
var connectedUser = '';


var PopUpBox = React.createClass({

    getInitialState: function() {
        return {
            userName: '',
            nameTaken:"",
            btnText: 'Set',
            opts: {}};
    },
    handleUserNameChange: function(e) {
        this.setState({userName: e.target.value});
    },
    handleSubmit: function(e){
        e.preventDefault();
        var userName = this.state.userName.trim();

        if(!userName){
            return
        }
        var une = $('#userName');
        //var submit = $('#submitUserName');

        if(une[0].hasAttribute('disabled')){
            this.setState({
                btnText: "Set",
                userName: '',
                opts: {}
            })

        }else{
            this.setState({
                btnText: "Change", opts:{disabled:'disabled'},
                nameTaken: ""
            });
            chrome.runtime.sendMessage({userNameSet: userName});
        }

    },
    nameTaken: function(){
        this.setState({
            nameTaken: "User Name Taken",
            btnText:"Set",
            userName: '',
            opts:{}
        });
        console.log("User Name Taken")
    },
    render: function() {
        return (
            <form className="popUpBox" onSubmit={this.handleSubmit}>
                <input
                    {...this.state.opts}
                    id="userName"
                    type="text"
                    placeholder="Your name"
                    value={this.state.userName}
                    onChange={this.handleUserNameChange}
                />
                <input id="submitUserName" type="submit" value= {this.state.btnText} />
                <div id="nameTaken">{this.state.nameTaken}</div>
            </form>
        );
    }
});
var popUpRender = ReactDOM.render(
    <PopUpBox />,
    document.getElementById('content')
);
//window.onload = function() {
//
//  console.log("Instantiated");
//
//  var connectForm = document.getElementById("connectForm");
//  var userNameForm = document.getElementById("userNameForm");
//  var completedForm = document.getElementById("completedForm");
//
//  chrome.runtime.sendMessage({getInfo: true});
//
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if(message.userNameTaken){
        popUpRender.nameTaken();
    }
});
//
//    if (message.userInfo) {
//      userName = message.userInfo.userName;
//      userId = message.userInfo.userId;
//      userKey = message.userInfo.key;
//      connectedUser = message.userInfo.connectedUser;
//
//      //console.log("message returned " + userName + " " + userId + " " + userKey)
//
//
//
//      // Determine what DOM element should be shown based on information returned from background.js
//      if (userName == '' && userId == 0 && userKey == 0) {
//        userNameForm.removeAttribute("hidden");
//      } else if(connectedUser == '') {
//          setTimeout(function() {
//                if (userId == 0) {
//                  chrome.runtime.sendMessage({getInfo: true});
//                  console.log("fired")}
//              }
//          ,200);
//          connectForm.removeAttribute("hidden");
//          document.getElementsByClassName("userName")[0].innerHTML = userName;
//          document.getElementsByClassName("userId")[0].innerHTML = String(userId);
//          document.getElementsByClassName("userKey")[0].innerHTML = String(userKey);
//
//        } else{
//          document.getElementsByClassName("userName")[1].innerHTML = userName;
//          document.getElementsByClassName("userId ")[1].innerHTML = String(userId);
//          document.getElementsByClassName("userKey")[1].innerHTML = String(userKey);
//          document.getElementById("connectedUser").innerHTML = connectedUser;
//          completedForm.removeAttribute("hidden");
//
//      }
//    } else if (message.connectionResult){
//      connectedUser = message.connectionResult.user2;
//      location.reload();
//    }
//  });
//
//  // DOM Listeners ---------------------------------------------------------------------------------//
//  document.getElementById("userNameButton").addEventListener("click", function() {
//    connectForm.removeAttribute("hidden");
//    userNameForm.setAttribute("hidden", "hidden");
//
//    userName = document.getElementById("userNameField").value;
//    chrome.runtime.sendMessage({userNameSet: userName});
//
//    console.log(userName);
//
//    location.reload();
//  });
//
//  document.getElementById("connectButton").addEventListener("click", function(){
//    var userId = document.getElementById("userIdField").value;
//    var key = document.getElementById("keyField").value;
//
//    console.log("userId: " + userId);
//    console.log("key: " + key);
//
//    chrome.runtime.sendMessage({
//      connectRequest: {userId: userId, key: key}
//    });
//
//    location.reload();
//  });
//
//  document.getElementById("disconnectButton").addEventListener("click", function(){
//    chrome.runtime.sendMessage({disconnectRequest: true});
//    location.reload();
//  });
//
//  document.getElementById("urlButton").addEventListener("click", function(){
//    var url = document.getElementById("urlField").value;
//    console.log(url);
//    chrome.runtime.sendMessage({urlRequest: url});
//  })
//};






