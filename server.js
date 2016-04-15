var http = require('http');
var server = http.createServer(function(req,res){
  "use strict";
  res.writeHead(200,{'Content-Type':'text/html'});
  res.end('<h1>Hola esto es una prueba</h1>');
});
var port=Number(process.env.PORT || 3000);
server.listen(port);
