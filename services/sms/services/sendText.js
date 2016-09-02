/*
 * Creates a new text message, sends it through Twilio's API and then saves it to 
 * dynamoDB
 */
var twilio = require('twilio');
var context = require('context');
var AWS = require("aws-sdk");
var MessageModel = require("../models/textMessage.js")

function createMessage(inputTextMessage) {
    var client = new twilio.RestClient(context.twilio_data.accountSid, context.twilio_data.authToken);
    
    client.sms.messages.create({

        to: inputTextMessage.receiver,
        from: inputTextMessage.sender,
        body: inputTextMessage.messageContent },
        
        function(error, message) {
            var updatedMessage = inputTextMessage;
        
            if (!error) {
                console.log('Success! The SID for this SMS message is:');
                console.log(message.sid);
                updatedMessage.sid = message.sid;
                
                console.log('Message sent on:');
                console.log(message.dateCreated);
                updatedMessage.timestamp = message.dateCreated;
                
                return updatedMessage;
            } else {
                console.error('Error creating message: ' + error.message);
                return null;
            }
        
});

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
    
    docClient.put(params, function(err, data) {
        if(err) {
            console.error("Error loading message to database: " + JSON.stringify(err, null, 2));
        } else {
            console.log("Message successfully loaded into database");
        }
        
    });
}

function sendMessage(sender, messageContent){
    let textMessage = new MessageModel.textMessage(sender, context.twilio_data.accPhoneNum, messageContent);
    
    let updatedMessage = createMessage(textMessage); 
    
    if (updatedMessage != null) {
        saveMessage(updatedMessage);
    }
};