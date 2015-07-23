/**
 * Created by Tamir on 7/23/2015.
 */
import java.io.IOException;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.Socket;
import java.util.Date;

import com.corundumstudio.socketio.AckCallback;
import com.corundumstudio.socketio.AckRequest;
import com.corundumstudio.socketio.Configuration;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.VoidAckCallback;
import com.corundumstudio.socketio.listener.DataListener;


public class MirrorServer {

    /**
     * Runs the server.
     */
    public static void main(String[] args) throws IOException {

        ServerSocket listener = null;
        try {
            listener = new ServerSocket(9090);
        } catch (IOException e) {
            System.err.println("Could not listen on port: 9090");
            System.exit(1);
        }

        Socket socket = null;
        try {
            while (true) {
                socket = listener.accept();
                System.out.println("Client Connected: " + socket.toString() );

                PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
                BufferedReader in = new BufferedReader(
                        new InputStreamReader(
                                socket.getInputStream()));
                String inputLine, outputLine;
                outputLine = null;
                int counter = 0;
                out.println("Start");
                try {while ((inputLine = in.readLine()) != null){
                    outputLine = inputLine + "-server";
                    out.println(outputLine);
                    if(inputLine.equals("bye")){
                        System.out.println("Closing Socket");
                        out.println("closing Socket");
                        break;
                    }

                }
                    in.close();
                    out.close();
                    socket.close();
                }catch(IOException e){
                    System.err.println("Mimic Failed: " + e);
                }

            }
        } catch(IOException e){
            System.err.println("Accept Failed");
            System.exit(1);
        }
        finally {
            listener.close();

        }
    }
}