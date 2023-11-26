import axios from "axios";

export default class Slack {
  constructor(webhookUrl) {
    this.webhookUrl = webhookUrl;
  }

  push(text) {
    const options = {
      text: text
    };
    axios.post(this.webhookUrl, JSON.stringify(options))
      .then((response) => {
        console.log("Slack Response: " + response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }
}


