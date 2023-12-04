export default class Slack {
  constructor(webhookUrl) {
    this.webhookUrl = webhookUrl;
  }

  async push(text) {
    const response = await fetch(this.webhookUrl, {
      method: "POST",
      body: JSON.stringify({text: text}),
    });
    console.log(`Slack: status=${response.status}, message='${await response.text()}'`);
  }
}


