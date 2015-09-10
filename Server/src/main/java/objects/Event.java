package objects;

/**
 * Created by Tamir on 8/18/2015.
 */
public class Event {
    public int origin = -1;
    public String commandType = "";

    public Event(){}

    public Event(int origin, String commandType) {
        this.origin = origin;
        this.commandType = commandType;
    }
}
