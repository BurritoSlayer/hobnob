var parse_post = require("parse-post");

const port = 8081;
 
var route = beeline.route({
    "/texts": function(req, res) {
        "GET": function(req, res) { /*** GET Code ***/ },
        "POST": parse_post(function(req, res) {
            // req.body has parsed POST request body 
            console.log(req.body);
        })
    }
});
 
http.createServer(route).listen(port);