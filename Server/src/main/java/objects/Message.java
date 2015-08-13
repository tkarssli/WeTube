package objects;

/**
 * Created by Tamir on 8/1/2015.
 */
public class Message {
    public String command,user1,user2 = "";
    public Boolean bool = false;
    public int origin, target, key = -1;

    public Message(){}

    public Message(String command, boolean bool, int origin, int target) {
        this.command = command;
        this.bool = bool;
        this.origin = origin;
        this.target = target;
    }

    public Message(int key, int target, int origin) {
        this.key = key;
        this.target = target;
        this.origin = origin;
    }

    public Message(String command, boolean bool, String user1, String user2) {
        this.command = command;
        this.bool = bool;
        this.user1 = user1;
        this.user2 = user2;

    }

}
