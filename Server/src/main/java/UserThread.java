/**
 * Created by Tamir on 7/30/2015.
 *
 * Client Thread for Mirror Server
 */
import com.corundumstudio.socketio.SocketIOClient;

public class UserThread extends Thread {

    protected SocketIOClient socket;

    public UserThread(SocketIOClient socket){
        this.socket= socket;
        System.out.println("User Connected on " + socket.getRemoteAddress());
    }


    public void run(){

    }
}
