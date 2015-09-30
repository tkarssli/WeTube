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
import objects.VideoEvent;

import java.io.Console;
import java.io.IOException;
import java.net.Socket;
import java.util.Map;


public class    MirrorServer {

    private static String SERVERADDRESS = "";
    private static int PORT = 80;

    /**
     * Runs the server.
     */
    public static void main(String[] args) throws InterruptedException {

        // Get local IP, necessary evil because of dynamic local IP
        Socket s;
        try{
            s = new Socket("google.com", 80);
            SERVERADDRESS = s.getLocalAddress().getHostAddress();
        } catch(IOException e){
            System.out.println("Local Ip couldn't be found, check connection");
            System.exit(0);
        }


        // Get Port environment variable for Heroku
        Map<String,String> env = System.getenv();


        System.out.println("Hosted on " + SERVERADDRESS + ", port set to " + PORT);


        // Server Config
        Configuration config = new Configuration();
        config.setHostname(SERVERADDRESS);
        config.setPort(PORT);
        final SocketIOServer server = new SocketIOServer(config);

        // Start thread to allow for I/O in console if console exists
//        if (!(System.console() == null)) {
//            consoleIoThread ioThread = new consoleIoThread(server);
//            ioThread.start();
//        } else {System.out.println("No Console.");}

        // Handlers --------------------------------------------------------------------------------------------------------//
        final UserHandler userHandler = new UserHandler();
        final ConnectionHandler connectionHandler = new ConnectionHandler(userHandler, server);

        // Routers ---------------------------------------------------------------------------------------------------------//
        final EventRouter eventRouter = new EventRouter(userHandler, server);


        // Listeners -------------------------------------------------------------------------------------------------------//

        // Add user to storage on connect
        server.addEventListener("connected", UserObject.class, new DataListener<UserObject>() {
            @Override
            public void onData(SocketIOClient client, UserObject user, AckRequest ackRequest) throws Exception {
                connectionHandler.connectUser(user, client.getSessionId());
            }
        });

        // Send incoming message to EventRouter
        server.addEventListener("videoEvent", VideoEvent.class, new DataListener<VideoEvent>() {
            @Override
            public void onData(SocketIOClient socketIOClient, VideoEvent event, AckRequest ackRequest) throws Exception {
                eventRouter.routeVideoEvent(event);
            }
        });

        // Clear user from storage on disconnect
        server.addDisconnectListener(new DisconnectListener() {
            @Override
            public void onDisconnect(SocketIOClient client) {
                connectionHandler.userDisconnected(client.getRemoteAddress());
            }
        });

        // Receive connect request
        server.addEventListener("connectRequest", Message.class, new DataListener<Message>() {
            @Override
            public void onData(SocketIOClient client, Message message, AckRequest ackRequest) throws Exception {
                System.out.println("Connect request received from " + message.origin + " to target: " + message.target);
                connectionHandler.formConnection(message);
            }
        });

        // Receive disconnect request
        server.addEventListener("disconnectRequest", Message.class, new DataListener<Message>() {
            @Override
            public void onData(SocketIOClient client, Message message, AckRequest ackRequest) throws Exception {
                System.out.println("Disconnect request received from " + message.origin);
                connectionHandler.breakConnection(message.origin);
            }
        });

        // Generic Message request
        server.addEventListener("message", Message.class, new DataListener<Message>() {
            @Override
            public void onData(SocketIOClient socketIOClient, Message message, AckRequest ackRequest) throws Exception {
                eventRouter.routeEvent(message);
            }
    });

        server.addEventListener("ping", Message.class, new DataListener<Message>() {
            @Override
            public void onData(SocketIOClient client, Message message, AckRequest ackRequest) throws Exception {
                server.getClient(client.getSessionId()).sendEvent("pong", message);

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
                    System.exit(0);
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