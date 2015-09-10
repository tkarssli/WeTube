import com.corundumstudio.socketio.SocketIOServer;
import handlers.UserHandler;
import objects.Event;
import objects.UserObject;

/**
 * Created by Tamir on 8/11/2015.
 *
 * Class for passing commands between users
 */
public class EventRouter {
    private final UserHandler userHandler;
    private final SocketIOServer server;

    public EventRouter(UserHandler userHandler, SocketIOServer server) {
        this.userHandler = userHandler;
        this.server = server;
    }

    public void route(Event event) {

        // Get origin and target
        UserObject user1 = userHandler.getUser(event.origin);
        UserObject user2 = userHandler.getUser(user1.getConnectedUser());

        // String command = message.command;

        // Pass message from user1 to user2
        server.getClient(user2.getSessionId()).sendEvent("event", event);

        System.out.println("command sent from " + user1.getUserName() + " to " + user2.getUserName());


    }
}