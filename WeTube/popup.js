chrome.runtime.sendMessage({getInfo: true});

$(document).ready(function() {

    var userName = "";
    var connectedUser = "";
    var popUpRender;
    var connect;


    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        if(message.userInfo){
            userName = message.userInfo.userName;
            connectedUser = message.userInfo.connectedUser;

            console.log("Connected user : " + connectedUser);
            if(userName){
                popUpRender.updateUserName();
                //popUpRender.updateTargetUser();
            }
        }
    });

    var PopUpBox = React.createClass({

        getInitialState: function () {
            return {
                userName: '',
                nameTaken: "",
                btnText: 'Set',
                opts: {},
                showConnect: false
            };
        },
        handleUserNameChange: function (e) {
            this.setState({userName: e.target.value});
        },
        updateUserName: function(){
            this.setState({
                userName: userName,
                btnText: 'Change',
                opts: {disabled: 'disabled'},
                showConnect: true
            })

        },
        handleSubmit: function (e) {
            e.preventDefault();
            var un = this.state.userName.trim();

            if (!un) {
                return
            }
            var une = $('#userName');

            if (une[0].hasAttribute('disabled')) {
                this.setState({
                    btnText: "Set",
                    userName: '',
                    opts: {},
                    showConnect: false
                });
                userName = '';

            } else {
                this.setState({
                    btnText: "Change",
                    opts: {disabled: 'disabled'},
                    nameTaken: "",
                    showConnect: true
                });
                userName = un;
                chrome.runtime.sendMessage({userNameSet: un});
            }

        },
        nameTaken: function () {
            this.setState({
                nameTaken: "User Name Taken",
                btnText: "Set",
                userName: '',
                showConnect: false,
                opts: {}
            });
            userName = '';
            console.log("User Name Taken")
        },
        render: function () {
            return (
                <div>
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
                    { this.state.showConnect ? <Connect /> : null }
                </div>

            );
        }
    });

    var Connect = React.createClass({

        componentWillMount: function(){
            connect = this;
        },
        getInitialState: function () {


            if(connectedUser){
                return {
                    targetUser: connectedUser,
                    btnText: 'Disconnect',
                    opts: {disabled: 'disabled'}
                };

            } else {
                return {
                    targetUser: '',
                    btnText: 'Connect',
                    opts: {}
                };

            }

        },
        componentDidMount: function() {

            chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
                if(message.badUser) {
                    connectedUser = '';
                    connect.setState({
                            badUser: "User does not exist",
                            targetUser: '',
                            btnText: 'Connect',
                            opts: {}
                    })
                }

                console.log("tick tock")
            });

        },
        handleTargetUserChange: function (e) {
            this.setState({targetUser: e.target.value});
        },
        //updateTargetUser: function(){
        //    this.setState({targetUser: connectedUser})
        //},
        handleSubmit: function(e){
            e.preventDefault();
            var tu = this.state.targetUser.trim();

            if (!tu) {
                return
            }

            var tue = $('#targetUser');

            if (tue[0].hasAttribute('disabled')) {
                this.setState({
                    btnText: "Connect",
                    targetUser: '',
                    opts: {}
                });
                connectedUser = '';
                chrome.runtime.sendMessage({disconnectRequest: true});

            } else {
                this.setState({
                    btnText: "Disconnect",
                    opts: {disabled: 'disabled'},
                    badUser: ""
                });
                connectedUser = tu;
                chrome.runtime.sendMessage({connectRequest: {targetUser: tu}});
            }
        },
        render: function () {
            return (
                <form className="connectBox" onSubmit={this.handleSubmit}>
                    <input
                    {...this.state.opts}
                        id="targetUser"
                        type="text"
                        placeholder="Enter a name to connect to"
                        value={this.state.targetUser}
                        onChange={this.handleTargetUserChange}
                    />
                    <input id="submitConnect" type="submit" value= {this.state.btnText} />
                    <div id="badUser">{this.state.badUser}</div>
                </form>
            );
        }
    });
    popUpRender = ReactDOM.render(
        <PopUpBox />,
        document.getElementById('content')
    );

    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        if (message.userNameTaken) {
            popUpRender.nameTaken();
        }


    });
});





