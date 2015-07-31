/**
 * Created by Tamir on 7/23/2015.
 */
public class UserObject {



    private String userName;
    private String action;
    private String socketId;

    public UserObject(){
    }

    public UserObject(String userName, String action, String socketId){
        super();
        this.userName = userName;
        this.action = action;
        this.socketId = socketId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getSocketId() {
        return socketId;
    }

    public void setSocketId(String socketId) {
        this.socketId = socketId;
    }
}
