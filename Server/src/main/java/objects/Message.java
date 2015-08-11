package objects;

/**
 * Created by Tamir on 8/1/2015.
 */
public class Message {
    public final String command;
    public final int origin, target;

    public Message(String command, int origin, int target) {
        this.command = command;
        this.origin = origin;
        this.target = target;
    }

}
