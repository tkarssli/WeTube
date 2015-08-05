import java.util.UUID;

/**
 * Created by Tamir on 7/23/2015.
 */
public class UserObject {

    private String userName;
    private UUID sessionId, uuid, connectedUser;

    public UserObject(){
        this.uuid = UUID.randomUUID();
        this.userName = null;
        this.sessionId = null;
        this.connectedUser = null;
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

    public UUID getUuid(){
        return uuid;
    }

    public UUID getConnectedUser(){
        return connectedUser;
    }

    public void setConnectedUser(UUID uuid){
        this.connectedUser = uuid;
    }
}
