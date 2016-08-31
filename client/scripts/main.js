window.onload = function() {
    
    let text_user_id = 001; //will need to change after testing
    var MessageContext = {
        displayContext : null
    }
    function Message(sender, content) {
        this.messageSender = sender
        this.messageContent = content
    }
    var current_messages = [new Message("you","hi"),new Message("contact", "hey"), 
                            new Message("you","wsup"), new Message("contact", "nm, u?"), 
                            new Message("you", "nm..")];

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
    
    function addMessages(messages) {
        var htmlToAdd = "";
        var counter = 3;
        
        for (m of messages) {
            if (typeof m.content != "string") {
                console.log("invalid message");
            }
            
            htmlToAdd += '<span id="message" style="bottom:' + counter + '%;">' + m.sender + ": " + m.content "</span>";
            counter += 10;
        }
        
        document.getElementById("message-display").innerHTML = htmlToAdd;
    }

    function clearMessageDisplay() {
        document.getElementById("message-display").innerHTML = "";
    }
    
}