package objects;

/**
 * Created by Tamir on 8/1/2015.
 */
public class Message {
    public final String command;
    public final Boolean bool;
    public final int origin, target;

    public Message(String command, boolean bool, int origin, int target) {
        this.command = command;
        this.bool = bool;
        this.origin = origin;
        this.target = target;
    }

}
