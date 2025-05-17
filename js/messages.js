window.addEventListener("load", async () => {
  try {
    client.onMessageArrived = gotMessage;
    await client.connect();
    client.subscribe(config.topic);
  } catch (error) {
    console.error(error);
  }
});

function send() {
  const input = document.getElementById('textInput').value;
  console.log("send", input);
  sendMessage("update", input);
}


function sendMessage(event, message) {
  let body = {event, message};
  console.log("sendMessage", config.topic, body);
  client.publish(config.topic, body);
}

function gotMessage(message) {
  try {
    let info = JSON.parse(message.payloadString);
    console.log("message", info);
    switch (info.event) {
      case "update": update(info.message); break;
    }
  } catch (error) {
    console.error("couldn't parse message", message.payloadString);
  }
}

function update(info) {
  console.log("info", info);
  document.getElementById('messageDisplay').textContent = info;
}