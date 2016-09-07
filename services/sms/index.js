var http = require('http');
var sendText = require('./services/sendText.js');

var port = 8081;

http.createServer(function(req, res){
    if (req.method === 'POST') {
        if (req.url === '/texts') {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.write('thanks for the data yo');
            res.end();
            console.log('posted');
        } else {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end();
        }
    } else {
        res.writeHead(405, 'Method Not Supported', {'Content-Type': 'text/html'});
        res.end();
    }
}).listen(port);
