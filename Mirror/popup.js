genericOnClick = function(){
  console.log("TESTES")
};

window.onload = function(){
  document.getElementById("button1").addEventListener("click", function(){
    var userName = document.getElementById("userName").value;
    var key = document.getElementById("key").value;

    chrome.runtime.sendMessage({
      connectRequest: {username: userName, key: key}
    })
  });
};
