package objects;

import java.util.Random;
import java.util.UUID;

/**
 * Created by Tamir on 7/23/2015.
 */
public class UserObject {

    private String userName;
    private UUID sessionId;
    private int  userId,key, connectedUser;

   final Random randGen = new Random();

    public UserObject(){

        this.userId = randGen.nextInt(10000)+10000;
        this.userName = null;
        this.sessionId = null;
        this.connectedUser = -1;
        this.key = randGen.nextInt(10000000)+ 10000000;
    }

    public UserObject(String userName, UUID sessionId){
        super();
        this.userName = userName;
        this.sessionId = sessionId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public UUID getSessionId() {
        return sessionId;
    }

    public void setSessionId(UUID sessionId) {
        this.sessionId = sessionId;
    }

    public int getUserId(){
        return userId;
    }

    public int getConnectedUser(){
        return connectedUser;
    }

    public void setConnectedUser(int user){
        this.connectedUser = user;
    }

    public int getKey() {
        return key;
    }

    public void setKey() {
        this.key = randGen.nextInt(10000000)+ 10000000;
    }
}
