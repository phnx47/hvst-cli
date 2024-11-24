const { SLACK_WEBHOOK_URL } = process.env;

export async function sendToSlack(report) {
  if (!SLACK_WEBHOOK_URL) {
    throw new Error("Environment variable 'SLACK_WEBHOOK_URL' is not defined");
  }
  const response = await fetch(SLACK_WEBHOOK_URL, {
    method: "POST",
    body: JSON.stringify({ text: report }),
  });
  console.log(`Slack: status=${response.status}, message='${await response.text()}'`);
}
