var app = (function () {

    class Point{
        constructor(x,y){
            this.x=x;
            this.y=y;
        }        
    }
    
    var stompClient = null;
    let ingresado = null;

    var addPointToCanvas = function (point) {        
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(point.x, point.y, 10, 0, 2 * Math.PI);
        ctx.stroke();
    };

    var drawPoligon = function (objeto){
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(objeto[0].x , objeto[0].y);
        for (let i = 1 ; i < objeto.length; i++){
            ctx.lineTo(objeto[i].x , objeto[i].y);
        }
        ctx.closePath();
        ctx.fill();

    }
    
    
    var getMousePosition = function (evt) {
        canvas = document.getElementById("canvas");
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    };


    var connectAndSubscribe = function () {
        console.info('Connecting to WS...');
        var socket = new SockJS('/stompendpoint');
        stompClient = Stomp.over(socket);
        
        //subscribe to /topic/TOPICXX when connections succeed
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            stompClient.subscribe('/topic/newpoint.'+ingresado, function (eventbody) {
                var theObject = JSON.parse(eventbody.body)
                addPointToCanvas(theObject);
            });
            stompClient.subscribe('/topic/newPolygon.'+ingresado, function (eventbody){
                var theObject = JSON.parse(eventbody.body)
                drawPoligon(theObject);
            })
        });

    };


    
    

    return {

        init: function () {
            var can = document.getElementById("canvas");
            ingresado = $('#id').val();
            $('#donde').html("Conectado a: " +ingresado)
            //websocket connection
            connectAndSubscribe();
        },

        publishPoint: function(px,py){
            var pt=new Point(px,py);
            console.info("publishing point at "+pt);

            stompClient.send("/app/newpoint."+ingresado ,{},JSON.stringify(pt))

        },

        disconnect: function () {
            if (stompClient !== null) {
                stompClient.disconnect();
            }
            setConnected(false);
            console.log("Disconnected");
        }
    };

})();