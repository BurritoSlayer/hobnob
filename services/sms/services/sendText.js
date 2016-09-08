/*
 * Creates a new text message, sends it through Twilio's API and then saves it to 
 * dynamoDB
 */
var twilio = require('twilio');
var context = require('../context');
var AWS = require("aws-sdk");
var MessageModel = require("../models/textMessage.js");

var exports = module.exports = {};

function createMessage(inputTextMessage) {
    var client = new twilio.RestClient(context.twilio_data.accountSid, context.twilio_data.authToken);
    
    client.sms.messages.create({

        to: inputTextMessage.receiver,
        from: inputTextMessage.sender,
        body: inputTextMessage.messageContent },
        
        function(error, message) {
            var updatedMessage = inputTextMessage;
        
            if (!error) {
                console.log('Success! The SID for this SMS message is: ' + message.sid);
                updatedMessage.sid = message.sid;
                
                console.log('Message sent on:' + message.dateCreated);
                console.log(message.dateCreated);
                updatedMessage.timestamp = message.dateCreated;
                
                return updatedMessage;
            } else {
                console.error('Error creating message: ' + error.message);
                return null;
            }
    });
};

function saveMessage(textMessage) {
    AWS.config.update({
        region: context.aws_data.region,
        endpoint: context.aws_data.end_point
    });
    
    var docClient = new AWS.DynamoDB.DocumentClient();
    
    var params = {
        TableName: "texts",
        Item: {
            "sender" : textMessage.sender,
            "receiver" : textMessage.reciever,
            "messageContent" : textMessage.messageContent
        }
    }
    
    console.log('attempting to add new text to dynamo..')
    
    docClient.put(params, function(err, data) {
        if(err) {
            console.error("Error loading message to database: " + JSON.stringify(err, null, 2));
        } else {
            console.log("Message successfully loaded into database");
        }
        
    });
}

exports.sendMessage = function(receiver, messageContent){
    const textMessage = new MessageModel.textMessage(receiver, context.twilio_data.accPhoneNum, messageContent);
    
    //const updatedMessage = createMessage(textMessage); 
    
    Promise.resolve(createMessage(textMessage)).then(function(updatedMessage){
    
        if (updatedMessage != null) {
            return saveMessage(updatedMessage);
            console.log('message saved');
        } else {
            console.error('updatedMessage was null');
        } 
        
    });
};

