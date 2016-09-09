/*
 * Creates a new text message, sends it through Twilio's API and then saves it to 
 * dynamoDB
 */
var twilio = require('twilio');
var context = require('../context');
var AWS = require("aws-sdk");
var MessageModel = require("../models/textMessage.js");

var exports = module.exports = {};
var isPaused = true;
var messageUpdated;

function createMessage(inputTextMessage) {
    var client = new twilio.RestClient(context.twilio_data.accountSid, context.twilio_data.authToken);
    
    client.sms.messages.create({

        to: inputTextMessage.receiver,
        from: inputTextMessage.sender,
        body: inputTextMessage.messageContent },
        
        function(error, message) {
            messageUpdated = inputTextMessage;
        
            if (!error) {
                console.log('Success! The SID for this SMS message is: ' + message.sid);
                messageUpdated.sid = message.sid;
                
                console.log('Message sent on:' + message.dateCreated);
                console.log(message.dateCreated);
                messageUpdated.timestamp = message.dateCreated;
                
                var isPaused=true;
                return messageUpdated;
            } else {
                console.error('Error creating message: ' + error.message);
                return null;
            }
    });
};

var saveMessage = function(textMessage) {
    AWS.config.update({
        region: context.aws_data.region,
        endpoint: context.aws_data.end_point
    });
    
    var docClient = new AWS.DynamoDB.DocumentClient();
    
    var params = {
        TableName: "texts",
        Item: {
            "sid" : textMessage.sid,
            "timestamp" : textMessage.timestamp.toString(),
            "sender" : textMessage.sender.toString(),
            "receiver" : textMessage.receiver.toString(),
            "messageContent" : textMessage.messageContent
        }
    }
    
    console.log('attempting to add new text to dynamo..');
    
    docClient.put(params, function(err, data) {
        if(err) {
            console.error("Error loading message to database: " + JSON.stringify(err, null, 2));
        } else {
            console.log("Message successfully loaded into database");
        }
        
    });
}

var sendMessage = function(receiver, messageContent){
    const textMessage = new MessageModel.textMessage(receiver, context.twilio_data.accPhoneNum, messageContent);
    
    //const updatedMessage = createMessage(textMessage); 
    createMessage(textMessage);
    
    // need to refactor to Promises down the road.. current code can cause bugs
    // if the timeout completes before the return of createMessage()
    function waitForIt(){
        if (typeof messageUpdated === 'undefined' ) {
            setTimeout(function(){waitForIt()},100);
            console.log('waiting..');
        } else if (messageUpdated.timestamp === 'undefined') {
            setTimeout(function(){waitForIt()},100);
            console.log('waiting..');
        } else {
            if (messageUpdated != null || typeof messageUpdated != 'undefined') {
                console.log('message saved');
                return saveMessage(messageUpdated);
            } else {
                console.error('messageUpdated was bad');
                return null;
            } 
        };
    }
    
    waitForIt();
};

module.exports = {
    sendMessage,
    saveMessage
}