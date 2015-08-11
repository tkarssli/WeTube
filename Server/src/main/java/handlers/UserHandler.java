package handlers;

import objects.UserObject;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by Tamir on 8/4/2015.
 */
public class UserHandler {

    private Map<Integer, UserObject> clientMap;

    public UserHandler(){
        this.clientMap = new HashMap<Integer, UserObject>();
    }

    public UserObject getUser(int userId){
        return clientMap.get(userId);
    }

    public void addUser(int userId, UserObject client){
        if (!exists(userId)){
            clientMap.put(userId, client);

        }
    }
    public void removeUser(int userId){
        if(exists(userId)){
            clientMap.remove(userId);
        }
    }

    public int assignNewKey(int userId){
        UserObject user;
        int key;

        user = clientMap.get(userId);
        user.setKey();
        key = user.getKey();

        return key;

    }

    public boolean exists(int userId){
       return clientMap.containsKey(userId);
    }
}
