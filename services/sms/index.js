var http = require('http');
var sendText = require('./services/sendText.js');
var qs = require('querystring');
const spawn = require('child_process').spawn;

var port = 8081;

http.createServer(function(req, res){
    if (req.method === 'POST') {
        if (req.url === '/texts') {
            var body = '';
            var postData;
            var finished = true;
            
            req.on('data', function(data) {
                body += data;
            });
            
            req.on('end', function() {
                postData = qs.parse(body);
                
                if (postData === undefined || (postData['receiver'] === undefined || postData['receiver'] === ''
                    || postData['receiver'] === null) || (postData['messageContent'] === undefined 
                    || postData['messageContent'] === '' || postData['messageContent'] === null)) 
                {
                    finished = false;
                } else {
                    var receiver = postData['receiver'];
                    var messageContent = postData['messageContent'];
                    
                    console.log('receiver: ' + receiver);
                    console.log('messageContent: ' + messageContent);
                    console.log('postData: ' + postData)
                    //sendText.sendMessage(receiver, messageContent);
                }
                
                if (!finished) {
                    res.writeHead(404, {'Content-Type': 'text/html'});
                    res.write('Error empty data. Required: receiver and messageContent');
                    res.end();
                } else {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write('thanks for the data yo');
                    res.end();
                    console.log('posted');
                }
            });
            
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
