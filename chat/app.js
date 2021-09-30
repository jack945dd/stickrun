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
                    case "txt":
                        content_type = {'Content-Type': 'text/plain'};
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

io.on('connection', 
    function(socket)
    {
        socket.on('join', 
            function(nickname){
                clients.push({id: socket.id, nickname: nickname});
                io.emit('msg_server', '<li class="msg_server"><div>' + nickname+ ' 加入聊天</div></li>');
            }
        );
        socket.on('send', 
            function(value){
                if(!value.length)
                    return;
                let texts = value.split('\n');
                let id = socket.id;
                let l = clients.length;
                for(i=0; i<l; i++){
                    if(id == clients[i].id){
                        io.emit("msg", {from: clients[i].nickname, texts:texts});
                        break;
                    }
                }
            }
        );
        socket.on('disconnect', 
            function(){
                let id = socket.id;
                let l = clients.length;
                for(i=0; i<l; i++){
                    if(clients[i].id == id){
                        io.emit('msg_server', '<li class="msg_server"><div>' + clients[i].nickname+ ' 離開聊天</div></li>');
                        clients.splice(i, 1);
                        break;
                    }
                }
            }
        );
    }
);

server.listen(port, 
    function()
    {
        console.log("listen on " + port);
    }
);

