/**
 * Created by tkars on 4/28/2016.
 */
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

users = {};
connections = {};

io.on('connection', function(socket){

    socket.on('disconnect', function(){
        detachUsers(socket);
        delete users[socket.userName];
        console.log(socket.userName + " has disconnected");
    });

    socket.on('connected', function(data){
        var name = data.userName;

        if(!users[name]){
            users[name] = socket;
            users[name].userName = name;
            users[name].connection = "";
            console.log(name + " has connected");
        } else {
            socket.emit('userNameTaken',{userName: name});
            socket.disconnect()
        }


    });

    socket.on('connectRequest', function(data){
        var u1 = socket.userName;
        var u2 = data.target;

        if (connections[u1] || connections[u2]){
            console.log( "a user is already connected");
            users[u1].emit('server', {command: "connectionResult",user2: u2, bool: false})
        } else {
            if(users[u2]){
                connections[u1] = u2;
                connections[u2] = u1;
                console.log(connections);

                users[u1].emit('server', {command: "connectionResult",user2: u2, bool: true});
                users[u2].emit('server', {command: "connectionResult",user2: u1, bool: true})
            } else {
                socket.emit('server', {command: "badUser"})
            }
        }
    });

    socket.on('disconnectRequest', function(data){
        detachUsers(socket);
    });

    socket.on('videoEvent', function(data){
        //console.log(socket.userName);
        //console.log(data);
        var u1s = socket;
        var u2 = connections[u1s.userName];

        u1s.lastSent = Date.now();
        users[u2].lastRecieved = Date.now();

        if(msgFreqCheck(u1s, users[u2])){
            users[u2].emit('event', data);
        }

    });
    socket.on('message', function(data){
        if( connections[socket.userName]){
            var u2 =  connections[socket.userName];
            users[u2].emit("message",{URL: data.URL});

            console.log(socket.userName + " has sent a link to " + u2)
        }
    })
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});

var detachUsers = function(socket){
    var u1 = socket.userName;

    if(connections[socket.userName]){

        var u2 = connections[u1];

        delete connections[u1];
        delete connections[u2];
        users[u1].emit('server', {command: "connectionResult",user2: u2, bool: false});
        users[u2].emit('server', {command: "connectionResult",user2: u1, bool: false});

        console.log(u1 + " has disconnected from " + u2);
    } else {
        console.log(u1 + " not connected to client");
        socket.emit('server', {command: "connectionResult",user2: "No connection", bool: false})
    }
};

var msgFreqCheck = function (u1s, u2s) {
    return u1s.lastSent - u2s.lastSent > 1000;

};

