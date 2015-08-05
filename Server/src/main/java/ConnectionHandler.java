import com.corundumstudio.socketio.SocketIOServer;

import java.util.UUID;

/**
 * Created by Tamir on 8/4/2015.
 */
public class ConnectionHandler {

    private UserHandler userHandler;
    private SocketIOServer server;

    public ConnectionHandler(UserHandler userHandler, SocketIOServer server){
        this.userHandler = userHandler;
        this.server = server;

    }

    // Set uuid for client's connection and add to client Map.
    public void connectUser(UserObject user, UUID sessionId){
        userHandler.addUser(user.getUuid(), user);
        user.setSessionId(sessionId);

        // Send confirmation to Client
        server.getClient(sessionId).sendEvent("server", new String("Connection Successful"));
    }

    public void disconnectUser(UUID uuid){
        server.getClient(uuid).disconnect();
        userHandler.removeUser(uuid);

    }
}
