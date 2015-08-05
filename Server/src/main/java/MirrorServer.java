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


public class MirrorServer {
    
    private final static String SERVERADDRESS = "localhost";
    private final static int PORT = 9090;

    /**
     * Runs the server.
     */
    public static void main(String[] args) throws InterruptedException {

        Configuration config = new Configuration();
        config.setHostname(SERVERADDRESS);
        config.setPort(PORT);

        final SocketIOServer server = new SocketIOServer(config);

        final UserHandler userHandler = new UserHandler();
        final ConnectionHandler connectionHandler = new ConnectionHandler(userHandler, server);




        server.addEventListener("connected", UserObject.class, new DataListener<UserObject>() {
            @Override
            public void onData(SocketIOClient client, UserObject user, AckRequest ackRequest) throws Exception {
                System.out.println("User connected " + user.getUserName());
                connectionHandler.connectUser(user, client.getSessionId());

            }
        });

        server.start();

        Thread.sleep(Integer.MAX_VALUE);

        server.stop();


//        try {
//            while (true) {
//                socket = listener.;
//                System.out.println("Client Connected: " + socket.toString() );
//
//                PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
//                BufferedReader in = new BufferedReader(
//                        new InputStreamReader(
//                                socket.getInputStream()));
//                String inputLine, outputLine;
//                outputLine = null;
//                out.println("Start");
//                try {while ((inputLine = in.readLine()) != null){
//                    outputLine = inputLine + "-server";
//                    out.println(outputLine);
//                    if(inputLine.equals("bye")){
//                        System.out.println("Closing Socket");
//                        out.println("closing Socket");
//                        break;
//                    }
//
//                }
//                    in.close();
//                    out.close();
//                    socket.close();
//                }catch(IOException e){
//                    System.err.println("Mimic Failed: " + e);
//                }
//
//            }
//        } catch(IOException e){
//            System.err.println("Accept Failed");
//            System.exit(1);
//        }
//        finally {
//            listener.close();
//
//        }
    }
}