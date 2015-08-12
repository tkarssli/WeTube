package handlers;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import objects.Message;
import objects.UserObject;

import java.net.SocketAddress;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Created by Tamir on 8/4/2015.
 */


public class ConnectionHandler {

    private UserHandler userHandler;
    private SocketIOServer server;
    private Map<SocketAddress, Integer> sessionIdMap;

    private final Map<Integer, Integer> userConnectionMap = new HashMap<Integer, Integer>();

    public ConnectionHandler(UserHandler userHandler, SocketIOServer server){
        this.userHandler = userHandler;
        this.server = server;

        this.sessionIdMap = new HashMap<SocketAddress, Integer>();

    }

    // Store user's connection info, and user info
    public void connectUser(UserObject user, UUID sessionId){

        // Set user's session ID
        userHandler.addUser(user.getUserId(), user);
        user.setSessionId(sessionId);

        // Pair SocketAddress with userId
        SocketAddress address = server.getClient(user.getSessionId()).getRemoteAddress();
        sessionIdMap.put(address, user.getUserId());

        // Send User information back to client
        server.getClient(sessionId).sendEvent("server", user);

        System.out.println("User connected: " + user.getUserName() + " Key: " + user.getKey() + " userId: " + user.getUserId());

    }
    public void disconnectUser(int userId){
        UserObject user = userHandler.getUser(userId);


        // force user to disconnect
        SocketIOClient client = server.getClient(user.getSessionId());
        SocketAddress address = client.getRemoteAddress();
        client.disconnect();

        // perform cleanup on user
        userDisconnected(address);

    }
    // process a request to connect with a user
    public void formConnection(Message request){

        int user1 = request.origin;
        int user2 = request.target;

        if (userConnectionMap.containsKey(user1) || userConnectionMap.containsKey(user2)){
            // TODO send user who made connection message stating that a connection already exists
        } else{
            userConnectionMap.put(user1,user2);

            // Set connected users on userObjects
            UserObject user1Object = userHandler.getUser(user1);
            user1Object.setConnectedUser(user2);
            UserObject user2Object = userHandler.getUser(user2);
            user2Object.setConnectedUser(user1);

            // Send successful connect messages back to clients
            server.getClient(user1Object.getSessionId()).sendEvent("server", new Message("connection", true, user1, user2));
            server.getClient(user2Object.getSessionId()).sendEvent("server", new Message("connection", true, user2, user1));

            System.out.println(userHandler.getUser(user1).getUserName() + " connected to " + userHandler.getUser(user2).getUserName());
        }
    }

    public void breakConnection(int userId){

        UserObject user1 = userHandler.getUser(userId);
        UserObject user2 = userHandler.getUser(userConnectionMap.get(userId));

        // Remove users from connection map
        userConnectionMap.remove(userId);
        userConnectionMap.remove(user2);

        // Set connected user parameter to default
        user1.setConnectedUser(-1);
        user2.setConnectedUser(-1);

        // Send broken connect messages back to client that is still connected
        server.getClient(user2.getSessionId()).sendEvent("server", new Message("connection", false, user2.getUserId(), user1.getUserId()));


        System.out.println(user1.getUserName() + " disconnected from " + user2.getUserName());


    }

    // Cleanup to be performed when a user is disconnected
    public void userDisconnected(SocketAddress address){
        int userId = sessionIdMap.get(address);
        UserObject user = userHandler.getUser(userId);

        // check if user is connected to another, if true break connection.
        if (userConnectionMap.containsKey(userId)){
            breakConnection(userId);
        }

        // Clean user out of maps
        userHandler.removeUser(userId);
        sessionIdMap.remove(address);

        System.out.println("User disconnected: " + user.getUserName() + " Key: " + user.getKey() + " userId: " + user.getUserId());


    }
}
