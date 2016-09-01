let sms_user_id = 001;//user.get_user_id(); //will need to change after testing
var displayHtml = "";

var MessageContext = {
    displayContext : null
}

function Message(sender, content, displayId) {
    this.messageSender = sender;
    this.messageContent = content;
    this.displayId = displayId; 
    this.displayNumber = (this.displayId * 10) + 3;
}

var current_messages = [new Message("you","hi", 4),new Message("contact", "hey", 3), 
                        new Message("you","wsup", 2), new Message("contact", "nm, u?", 1), 
                        new Message("you", "nm..", 0)];

function loadTexts() {
  //clears the message display
  //makes a call to text service to get recent texts
  //for each message (up to a certain amount?)
  //load each into terminal
  //reconfigure the send button to send 

  clearMessageDisplay();
  MessageContext.displayContext = "SMS";
  //sync_texts();
  addMessages(current_messages);
}

function sync_texts() {
    $.ajax({
        type: 'POST',
        data: {id: text_user_id},
        url:'https://', //ec2 instance
        dataType: 'json',
        success: function (json) {
            last_received = json.last_message_id;
        }
    });

    //setTimeout("loadTexts()", 2000);
}

function submitMessage(){
    let messageString = document.getElementById("text-input").value;
    
    if ((messageString != null) && (messageString != '') 
                && (MessageContext.displayContext != null)) {
        
        newMessage(current_messages, messageString);
        document.getElementById("text-input").value = '';
    }
}

function addMessages(messages) {
    for (let m of messages) {
        if (typeof m.messageContent != "string") {
            console.log("invalid message");
        }
        displayHtml += '<span id="message" style="bottom:' + m.displayNumber + '%;">' +
                     m.messageSender + ': ' + m.messageContent + '</span>';
    }
    
    document.getElementById("message-display").innerHTML = displayHtml;
}

function newMessage(messages, newMessageContent) {
    messages.push(new Message("you", newMessageContent, -1));
    incrementMessages(messages);
    clearMessageDisplay();
    addMessages(messages);
}

function clearMessageDisplay() {
    displayHtml = "";
    document.getElementById("message-display").innerHTML = displayHtml;
}

function incrementMessages(messages) {
    for (let m of messages) {
        m.displayId++;
        m.displayNumber = m.displayNumber + 10;
    }
}

window.onkeyup = function(e) {
    var key = e.keyCode ? e.keyCode : e.which;
    let messageString = document.getElementById("text-input").value;

    if (key == 13) {
        submitMessage();
    }
}
