textMessage = function(receiver, sender, messageContent) {
    this.receiver = receiver;
    this.sender = sender;
    this.messageContent = messageContent;
    this.sid = null;
    this.timestamp = null;
}

exports.textMessage = textMessage;
