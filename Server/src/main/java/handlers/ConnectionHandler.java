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
 *
 * Class for handling connections
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
        UserObject user1 = userHandler.getUser(request.origin);
        UserObject user2 = userHandler.getUser(request.target);
        try {
            // Start connection by making sure target is available to connect to, or that origin isn't already connected, AND if user2 does not exists
            if (userConnectionMap.containsKey(user1.getUserId()) || userConnectionMap.containsKey(user2.getUserId()) || user1.getUserId() == user2.getUserId())  {
                // TODO send user who made connection message stating that a connection already exists, or a user cannot connect to themselves
            } else {


                // Check key is correct
                if (request.key == user2.getKey()) {
                    userConnectionMap.put(user1.getUserId(), user2.getUserId());
                    userConnectionMap.put(user2.getUserId(), user1.getUserId());
                    // Set connected users on userObjects
                    user1.setConnectedUser(user2.getUserId());
                    user2.setConnectedUser(user1.getUserId());

                    // Send successful connect messages back to clients
                    server.getClient(user1.getSessionId()).sendEvent("server", new Message("connectionResult", true, user1.getUserName(), user2.getUserName()));
                    server.getClient(user2.getSessionId()).sendEvent("server", new Message("connectionResult", true, user2.getUserName(), user1.getUserName()));
                    System.out.println(user1.getUserName() + " connected to " + user2.getUserName());
                } else {
                    // Send failed connection notice back
                    server.getClient(user1.getSessionId()).sendEvent("server", new Message("connectionResult", false, user1.getUserName(), user2.getUserName()));
                    System.out.println(user1.getUserName() + " failed to connect to " + user2.getUserName() + " because of a bad key!");
                }
            }
        } catch( NullPointerException e){
            server.getClient(user1.getSessionId()).sendEvent("server", new Message("connectionResult", false, user1.getUserName(), "Unknown"));
            System.out.println(user1.getUserName() + " failed to connect to unknown user " + request.target);

        }
    }

    public void breakConnection(int userId){

        UserObject user1 = userHandler.getUser(userId);
        UserObject user2 = userHandler.getUser(userConnectionMap.get(userId));

        // Remove users from connection map
        userConnectionMap.remove(userId);
        userConnectionMap.remove(user2.getUserId());

        // Set connected user parameter to default
        user1.setConnectedUser(-1);
        user2.setConnectedUser(-1);

        // Send broken connect messages back to client that is still connected
        server.getClient(user2.getSessionId()).sendEvent("server", new Message("connectionResult", false, user2.getUserId(), user1.getUserId()));


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
