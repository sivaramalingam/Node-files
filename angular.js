
var express = require("express"),
    app     = express(),
    bodyParser = require('body-parser');
    //angularserver = require('angularjs-server');
    
    
app.use(express.static(__dirname + '/wonder/view'));
//Store all HTML files in view folder.
app.use(express.static(__dirname + '/wonder/assets'));
//Store all JS and CSS in Scripts folder.

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));


app.get('/',function(req,res){
  res.status(200).sendFile(__dirname + '/wonder/view/index.html');
  //It will find and locate index.html from View or Scripts
});
/* 
app.get('/about',function(req,res){
  res.sendFile('/about.html');
});

app.get('/sitemap',function(req,res){
  res.sendFile('/sitemap.html');
}); */


app.listen(9000);

console.log(__dirname)
console.log("Running at Port 9000");



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

/* var http = require('http'),
    fs = require('fs');

http.createServer(function(req, res){
  console.log(req.url);
    fs.readFile('wonder/',function (err, data){
        res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
        res.write(data);
        console.log(data)
        res.end();
    });
    
}).listen(9000); */

/* var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic(__dirname)).listen(8080, function(){
    console.log('Server running on 8080...');
}); */