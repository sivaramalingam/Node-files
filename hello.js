/* var http = require('http'),
    fs = require('fs');


fs.readFile('1.html', function (err, html) {
    if (err) {
        throw err; 
    }       
    http.createServer(function(request, response) {  
        response.writeHeader(200, {"Content-Type": "text/html"});  
        response.write(html);  
        response.end();  
    }).listen(8000);
}); */

//console.log("hello world")

var http = require('http'),
    fs = require('fs');

http.createServer(function(req, res){
  console.log(req.url);
    fs.readFile('test-hello.html',function (err, data){
        res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
        res.write(data);
        console.log(data)
        res.end();
    });
    
}).listen(9000);

/* var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic(__dirname)).listen(8080, function(){
    console.log('Server running on 8080...');
}); */