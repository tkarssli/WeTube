package objects;

/**
 * Created by Tamir on 8/1/2015.
 */
public class Message extends Event {
    public String command,user1,user2 = "";
    public Boolean bool = false;
    public int target, key = -1;
    public double time = 0.0;
    public String URL = "";

    public Message(){}

    public Message(String command, boolean bool, int target) {
        this.command = command;
        this.bool = bool;
        this.target = target;
    }

    public Message(int key, int target) {
        this.key = key;
        this.target = target;
    }
    public Message(double time){
        this.time = time;
    }

    public Message(String string, boolean bool ){
        this.command = string;
        this.bool = bool;
    }

    public Message(String command, boolean bool, String user1, String user2) {
        this.command = command;
        this.bool = bool;
        this.user1 = user1;
        this.user2 = user2;

    }

}
