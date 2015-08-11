package handlers;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
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
    private Map<SocketAddress, Integer> connectionMap;

    private final Map<UUID, Integer> sessionMap = new HashMap<UUID, Integer>();

    public ConnectionHandler(UserHandler userHandler, SocketIOServer server){
        this.userHandler = userHandler;
        this.server = server;

        this. connectionMap = new HashMap<SocketAddress, Integer>();

    }

    // Store user's connection info, and user info
    public void connectUser(UserObject user, UUID sessionId){

        // Set user's session ID
        userHandler.addUser(user.getUserId(), user);
        user.setSessionId(sessionId);

        // Pair SocketAdress with userId
        SocketAddress address = server.getClient(user.getSessionId()).getRemoteAddress();
        connectionMap.put(address, user.getUserId());

        // Send User information back to client
        server.getClient(sessionId).sendEvent("server", user);

        System.out.println("User connected: " + user.getUserName() + " Key: " + user.getKey() + " userId: " + user.getUserId());

    }

    public void disconnectUser(int userId){
        UserObject user = userHandler.getUser(userId);

        // force user to disconnect
        SocketIOClient client = server.getClient(user.getSessionId());
        client.disconnect();



    }

    public void userDisconnected(SocketAddress address){
        int userId = connectionMap.get(address);
        UserObject user = userHandler.getUser(userId);
        userHandler.removeUser(userId);
        connectionMap.remove(address);

        System.out.println("User disconnected: " + user.getUserName() + " Key: " + user.getKey() + " userId: " + user.getUserId());


    }
}
