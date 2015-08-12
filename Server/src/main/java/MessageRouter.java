import com.corundumstudio.socketio.SocketIOServer;
import handlers.UserHandler;
import objects.Message;
import objects.UserObject;

/**
 * Created by Tamir on 8/11/2015.
 *
 * Class for passing commands between users
 */
public class MessageRouter {
    private final UserHandler userHandler;
    private final SocketIOServer server;

    public MessageRouter(UserHandler userHandler, SocketIOServer server) {
        this.userHandler = userHandler;
        this.server = server;
    }

    public void route(Message message) {

        // Get origin and target
        UserObject user1 = userHandler.getUser(message.origin);
        UserObject user2 = userHandler.getUser(message.target);

        String command = message.command;

        // Pass message from user1 to user2
        server.getClient(user1.getSessionId()).sendEvent("message", message);

        System.out.println(command + " command sent from " + user1.getUserName() + " to " + user2.getUserName());


    }
}
