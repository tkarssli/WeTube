/**
 * Created by Tamir on 7/23/2015.
 *
 * Mirror Server
 */

import com.corundumstudio.socketio.AckRequest;
import com.corundumstudio.socketio.Configuration;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.DataListener;
import com.corundumstudio.socketio.listener.DisconnectListener;
import handlers.ConnectionHandler;
import handlers.UserHandler;
import objects.Message;
import objects.UserObject;

import java.io.Console;
import java.util.Map;


public class MirrorServer {
    
    private static final String SERVERADDRESS = "0.0.0.0";
    private static int PORT = 0;

    /**
     * Runs the server.
     */
    public static void main(String[] args) throws InterruptedException {

        // Get Port environment variable for Heroku
        Map<String,String> env = System.getenv();
        try {
            PORT = Integer.parseInt(env.get("PORT"));
        } catch(NumberFormatException e){
            System.out.println("Hosted locally, port set to 9090");
            PORT = 9090;
        }

        // Server Config
        Configuration config = new Configuration();
        config.setHostname(SERVERADDRESS);
        config.setPort(PORT);
        final SocketIOServer server = new SocketIOServer(config);

        // Start thread to allow for I/O in console if console exists
        if (!(System.console() == null)) {
            consoleIoThread ioThread = new consoleIoThread(server);
            ioThread.start();
        } else {System.out.println("No Console.");}

        // Handlers --------------------------------------------------------------------------------------------------------//
        final UserHandler userHandler = new UserHandler();
        final ConnectionHandler connectionHandler = new ConnectionHandler(userHandler, server);

        // Routers ---------------------------------------------------------------------------------------------------------//
        final MessageRouter messageRouter = new MessageRouter(userHandler, server);


        // Listeners -------------------------------------------------------------------------------------------------------//

        // Add user to storage on connect
        server.addEventListener("connected", UserObject.class, new DataListener<UserObject>() {
            @Override
            public void onData(SocketIOClient client, UserObject user, AckRequest ackRequest) throws Exception {
                connectionHandler.connectUser(user, client.getSessionId());
            }
        });

        // Send incoming message to MessageRouter
        server.addEventListener("message", Message.class, new DataListener<Message>() {
            @Override
            public void onData(SocketIOClient socketIOClient, Message message, AckRequest ackRequest) throws Exception {

                messageRouter.route(message);


            }
        });

        // Clear user from storage on disconnect
        server.addDisconnectListener(new DisconnectListener() {
            @Override
            public void onDisconnect(SocketIOClient client) {
                connectionHandler.userDisconnected(client.getRemoteAddress());
            }
        });


        // Start Server -------------------------------------------------------------------------------------------------------//

        server.start();

        Thread.sleep(Integer.MAX_VALUE);

        server.stop();

    }
}

// In the case that this is run from a console, simple commands for managing the server
class consoleIoThread extends Thread {
    private Console c;
    private SocketIOServer server;
    consoleIoThread(SocketIOServer server){
        this.c = System.console();
        this.server = server;
    }

    public void run() {
        String[] commands = new String[] {"start", "stop", "restart","echo"};


        while (true){
            String input = c.readLine();
            int index = -1;
            for(int i=0; i < commands.length;i++){
                if(input == commands[i]){
                    index = i;
                    break;
                } else if ( i == commands.length -1){
                    System.out.println("Enter a valid command;");
                    for ( String s : commands){System.out.println(s);}
                }

            }
            switch (index){
                case 0:
                    server.start();
                    break;
                case 1:
                    server.stop();
                    break;
                case 2:
                    server.stop();
                    server.start();
                    break;
                case 3:
                    System.out.println("Echoooooo");
            }

        }

    }
}