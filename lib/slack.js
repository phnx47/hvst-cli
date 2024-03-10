export default class Slack {
  constructor() {
    if (!process.env.SLACK_WEBHOOK_URL) throw new Error("Environment variable 'SLACK_WEBHOOK_URL' is not defined");
    this.webhookUrl = process.env.SLACK_WEBHOOK_URL;
  }

  async push(text) {
    const response = await fetch(this.webhookUrl, {
      method: "POST",
      body: JSON.stringify({text: text}),
    });
    console.log(`Slack: status=${response.status}, message='${await response.text()}'`);
  }
}


