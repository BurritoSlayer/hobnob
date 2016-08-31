window.onload = function() {
    
    let text_user_id = 001; //will need to change after testing
    var MessageContext = {
        displayContext = null;
    }, 
    current_messages = ["hi", "hey", "wsup", "nm, u?", "nm.."];

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
        htmlToAdd = "";
        
        for (m of messages) {
            if (typeof m != "string") {
                console.log("invalid message")
            }
            
            htmlToAdd += '<div id="message" >' + m + "</div";
        }
        
        document.getElementById("message-display").innerHTML = htmlToAdd;
    }

    function clearMessageDisplay() {
        document.getElementById("message-display").innerHTML = "";
    }
    
}