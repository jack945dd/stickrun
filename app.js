const fs = require('fs');

const server = require('http').createServer(
    function(req, res)
    {
        let file = "index.html";
        let status_code = 200;
        let content_type = {'Content-Type': 'text/html'};
        if(req.url == '/');
        else
            if(fs.existsSync("public"+req.url)){    //file exists, set file name and content type
                file = "public"+req.url;
                let extension = req.url.split('.')[req.url.split('.').length-1];
                switch(extension){
                    case "js":
                        content_type = {'Content-Type': 'application/x-javascript'};
                        break;
                    case "png":
                        content_type = {'Content-Type': 'image/png'};
                        break;
                    case "json":
                        content_type = {'Content-Type': 'application/json'};
                        break;
                }
            }
            else{   //file not found, send 404
                file = "404.html";
                status_code = 404;
            }
        fs.readFile(file,   //write file to client
                function(err, data)
                {
                    res.writeHead(status_code, content_type);
                    res.end(data);
                }
            );
    }
);
const io = require('socket.io')(server);

const port = 8888;
var clients = [];
var queue_2p = [];

io.on('connection', 
    function(socket)
    {
        clients.push(socket.id);
        socket.on('2p', 
            function(){
                queue_2p.push(socket.id);
                check_queue();
            }
        );
        socket.on('disconnect', 
            function(){
                for(let i=0; i<clients.length; i++){
                    if(socket.id == clients[i])
                        clients.splice(i, 1);
                        console.log('clients:'+clients);
                }
                for(let i=0; i<queue_2p.length; i++){
                    if(socket.id == queue_2p[i])
                        queue_2p.splice(i, 1);
                        console.log('queue:'+queue_2p);
                }
            }
        );
    }
);
function check_queue(){
    while(queue_2p.length>=2){
        console.log('new 2p room');
        queue_2p.splice(0, 2);
    }
}
server.listen(port, 
    function()
    {
        console.log("listen on " + port);
    }
);

