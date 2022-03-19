package edu.eci.arsw.collabpaint;

import edu.eci.arsw.collabpaint.model.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.LinkedList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

@Controller
public class STOMPMessagesHandler {
    @Autowired
    SimpMessagingTemplate msgt;
    private final ConcurrentHashMap<String , List<Point>> polygons = new ConcurrentHashMap<String , List<Point>>();


    @MessageMapping("/newpoint.{numdibujo}")
    public void handlePointEvent(Point pt, @DestinationVariable String numdibujo) throws Exception {
        System.out.println("Nuevo punto recibido en el servidor!:"+pt);
        makePolygon(pt, numdibujo);
        if(polygons.get(numdibujo).size() >= 4){
            msgt.convertAndSend("/topic/newPolygon."+numdibujo, polygons.get(numdibujo));
        }
        msgt.convertAndSend("/topic/newpoint."+numdibujo, pt);
    }

    public void makePolygon(Point pt, String numdibujo){
        List<Point> list = new LinkedList<>();
        if (polygons.containsKey(numdibujo)){
            list = polygons.get(numdibujo);
        }
        list.add(pt);
        polygons.put(numdibujo,list);



    }
}



