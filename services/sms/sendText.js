var twilio = require('twilio');

var client = new twilio.RestClient(twilio_data.accountSid, twilio_data.authToken);

var receiver = '';
var sender = twilio_data.accPhoneNum;
var messageContent = '';

client.sms.messages.create({
    to: receiver,
    from: sender,
    body: messageContent },
    
    function(error, message) {

        if (!error) {
            console.log('Success! The SID for this SMS message is:');
            console.log(message.sid);

            console.log('Message sent on:');
            console.log(message.dateCreated);
        } else {
            console.log('Oops! There was an error: ' + error.message);
        }
                           
});