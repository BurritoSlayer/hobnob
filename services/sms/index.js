var http = require('http');
var sendText = require('./services/sendText.js');
const spawn = require('child_process').spawn;

var port = 8081;

http.createServer(function(req, res){
    if (req.method === 'POST') {
        if (req.url === '/texts') {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write('thanks for the data yo');
            res.end();
            console.log('posted');
        } else if (req.url === '/server') {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write('initializing build script');
            res.end();
            console.log('calling build script');
            spawn('sh', [ 'build.sh' ]);
        } else {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end();
        }
    } else if (req.method === 'GET') {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end();
    } else {
        res.writeHead(405, 'Method Not Supported', {'Content-Type': 'text/html'});
	    res.end();
    }
}).listen(port);
