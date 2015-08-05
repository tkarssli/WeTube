import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Created by Tamir on 8/4/2015.
 */
public class UserHandler {

    private Map<UUID, UserObject> clientMap;

    public UserHandler(){
        this.clientMap = new HashMap<UUID, UserObject>();
    }

    public UserObject getUser(UUID uuid){
        return clientMap.get(uuid);
    }

    public void addUser(UUID uuid, UserObject client){
        if (!exists(uuid)){
            clientMap.put(uuid, client);

        }
    }
    public void removeUser(UUID uuid){
        if(exists(uuid)){
            clientMap.remove(uuid);
        }
    }

    public boolean exists(UUID uuid){
       return clientMap.containsKey(uuid);
    }
}
