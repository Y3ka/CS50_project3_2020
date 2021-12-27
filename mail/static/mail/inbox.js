document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  
  //add event listener on the send button
  document.querySelector('#send_button').addEventListener('click',() => send_email());

  // By default, load the inbox
  //load_mailbox('inbox');
});

function compose_email() {
  
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
 
  

}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  //Show the emails
  if(mailbox === 'inbox') {
    fetch('/emails/inbox')
    .then(response => response.json())
    .then(emails => {
        // Print emails
        console.log(emails);
        emails.forEach(element => { 
          let new_email = document.createElement("div");
          new_email.setAttribute("id", element["id"]);
          new_email.setAttribute("class", "email");
          let new_subject = document.createElement("div");
          let new_sender = document.createElement("div");
          let new_timestamp = document.createElement("div");
          let subject = document.createTextNode(element["subject"]);
          let timestamp = document.createTextNode(element["timestamp"]);
          let sender = document.createTextNode(element["sender"]);
          new_subject.appendChild(subject);
          new_sender.appendChild(sender);
          new_timestamp.appendChild(timestamp);
          new_subject.style.cssText = "display: inline-block; width: 38%; text-overflow: ellipsis; margin-left: 1%;";
          new_sender.style.cssText = "display: inline-block; width: 38%; padding-left:1%; border-left: solid; border-right: solid; text-overflow: ellipsis;";
          new_timestamp.style.cssText = "display: inline-block; width: 22%; text-align: right; margin-right: 1%;";

          new_email.appendChild(new_subject);
          new_email.appendChild(new_sender);
          new_email.appendChild(new_timestamp);
          new_email.style.cssText = "margin-left: 20%; margin-right: 20%; width: 60%; border: solid; border-radius: 5px; margin-top: 2px; margin-bottom: 2px;";
          document.body.appendChild(new_email);
          if(element["read"] === true) {
            new_email.style.setProperty("background-color",  "grey");
          }
          //Mark the email as read
          document.getElementById(element["id"]).addEventListener('click', mark_read(element["id"]));
          document.querySelectorAll(".btn").forEach(element => element.addEventListener("click", () => new_email.remove()));
        });
       
    }); 
  }
}

function mark_read(id) {
  fetch('/emails/'+id, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })
  
}

function send_email() {
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;
  console.log("subject:" + subject + " body:" + body);
  console.log('recipients:' + document.querySelector('#compose-recipients').value);

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
    })
  })
  .then(response => {
    console.log(response);
    // If response NOT ok, throw new Error
    if (!response.ok) {
      throw new Error(response.error);
    }
    return response.json()
  })
  .then(result => {
      // Print result
      console.log(result);
      load_mailbox('sent');
  })
  .catch(error => console.log(error));  
  
}