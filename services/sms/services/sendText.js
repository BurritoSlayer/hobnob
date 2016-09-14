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

//TODO: refactor to look by specific phone number, either in receiver or sender
    //also might split this out into its own js file.
var queryMessages = function(){
    let date = new Date();
    date.setMonth(d.getMonth() - 1); //one month ago from today, which means 
                                        //we're only returning texts from this month
    
    let messageArr = [];
    
    AWS.config.update({
        region: context.aws_data.region,
        endpoint: context.aws_data.end_point
    });
    
    let docClient = new AWS.DynamoDB.DocumentClient();

    let params = {
	   TableName: "texts",
	   IndexName: "sid-timestamp-index",
	   ProjectionExpression: "messageContent, sender, receiver",
       KeyConditionExpression: "timestamp > :v_timestamp", 
       ExpressionAttributeNames: {
           "timestamp": "timestamp"
       },
       ExpressionAttributeValues: {
           ":v_timestamp": date; //one month from today
       },
	   Limit: 10,
	   ScanIndexForward: "false"
    }
    
    console.log('attempting to query list of messages from database');
    
    docClient.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            return null;
        } else {
            console.log("Query succeeded.");
            data.Items.forEach(function(item) {
                messageArr.push(new MessageModel.textMessage(data.receiver, data.sender, data.messageContent));
            });
            return messageArr;
        }
    });
}

module.exports = {
    sendMessage,
    saveMessage,
    queryMessages
}