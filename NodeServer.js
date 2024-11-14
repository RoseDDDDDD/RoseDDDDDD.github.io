var http = require('http');
var fs = require('fs');


var server = http.createServer(function(rek,res){
    console.log("request was made" + rek.url);
    res.writeHead(200, {'Content-Type': 'text/html'});
    var myReadStream = fs.createReadStream(__dirname + '/index.html', 'utf-8');
    myReadStream.pipe(res);
    
});

server.listen(3000,'127.0.0.1');
console.log("listening");