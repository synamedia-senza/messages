class WebsocketClient {
  client = null;
  connected = false;

  connect() {
    return new Promise((resolve, reject) => {
      const port = 8884;
      const clientId = "senza-" + Math.floor(100000 + Math.random() * 900000);
      const keepAlive = 60;
      const cleanSession = true;
      const ssl = true;

      this.client = new Messaging.Client(config.host, port, clientId);
      this.client.onConnectionLost = this.onConnectionLost;
      this.client.onMessageArrived = this.onMessageArrived;

      const options = {
        userName: config.username,
        password: config.password,
        timeout: 3,
        keepAliveInterval: keepAlive,
        cleanSession: cleanSession,
        useSSL: ssl,
        onSuccess: () => {
          this.connected = true;
          console.log("connected");
          resolve();
        },
        onFailure: (message) => {
          this.connected = false;
          console.error("error:", message.errorMessage);
          reject(new Error(message.errorMessage));
        }
      };
      this.client.connect(options);
    });
  }
    
  onConnectionLost(responseObject) {
    this.connected = false;
    console.log("connection lost");
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
    }
  }
  
  onMessageArrived(message) {
    console.log("message:" + message.payloadString);
  }
  
  disconnect() {
    this.client.disconnect();
  }
  
  publish(topic, json) {
    if (!this.connected) {
      console.log("Not connected");
      return false;
    }

    console.log("publish", topic, json);

    let payload = JSON.stringify(json);
    let message = new Messaging.Message(payload);
    message.destinationName = topic;
    message.qos = 2;
    message.retained = false;
    this.client.send(message);
  }
  
  
  subscribe(topic, qosNr = 2) {
    if (!this.connected) {
      console.log("Not connected");
      return false;
    }

    if (topic.length < 1) {
      console.log("Topic cannot be empty");
      return false;
    }

    this.client.subscribe(topic, {qos: qosNr});
    console.log("subscribe", topic)
    return true;
  }
}

let client = new WebsocketClient();